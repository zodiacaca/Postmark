
// variables //
// switch
var toggle = false;
var jumpToggle = 0;
var index = 0;

// link right clicked
var linkItem = {
  element: undefined,
  title: undefined,
  href: undefined
}
var containers = [];
var lastContainer;
var subfolders = [];
var markTime = 0;
var remembered = {
  level: undefined,
  category: { category: undefined, depth: 0 },
  title: [],
  href: []
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
    showArea();
    
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
    saveData(host, page, containers[index], linkItem.title, linkItem.href);  // pass variables to local ones, storageArea has a delay
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

function saveData(host, page, container, title, href) {
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
    var newest = 1;
    var length = 0;
    for (var key in item[host][subfoldersStr]) {
      if (!oldest && !isNaN(key)) {
        oldest = key;
      }
      if (!isNaN(key)) {
        newest = key;
      }
      length += 1;
    }
    length -= 1;  // maxEntries takes one place
    if (length >= item[host][subfoldersStr]["maxEntries"]) {
      delete item[host][subfoldersStr][oldest];
    }
    var number = parseInt(newest) + 1;
    item[host][subfoldersStr][number] = {
      title: title, // from the title attribute or the inner text
      href: href,
      tag: container.tag, // tag name
      class: container.class, // class name
      depth: $(container).parents().length, // depth in the DOM tree
      level: container.level, // chosen selector's position, relative to depth
      nth: getNth(container.container), // position among the many anchors within
      page: page, // at the page where marked
      date: getFullDate(),
      time: getTimeValue(),
      autoMarked: false
    }
    console.log(item);
    chrome.storage.local.set(item);
    styleMark(container.container, "#48929B", "ff");
    matchedItem.pushIfUnique(container.container);
    markTime = getTimeValue();
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

function styleMark(ctn, c, a, dsp) {
  if (!$(ctn).children(".postmark-mark").length || dsp) {
    
    var a_b = parseInt(a, 16) / 5;
    a_b = Math.round(a_b);
    a_b = a_b.toString(16);
    var a_s = parseInt(a, 16) / 3;
    a_s = Math.round(a_s);
    a_s = a_s.toString(16);
    var c_s = c + a_s;
    
    var containerSize = {
      w: ctn.offsetWidth,
      h: ctn.offsetHeight
    }
    var z = findMaxZ($(ctn).children());
    if ($(ctn).css("position") == "static") {
      $(ctn).css("position", "relative");
    }
    var mark = document.createElement("div");
    if (dsp) {
      mark.className = "postmark-area";
    } else {
      mark.className = "postmark-mark";
    }
    ctn.appendChild(mark);
    $(mark).css("all", "initial");
    $(mark).css("width", containerSize.w + "px");
    $(mark).css("height", containerSize.h + "px");
    $(mark).css("border", "thin solid " + c + a);
    mark.style.backgroundColor = c + a_b;
    mark.style.backgroundImage = "linear-gradient(-45deg," + c_s + " 5.56%,transparent 5.56%,transparent 50%," + c_s + " 50%," + c_s + " 55.56%,transparent 55.56%,transparent 100%)";
    $(mark).css("background-size", "9px 9px");
    $(mark).css("box-sizing", "border-box");
    $(mark).css("position", "absolute");
    $(mark).css("top", 0);
    $(mark).css("left", 0);
    (z) && ($(mark).css("z-index", z));
    $(mark).css("pointer-events", "none");
    $(mark).css("transition", "opacity 0.4s");
    $(mark).parent().hover(
      function () {
        if (getTimeValue() - markTime > 3000) {
          $(this).find(".postmark-mark").css("opacity", 0);
        }
      }, function () {
        $(this).find(".postmark-mark").css("opacity", 1);
      }
    );
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
    level: 0
  }
  containers.push(data);
  
  var parents = $(linkItem.element).parents();
  var count = parents.length - 2;
  for (var i = 0; i < count; i++) {
    var data = {
      container: parents.get(i),
      tag: parents.get(i).tagName.toLowerCase(),
      class: parents.get(i).className,
      level: i + 1
    }
    containers.push(data);
  }
}

function selectContainer() {
  if (remembered.level) {
    index = remembered.level;
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
  if (lastContainer) {
    $(lastContainer).find(".postmark-area").remove();
  }
  $(document).find(".postmark-mark").css("display", "block");
  $("#markBox").remove();
  $("#opBox").remove();
  linkItem.element = undefined;
  linkItem.title = undefined;
  linkItem.href = undefined;
  containers = [];
  lastContainer = undefined;
  subfolders = [];
  index = 0;
  jumpToggle = 0;
  toggle = false;
}

