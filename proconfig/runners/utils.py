from proconfig.utils.pytree import tree_map, PyTree, TreeSpec, LeafSpec

def empty_callback_fn(**kwargs):
    pass

def _max_input_len_helper(tree: PyTree, tree_spec: TreeSpec, max_input_len):
    if type(tree_spec) == LeafSpec:
        if tree is None:
            tree = [None]
        return max(len(tree), max_input_len)
    
    if tree_spec.type == dict:
        sub_trees = list(tree.values())
    elif tree_spec.type == list:
        sub_trees = tree
    else:
        raise NotImplementedError()
    
    for sub_tree, sub_tree_spec in zip(sub_trees, tree_spec.children_specs):
        max_input_len = max(_max_input_len_helper(sub_tree, sub_tree_spec,max_input_len), max_input_len)

    return max_input_len

def _get_config_by_index_helper(tree: PyTree, tree_spec: TreeSpec, index: int):
    if type(tree_spec) == LeafSpec:
        if tree is None:
            tree = [None]
        try:
            return tree[index] if index < len(tree) else tree[-1]
        except:
            import pdb; pdb.set_trace()
    
    if tree_spec.type == dict:
        keys = tree_spec.context
        return {
            k: _get_config_by_index_helper(tree[k], tree_spec.children_specs[ik], index)
            for ik, k in enumerate(keys)
        }
    elif tree_spec.type == list:
        return [
            _get_config_by_index_helper(tree[ik], tree_spec.children_specs[ik], index)
            for ik in range(len(tree))
        ]
    else:
        raise NotImplementedError()