
from typing import Tuple


class Step:

    _label: str
    _result: str

    def __init__(self, label: str, result: str):
        self._label = label
        self._result = result

    def __repr__(self):
        return f"Step(label=\"{self._label}\", result=\"{self._result}\")"

    @property
    def label(self) -> str:
        return self._label
    
    @property
    def result(self) -> str:
        return self._result

    def has_result(self) -> bool:
        return self._result is not None


class Scenario:

    _label: str
    _steps: Tuple[Step, ...]

    def __init__(self, label: str, steps: Tuple[Step, ...]):
        self._label = label
        self._steps = steps

    def __repr__(self):
        return f"Scenario(label=\"{self._label}\", steps={self._steps})"

    @property
    def label(self) -> str:
        return self._label

    @property
    def steps(self) -> Tuple[Step, ...]:
        return self._steps
