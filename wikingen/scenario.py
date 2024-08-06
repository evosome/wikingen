
from typing import Tuple


class Step:

    _label: str

    def __init__(self, label: str):
        self._label = label

    def __repr__(self):
        return f"Step(label=\"{self._label}\")"

    @property
    def label(self) -> str:
        return self._label


class Scenario:

    _label: str
    _steps: Tuple[Step]

    def __init__(self, label: str, steps: Tuple[Step]):
        self._label = label
        self._steps = steps

    def __repr__(self):
        return f"Scenario(label=\"{self._label}\", steps={self._steps})"

    @property
    def label(self) -> str:
        return self._label

    @property
    def steps(self) -> Tuple[Step]:
        return self._steps
