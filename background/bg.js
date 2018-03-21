

chrome.runtime.onInstalled.addListener(function () {
  var id = chrome.contextMenus.create({
    "title": "Inspect Containers",
    "contexts":["link"],
    "id": "postmark"
  });
});

// click on the item created by above
chrome.contextMenus.onClicked.addListener(onClickHandler);

function onClickHandler(info, tab) {
  console.log(info);
  
  // send info to content.js
  chrome.tabs.sendMessage(
    tab.id,
    { greeting: "" },  // messages
    callbackHandler
  );
};

function callbackHandler(content) {
  
}

// listen from content
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // console.log(sender.tab ? "from a content script: " + sender.tab.url : "from the extension");
  // console.log(sender.tab);
  if (request.task == "css") {
    // chrome.tabs.insertCSS(sender.tab.id, {file: ""})
  }
});
