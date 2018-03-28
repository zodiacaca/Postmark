
/*
  listen from content
*/
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // console.log(sender.tab ? "from a content script: " + sender.tab.url : "from the extension");
  // console.log(sender.tab);
  if (request.task == "css") {
    // chrome.tabs.insertCSS(sender.tab.id, {file: request.file})
  } else if (request.task == "icon") {
    changeIcon(request.path);
  }
});

/*
  tab switch
*/
chrome.tabs.onActiveChanged.addListener(function (tabId, selectInfo) {
  chrome.tabs.sendMessage(
    tabId,
    { event: "onActivated" },  // messages
    callbackHandler
  );
});


function changeIcon(p) {
  chrome.browserAction.setIcon({path: p});
}
