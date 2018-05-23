
/*
  right click
*/
chrome.contextMenus.onClicked.addListener(onClickHandler);

function onClickHandler(info, tab) {
  console.log(info);
  
  if (info.menuItemId == "postmark_link") {
    chrome.tabs.sendMessage(
      tab.id,
      { event: "onRClicked" },  // messages
      callbackHandler
    );
  } else if (info.menuItemId == "postmark_page") {
    var url = chrome.runtime.getURL("/option/options.html");
    url += "?section=3";
    url += "&url=" + tab.url;
    window.open(url, "_blank");
  }
}

function callbackHandler(content) {
  
}


/*
  icon click
*/
var lastClicked;
chrome.browserAction.onClicked.addListener(function (tab) {
  
  var d = new Date();
  
  if (d.getTime() - lastClicked > 200) {
    chrome.tabs.sendMessage(
      tab.id,
      { event: "onIconClicked" }
    );
  } else {
    var url = chrome.runtime.getURL("/option/options.html");
    url += "?section=2";
    url += "&url=" + tab.url;
    window.open(url, "_blank");
  }
  lastClicked = d.getTime();
});
