
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
  $(markBox).css("z-index", Math.pow(2, 31));
}

function updateBox() {
  // update position of list box
  $("#markBox").position({
    my: "left top",
    at: "right top",
    of: linkData.item,
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
  filterClassNames();
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
  // append
  var markList = document.getElementById("markList");
  markList.appendChild(level);
  level.appendChild(document.createTextNode(getElementIdentifier(containers[i].tag, containers[i].class)));
  // css properties
  $(level).css("all", "initial");
  $(level).css("font-family", "Helvetica");
  $(level).css("font-size", toPx(0.9));
  $(level).css("line-height", "2.2");
  $(level).css("color", listTextColor);
  $(level).css("width", toPx(16));
  $(level).css("padding-left", toPx(0.75));
  $(level).css("border-bottom", "thin solid " + floorColor);
  $(level).css("display", "block");
  $(level).css("transition", "color 0.5s");
}

function addButtons() {

  var opBox = document.createElement("div");
  opBox.id = "opBox";
  document.body.appendChild(opBox);
  $(opBox).css("all", "initial");
  $(opBox).css("position", "fixed");
  $(opBox).css("z-index", Math.pow(2, 31));

  var confirm = document.createElement("button");
  confirm.id = "markConfirm";
  opBox.appendChild(confirm);
  $(confirm).css("all", "initial");
  $(confirm).css("width", toPx(1.8));
  $(confirm).css("height", toPx(1.8));
  $(confirm).css("border-top", "thin solid grey");
  $(confirm).css("border-right", "thin solid grey");
  $(confirm).css("border-bottom", "medium solid #0f0");
  $(confirm).css("background", "#fffa");
  $(confirm).css("box-sizing", "content-box");
  $(confirm).css("display", "inline");
  var checkIcon = document.createElement("img");
  var url = chrome.runtime.getURL("/icons/check.svg");
  $(checkIcon).attr("src", url);
  confirm.appendChild(checkIcon);
  $(checkIcon).css("all", "initial");
  $(checkIcon).css("padding", toPx(0.4));
  $(checkIcon).css("width", toPx(1));
  $(checkIcon).css("height", toPx(1));
  $(confirm).hover(
    function() {
      $(confirm).css("background", "#ddd");
      $(confirm).css("transform", "scale(1.1)");
      $(confirm).css("border", "0px solid grey");
      $(confirm).css("border-bottom", "medium solid #0f0");
    }, function() {
      $(confirm).css("background", "#fffa");
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
  $(cancel).css("background", "#fffa");
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
    function() {
      $(cancel).css("background", "#ddd");
      $(cancel).css("transform", "scale(1.1)");
      $(cancel).css("border", "0px solid grey");
      $(cancel).css("border-bottom", "medium solid red");
    }, function() {
      $(cancel).css("background", "#fffa");
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
  $(folderList).css("all", "initial");
  $(folderList).css("position", "absolute");
  $(folderList).css("top", "0");
  $(folderList).css("left", "0");
  $(folderList).css("background-color", "rgba(0, 0, 0, 0.8)");

  addHostnameButton();
}

function addHostnameButton() {
  var hostItem = document.createElement("button");
  hostItem.id = "folderItem0";
  var folderList = document.getElementById("markFolders");
  folderList.appendChild(hostItem);
  hostItem.appendChild(document.createTextNode(window.location.hostname));
  $(hostItem).css("all", "initial");
  $(hostItem).css("font-family", "Helvetica");
  $(hostItem).css("font-size", toPx(0.9));
  $(hostItem).css("color", "#222");
  $(hostItem).css("margin", toPx(0.4));
  $(hostItem).css("margin-left", toPx(0.1));
  $(hostItem).css("margin-right", toPx(0.2));
  $(hostItem).css("padding", toPx([0.1, 0.2]));
  $(hostItem).css("border-bottom", "medium solid #0f0");
  $(hostItem).css("background-color", "#eee");

  $(hostItem).on("click", function(e) {
    subfolders = [];
    subfolders.push(window.location.hostname + "/");
    var count = $("#markFolders").children().length;
    for (var i = 1; i <= count; i++) {
      var element = document.getElementById("folderItem" + i);
      $(element).css("border-bottom", "medium solid grey");
    }
  });
}

function showSubfolders(index, folder) {
  var folderItem = document.createElement("button");
  folderItem.className = "folderButton";
  folderItem.id = "folderItem" + index;
  var folderList = document.getElementById("markFolders");
  folderList.appendChild(folderItem);
  folderItem.appendChild(document.createTextNode(folder));
  $(folderItem).css("all", "initial");
  $(folderItem).css("font-family", "Helvetica");
  $(folderItem).css("font-size", toPx(0.9));
  $(folderItem).css("margin", toPx(0.4));
  $(folderItem).css("margin-left", toPx(0.1));
  $(folderItem).css("margin-right", toPx(0.2));
  $(folderItem).css("padding", toPx([0.1, 0.2]));
  $(folderItem).css("border-bottom", "medium solid grey");
  $(folderItem).css("background-color", "#eee");

  $(folderItem).on("click", function(e) {
    selectCategory(this);
  });
}

function selectCategory(btn) {
  var num = btn.id.substring(10);
  var index = parseInt(num);
  for (var i = 1; i <= index; i++) {
    var element = document.getElementById("folderItem" + i);
    var folder = element.innerText;
    subfolders.pushIfUnique(folder);
    $(element).css("border-bottom", "medium solid #0f0");
  }
  var count = $("#markFolders").children().length;
  for (var i = index + 1; i <= count; i++) {
    var element = document.getElementById("folderItem" + i);
    subfolders.splice(index + 1)
    $(element).css("border-bottom", "medium solid grey");
  }
}

function selectButton(folder, index) {
  if (remembered.category.category.indexOf(folder) >= 0) {
    var button = document.getElementById("folderItem" + index);
    selectCategory(button);
  }
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
  showArea();
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

function showArea() {
  if (lastContainer) {
    $(lastContainer).find(".postmark-area").remove();
  }
  $(document).find(".postmark-mark").css("display", "none");
  styleMark(containers[index].container, "#0000ff", "ff", true, false);
  // container, color, alpha, for displaying area, newly added
  lastContainer = containers[index].container;
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
