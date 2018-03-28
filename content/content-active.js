

function checkDOM()
{
  // popup box
  if (!document.getElementById("markBox") && item) {
    // chrome.runtime.sendMessage({ task: "css", file: "" });
    
    createBox();
    updateBox();
    addStick();
    findClasses()
    fillBox();
    addButtons();
    colorBackground();
    
    toggle = true;
  }
  else {
    clear();
    
    toggle = false;
  }
  
  // use wheel for selecting class
  window.onwheel = function (e) {
    if (e.deltaY < 0) {
      if (index > 0) { index -= 1 }
    }
    if (e.deltaY > 0) {
      if (index < containers.length - 1) { index += 1 }
    }
    updateStyle();
    
    return !toggle;
  }
  
  // exit
  $("#markConfirm").on("click", function (e) {
    saveData();
    clear();
  });
  
  $("#markCancel").on("click", function (e) {
    clear();
  });
}

/*
  save data
*/
function saveData() {
  var markItem = {};
  var host = window.location.hostname;
  markItem[host] = {
    class: containers[index].class,
    href: link,
    title: linkText,
    page: window.location.href,
    date: getTime()
  };
  chrome.storage.local.set(markItem);
  console.log(markItem);
  styleContainer(containers[index].container);
}

function getTime() {
  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  var date = d.getDate();
  var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var day = days[d.getDay()];
  
  var str = year + "/" + month + "/" + date + ", " + day;
  
  return str;
}

function styleContainer(ctn) {
  $(ctn).css("border", "thick solid #f00");
  $(ctn).css("box-sizing", "border-box");
  $(ctn).css("overflow", "hidden");
}

/*
  find classes
*/
function findClasses() {
  var itemClass = item.className;
  if (itemClass) {
    var data = {
      container: undefined,
      class: undefined
    }
    data.container = $(item);
    data.class = itemClass;
    
    containers.push(data);
  }
  
  var parents = $(item).parents();
  var count = parents.length - 2;
  for (var i = 0; i < count; i++) {
    var classNames = parents.get(i).className;
    if (classNames) {
      var data = {
        container: undefined,
        class: undefined
      }
      data.container = parents.get(i);
      data.class = classNames;
      
      containers.push(data);
    }
  }
  selectClasses()
}

function selectClasses() {
  chrome.storage.local.get(function (items) {
    var host = window.location.hostname;
    var markItem = items[host];
    if (markItem) {
      var classes = markItem.class;
      var containerClasses = [];
      var count = containers.length;
      for (var i = 0; i < count; i++) {
        containerClasses.push(containers[i].class)
      }
      var indexFound = containerClasses.findIndex(function (element) {
        return element == classes;
      });
      if (indexFound >= 0) {
        index = indexFound;
        updateStyle();
      }
    }
  });
}

/*
  reset
*/
function clear() {
  lastContainer && $(lastContainer).css("background", lastContainerStyle);
  $("#markBox").remove();
  $("#opBox").remove();
  item = undefined;
  link = undefined;
  linkText = undefined;
  containers = [];
  lastContainer = undefined;
  lastContainerStyle = undefined;
  index = 0;
  toggle = false;
}
