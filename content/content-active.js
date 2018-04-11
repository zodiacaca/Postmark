
// variables //
// switch
var toggle = false;
var jumpToggle = 0;
var index = 0;

// link right clicked
var item;
var autoItem;
var matchedItem = [];
var link;
var linkText;
var containers = [];
var lastContainer;
var lastContainerStyle;
var subfolders = [];
var remembered = {
  class: undefined,
  category: { category: undefined, depth: 0 },
  link: [],
  title: []
}

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
    
    selectClasses();
    
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
    saveData(host, page, containers[index], link, linkText);
    clear();
  }
  if (document.getElementById("markFolders")) {
    subfolders.push(window.location.hostname + "/");
    if (remembered.category.category) {
      for (var i = 0; i < $("." + "folderButton").length; i++) {
        var depth = "";
        for (var ii = 0; ii < i; ii++) {
          depth += $("." + "folderButton")[ii].innerText;
        }
        selectButton(depth, i + 1);
      }
    }
  }
}

function saveData(host, page, container, link, linkText) {
  var subfoldersStr = "";
  for (var i = 1; i < subfolders.length; i++) {
    subfoldersStr += subfolders[i];
  }
  subfoldersStr = "/" + subfoldersStr;
  chrome.storage.local.get([window.location.hostname], function (item) {
    (!item[host]) && (item[host] = {});
    (!item[host][subfoldersStr]) && (item[host][subfoldersStr] = {});
    (!item[host][subfoldersStr]["maxEntries"]) && (item[host][subfoldersStr]["maxEntries"] = 2);
    var oldest;
    var length = 0;
    for (var key in item[host][subfoldersStr]) {
      (!oldest) && (oldest = key);
      length += 1;
    }
    length -= 1;
    (isNaN(oldest)) && (oldest = 1);
    if (length >= item[host][subfoldersStr]["maxEntries"]) {
      delete item[host][subfoldersStr][oldest];
    }
    var number = parseInt(oldest) + length;
    item[host][subfoldersStr][number] = {
      class: container.class,
      href: link,
      nth: getNth(container.container),
      title: linkText,
      page: page,
      date: getFullDate(),
      time: getTimeValue()
    }
    console.log(item);
    chrome.storage.local.set(item);
    styleContainer(container.container, "red");
  });
}

function getNth(ctn) {
  var num = 0;
  $(ctn).find("a").each(function (i, v) {
    num++;
  });
  
  return num;
}

function getFullDate() {
  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  var date = d.getDate();
  var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var day = days[d.getDay()];
  
  var str = year + "/" + month + "/" + date + ", " + day;
  
  return str;
}

function getTimeValue() {
  var d = new Date();
  
  return d.getTime();
}

function styleContainer(ctn, color) {
  $(ctn).css("border", "thick solid " + color);
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
}

function selectClasses() {
  var containerClasses = [];
  var count = containers.length;
  for (var i = 0; i < count; i++) {
    containerClasses.push(containers[i].class)
  }
  var indexFound = containerClasses.findIndex(function (element) {
    return element == remembered.class;
  });
  if (indexFound >= 0) {
    index = indexFound;
    updateStyle();
  }
}

/*
  jump
*/
function jump() {
  if (matchedItem.length > 0) {
    if (jumpToggle == matchedItem.length) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo(0, matchedItem[jumpToggle].offsetTop);
    }
    if (jumpToggle < matchedItem.length) {
      jumpToggle++;
    } else {
      jumpToggle = 0;
    }
  }
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
  index = 0;
  jumpToggle = 0;
  toggle = false;
}

