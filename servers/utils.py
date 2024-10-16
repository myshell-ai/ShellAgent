import os
import proconfig.widgets
import types

import proconfig.widgets.imagen_widgets

def get_package_dependencies(package):
    assert (hasattr(package, "__package__"))
    fn = package.__file__
    fn_dir = os.path.dirname(fn) + os.sep
    node_set = {fn}  # set of module filenames
    node_depth_dict = {fn: 0}  # tracks the greatest depth that we've seen for each node
    node_pkg_dict = {fn: package}  # mapping of module filenames to module objects
    link_set = set()  # tuple of (parent module filename, child module filename)
    del fn

    def dependency_traversal_recursive(module, depth):
        for module_child in vars(module).values():

            # skip anything that isn't a module
            if not isinstance(module_child, types.ModuleType):
                continue

            fn_child = getattr(module_child, "__file__", None)

            # skip anything without a filename or outside the package
            if (fn_child is None) or (not fn_child.startswith(fn_dir)):
                continue

            # have we seen this module before? if not, add it to the database
            if not fn_child in node_set:
                node_set.add(fn_child)
                node_depth_dict[fn_child] = depth
                node_pkg_dict[fn_child] = module_child

            # set the depth to be the deepest depth we've encountered the node
            node_depth_dict[fn_child] = max(depth, node_depth_dict[fn_child])

            # have we visited this child module from this parent module before?
            if not ((module.__file__, fn_child) in link_set):
                link_set.add((module.__file__, fn_child))
                dependency_traversal_recursive(module_child, depth + 1)
            else:
                if "imagen_widgets/library" in module.__file__:
                    pass
                else:
                    print(module.__file__)
                    raise ValueError("Cycle detected in dependency graph!")

    dependency_traversal_recursive(package, 1)
    return (node_pkg_dict, node_depth_dict)


if __name__ == "__main__":
    module = proconfig.widgets.imagen_widgets
    print(get_package_dependencies(module))