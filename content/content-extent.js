
function mark()
{
  // chrome.storage.local.clear();
  chrome.storage.local.get(function(items) {
    console.log(items);
    var host = window.location.hostname;
    var markItem = items[host];
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
    });
  });
}
mark();
