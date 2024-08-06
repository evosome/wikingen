
from json import dumps
from esprima import parse as json_parse, toDict
from jsonpath_ng.ext import parse

from wikingen.parsers import default

with open("test.js", 'r', encoding="utf-8") as stream:
    text = stream.read()
    test = default.parse(text)

    print(test.label)
    print(test.description)
    for scenario in test.scenarios:
        print(" + ", scenario.label)
        for step in scenario.steps:
            print("   o ", step.label)
