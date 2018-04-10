
// prototype
Array.prototype.pushIfUnique = function(element) { 
  if (this.indexOf(element) == -1) {
    this.push(element);
  }
}

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
  
  chrome.storage.local.get([window.location.hostname], function (item) {
    if (item) {
      for (var site in item) {
        for (var sub in item[site]) {
          for (var entry in item[site][sub]) {
            if (!isNaN(entry)) {
              var title = item[site][sub][entry].title;
              var classes = item[site][sub][entry].class;
              findAutoSelectClass(classes, site);
              var classArray;
              if (classes.indexOf(" ") >= 0) {
                classArray = classes.split(" ");
                for (var i = 0; i < classArray.length; i++) {
                  classArray[i] = "." + classArray[i];
                }
              } else {
                classArray = ["." + classes];
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
                  (match) && ($(value).css("border", "thick solid #f00"));
                  (match) && ($(value).css("box-sizing", "border-box"));
                  (match) && ($(value).css("overflow", "hidden"));
                  (match) && (matched = true);
                });
              } else {
                $(classSelector).each(function (index, value) {
                  var match = false;
                  ($(value).attr("href") == item[site][sub][entry].href) && (match = true);
                  $(value).find("a").each(function (i, v) {
                    ($(v).attr("href") == item[site][sub][entry].href) && (match = true);
                  });
                  (match) && ($(value).css("border", "thick solid #f00"));
                  (match) && ($(value).css("box-sizing", "border-box"));
                  (match) && ($(value).css("overflow", "hidden"));
                  (match) && (matched = true);
                });
              }
              // change icon to notice user
              (matched) && (chrome.runtime.sendMessage({task: "icon", path: "icons/postmark-r.svg"}));
            }
          }
        }
      }
    }
  });
}
checkMark();

function autoMark()
{
  
}

function findAutoSelectClass(classes, host) {
  var url = window.location.href;
  if (url.indexOf(host) >= 0) {
    rememberedClass = classes;
  }
}

