
/*
  filter classes
*/
function filterClassNames() {
  
  var className;
  
  var classArray = getClassArray(containers[index].class);
  if (classArray && classArray.length > 1) {
    
    var parents = $(containers[index].container).parents();
    for (var i = 0; i < parents.length; i++) {
      
      if ($(parents.get(i)).children().length >= 4) {
        var children = $(parents.get(i)).children();
        var list = [];
        for (var ii = 0; ii < children.length; ii++) {
          var info = getBranchAppearance(children.get(ii));
          list.push(info);
        }
        var percent = getMajorityPercent(list)[0];
        var majority = getMajorityPercent(list)[1];
        if (percent >= 0.5) {
          className = findPostClass(classArray, children, majority);
        }
        
        if (className) {
          break;
        }
      }
      
    }
    
  }
  
  if (className) {
    containers[index].class = className;
    $("#markList").children().eq(index)[0].innerText = getElementIdentifier(containers[index].tag, className);
    $("#markList").children().eq(index).css("color", "#00f");
  }
  
}

function getClassArray(classes) {
  var classArray;
  if (classes) {
    if (classes.indexOf(" ") >= 0) {
      classArray = classes.split(" ");
      for (var i = classArray.length - 1; i >= 0; i--) {
        if (!classArray[i]) {
          classArray.splice(i, 1);
        }
      }
    } else {
      classArray = [classes];
    }
  }
  
  return classArray;
}

function getBranchAppearance(child) {
  
  var str = child.tagName;
  
  var characteristic = ["width", "min-width", "max-width"];
  for (var i = 0; i < characteristic.length; i++) {
    str += window.getComputedStyle(child, null).getPropertyValue(characteristic[i]);
  }
  
  return str;
}

function getMajorityPercent(list) {
loop0:
  var percent;
  var majority;
  for (var i = 0; i < list.length; i++) {
loop1:
    var count = 0;
    var major = [];
    for (var ii = 0; ii < list.length; ii++) {
      if (list[i] == list[ii]) {
        major.push(ii);
        count++;
      }
    }
    var pct = count / list.length;
    if (percent) {
      if (pct > percent) {
        percent = pct;
        majority = major;
      }
    } else {
      percent = pct;
      majority = major;
    }
    
  }
  
  return [percent, majority];
}

function findPostClass(classes, children, major) {
  
  var className;
loop0:
  for (var i = 0; i < classes.length; i++) {
    
    // check the very basic appearance of element to see them if unified
    var notUnified = unifiedAppearance(classes[i]);
    if (notUnified) {
      // console.log("\"" + classes[i] + "\" failed at unifiy check.");
      continue loop0;
    }
loop1:  // check can find class under single element of majority
    var notFound;
    for (var ii = 0; ii < major.length; ii++) {
      
      var childClasses = getClassArray(children.get(major[ii]).className);
      if (childClasses) {
        if (childClasses.indexOf(classes[i]) == -1) {
          notFound = seekClass(classes[i], children.get(major[ii]));
        }
      } else {
        notFound = seekClass(classes[i], children.get(major[ii]));
      }
      if (notFound) {
        notFound = undefined;
        // console.log("\"" + classes[i] + "\" not found in some of the children.");
        continue loop0;
      }
      
    }
    
    className = classes[i];
    break loop0;
    
  }
  
  return className;
}

function unifiedAppearance(classN) {
  
  var notUnified;
  
  var appearance;
  $("." + classN).each(function(i, v) {
    if (appearance) {
      if (getBranchAppearance(v) != appearance) {
        notUnified = true;
      }
    } else {
      appearance = getBranchAppearance(v);
    }
  });
  
  return notUnified;
}

function seekClass(classN, child) {
  var notFound = true;
  $(child).find("*").each(function(i, v) {
    var vClasses = getClassArray(v.className);
    if (vClasses && vClasses.indexOf(classN) != -1) {
      notFound = false;
    }
  });
  
  return notFound;
}

