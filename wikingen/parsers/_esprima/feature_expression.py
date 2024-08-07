
from esprima.nodes import CallExpression
from esprima.syntax import Syntax

from wikingen.parsers.parser_exception import ParserException

from .template_string import TemplateString


class FeatureExpression:

    _label: str

    def __init__(self, call_expression: CallExpression, literal_table):

        arg = call_expression.arguments[0]
        if arg.type != Syntax.TemplateLiteral and arg.type != Syntax.Literal:
            raise ParserException("Feature label must be string or template string")

        self._label = (arg.value
                       if arg.type == Syntax.Literal
                       else TemplateString(arg, literal_table).baked_string)

    @property
    def label(self) -> str:
        return self._label
