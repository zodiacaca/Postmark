
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
    var win = window.open(url, "_blank");
  }
}

function callbackHandler(content) {
  
}


/*
  icon click
*/
chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.sendMessage(
    tab.id,
    { event: "onIconClicked" }
  );
});
