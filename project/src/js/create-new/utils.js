// Utility to safely append a child to a parent, preventing DOM hierarchy errors.
function safeAppend(parent, child) {
    // parent.appendChild(child) throws a HierarchyRequestError if:
    // 1. child is an ancestor of parent (including parent itself).
    //    This can be checked with child.contains(parent).

    if (child.contains(parent)) {
        // This condition covers both child === parent and child being an ancestor of parent.
        console.warn('safeAppend: Attempted to append an ancestor node (child) or the node itself (child) into one of its descendants (parent) or itself (parent). This would cause a DOM hierarchy error. Aborting.', { parent, child });
        return;
    }

    // If the child is already a direct child of the parent, appendChild will move it to the end of the child list.
    // This is standard behavior and not an error.
    parent.appendChild(child);
}
