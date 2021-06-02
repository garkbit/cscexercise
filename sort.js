// NOTE: I provided two different sorting approaches, one
// that merely satisfies the data integrity constraints,
// and one that sorts things in a way humans might wish
// to have a dependency graph such as this presented.
// They take fundamentally different approaches, and are
// probably both worth glancing at.

// This only satisfies the data integrity constraints
// without taking into account how a human might wish
// to parse a dependency graph.
const sortCategoriesForInsert = (inputJson) => {
    
    // While this adds extra overhead, it's what keeps
    // the function pure, otherwise we'd be silently mutating
    // the provided array outside the scope of this function
    const unsorted = [...inputJson];
    
    const sorted = [];
    
    // Depending upon how badly out of order the provided array
    // is, we'll need to process the remaining unsorted items
    // several times. Worst case scenario is a perfectly inverted
    // dependency graph
    while (unsorted.length > 0) {
        for (let i = 0; i < unsorted.length; i++) {
            
            const cat = unsorted[i];
            
            // Null parents are root nodes, so add them to the sorted array,
            // otherwise check to see if a categories' parent has already been
            // pushed into sorted
            if (cat.parent_id === null || sorted.findIndex(c => c.id === cat.parent_id) >= 0) {
                sorted.push(cat);
                unsorted.splice(i, 1);
                i--;
            }
            
            else if (unsorted.findIndex(c => c.id === cat.parent_id) === -1) {
                // I know the exercise assumes data integrity,
                // but I'm paranoid about orphan nodes causing
                // an infinite loop. We could handle this several
                // ways, but for the purposes of this exercise,
                // we'll eat the orphan (!) and print a notice
                console.error(`The "%s" category doesn't have a parent! Check your input data.`, cat.name);
                unsorted.splice(i, 1);
                i--;
            }
        }
    }
    return sorted;
}

// This handles the same cases as above (though
// without printing an error for orphan nodes),
// but sorts things as you would an alphabetized
// outline, e.g.:
//
// - Parent A
//   |- Child A
//      |- Grandchild A
//      |- Grandchild B
//   |- Child B
// - Parent B
//
const sortCategoriesForInsertPrettily = (inputJson) => {
    
    const getOrderedChildren = (parent_id) => {
        
        const children = inputJson
            .filter(c => c.parent_id === parent_id)
            .sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
        
        if (children.length > 0) {
            for (let i = 0; i < children.length; i++) {
                
                // Recursion FTW!
                const gChildren = getOrderedChildren(children[i].id);
                
                // Insert children...
                children.splice(i + 1, 0, ...gChildren);
                
                // Offset iterator
                i = i + gChildren.length;
            }
        }
        return children;
    };
    
    return getOrderedChildren(null);
}

module.exports = sortCategoriesForInsert;
