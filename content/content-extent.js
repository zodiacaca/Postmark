
function mark()
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
  chrome.runtime.sendMessage({task: "icon", path: "icons/postmark-128.png"});
  
  chrome.storage.local.get(function(items) {
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
      if (title) {
        $(classSelector).each(function(index, value) {
          var match = false;
          ($(value).innerText == title) && (match = true);
          $(value).find("a").each(function(i, v) {
            (v.innerText == title) && (match = true);
          });
          match && $(value).css("border", "thick solid #f00");
          match && $(value).css("box-sizing", "border-box");
          match && $(value).css("overflow", "hidden");
          match && (matched = true);
        });
      } else {
        $(classSelector).each(function(index, value) {
          var match = false;
          ($(value).attr("href") == markItem.href) && (match = true);
          $(value).find("a").each(function(i, v) {
            ($(v).attr("href") == markItem.href) && (match = true);
          });
          match && $(value).css("border", "thick solid #f00");
          match && $(value).css("box-sizing", "border-box");
          match && $(value).css("overflow", "hidden");
          match && (matched = true);
        });
      }
      // change icon to notice user
      matched && chrome.runtime.sendMessage({task: "icon", path: "icons/postmark-128-r.png"});
    }
  });
}
mark();

function autoMark()
{
  
}
autoMark();

function getTime() {
  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  var date = d.getDate();
  var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var day = days[d.getDay()];
  
  var str = year + "/" + month + "/" + date + ", " + day;
  
  return str;
}
