

// variables //
// switch
var toggle = false;
var index = 0;
var extraStep = false;

// link right clicked
var item;
var link;
var linkText;
var containers = [];
var lastContainer;
var lastContainerStyle;

// colors
var listTextColor = "rgba(30,30,30,1)"
var bgColor = "#fff";
var bgColorSelected = "#bbb";
var floorColor = "grey";
var stickColor = "#111";

var size = 16;
var zIndex;


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.event == "onRClicked") {
    checkDOM();
  } else if (message.event == "onActivated") {
    checkMark()
  }
});


document.oncontextmenu = function (e) {
  item = e.target;
  link = $(item).attr("href");
  linkText = item.innerText;
}


/*
  passive mark action
*/
function checkMark()
{
/*   $.ajax({
    url: "",
    dataType: "html",
    success: extractBody
  });
  
  function extractBody(html)
  {
    var start = html.indexOf("<body");
    var newStart = html.indexOf(">", start)
    newStart += 1;
    var end = html.indexOf("</body>");
    var body = html.substring(newStart, end+7);
    body = "<body>" + body;
    phaseXML(body);
    console.log(body);
  }
  
  function phaseXML(body)
  {
    var xmlDoc = $.parseXML(body);
    findLink(xmlDoc);
  }
  
  function findLink(xml)
  {
    var container = $(xml).find("");
    console.log(container);
  } */
  
  // initialize icon
  chrome.runtime.sendMessage({task: "icon", path: "icons/postmark.svg"});
  
  chrome.storage.local.get(function (items) {
    // console.log(items);
    var host = window.location.hostname;
    var markItem = items[host];
    if (markItem) {
      var title = markItem.title;
      var classes = markItem.class;
      var classArray = classes.split(" ");
      for (var i = 0; i < classArray.length; i++) {
        classArray[i] = "." + classArray[i];
      }
      var classSelector = "";
      for (var i = 0; i < classArray.length; i++) {
        classSelector += classArray[i];
      }
      var matched = false;
      if (title && title != "") {
        $(classSelector).each(function (index, value) {
          var match = false;
          ($(value).innerText == title) && (match = true);
          $(value).find("a").each(function (i, v) {
            (v.innerText == title) && (match = true);
          });
          match && $(value).css("border", "thick solid #f00");
          match && $(value).css("box-sizing", "border-box");
          match && $(value).css("overflow", "hidden");
          match && (matched = true);
        });
      } else {
        $(classSelector).each(function (index, value) {
          var match = false;
          ($(value).attr("href") == markItem.href) && (match = true);
          $(value).find("a").each(function (i, v) {
            ($(v).attr("href") == markItem.href) && (match = true);
          });
          match && $(value).css("border", "thick solid #f00");
          match && $(value).css("box-sizing", "border-box");
          match && $(value).css("overflow", "hidden");
          match && (matched = true);
        });
      }
      // change icon to notice user
      matched && chrome.runtime.sendMessage({task: "icon", path: "icons/postmark-r.svg"});
    }
  });
}
checkMark();

function autoMark()
{
  
}
autoMark();
