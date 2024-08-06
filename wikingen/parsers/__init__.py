
from .parser import Parser
from ._esprima import EsprimaParser

default: Parser = EsprimaParser()

__all__ = ("Parser", "default")
