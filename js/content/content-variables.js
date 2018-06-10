
/*--------------------
  Variables
--------------------*/
/* passive */
var checkStatus = {
  checked: false,
  matched: false
}
var remembered = {
  selector: undefined,
  level: undefined,
  category: { category: undefined, depth: 0 },
  title: [],
  href: []
}
// 
var matchedItem = [];
var observerTimer;

// functions
// called after document loaded or tab activated
// 
var checkMark;
// called once after a successful matching
var pushElements;
// called from lookupElements() which compares records against DOM elements
var markItems;

/* reviewed 06/08 */
/* active */
// functions
// called inside prepareData()
// get the first big picture in the container
var getPostImage;

/* active-ui */

/* active-filter */
// functions
// called in the wheel listener
// clear class names, only keep one class name assigned to the container
var filterClassNames;
  var getClassArray;
  var getBranchAppearance;
  var getMajorityPercent;
  var findPostClass;
  var unifiedAppearance;
  var seekClass;
/* reviewed 06/08 */
