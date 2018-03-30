
/*
  make UI
*/
function createBox() {
  // initialize
  var markBox = document.createElement("div");
  markBox.id = "markBox";
  // append to body
  document.body.appendChild(markBox);
  // css properties
  $(markBox).css("all", "initial");
  $(markBox).css("border", "thin solid grey");
  $(markBox).css("border-left", "medium solid black");
  $(markBox).css("background-color", bgColor);
  $(markBox).css("box-sizing", "content-box");
  $(markBox).css("box-shadow", toPx([0.25, 0.25, 0]) + "#222");
  $(markBox).css("display", "block");
  $(markBox).css("position", "fixed");
  $(markBox).css("overflow", "hidden");
  
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
    zIndex = max + 1;
    $(markBox).css("z-index", zIndex);
  }
}

function updateBox() {
  // update position of list box
  $("#markBox").position({
    my: "left top",
    at: "right top",
    of: item,
    collision: "fit"
  });
}

function addStick() {
  var stick = document.createElement("div");
  stick.id = "markStick";
  var markBox = document.getElementById("markBox");
  markBox.appendChild(stick);
  $(stick).css("all", "initial");
  $(stick).css("width", toPx(0.2));
  $(stick).css("height", toPx(0.9 * 2.2));
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
  list.id = "markList";
  // append
  var markBox = document.getElementById("markBox");
  markBox.appendChild(list);
  // css properties
  $(list).css("all", "initial");
  $(list).css("list-style", "none");
}

function addItem(i) {
  // initialize
  var level = document.createElement("li");
  var paragraph = document.createElement("p");
  // append
  var markList = document.getElementById("markList");
  markList.appendChild(level);
  level.appendChild(paragraph);
  paragraph.appendChild(document.createTextNode(containers[i].class));
  // css properties
  $(level).css("all", "initial");
  $(level).css("width", toPx(16));
  $(level).css("border-bottom", "thin solid " + floorColor);
  $(level).css("display", "block");
  
  $(paragraph).css("all", "initial");
  $(paragraph).css("font-family", "Helvetica");
  $(paragraph).css("font-size", toPx(0.9));
  $(paragraph).css("line-height", "2.2");
  $(paragraph).css("color", listTextColor);
  $(paragraph).css("margin-left", toPx(0.75));
  $(paragraph).before().css("content", "");
  $(paragraph).before().css("clear", "both");
  $(paragraph).before().css("display", "table");
}

