
// variables //
// switch
var toggle = false;
var jumpToggle = 0;
var index = 0;

// link right clicked
var linkItem = {
  element: undefined,
  title: undefined,
  link: undefined
}
var containers = [];
var lastContainer = {
  container: undefined,
  style: undefined
}
var subfolders = [];
var remembered = {
  depth: undefined,
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
  if (!document.getElementById("markBox") && linkItem.element) {
    // chrome.runtime.sendMessage({ task: "css", file: "" });
    
    createBox();
    updateBox();
    addStick();
    getContainers()
    fillBox();
    addButtons();
    colorBackground();
    
    selectContainer();
    toggle = true;
  }
  else {
    clear();
    
    toggle = false;
  }
  
  // use wheel for selecting container
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
    saveData(host, page, containers[index], linkItem.link, linkItem.title);  // pass variables to local ones, storageArea has a delay
    clear();
  }
  if (document.getElementById("markFolders")) {
    subfolders.push(window.location.hostname + "/");
    if (remembered.category.category) {
      for (var i = 1; i <= $("." + "folderButton").length; i++) {
        var depth = "";
        for (var ii = 0; ii < i; ii++) {
          depth += $("." + "folderButton")[ii].innerText;
        }
        selectButton(depth, i);
      }
    }
  }
}

function saveData(host, page, container, link, linkTitle) {
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
      title: linkTitle,
      href: link,
      tag: container.tag,
      class: container.class,
      depth: container.depth,
      nth: getNth(container.container),
      page: page,
      date: getFullDate(),
      time: getTimeValue(),
      autoMarked: false
    }
    console.log(item);
    chrome.storage.local.set(item);
    styleMark(container.container, { r:255, g:0, b:0, a:1 });
    matchedItem.pushIfUnique(container.container);
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

function styleMark(ctn, c) {
  if (!$(ctn).children(".postmark-marks").length) {
    var containerSize = {
      w: ctn.offsetWidth,
      h: ctn.offsetHeight
    }
    var z = findMaxZ($(ctn).children());
    if ($(ctn).css("position") == "static") {
      $(ctn).css("position", "relative");
    }
    var mark = document.createElement("div");
    mark.className = "postmark-marks";
    ctn.appendChild(mark);
    $(mark).css("all", "initial");
    $(mark).css("width", containerSize.w + "px");
    $(mark).css("height", containerSize.h + "px");
    $(mark).css("border", "thin solid " + "rgba(" + c.r + "," + c.g + "," + c.b + "," + c.a + ")");
    $(mark).css("background-color", "rgba(" + c.r + "," + c.g + "," + c.b + "," + c.a * 0.2 + ")");
    $(mark).css("box-sizing", "border-box");
    $(mark).css("position", "absolute");
    $(mark).css("top", 0);
    $(mark).css("left", 0);
    (z) && ($(mark).css("z-index", z));
    $(mark).css("pointer-events", "none");
  }
}

/*
  get containers
*/
function getContainers() {
  var data = {
    container: linkItem.element,
    tag: linkItem.element.tagName.toLowerCase(),
    class: linkItem.element.className,
    depth: 0
  }
  containers.push(data);
  
  var parents = $(linkItem.element).parents();
  var count = parents.length - 2;
  for (var i = 0; i < count; i++) {
    var data = {
      container: parents.get(i),
      tag: parents.get(i).tagName.toLowerCase(),
      class: parents.get(i).className,
      depth: i + 1
    }
    containers.push(data);
  }
}

function selectContainer() {
  if (remembered.depth) {
    index = remembered.depth;
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
      console.log("Jump to TOP");
    } else {
      var item = matchedItem[matchedItem.length - jumpToggle - 1];
      window.scrollTo(0, $(item).offset().top);
      console.log("Jump to " + item);
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
  (lastContainer.container) && ($(lastContainer.container).css("background", lastContainer.style));
  $("#markBox").remove();
  $("#opBox").remove();
  linkItem.element = undefined;
  linkItem.link = undefined;
  linkItem.title = undefined;
  containers = [];
  lastContainer.container = undefined;
  lastContainer.style = undefined;
  subfolders = [];
  index = 0;
  jumpToggle = 0;
  toggle = false;
}

