
/*
  list
*/
// chrome.storage.local.clear();
chrome.storage.local.get(function (items) {
  console.log(items);
  var markList = document.getElementById("markList");
  for (var site in items) {
    var emptySite = true;
    
    for (var sub in items[site]) {
      var emptySubfolder = true;
      
      for (var entry in items[site][sub]) {
        
        if (!isNaN(entry)) {
          emptySite = false;
          emptySubfolder = false;
          var row = document.createElement("tr");
          row.id = site + "(" + entry + ")";
          var host = document.createElement("th");
          $(host).attr("scope", "row");
          var subfolder = document.createElement("td");
          var classes = document.createElement("td");
          var length = document.createElement("td");
          var title = document.createElement("td");
          var post = document.createElement("td");
          var postLink = document.createElement("a");
          var page = document.createElement("td");
          var pageLink = document.createElement("a");
          var seek = document.createElement("td");
          var date = document.createElement("td");
          var remove = document.createElement("td");
          var removeIcon = document.createElement("img");
          markList.appendChild(row);
          row.appendChild(host);
          row.appendChild(subfolder);
          row.appendChild(classes);
          row.appendChild(length);
          row.appendChild(title);
          row.appendChild(post);
          post.appendChild(postLink);
          row.appendChild(page);
          page.appendChild(pageLink);
          row.appendChild(seek);
          row.appendChild(date);
          row.appendChild(remove);
          remove.appendChild(removeIcon);
          host.appendChild(document.createTextNode(site));
          subfolder.appendChild(document.createTextNode(sub));
          classes.appendChild(document.createTextNode(items[site][sub][entry].class));
          length.appendChild(document.createTextNode(items[site][sub].maxEntries));
          title.appendChild(document.createTextNode(items[site][sub][entry].title));
          postLink.appendChild(document.createTextNode("post"));
          $(postLink).attr("href", items[site][sub][entry].href);
          pageLink.appendChild(document.createTextNode("page"));
          $(pageLink).attr("href", items[site][sub][entry].page);
          seek.appendChild(document.createTextNode("Seek"));
          date.appendChild(document.createTextNode(items[site][sub][entry].date));
          $(removeIcon).attr("src", "/icons/cross-remove-sign.svg");
          $(removeIcon).attr("alt", "remove");
          
          $(removeIcon).on("click", function () {
            var parent = $(this).parent().parent();
            var host = $(parent).children()[0].innerText;
            var subfolder = $(parent).children()[1].innerText;
            var id = parent[0].id.substring(host.length + 1, parent[0].id.length - 1);
            removeEntry(host, subfolder, id);
            $(parent).remove();
          });
        }
      }
      (emptySubfolder) && (removeEntry(site, sub));
    }
    (emptySite) && (removeEntry(site));
  }
});

function removeEntry(host, subfolder, id) {
  chrome.storage.local.get([host], function (item) {
    if (host && subfolder && id) {
      delete item[host][subfolder][id];
      chrome.storage.local.set(item);
      console.log("Delete entry for " + host + subfolder);
    } else if (host && subfolder) {
      delete item[host][subfolder];
      chrome.storage.local.set(item);
      console.log("Delete empty category for " + host);
    } else {
      chrome.storage.local.remove(host);
      console.log("Delete empty host " + host);
    }
  });
}


/*
  ui control
*/
function selectSection() {
  var innerWidth = document.body.clientWidth;
  var page = window.location.href;
  var section = page.indexOf("section=");
  section = page.substr(section + 8, 1);
  var url = page.indexOf("url=");
  url = page.substr(url + 4);
  if (section == "3") {
    $("#slider").css("transform", "translateX(" + "-200%" + ")");
    $("#slider").css("transition", "all 600ms cubic-bezier(0.77, 0, 0.18, 1)");
    $(".nav-btn").css("border-bottom", "thick solid rgba(0, 0, 0, 0)");
    $("#nav-seek").css("border-bottom", "thick solid rgba(0, 0, 0, 0.5)");
    fillSeekForm(url);
  } else if (section == "1") {
    $("#slider").css("transform", "translateX(0)");
    $("#slider").css("transition", "all 600ms cubic-bezier(0.77, 0, 0.18, 1)");
    $(".nav-btn").css("border-bottom", "thick solid rgba(0, 0, 0, 0)");
    $("#nav-auto").css("border-bottom", "thick solid rgba(0, 0, 0, 0.5)");
  }
}
selectSection();

function fillSeekForm(url) {
  url += "page/*num*/";
  $("input[name='urlPattern']").val(url);
}

