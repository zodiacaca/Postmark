
/*
  right click
*/
chrome.runtime.onInstalled.addListener(function () {
  var id = chrome.contextMenus.create({
    "title": "Inspect Containers",
    "contexts":["link"],
    "id": "postmark"
  });
});

chrome.contextMenus.onClicked.addListener(onClickHandler);

function onClickHandler(info, tab) {
  console.log(info);
  
  // send info to content.js
  chrome.tabs.sendMessage(
    tab.id,
    { event: "onRClicked" },  // messages
    callbackHandler
  );
};

function callbackHandler(content) {
  
}


/*
  icon click
*/
chrome.browserAction.onClicked.addListener(function (tab) {
  alert("icon clicked")
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


/*
  listen from content
*/
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // console.log(sender.tab ? "from a content script: " + sender.tab.url : "from the extension");
  // console.log(sender.tab);
  if (request.task == "css") {
    // chrome.tabs.insertCSS(sender.tab.id, {file: request.file})
  } else if (request.task == "icon") {
    chrome.browserAction.setIcon({path: request.path});
  }
});
