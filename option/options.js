
// chrome.storage.local.clear();
chrome.storage.local.get(function(items) {
  chrome.extension.getBackgroundPage().console.log(items);
  var markList = document.getElementById("markList");
  for (var key in items) {
    var entry = document.createElement("li");
    var classSpan = document.createElement("span");
    classSpan.className = "classSpan";
    var classP = document.createElement("p");
    var linkSpan = document.createElement("span");
    linkSpan.className = "linkSpan";
    var linkP = document.createElement("p");
    markList.appendChild(entry);
    entry.appendChild(classSpan);
    classSpan.appendChild(classP);
    entry.appendChild(linkSpan);
    linkSpan.appendChild(linkP);
    classP.appendChild(document.createTextNode(items[key].class));
    linkP.appendChild(document.createTextNode(items[key].href));
  }
  
});
