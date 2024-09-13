
from esprima.nodes import Node


def traverse(root: Node, **options):
    pre = options.get("pre")
    post = options.get("post")
    skip_prop = options.get("skip_prop")

    def _visit(node: Node, parent: Node, prop):

        if not isinstance(node, Node):
            return

        res = True
        if pre:
            res = pre(node, parent, prop)

        if res == False:  # NOQA
            return

        for iprop in node.__dict__:
            if skip_prop and skip_prop(node, iprop):
                continue

            child = node.__dict__[iprop]

            if isinstance(child, list):
                for i in child:
                    _visit(i, node, prop)
            else:
                _visit(child, node, prop)

        if post:
            post(node, parent, prop)

    _visit(root, None, None)
