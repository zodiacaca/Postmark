
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

var storedData = {};

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
    (document.getElementById("markBox")) && (updateStyle());
    
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
    if (subfoldersStr.indexOf("/") + 1 != subfoldersStr.length) {
      var slashIndexes = [];
      var pos = 0;
      while (subfoldersStr.indexOf("/", pos) >= 0) {
        slashIndexes.pushIfUnique(subfoldersStr.indexOf("/", pos));
        pos += 1;
      }
      var subArray = [];
      for (var i = 0; i < slashIndexes.length; i++) {
        var a = slashIndexes[i] + 1;
        var b = slashIndexes[i + 1];
        b ? b++ : b = undefined;
        (a < subfoldersStr.length) && (subArray.push(subfoldersStr.substring(a, b)));
      }
      addFolderList();
      for (var i = 0; i < subArray.length; i++) {
        showSubfolders(i + 1, subArray[i]);
      }
    }
  }
  if (!document.getElementById("markFolders") || subfolders.length > 0) {
    saveData(host, page);
    clear();
  }
  subfolders.push(window.location.hostname + "/");
}

function saveData(host, page) {
  var subfoldersStr = "";
  for (var i = 1; i < subfolders.length; i++) {
    subfoldersStr += subfolders[i];
  }
  subfoldersStr = "/" + subfoldersStr;
  var markItem = storedData;
  (!markItem[host]) && (markItem[host] = {});
  (!markItem[host][subfoldersStr]) && (markItem[host][subfoldersStr] = {});
  (!markItem[host][subfoldersStr]["maxEntries"]) && (markItem[host][subfoldersStr]["maxEntries"] = 2);
  var oldest;
  var length = 0;
  for (var key in markItem[host][subfoldersStr]) {
    (!oldest) && (oldest = key);
    length += 1;
  }
  length -= 1;
  (isNaN(oldest)) && (oldest = 1);
  if (length >= markItem[host][subfoldersStr]["maxEntries"]) {
    delete markItem[host][subfoldersStr][oldest];
  }
  var number = parseInt(oldest) + length;
  markItem[host][subfoldersStr][number] = {
    class: containers[index].class,
    href: link,
    title: linkText,
    page: page,
    date: getTime()
  }
  console.log(markItem);
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
  chrome.storage.local.get([window.location.hostname], function (item) {
    if (item) {
      storedData = item;
      
      var classes = item.class;
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
  (lastContainer) && ($(lastContainer).css("background", lastContainerStyle));
  $("#markBox").remove();
  $("#opBox").remove();
  item = undefined;
  link = undefined;
  linkText = undefined;
  containers = [];
  lastContainer = undefined;
  lastContainerStyle = undefined;
  subfolders = [];
  storedData = {};
  index = 0;
  toggle = false;
}

