
from typing import Tuple
from .scenario import Scenario


class Test:

    _label: str
    _feature: str
    _description: str
    _scenarios: Tuple[Scenario]

    def __init__(
            self,
            label: str,
            feature: str,
            description: str,
            scenarios: Tuple[Scenario]
    ):
        self._label = label
        self._feature = feature
        self._description = description
        self._scenarios = scenarios

    def __repr__(self):
        return (f"Test(label=\"{self._label}\", "
                f"feature=\"{self._feature}\", "
                f"description=\"{self._description}\")")

    @property
    def scenarios(self) -> Tuple[Scenario]:
        """
        Resolve immutable list of all scenarios found in
        test script.
        :return: Scenarios
        """
        return self._scenarios

    @property
    def label(self) -> str:
        """
        Test label, stored in const variable `SCENARIO_LABEL`
        :return: Test label
        """
        return self._label

    @property
    def description(self) -> str:
        """
        Test description, located at the top of a test script
        :return: Test description
        """
        return self._description
