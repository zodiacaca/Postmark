
// chrome.storage.local.clear();
chrome.storage.local.get(function (items) {
  console.log(items);
  var markList = document.getElementById("markList");
  for (var site in items) {
    for (var sub in items[site]) {
      for (var entry in items[site][sub]) {
        if (!isNaN(entry)) {
          var row = document.createElement("tr");
          var host = document.createElement("th");
          $(host).attr("scope", "row");
          var subfolder = document.createElement("td");
          var classes = document.createElement("td");
          var title = document.createElement("td");
          var post = document.createElement("td");
          var postLink = document.createElement("a");
          var page = document.createElement("td");
          var pageLink = document.createElement("a");
          var date = document.createElement("td");
          var remove = document.createElement("td");
          var removeIcon = document.createElement("img");
          markList.appendChild(row);
          row.appendChild(host);
          row.appendChild(subfolder);
          row.appendChild(classes);
          row.appendChild(title);
          row.appendChild(post);
          post.appendChild(postLink);
          row.appendChild(page);
          page.appendChild(pageLink);
          row.appendChild(date);
          row.appendChild(remove);
          remove.appendChild(removeIcon);
          host.appendChild(document.createTextNode(site));
          subfolder.appendChild(document.createTextNode(sub));
          classes.appendChild(document.createTextNode(items[site][sub][entry].class));
          title.appendChild(document.createTextNode(items[site][sub][entry].title));
          $(postLink).attr("href", items[site][sub][entry].href);
          $(pageLink).attr("href", items[site][sub][entry].page);
          postLink.appendChild(document.createTextNode("post"));
          pageLink.appendChild(document.createTextNode("page"));
          date.appendChild(document.createTextNode(items[site][sub][entry].date));
          $(removeIcon).attr("src", "/icons/cross-remove-sign.svg");
          $(removeIcon).attr("alt", "remove");
          
          $(removeIcon).on("click", function () {
            var parent = $(this).parent().parent();
            var str = $(parent).children()[0].innerText;
            
            $(parent).remove();
          });
        }
      }
    }
  }
});
