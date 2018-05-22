
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
      classArray[i] = "." + classArray[i];
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

