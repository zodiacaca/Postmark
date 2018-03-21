
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  checkDOM();
});

document.oncontextmenu = function (e) {
  item = e.target;
  link = $(item).attr("href");
}

// switch
var toggle = false;
var index = 0;

// link right clicked
var item;
var link;
var containers = [];
var containerClasses = [];
var lastContainer;
var lastContainerStyle;

// colors
var listTextColor = "rgba(40,40,40,1)"
var buttonTextColor = "rgba(230,230,230,1)"
var bgColor = "#ddd";
var bgColorSelected = "#aaa";
var floorColor = "#888";
var stickColor = "#111";

function checkDOM()
{
  toggle = !toggle;
  
  if (toggle) {
    // chrome.runtime.sendMessage({ task: "css" });
    
    createBox();
    updateBox();
    addStick();
    findClasses()
    fillBox();
    addButtons();
    colorBackground();
  }
  else {
    clear();
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
  $("#classConfirm").on("click", function (e) {
    var markItem = {};
    var host = window.location.hostname;
    markItem[host] = { class: containerClasses[index], href: link, page: window.location.href };
    chrome.storage.local.set(markItem, function() {
    });
    $(containers[index]).css("border", "thick solid #f00");
    $(containers[index]).css("box-sizing", "border-box");
    clear();
  });
  
  $("#classCancel").on("click", function (e) {
    clear();
  });
}

/*
  find classes
*/
function findClasses() {
  var itemClass = item.className;
  itemClass && containers.push($(item));
  itemClass && containerClasses.push(itemClass);
  var parents = $(item).parents();
  var count = parents.length - 2;
  for (var i = 0; i < count; i++) {
    var classNames = parents.get(i).className;
    classNames && containers.push(parents.get(i));
    classNames && containerClasses.push(classNames);
  }
  
  selectClasses()
}

function selectClasses() {
  chrome.storage.local.get(function(items) {
    var host = window.location.hostname;
    var markItem = items[host];
    if (markItem) {
      var classes = markItem.class;
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
  make UI
*/
function createBox() {
  // initialize
  var classBox = document.createElement("div");
  classBox.id = "classBox";
  // append to body
  document.body.appendChild(classBox);
  // css properties
  $(classBox).css("all", "initial");
  $(classBox).css("display", "block");
  $(classBox).css("width", "18rem");
  $(classBox).css("height", "24rem");
  $(classBox).css("border", "thin solid grey");
  $(classBox).css("border-left", "medium solid black");
  $(classBox).css("background-color", bgColor);
  $(classBox).css("box-sizing", "content-box");
  $(classBox).css("box-shadow", "0.2rem 0.2rem 0.25rem grey");
  $(classBox).css("position", "fixed");
  $(classBox).css("overflow", "hidden");
  
  // find top level
  var indexes = [];
  var nodes = $("body").children();
  nodes.each(function () {
    var z = $(this).css("z-index");
    (!isNaN(z)) && indexes.push(z);
  });
  if (indexes.length > 0) {
    var max = indexes.reduce(function (a, b) {
      return Math.max(a, b);
    });
    var zIndex = max + 1;
    $(classBox).css("z-index", zIndex);
  }
}

function updateBox() {
  // update position of list box
  $("#classBox").position({
    my: "left top",
    at: "right top",
    of: item,
    collision: "fit"
  });
}

function addStick() {
  var stick = document.createElement("div");
  stick.id = "classStick";
  var classBox = document.getElementById("classBox");
  classBox.appendChild(stick);
  var height = 1 * 2;
  height += "rem";
  $(stick).css("all", "initial");
  $(stick).css("width", "0.25rem");
  $(stick).css("height", height);
  $(stick).css("background-color", stickColor);
  $(stick).css("position", "absolute");
  $(stick).css("top", "0");
  $(stick).css("left", "0");
}

function fillBox() {
  createList();
  var count = containers.length;
  for (var i = 0; i < count; i++) {
    addItem(i);
  }
  updateStyle();
}

function createList() {
  // initialize
  var list = document.createElement("ol");
  list.id = "classList";
  // append
  var classBox = document.getElementById("classBox");
  classBox.appendChild(list);
  // css properties
  $(list).css("all", "initial");
  $(list).css("list-style", "none");
}

function addItem(i) {
  // initialize
  var level = document.createElement("li");
  var paragraph = document.createElement("p");
  // append
  var classList = document.getElementById("classList");
  classList.appendChild(level);
  level.appendChild(paragraph);
  paragraph.appendChild(document.createTextNode(containerClasses[i]));
  // css properties
  $(level).css("all", "initial");
  $(level).css("display", "block");
  $(level).css("border-bottom", "thin solid " + floorColor);
  
  $(paragraph).css("all", "initial");
  $(paragraph).css("font-family", "Helvetica");
  $(paragraph).css("font-size", "1rem");
  $(paragraph).css("line-height", "2");
  $(paragraph).css("color", listTextColor);
  $(paragraph).css("margin-left", "0.75rem");
  $(paragraph).before().css("content", "");
  $(paragraph).before().css("clear", "both");
  $(paragraph).before().css("display", "table");
}

function addButtons() {
  var cancel = document.createElement("button");
  cancel.id = "classCancel";
  var classBox = document.getElementById("classBox");
  classBox.appendChild(cancel);
  cancel.appendChild(document.createTextNode("Cancel"));
  var height = 1 * 1.4;
  var heightREM = height + "rem";
  var top = 24 - 1 * 1.4 - 0.125;
  var topREM = top + "rem";
  var width = 6.25;
  var widthREM = width + "rem";
  var leftCancel = 18 - width - 0.2;
  var leftCancelREM = leftCancel + "rem";
  $(cancel).css("all", "initial");
  $(cancel).css("font-family", "Helvetica");
  $(cancel).css("font-size", "0.8rem");
  $(cancel).css("text-align", "center");
  $(cancel).css("color", buttonTextColor);
  $(cancel).css("width", widthREM);
  $(cancel).css("height", heightREM);
  $(cancel).css("border", "thin solid rgba(80,80,80,1)");
  $(cancel).css("background", "linear-gradient(45deg, #666, #555)");
  $(cancel).css("box-sizing", "border-box");
  $(cancel).css("position", "absolute");
  $(cancel).css("top", topREM);
  $(cancel).css("left", leftCancelREM);
  
  var confirm = document.createElement("button");
  confirm.id = "classConfirm";
  classBox.appendChild(confirm);
  confirm.appendChild(document.createTextNode("OK"));
  var leftConfirm = 18 - width * 2 - 0.2 * 2;
  var leftConfirmREM = leftConfirm + "rem";
  $(confirm).css("all", "initial");
  $(confirm).css("font-family", "Helvetica");
  $(confirm).css("font-size", "0.8rem");
  $(confirm).css("text-align", "center");
  $(confirm).css("color", buttonTextColor);
  $(confirm).css("width", widthREM);
  $(confirm).css("height", heightREM);
  $(confirm).css("border", "thin solid rgba(80,80,80,1)");
  $(confirm).css("background", "linear-gradient(45deg, #666, #555)");
  $(confirm).css("box-sizing", "border-box");
  $(confirm).css("position", "absolute");
  $(confirm).css("top", topREM);
  $(confirm).css("left", leftConfirmREM);
}

/*
  update UI
*/
function updateStyle() {
  // update stick position
  moveStick()
  // change item background color
  changeBackground()
  // color selected container background
  colorBackground();
}

function moveStick() {
  var listPos = $("#classList").position().top;
  var itemPos = $("#classList").children().eq(index).position().top;
  var top = itemPos - listPos;
  $("#classStick").css("top", top);
}

function changeBackground() {
  $("#classList").children().css("background-color", bgColor);
  $("#classList").children().eq(index).css("background-color", bgColorSelected);
}

function colorBackground() {
  lastContainer && $(lastContainer).css("background", lastContainerStyle);
  var bg = $(containers[index]).css("background");
  var bgIndex = bg.indexOf(")");
  var bgStyle = bg.substr(bgIndex + 1);
  $(containers[index]).css("background", "rgba(0,0,255,0.2)" + bgStyle);
  lastContainer = containers[index];
  lastContainerStyle = bg;
}

/*
  reset
*/
function clear() {
  lastContainer && $(lastContainer).css("background", lastContainerStyle);
  $("#classBox").remove();
  item = undefined;
  link = undefined;
  containers = [];
  containerClasses = [];
  lastContainer = undefined;
  lastContainerStyle = undefined;
  index = 0;
  toggle = false;
}
