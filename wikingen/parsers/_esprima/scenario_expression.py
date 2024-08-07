import re
from re import match
from typing import List, Tuple
from esprima.syntax import Syntax
from esprima.nodes import (
    CallExpression, AsyncArrowFunctionExpression, BlockStatement,
    ExpressionStatement, Node
)

from wikingen.scenario import Scenario, Step
from wikingen.parsers.parser_exception import ParserException

from .template_string import TemplateString


_COMMENT_REGEXP = r"(.*)\[(.*)\]"


class StepComment:

    _label: str = None
    _result: str = None

    def __init__(self, comment: Node):
        self._parse_comment(comment.value)

    def _parse_comment(self, comment: str) -> None:
        matches = re.findall(_COMMENT_REGEXP, comment)
        if len(matches) == 0:
            self._label = comment
            return
        if len(matches) > 1:
            raise ParserException("Found more than one results of step")
        self._label, self._result = matches[0]

    @property
    def label(self) -> str:
        return self._label

    @property
    def result(self) -> str:
        return self._result



class ScenarioStep:

    _comment: StepComment

    def __init__(self, expression_statement: ExpressionStatement):
        comments = expression_statement.leadingComments
        self._comment = StepComment(comments[-1]) if comments and len(comments) > 0 else None

    @property
    def is_unnamed(self) -> bool:
        return self._comment is None

    @property
    def comment(self) -> str:
        return self._comment.label

    @property
    def result(self) -> str:
        return self._comment.result


class ScenarioBlock:

    _steps: List[ScenarioStep]

    def __init__(self, block_statment: BlockStatement):
        if len(block_statment.body) == 0:
            raise ParserException("Scenario arrow function block is empty")
        self._steps = list(filter(lambda s: not s.is_unnamed, map(ScenarioStep, block_statment.body)))

    @property
    def steps(self) -> Tuple[Step, ...]:
        return tuple([Step(s.comment, s.result) for s in self._steps])


class ScenarioExpression:

    _label: str
    _block: ScenarioBlock

    def __init__(self, call_expression: CallExpression, literal_table):

        arg = call_expression.arguments[0]
        if arg.type != Syntax.TemplateLiteral and arg.type != Syntax.Literal:
            raise ParserException("Scenario label must be string or template string")

        self._label = (arg.value
                       if arg.type == Syntax.Literal
                       else TemplateString(arg, literal_table).baked_string)

        arg = call_expression.arguments[1]
        if not isinstance(arg, AsyncArrowFunctionExpression):
            raise ParserException("Scenario call must be async arrow function")
        if not isinstance(arg.body, BlockStatement):
            raise ParserException("Scenario arrow function must be block statement, not single line")

        self._block = ScenarioBlock(arg.body)

    @property
    def scenario(self) -> Scenario:
        return Scenario(self._label, tuple(self._block.steps))
