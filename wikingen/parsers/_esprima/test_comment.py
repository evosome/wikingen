
from typing import Dict, Tuple
from pyjsdoc import parse_comment, strip_stars
from esprima.nodes import BlockComment

from wikingen.test import TestComment


class TestCommentWrapper:

    _doc: str
    _pre: str
    _autotest_users: Tuple[str, ...]

    def __init__(self, block_comment: BlockComment):
        parsed_data = self._parse_comment_block(block_comment)
        self._doc = parsed_data.get("doc")
        self._pre = parsed_data.get("pre")
        autotest_users = parsed_data.get("user")
        self._autotest_users = self._tuple_users(autotest_users)

    @staticmethod
    def _remove_stars(comment: str) -> str:
        i = 0
        while comment[i] == '*':
            i += 1
        return strip_stars(comment[i:])

    @staticmethod
    def _parse_comment_block(block_comment: BlockComment) -> Dict:
        comment_value = TestCommentWrapper._remove_stars(block_comment.value)
        return parse_comment(comment_value, '')

    @staticmethod
    def _tuple_users(users) -> Tuple[str, ...]:
        if isinstance(users, list):
            return tuple(users)
        elif isinstance(users, str):
            return (users, )
        else:
            return tuple()

    @property
    def test_comment(self) -> TestComment:
        return TestComment(self._doc, self._pre, self._autotest_users)
