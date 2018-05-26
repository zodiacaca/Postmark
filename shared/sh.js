
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
  var classArray = [];
  if (classes.indexOf(" ") >= 0) {
    classArray = classes.split(" ");
    for (var i = 0; i < classArray.length; i++) {
      if (classArray[i]) {
        classArray[i] = "." + classArray[i];
      } else {
        classArray.splice(i, 1);
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

