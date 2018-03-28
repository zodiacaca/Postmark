
// chrome.storage.local.clear();
chrome.storage.local.get(function (items) {
  // chrome.extension.getBackgroundPage().console.log(items);
  var markList = document.getElementById("markList");
  for (var key in items) {
    var entry = document.createElement("tr");
    var host = document.createElement("th");
    $(host).attr("scope", "row");
    var classes = document.createElement("td");
    var title = document.createElement("td");
    var post = document.createElement("td");
    var postLink = document.createElement("a");
    var page = document.createElement("td");
    var pageLink = document.createElement("a");
    var date = document.createElement("td");
    var remove = document.createElement("td");
    var removeIcon = document.createElement("img");
    markList.appendChild(entry);
    entry.appendChild(host);
    entry.appendChild(classes);
    entry.appendChild(title);
    entry.appendChild(post);
    post.appendChild(postLink);
    entry.appendChild(page);
    page.appendChild(pageLink);
    entry.appendChild(date);
    entry.appendChild(remove);
    remove.appendChild(removeIcon);
    host.appendChild(document.createTextNode(key));
    classes.appendChild(document.createTextNode(items[key].class));
    title.appendChild(document.createTextNode(items[key].title));
    $(postLink).attr("href", items[key].href);
    $(pageLink).attr("href", items[key].page);
    postLink.appendChild(document.createTextNode("post"));
    pageLink.appendChild(document.createTextNode("page"));
    date.appendChild(document.createTextNode(items[key].date));
    $(removeIcon).attr("src", "/icons/cross-remove-sign.svg");
    $(removeIcon).attr("alt", "remove");
    
    $(removeIcon).on("click", function () {
      var parent = $(this).parent().parent();
      var str = $(parent).children()[0].innerText;
      chrome.storage.local.remove(str);
      $(parent).remove();
    });
  }
});
