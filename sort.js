// NOTE: While I went through the trouble of addressing
// orphan nodes, I didn't address circular dependencies,
// which would be equally fatal. Further, this sorts things
// into an "optimal" order only in the sense that data
// integrity constraints aren't violated. A truly optimal
// order would likely alphabetize by category name, and be
// further sorted by parent/child relationships, like this:
//
// parent1
// |-child1
//   |-grandchild1.1
//   |-grandchild1.2
// |-child2
//   |-grandchild2.1
//

module.exports = function sortCategoriesForInsert(inputJson) {
    
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
