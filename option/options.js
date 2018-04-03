
// chrome.storage.local.clear();
chrome.storage.local.get(function (items) {
  chrome.extension.getBackgroundPage().console.log(items);
  var markList = document.getElementById("markList");
  for (var site in items) {
    for (var sub in items[site]) {
      var entry = document.createElement("tr");
      var host = document.createElement("th");
      $(host).attr("scope", "row");
      var subfolders = document.createElement("td");
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
      entry.appendChild(subfolders);
      entry.appendChild(classes);
      entry.appendChild(title);
      entry.appendChild(post);
      post.appendChild(postLink);
      entry.appendChild(page);
      page.appendChild(pageLink);
      entry.appendChild(date);
      entry.appendChild(remove);
      remove.appendChild(removeIcon);
      host.appendChild(document.createTextNode(site));
      subfolders.appendChild(document.createTextNode(sub));
      classes.appendChild(document.createTextNode(items[site][sub].class));
      title.appendChild(document.createTextNode(items[site][sub].title));
      $(postLink).attr("href", items[site][sub].href);
      $(pageLink).attr("href", items[site][sub].page);
      postLink.appendChild(document.createTextNode("post"));
      pageLink.appendChild(document.createTextNode("page"));
      date.appendChild(document.createTextNode(items[site][sub].date));
      $(removeIcon).attr("src", "/icons/cross-remove-sign.svg");
      $(removeIcon).attr("alt", "remove");
      
      $(removeIcon).on("click", function () {
        var parent = $(this).parent().parent();
        var str = $(parent).children()[0].innerText;
        chrome.storage.local.remove(str);
        $(parent).remove();
      });
    }
  }
});
