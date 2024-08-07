from re import sub
from typing import Dict, List
from esprima import parse as js_parse
from esprima.syntax import Syntax
from esprima.nodes import (
    Node, Script, VariableDeclaration, VariableDeclarator,
    ExpressionStatement, CallExpression
)

from wikingen.test import Test
from wikingen.scenario import Scenario, Step
from wikingen.parsers.parser import Parser
from wikingen.parsers.parser_exception import ParserException

from .ast_traverse import traverse
from .feature_expression import FeatureExpression
from .scenario_expression import ScenarioExpression


class EsprimaParser(Parser):

    _scenario_label: str
    _scenario_description: str
    _literal_table: Dict[str, str]
    _feature_expression: FeatureExpression = None
    _scenario_expressions: List[ScenarioExpression]

    def __init__(self):
        self._literal_table = {}
        self._scenario_expressions = []

    def _collect_literals_from(
            self,
            declarators: List[VariableDeclarator]
    ) -> None:

        for declarator in declarators:
            id_ = declarator.id
            init = declarator.init
            if init.type == Syntax.Literal:
                self._literal_table[id_.name] = init.value

    def _wrap_call_expression(
            self,
            expression_node: CallExpression
    ) -> None:

        callee = expression_node.callee

        if callee.name == "Feature":
            if self._feature_expression:
                raise ParserException("More than one feature expression")
            self._feature_expression = FeatureExpression(
                expression_node, self._literal_table)

        elif callee.name == "Scenario":
            self._scenario_expressions.append(
                ScenarioExpression(expression_node, self._literal_table)
            )

    def _pre_visit(
            self,
            current_node: Node,
            parent: Node,
            _prop
    ) -> bool:

        # finding top level comment block in script
        if isinstance(current_node, Script):
            first_element = current_node.body[0]
            comments = first_element.leadingComments
            if len(comments) > 0:
                self._scenario_description = comments[0].value

        # finding top level const literal declarations, like:
        # const SCENARIO_LABEL = "ScenarioName";
        # const A = "a", B = "b";
        # and e. t. c.
        if (
                isinstance(parent, Script) and
                isinstance(current_node, VariableDeclaration) and
                current_node.kind == "const"
        ):
            self._collect_literals_from(current_node.declarations)
            return True  # skip children and properties

        # collect top level call expression statements, like:
        # Feature(...);
        # Scenario(...);
        if (
            isinstance(parent, Script) and
            isinstance(current_node, ExpressionStatement) and
            current_node.expression.type == Syntax.CallExpression
        ):
            self._wrap_call_expression(current_node.expression)
            return True

    def _traverse(self, root_node: Node):
        traverse(
            root_node,
            pre=self._pre_visit
        )

    def parse(self, code: str) -> Test:

        ast_tree = js_parse(
            code,
            attachComment=True)

        self._traverse(ast_tree)

        if "SCENARIO_LABEL" not in self._literal_table:
            raise ParserException("SCENARIO_LABEL not found in test script")

        scenario_label = self._literal_table["SCENARIO_LABEL"]
        feature_label = self._feature_expression.label
        scenario_description = self._scenario_description
        scenarios = tuple([se.scenario for se in self._scenario_expressions])

        return Test(
            scenario_label,
            feature_label,
            scenario_description,
            scenarios)
