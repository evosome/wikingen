
from .parser import Parser
from ._esprima.parser import EsprimaParser

default: Parser = EsprimaParser()

__all__ = ("Parser", "default")
