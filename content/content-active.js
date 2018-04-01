
// variables //
// switch
var toggle = false;
var index = 0;

// link right clicked
var item;
var link;
var linkText;
var containers = [];
var lastContainer;
var lastContainerStyle;
var subfolders = [];

// colors
var listTextColor = "rgba(30,30,30,1)"
var bgColor = "#fff";
var bgColorSelected = "#bbb";
var floorColor = "grey";
var stickColor = "#111";

var size = 16;
var zIndex;


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
    prepareData();
  });
  
  $("#markCancel").on("click", function (e) {
    if (document.getElementById("markFolders")) {
      $("#markFolders").remove();
      subfolders = [];
    } else {
      clear();
    }
  });
}

/*
  save data
*/
function prepareData() {
  var host = window.location.hostname;
  var page = window.location.href;
  if (!document.getElementById("markFolders")) {
    var subfoldersStr = page.substr(page.indexOf(host) + host.length);
    if (subfoldersStr.indexOf("/") != subfoldersStr.lastIndexOf("/")) {
      var subArray = subfoldersStr.split("/");
      var subFolderArray = [];
      subArray.forEach(item => (item != "") && subFolderArray.push(item));
      addFolderList();
      showSubfolders(0, host);
      for (var i = 0; i < subFolderArray.length; i++) {
        subFolderArray[i] = "/" + subFolderArray[i];
        showSubfolders(i + 1, subFolderArray[i]);
      }
    }
  }
  console.log(subfolders);
  if (!document.getElementById("markFolders") || subfolders.length > 0) {
    saveData(host, page);
    clear();
  }
}

function saveData(host, page) {
  var subfoldersStr = "";
  for (var i = 1; i < subfolders.length; i++) {
    subfoldersStr += subfolders[i];
  }
  var markItem = {};
  markItem[host] = {
    hostname: host,
    depth: subfoldersStr,
    class: containers[index].class,
    href: link,
    title: linkText,
    page: page,
    date: getTime()
  };
  // console.log(markItem);
  chrome.storage.local.set(markItem);
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
  subfolders = [];
  index = 0;
  toggle = false;
}
