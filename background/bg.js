

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