function addButtons() {

  var opBox = document.createElement("div");
  opBox.id = "opBox";
  document.body.appendChild(opBox);
  $(opBox).css("all", "initial");
  $(opBox).css("position", "fixed");
  $(opBox).css("z-index", zIndex);
  
  var confirm = document.createElement("button");
  confirm.id = "markConfirm";
  opBox.appendChild(confirm);
  $(confirm).css("all", "initial");
  $(confirm).css("width", toPx(1.8));
  $(confirm).css("height", toPx(1.8));
  $(confirm).css("border-top", "thin solid grey");
  $(confirm).css("border-right", "thin solid grey");
  $(confirm).css("border-bottom", "medium solid #0f0");
  $(confirm).css("background", "#aaa");
  $(confirm).css("box-sizing", "content-box");
  $(confirm).css("display", "inline");
  var checkIcon = document.createElement("img");
  url = chrome.runtime.getURL("/icons/check.svg");
  $(checkIcon).attr("src", url);
  confirm.appendChild(checkIcon);
  $(checkIcon).css("all", "initial");
  $(checkIcon).css("padding", toPx(0.4));
  $(checkIcon).css("width", toPx(1));
  $(checkIcon).css("height", toPx(1));
  $(confirm).hover(
    function () {
      $(confirm).css("background", "#ddd");
      $(confirm).css("transform", "scale(1.1)");
      $(confirm).css("border", "0px solid grey");
      $(confirm).css("border-bottom", "medium solid #0f0");
    }, function () {
      $(confirm).css("background", "#aaa");
      $(confirm).css("transform", "scale(1)");
      $(confirm).css("border-top", "thin solid grey");
      $(confirm).css("border-right", "thin solid grey");
      $(confirm).css("border-bottom", "medium solid #0f0");
    }
  );
  
  var cancel = document.createElement("button");
  cancel.id = "markCancel";
  opBox.appendChild(cancel);
  $(cancel).css("all", "initial");
  $(cancel).css("width", toPx(1.8));
  $(cancel).css("height", toPx(1.8));
  $(cancel).css("border-top", "thin solid grey");
  $(cancel).css("border-right", "thin solid grey");
  $(cancel).css("border-bottom", "medium solid red");
  $(cancel).css("background", "#aaa");
  $(cancel).css("box-sizing", "content-box");
  $(cancel).css("display", "inline");
  var removeIcon = document.createElement("img");
  var url = chrome.runtime.getURL("/icons/cross-remove-sign.svg");
  $(removeIcon).attr("src", url);
  cancel.appendChild(removeIcon);
  $(removeIcon).css("all", "initial");
  $(removeIcon).css("padding", toPx(0.4));
  $(removeIcon).css("width", toPx(1));
  $(removeIcon).css("height", toPx(1));
  $(cancel).hover(
    function () {
      $(cancel).css("background", "#ddd");
      $(cancel).css("transform", "scale(1.1)");
      $(cancel).css("border", "0px solid grey");
      $(cancel).css("border-bottom", "medium solid red");
    }, function () {
      $(cancel).css("background", "#aaa");
      $(cancel).css("transform", "scale(1)");
      $(cancel).css("border-top", "thin solid grey");
      $(cancel).css("border-right", "thin solid grey");
      $(cancel).css("border-bottom", "medium solid red");
    }
  );
  
  $(opBox).position({
    my: "left top",
    at: "right top",
    of: $("#markBox"),
    collision: "fit"
  });
}

function addFolderList() {
  var folderList = document.createElement("div");
  folderList.id = "markFolders";
  var markBox = document.getElementById("markBox");
  markBox.appendChild(folderList);
  $(folderList).css("position", "absolute");
  $(folderList).css("top", "0");
  $(folderList).css("left", "0");
  $(folderList).css("background", "rgba(0, 0, 0, 0.5)");
  
  addHostnamesButton();
}

function addHostnamesButton() {
  var hostItem = document.createElement("button");
  var folderList = document.getElementById("markFolders");
  folderList.appendChild(hostItem);
  hostItem.appendChild(document.createTextNode(window.location.hostname));
}

function showSubfolders(folder) {
  var folderItem = document.createElement("button");
  var folderList = document.getElementById("markFolders");
  folderList.appendChild(folderItem);
  folderItem.appendChild(document.createTextNode(folder));
  
  $(folderItem).on("click", function (e) {
    subfolders.push(folder);
  });
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
  var listPos = $("#markList").position().top;
  var itemPos = $("#markList").children().eq(index).position().top;
  var top = itemPos - listPos;
  $("#markStick").css("top", top);
}

function changeBackground() {
  $("#markList").children().css("background-color", bgColor);
  $("#markList").children().eq(index).css("background-color", bgColorSelected);
}

function colorBackground() {
  lastContainer && $(lastContainer).css("background", lastContainerStyle);
  var bg = $(containers[index].container).css("background");
  var bgIndex = bg.indexOf(")");
  var bgStyle = bg.substr(bgIndex + 1);
  $(containers[index].container).css("background", "rgba(0,0,255,0.2)" + bgStyle);
  lastContainer = containers[index].container;
  lastContainerStyle = bg;
}

/*
  toPx
*/
function toPx(num) {
  var array = Array.isArray(num);
  if (array) {
    var count = num.length;
    var str = "";
    for (var i = 0; i < count; i++) {
      str += num[i] * 16 + "px ";
    }
    
    return str;
  } else {
    return num * 16 + "px";
  }
}