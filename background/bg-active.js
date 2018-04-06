
/*
  right click
*/
chrome.contextMenus.onClicked.addListener(onClickHandler);

function onClickHandler(info, tab) {
  console.log(info);
  
  // send info to content.js
  chrome.tabs.sendMessage(
    tab.id,
    { event: "onRClicked" },  // messages
    callbackHandler
  );
}

function callbackHandler(content) {
  
}


/*
  icon click
*/
chrome.browserAction.onClicked.addListener(function (tab) {
  alert("icon clicked")
});
