
from wikingen.parsers import default
from wikingen.docformats.html import HTMLFormat

from pyjsdoc import parse_comment, strip_stars

with open("test.js", 'r', encoding="utf-8") as stream:
    text = stream.read()
    test = default.parse(text)

    with open("doc.html", 'w', encoding="utf-8") as out:
        out.write(HTMLFormat().format(test))
