
// prototype
Array.prototype.pushIfUnique = function(element) {
  if (this.indexOf(element) == -1) {
    this.push(element);
  }
}

// method
function getElementString(tag, classes, id) {
  var str;
  if (classes && classes.length) {
    str = tag + ":" + classes;
  } else {
    str = tag;
  }
  
  return str;
}

function getClassSelector(classes) {
  var rawArray = [];
  var classArray = [];
  if (classes.indexOf(" ") >= 0) {
    rawArray = classes.split(" ");
    for (var i = 0; i < rawArray.length; i++) {
      if (rawArray[i]) {
        rawArray[i] = "." + rawArray[i];
        classArray.push(rawArray[i]);
      }
    }
  } else if (classes) {
    classArray = ["." + classes];
  }
  var classSelector = "";
  for (var i = 0; i < classArray.length; i++) {
    classSelector += classArray[i];
  }
  
  return classSelector;
}