$("#nav-auto").on("click", function (e) {
  $("#slider").css("transform", "translateX(0)");
  $("#slider").css("transition", "all 600ms cubic-bezier(0.77, 0, 0.18, 1)");
  $(".nav-btn").css("border-bottom", "thick solid rgba(0, 0, 0, 0)");
  $(this).css("border-bottom", "thick solid rgba(0, 0, 0, 0.5)");
});
$("#nav-marks").on("click", function (e) {
  $("#slider").css("transform", "translateX(" + "-100%" + ")");
  $("#slider").css("transition", "all 600ms cubic-bezier(0.77, 0, 0.18, 1)");
  $(".nav-btn").css("border-bottom", "thick solid rgba(0, 0, 0, 0)");
  $(this).css("border-bottom", "thick solid rgba(0, 0, 0, 0.5)");
});
$("#nav-seek").on("click", function (e) {
  $("#slider").css("transform", "translateX(" + "-200%" + ")");
  $("#slider").css("transition", "all 600ms cubic-bezier(0.77, 0, 0.18, 1)");
  $(".nav-btn").css("border-bottom", "thick solid rgba(0, 0, 0, 0)");
  $(this).css("border-bottom", "thick solid rgba(0, 0, 0, 0.5)");
});

function adjustSectionSize() {
  var innerWidth = document.body.clientWidth;
  $("nav").css("width", innerWidth + "px");
  $(".crop").css("width", innerWidth + "px");
  $("#slider").children().css("width", innerWidth + "px");
  $("#slider-marks").css("left", innerWidth + "px");
  $("#slider-seek").css("left", innerWidth * 2 + "px");
  
  var innerHeight = window.innerHeight;
  $("body").css("height", innerHeight + "px");
  var navHeight = $("nav").height();
  var height = innerHeight - navHeight;
  $("#slider").children().css("height", height + "px");
}
adjustSectionSize();


/*
  seek
*/
$("#slider-seek-slider").slider({
  range: true,
  min: 0,
  max: 100,
  values: [2, 10],
  slide: function(event, ui) {
    $("#slider-seek-range-from").text(ui.values[0]);
    $("#slider-seek-range-to").text(ui.values[1]);
  }
});
$("#slider-seek-btn-seek").on("click", function (e) {
  seekMark();
});

function seekMark() {
  var start = parseInt($("#slider-seek-range-from").text());
  var end = parseInt($("#slider-seek-range-to").text());
  for (var i = start; i <= end; i++) {
    seek(i);
  }
}

function seek(num) {
  var page = $("input[name='urlPattern']").val();
  page = page.replace("*num*", num)
  var st = page.indexOf("//");
  st += 2;
  var ed = page.indexOf("/", st);
  var host = page.substr(st, ed - st);
  
  $.ajax({
    url: page,
    dataType: "html",
    success: phaseHTML
  });
  
  function phaseHTML(html)
  {
    var parser = new DOMParser();
    var htmlDoc = parser.parseFromString(html, "text/html");
    findMark(htmlDoc);
  }
  
  function findMark(html)
  {
    chrome.storage.local.get([host], function (item) {
      if (item) {
        var matched = false;
        for (var site in item) {
          for (var sub in item[site]) {
            for (var entry in item[site][sub]) {
              if (!isNaN(entry)) {
                var title = item[site][sub][entry].title;
                var classes = item[site][sub][entry].class;
                var outer = item[site][sub][entry].outer;
                var tag;
                (outer) ? (tag = outer) : (tag = "a");
                var containers = html.getElementsByClassName(classes);
                if (title && title != "") {
                  for (var i = 0; i < containers.length; i++) {
                    var match = false;
                    if (containers[i].innerText == title) {
                      match = true;
                    }
                    $(containers[i]).find(tag).each(function (i, v) {
                      if (v.innerText == title) {
                        match = true;
                      }
                    });
                    (match) && (matched = true);
                  }
                } else {
                  for (var i = 0; i < containers.length; i++) {
                    var match = false;
                    if ($(containers[i]).attr("href") == item[site][sub][entry].href) {
                      match = true;
                    }
                    $(containers[i]).find(tag).each(function (i, v) {
                      if ($(v).attr("href") == item[site][sub][entry].href) {
                        match = true;
                      }
                    });
                    (match) && (matched = true);
                  }
                }
              }
            }
          }
        }
        console.log("page:" + num + " " + matched);
        if (matched) {
          var foundPages = document.getElementById("slider-seek-pages");
          var pageBox = document.createElement("a");
          foundPages.appendChild(pageBox);
          pageBox.appendChild(document.createTextNode(num));
          $(pageBox).attr("href", page);
        }
      }
    });
  }
}

