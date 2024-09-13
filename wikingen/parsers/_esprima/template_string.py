
from typing import Dict, List
from esprima.nodes import TemplateLiteral, TemplateElement, Identifier
from esprima.syntax import Syntax

from wikingen.parsers.parser_exception import ParserException


class TemplateString:

    _quasis: List[TemplateElement]
    _expressions: List[Identifier]
    _baked_string: str

    def __init__(
            self,
            template_literal: TemplateLiteral,
            literal_table: Dict[str, str]
    ):
        self._quasis = template_literal.quasis
        if not all([e.type == Syntax.Identifier for e in template_literal.expressions]):
            raise ParserException("Expecting only identifier expressions in template string")
        self._expressions = template_literal.expressions
        self._baked_string = self._bake_string(literal_table)

    def _bake_string(self, literal_table) -> str:
        tail_quasis = self._quasis[-1]
        return "".join(
            [
                q.value.cooked + literal_table[e.name]
                for q, e in zip(self._quasis, self._expressions)
            ]
        ) + tail_quasis.value.cooked

    @property
    def baked_string(self) -> str:
        return self._baked_string
