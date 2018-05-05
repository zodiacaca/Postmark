
/*
  on installed
*/
chrome.runtime.onInstalled.addListener(function () {
  var id_link = chrome.contextMenus.create({
    "title": "Inspect containers",
    "contexts":["link"],
    "id": "postmark_link"
  });
  
  var id_page = chrome.contextMenus.create({
    "title": "Seek through pages",
    "contexts":["page"],
    "id": "postmark_page"
  });
  
  // change icon to svg format
  chrome.browserAction.setIcon({path: "icons/postmark.svg"});
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
    changeIcon(sender.tab.id, request.path);
  }
});

/*
  tab switch
*/
chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.browserAction.setIcon({path: "icons/postmark.svg"});
  chrome.tabs.sendMessage(
    activeInfo.tabId,
    { event: "onActivated" },  // messages
    callbackHandler
  );
});


function changeIcon(id, p) {
  chrome.tabs.query(
    { currentWindow: true, active: true },
    function (tabArray) {
      (tabArray[0].id == id) && (chrome.browserAction.setIcon({path: p}));
    }
  );
}
