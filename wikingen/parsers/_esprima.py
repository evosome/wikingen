
from .parser import Parser
from .parser_exception import ParserException
from wikingen.test import Test
from wikingen.scenario import Scenario, Step

from re import sub
from typing import Tuple
from esprima import parse as js_parse, toDict
from jsonpath_ng.ext import parse

_STAR_STRIP_REGEX = r"\s*\*+\s*"

_DESCRIPTION_COMMENTS_JPATH = parse(
                                    "$.body[0]"
                                    ".leadingComments[0]"
                                    ".value")

_SCENARIO_LABEL_JPATH = parse(
                              "$.body[?(@.type=\"VariableDeclaration\")]"
                              ".declarations[?(@.id.type=\"Identifier\" & @.id.name=\"SCENARIO_LABEL\")]"
                              ".init"
                              ".value")

_FEATURE_TEMPLATE = parse(
                          "$.body[?(@.type==\"ExpressionStatement\" & @.expression.callee.name==\"Feature\")]"
                          ".expression"
                          ".arguments[0]")

_SCENARIO_ARGS = parse(
                       "$.body[?(@.type==\"ExpressionStatement\" & @.expression.callee.name==\"Scenario\")]"
                       ".expression"
                       ".arguments")

_SCENARIO_STEPS = parse(
                        "$.body[?(@.type==\"ExpressionStatement\")]"
                        ".leadingComments[:1]"
                        ".value")


class _ScenarioTemplateString:

    _quasis: dict
    _scenario_label: str
    _baked_string: str

    def __init__(self, parsed: dict, scenario_label: str):
        self._quasis = parsed["quasis"]
        if len(self._quasis) > 2:
            raise ParserException("Found template string with more than 2 quasis")
        self._scenario_label = scenario_label
        self._baked_string = self._bake_quasis()

    def _bake_quasis(self):
        elements = list(map(lambda q: q["value"]["cooked"], self._quasis))
        elements.insert(1, self._scenario_label)
        return "".join(elements)

    @property
    def backed_string(self) -> str:
        return self._baked_string


class _ScenarioBody:

    _steps: dict

    def __init__(self, parsed: dict):
        self._steps = _SCENARIO_STEPS.find(parsed)

    @property
    def steps(self) -> Tuple[str]:
        return tuple(map(lambda step: step.value, self._steps))  # NOQA


class _ScenarioArgsWrap:

    _template_name: _ScenarioTemplateString
    _scenario_body: _ScenarioBody

    def __init__(self, parsed: dict, scenario_label: str):
        self._template_name = _ScenarioTemplateString(parsed[0], scenario_label)
        self._scenario_body = _ScenarioBody(parsed[1]["body"])

    @property
    def label(self) -> str:
        return self._template_name.backed_string

    @property
    def steps(self) -> Tuple[str]:
        return self._scenario_body.steps


class EsprimaParser(Parser):

    def parse(self, code: str) -> Test:
        parsed = toDict(js_parse(code, attachComment=True))
        test_label = self._resolve_scenario_label(parsed)
        test_feature = self._collect_feature(parsed, test_label)

        scenario_wraps = self._collect_scenarios(parsed, test_label)

        if not test_label:
            raise ParserException("Scenario label not found in test script")

        if not test_feature:
            raise ParserException("Feature label not found in test script")

        test_description = self._resolve_description(parsed)
        return Test(
            test_label,
            test_feature,
            test_description,
            tuple(map(lambda wrap: Scenario(wrap.label, tuple(map(lambda step_label: Step(step_label), wrap.steps))), scenario_wraps))  # NOQA
        )

    @staticmethod
    def _collect_feature(parsed: dict, scenario_label: str):
        matches = _FEATURE_TEMPLATE.find(parsed)
        if len(matches) == 0:
            return
        feature_label_template = _ScenarioTemplateString(matches[0].value, scenario_label)
        return feature_label_template.backed_string

    @staticmethod
    def _collect_scenarios(parsed: dict, scenario_label: str):
        matches = _SCENARIO_ARGS.find(parsed)
        if len(matches) == 0:
            return
        return map(lambda match: _ScenarioArgsWrap(match.value, scenario_label), matches)

    @staticmethod
    def _resolve_scenario_label(parsed: dict):
        matches = _SCENARIO_LABEL_JPATH.find(parsed)
        if len(matches) == 0:
            return
        return matches[0].value

    @staticmethod
    def _resolve_description(parsed: dict):
        comments_datum = _DESCRIPTION_COMMENTS_JPATH.find(parsed)
        if len(comments_datum) == 0:
            return
        return EsprimaParser._strip_comment_stars(comments_datum[0].value)

    @staticmethod
    def _strip_comment_stars(comment_block: str) -> str:
        return sub(_STAR_STRIP_REGEX, "", comment_block)
