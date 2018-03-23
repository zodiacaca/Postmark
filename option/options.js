
// chrome.storage.local.clear();
chrome.storage.local.get(function(items) {
  // chrome.extension.getBackgroundPage().console.log(items);
  var markList = document.getElementById("markList");
  for (var key in items) {
    var entry = document.createElement("tr");
    var host = document.createElement("th");
    $(host).attr("scope", "row");
    // chrome.extension.getBackgroundPage().console.log($(host));
    var classes = document.createElement("td");
    var title = document.createElement("td");
    var post = document.createElement("td");
    var postLink = document.createElement("a");
    var page = document.createElement("td");
    var pageLink = document.createElement("a");
    var remove = document.createElement("td");
    markList.appendChild(entry);
    entry.appendChild(host);
    entry.appendChild(classes);
    entry.appendChild(title);
    entry.appendChild(post);
    post.appendChild(postLink);
    entry.appendChild(page);
    page.appendChild(pageLink);
    entry.appendChild(remove);
    host.appendChild(document.createTextNode(key));
    classes.appendChild(document.createTextNode(items[key].class));
    title.appendChild(document.createTextNode(items[key].title));
    $(postLink).attr("href", items[key].href);
    $(pageLink).attr("href", items[key].page);
    postLink.appendChild(document.createTextNode("post"));
    pageLink.appendChild(document.createTextNode("page"));
    
    $(remove).on("click", function() {
      var parent = $(this).parent();
      var str = $(parent).children()[0].innerText;
      chrome.storage.local.remove(str);
      $(parent).remove();
    });
  }
});
