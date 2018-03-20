
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
var floorColor = "#444";
var stickColor = "#555";

function checkDOM()
{
  toggle = !toggle;
  
  if (toggle) {
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
    updateStyle()
    
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
  $(classBox).css("width", "280px");
  $(classBox).css("height", "380px");
  $(classBox).css("border-left", "thick solid #111");
  $(classBox).css("border-bottom", "thin solid #333");
  $(classBox).css("background-color", bgColor);
  $(classBox).css("box-sizing", "content-box");
  $(classBox).css("box-shadow", "4px 4px 10px rgba(80,80,80,1)");
  $(classBox).css("position", "fixed");
  var indexes = [];
  var nodes = $("body").children();
  nodes.each(function () {
    var z = $(this).css("z-index");
    (!isNaN(z)) && indexes.push(z);
  });
  var max = indexes.reduce(function (a, b) {
    return Math.max(a, b);
  });
  var zIndex = max + 1;
  $(classBox).css("z-index", zIndex);
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
  var height = 20 * 1.6;
  height += "px";
  $(stick).css("all", "initial");
  $(stick).css("width", "5px");
  $(stick).css("height", height);
  $(stick).css("background-color", stickColor);
  $(stick).css("position", "absolute");
  $(stick).css("top", "0px");
  $(stick).css("left", "0px");
}

function fillBox() {
  createList();
  var count = containers.length;
  for (var i = 0; i < count; i++) {
    addItem(i);
  }
  $("#classList").children().eq(index).css("background-color", bgColorSelected);
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
  $(paragraph).css("font-size", "20px");
  $(paragraph).css("line-height", "1.6");
  $(paragraph).css("color", listTextColor);
  $(paragraph).css("margin-left", "10px");
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
  var height = 20 * 1.4;
  height += "px";
  var top = 380 - 20 * 1.4 - 2;
  top += "px";
  $(cancel).css("all", "initial");
  $(cancel).css("font-family", "Helvetica");
  $(cancel).css("font-size", "14px");
  $(cancel).css("text-align", "center");
  $(cancel).css("color", buttonTextColor);
  $(cancel).css("width", "100px");
  $(cancel).css("height", height);
  $(cancel).css("border", "thin solid rgba(80,80,80,1)");
  $(cancel).css("background", "linear-gradient(45deg, #666, #555)");
  $(cancel).css("box-sizing", "border-box");
  $(cancel).css("position", "absolute");
  $(cancel).css("top", top);
  $(cancel).css("left", "177px");
  
  var confirm = document.createElement("button");
  confirm.id = "classConfirm";
  classBox.appendChild(confirm);
  confirm.appendChild(document.createTextNode("OK"));
  $(confirm).css("all", "initial");
  $(confirm).css("font-family", "Helvetica");
  $(confirm).css("font-size", "14px");
  $(confirm).css("text-align", "center");
  $(confirm).css("color", buttonTextColor);
  $(confirm).css("width", "100px");
  $(confirm).css("height", height);
  $(confirm).css("border", "thin solid rgba(80,80,80,1)");
  $(confirm).css("background", "linear-gradient(45deg, #666, #555)");
  $(confirm).css("box-sizing", "border-box");
  $(confirm).css("position", "absolute");
  $(confirm).css("top", top);
  $(confirm).css("left", "74px");
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
