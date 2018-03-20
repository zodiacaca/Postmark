
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
  
  chrome.storage.local.get(function(items) {
    // console.log(items);
    var host = window.location.hostname;
    var markItem = items[host];
    if (markItem) {
      var classes = markItem.class;
      var classArray = classes.split(" ");
      for (var i = 0; i < classArray.length; i++) {
        classArray[i] = "." + classArray[i];
      }
      var classSelector = "";
      for (var i = 0; i < classArray.length; i++) {
        classSelector += classArray[i];
      }
      $(classSelector).each(function(index, value) {
        var match = false;
        ($(value).attr("href") == markItem.href) && (match = true);
        ($(value).find("a").attr("href") == markItem.href) && (match = true);
        match && $(value).css("border", "thick solid #f00");
        match && $(value).css("box-sizing", "border-box");
      });
    }
  });
}
mark();

function autoMark()
{
  
}
autoMark();
