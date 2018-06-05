
// variables //
// switch
var toggle = false;
var jumpToggle = 0;
var index = 0;

// link right clicked
var linkData = {
  item: undefined,
  title: undefined,
  href: undefined
}
var containers = [];
var lastContainer;
var subfolders = [];

// colors
var listTextColor = "rgba(30,30,30,1)"
var bgColor = "#fff";
var bgColorSelected = "#bbb";
var floorColor = "grey";
var stickColor = "#111";

var size = 16;


function checkDOM()
{
  // popup box
  if (!document.getElementById("markBox") && linkData.item) {
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
  /* reviewed 06/04 */
  // use wheel for selecting container
  window.onwheel = function (e) {
    if (e.deltaY < 0) {
      if (index > 0) { index -= 1 }
    }
    if (e.deltaY > 0) {
      if (index < containers.length - 1) { index += 1 }
    }
    if (document.getElementById("markBox")) {
      updateStyle();
      filterClassNames();
    }
    
    return !toggle;
  }
  /* reviewed 06/04 */
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
  /* reviewed 06/05 */
  if (!document.getElementById("markFolders") || subfolders.length > 0) {
    // storage doesn't seem to be able to read object defined in the global scope
    var data = {
      item: linkData.item,
      title: linkData.title,
      href: linkData.href
    }
    var imgURL = getPostImage(containers[index].container);
    // pass variables to local ones, storageArea has a delay
    saveData(host, page, containers[index], data, imgURL);
    clear();
  }
  /* reviewed 06/05 */
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

function saveData(host, page, container, link, img) {
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
      title: link.title, // from the title attribute or the inner text
      href: link.href,
      tag: container.tag, // tag name
      class: container.class, // class name
      depth: $(link.item).parents().length, // depth in the DOM tree
      level: container.level, // chosen selector's position, relative to depth
      nth: getNth(container.container, link.item), // position among the many anchors within
      image: img,
      page: page, // at the page where marked
      date: getFullDate(),
      time: getTimeValue(),
      autoMarked: false
    }
    console.log(item);
    chrome.storage.local.set(item);
    styleMark(container.container, "#48929B", "ff", false, true);
    // container, color, alpha, for displaying area, newly added
    var data = {
      container: container.container,
      anchor: link.item
    }
    matchedItem.pushIfUnique(data);
  });
}
/* reviewed 06/05 */
function getPostImage(ctn) {
  var url;
  var threshold = 64;
  $(ctn).find("img").each(function (i, v) {
    if (v.offsetWidth >= threshold && v.offsetHeight >= threshold) {
      url = $(v).attr("src");
      
      return false;
    }
  });
  
  return url;
}
/* reviewed 06/05 */
function getNth(ctn, a) {
  var num = 0;
  $(ctn).find("a").each(function (i, v) {
    num++;
    if (v == a) {
      return false;
    }
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

function styleMark(ctn, c, a, dsp, added) {
// container, color, alpha, for displaying area, newly added
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
    if ($(ctn).css("position") == "static") {
      $(ctn).css("position", "relative");
    }
    var mark = document.createElement("div");
    if (dsp) {
      mark.className = "postmark-area";
    } else {
      mark.className = "postmark-mark";
    }
    if (added) {
      $(mark).attr("at", getTimeValue()); // added time value only for new mark
    } else {
      $(mark).attr("at", 0);
    }
    ctn.appendChild(mark);
    if ($(ctn).css("position") == "static") {
      $(ctn).css("position", "relative");
    }
    $(mark).css("all", "initial");
    $(mark).css("width", containerSize.w + "px");
    $(mark).css("height", containerSize.h + "px");
    $(mark).css("border", "thin solid " + c + a);
    if (added) {
      mark.style.backgroundColor = c + "11";
    } else {
      mark.style.backgroundColor = c + a_b;
    }
    mark.style.backgroundImage = "linear-gradient(-45deg," + c_s + " 5.56%,transparent 5.56%,transparent 50%," + c_s + " 50%," + c_s + " 55.56%,transparent 55.56%,transparent 100%)";
    $(mark).css("background-size", "9px 9px");
    $(mark).css("box-sizing", "border-box");
    $(mark).css("position", "absolute");
    $(mark).css("top", 0);
    $(mark).css("left", 0);
    $(mark).css("z-index", Math.pow(2, 31) - 1);
    $(mark).css("pointer-events", "none");
    $(mark).css("transition", "width 0.5s, height 0.5s, opacity 0.4s, background-color 2s cubic-bezier(0.25, -0.35, 0.25, 1.25)");
    $(mark).parent().hover(
      function () {
        $(this).find(".postmark-mark").each(function (i, v) {
          if (getTimeValue() - $(v).attr("at") > 2000) {
            $(v).css("opacity", 0);
          }
        });
      }, function () {
        $(this).find(".postmark-mark").css("opacity", 1);
      }
    );
    setTimeout(function () {
      mark.style.backgroundColor = c + a_b;
    }, 0);
  }
}

/*
  get containers
*/
function getContainers() {
  var data = {
    container: linkData.item,
    tag: linkData.item.tagName.toLowerCase(),
    class: linkData.item.className,
    level: 0
  }
  containers.push(data);
  
  var parents = $(linkData.item).parents();
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
/* reviewed 06/04 */
function filterClassNames() {
  
}
/* reviewed 06/04 */
/*
  jump
*/
function jump() {
  if (matchedItem.length > 0) {
    if (jumpToggle == matchedItem.length) {
      window.scrollTo(0, 0);
      console.log("Jump to TOP");
    } else {
      var item = matchedItem[matchedItem.length - jumpToggle - 1].container;
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
  linkData.item = undefined;
  linkData.title = undefined;
  linkData.href = undefined;
  containers = [];
  lastContainer = undefined;
  subfolders = [];
  index = 0;
  jumpToggle = 0;
  toggle = false;
}

