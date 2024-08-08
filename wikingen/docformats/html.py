
from jinja2 import (
    Environment as JinjaEnviroment,
    FileSystemLoader,
    select_autoescape
)

from wikingen.test import Test

_DEFAULT_TEMPLATE = "index.html"


class HTMLFormat:

    _env: JinjaEnviroment

    def __init__(self):
        self._env = JinjaEnviroment(
            loader=FileSystemLoader("./wikingen/docformats/templates"),
            autoescape=select_autoescape()
        )

    def format(self, test: Test) -> str:
        return self._env.get_template(_DEFAULT_TEMPLATE).render(test=test)
