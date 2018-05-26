
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
      
      var count = 0;
      for (var entry in items[site][sub]) {
        
        if (!isNaN(entry)) {
          emptySite = false;
          emptySubfolder = false;
          var row = document.createElement("tr");
          row.id = site + "(" + entry + ")";
          var host = document.createElement("th");
          $(host).attr("scope", "row");
          var subfolder = document.createElement("td");
          var container = document.createElement("td");
          var slot = document.createElement("td");
          count++;
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
          row.appendChild(container);
          row.appendChild(slot);
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
          container.appendChild(document.createTextNode(getElementString(items[site][sub][entry].tag, items[site][sub][entry].class)));
          slot.appendChild(document.createTextNode(count + "/" + items[site][sub].maxEntries));
          title.appendChild(document.createTextNode(items[site][sub][entry].title));
          postLink.appendChild(document.createTextNode("post"));
          $(postLink).attr("href", items[site][sub][entry].href);
          pageLink.appendChild(document.createTextNode("page"));
          $(pageLink).attr("href", items[site][sub][entry].page);
          date.appendChild(document.createTextNode(items[site][sub][entry].date));
          $(removeIcon).attr("src", "/icons/cross-remove-sign.svg");
          $(removeIcon).attr("alt", "remove");
          
          $(removeIcon).on("click", function () {
            var parent = $(this).parent().parent();
            var host = $(parent).children()[0].innerText;
            var subfolder = $(parent).children()[1].innerText;
            var id = parent[0].id.substring(host.length + 1, parent[0].id.length - 1);
            removeEntry(host, subfolder, id);
            $(parent).css("opacity", 0)
            setTimeout(function () {
              $(parent).remove();
            }, 500);
          });
        }
      }
      (emptySubfolder) && (removeEntry(site, sub));
    }
    (emptySite) && (removeEntry(site));
  }
  listComplete = true;
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
  } else {
    findMarks(url);
  }
}
selectSection();

function fillSeekForm(url) {
  url += "page/*num*/";
  $("#slider-seek-textfield-url").val(url);
}

function findMarks(url) {
  var host = getHostname(url);
  var headers = document.getElementsByTagName("th");
  var data =[];
  $(headers).each(function (index, value) {
    if (value.innerText.indexOf(host) >= 0) {
      $(value).parent().css("background-color", "#b4b7ff");
      data.push(value);
    }
  });
  if (data.length) {
    var pos = $(data[0]).offset().top - $("#slider-marks").offset().top;
    document.getElementById("slider-marks").scroll({
      top: pos,
      left: 0,
      behavior: "smooth"
    });
  }
  
  if (headers.length <= 9) {
    setTimeout(function () {
      findMarks(url);
    }, 100);
  }
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

function getHostname(url) {
  var st = url.indexOf("//");
  st += 2;
  var ed = url.indexOf("/", st);
  
  return url.substr(st, ed - st);
}

