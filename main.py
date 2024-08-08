
from wikingen.parsers import default
from wikingen.docformats.html import HTMLFormat

with open("test.js", 'r', encoding="utf-8") as stream:
    text = stream.read()
    test = default.parse(text)

    with open("doc.html", 'w') as out:
        out.write(HTMLFormat().format(test))
