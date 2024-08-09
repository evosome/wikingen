
from typing import Tuple, Union
from .scenario import Scenario


class TestComment:
    """
    JSDoc comment block, located on the top of the test script.
    Has base JSDoc and custom defined tags.
    """

    def __init__(
            self,
            description: Union[str, None],
            pre: Union[str, None],
            auto_usernames: Tuple[str, ...]
    ) -> None:
        self._description = description
        self._pre = pre
        self._auto_usernames = auto_usernames

    @property
    def description(self) -> str:
        return self._description

    @property
    def pre(self) -> str:
        """
        Test setup text
        :return: Test setup text
        """
        return self._pre

    @property
    def autotest_users(self) -> Tuple[str, ...]:
        """
        Immutable list of auto usernames fetched from @user tag
        :return: Immutable list of auto users names
        """
        return self._auto_usernames


class Test:

    _label: str
    _comment: TestComment
    _feature: str
    _scenarios: Tuple[Scenario, ...]

    def __init__(
            self,
            label: str,
            comment: TestComment,
            feature: str,
            scenarios: Tuple[Scenario, ...]
    ):
        self._label = label
        self._comment = comment
        self._feature = feature
        self._scenarios = scenarios

    def __repr__(self):
        return (f"Test(label=\"{self._label}\", "
                f"feature=\"{self._feature}\", ")

    @property
    def scenarios(self) -> Tuple[Scenario, ...]:
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
    def feature_label(self) -> str:
        return self._feature

    @property
    def comment(self) -> TestComment:
        """
        Test comment block, located at the top of a test script
        :return: Test comment
        """
        return self._comment


EMPTY_COMMENT = TestComment(None, None, tuple())
