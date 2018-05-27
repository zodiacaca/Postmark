

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.event == "onRClicked") {
    checkDOM();
  } else if (message.event == "onActivated") {
    checkMark();
  } else if (message.event == "onIconClicked") {
    jump();
  }
});


document.oncontextmenu = function (e) {
  if (e.target.tagName == "A") {
    linkItem.element = e.target;
  } else {
    var parents = $(e.target).parents();
    var count = parents.length - 2;
    for (var i = 0; i < count; i++) {
      if (parents.get(i).tagName == "A") {
        linkItem.element = parents.get(i);
        break
      }
    }
  }
  var title = $(linkItem.element).attr("title");
  if (title && title.length > 0) {
    linkItem.title = title;
  } else {
    linkItem.title = e.target.innerText;
  }
  if (attributeValid(linkItem.element, "href")) {
    linkItem.href = $(linkItem.element).attr("href");
    var question = linkItem.href.indexOf("?");
    linkItem.href = linkItem.href.substring(0, question);
  }
}

var checkStatus = {
  checked: false,
  matched: false
}
var matchedItem = [];
/*
  passive mark action
*/
function registerObserver() {
  // Select the node that will be observed for mutations
  var targetNode = $("body")[0];

  // Options for the observer (which mutations to observe)
  var config = { childList: true };

  // Callback function to execute when mutations are observed
  var callback = function (mutationsList) {
    for (var mutation of mutationsList) {
      if (mutation.type == "childList") {
        lookupElements();
      }
    }
  };

  // Create an observer instance linked to the callback function
  var observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
}
registerObserver();

function checkMark()
{
  // initialize icon
  chrome.runtime.sendMessage({task: "icon", path: "icons/i-2.svg"});
  
  if (!checkStatus.checked) {
    lookupElements();
  }
  
  markItems();
}
checkMark();

function lookupElements() {
  chrome.storage.local.get([window.location.hostname], function (item) {
    for (var site in item) {
      for (var sub in item[site]) {
        if (window.location.href.indexOf(sub) >= 0) {
          findAutoSelectSubfolder(sub, site);
          for (var entry in item[site][sub]) {
            if (!isNaN(entry)) {
              var level = item[site][sub][entry].level;
              findAutoSelectLevel(level, site);
              var title = item[site][sub][entry].title;
              var href = item[site][sub][entry].href;
              var tag = item[site][sub][entry].tag;
              var classes = item[site][sub][entry].class;
              var classSelector = getClassSelector(classes);
              if (href) {
                $(tag+classSelector).each(function (index, value) {
                  var match = false;
                  if (attributeValid(value, "href") && $(value).attr("href").indexOf(href) >= 0) {
                    match = true;
                    pushElements(value, undefined, href);
                  }
                  if (!match) {
                    $(value).find("a").each(function (i, v) {
                      if (attributeValid(v, "href") && $(v).attr("href").indexOf(href) >= 0) {
                        match = true;
                        pushElements(value, undefined, href);
                      }
                    });
                    (match) && (checkStatus.matched = true);
                  }
                });
              } else {
                $(tag+classSelector).each(function (index, value) {
                  var match = false;
                  if (value.innerText == title) {
                    match = true;
                    pushElements(value, title, undefined);
                  }
                  if (!match) {
                    $(value).find("*").each(function (i, v) {
                      if (v.innerText == title) {
                        match = true;
                        pushElements(value, title, undefined);
                      }
                    });
                  }
                  (match) && (checkStatus.matched = true);
                });
              }
            }
          }
        }
      }
      markItems();
      checkStatus.checked = true;
    }
  });
}

function pushElements(item, title, href) {
  matchedItem.pushIfUnique(item);
  if (title) {
    remembered.title.pushIfUnique(title);
  }
  if (href) {
    remembered.href.pushIfUnique(href);
  }
}

function markItems() {
  (checkStatus.matched) && (chrome.runtime.sendMessage({task: "icon", path: "icons/i-2-match.svg"}));
  matchedItem.forEach(function (element) {
    styleMark(element, "#48929B", "ff");
  });
}

function autoMark() {
  var host = window.location.hostname;
  var page = window.location.href;
  var home = false;
  if (page.lastIndexOf("/") + 1 == page.length) {
    home = isNaN(page.substr(page.lastIndexOf("/") - 1, 1))
  } else {
    home = isNaN(page.substr(page.length - 1, 1))
  }
  
  if (remembered.category.category && remembered.class && home) {
    var classSelector = getClassSelector(remembered.class);
    var autoItem = $(classSelector)[0];
    
    chrome.storage.local.get([host], function (item) {
      var subfoldersStr = remembered.category.category;
      (!item[host]) && (item[host] = {});
      (!item[host][subfoldersStr]) && (item[host][subfoldersStr] = {});
      (!item[host][subfoldersStr]["maxEntries"]) && (item[host][subfoldersStr]["maxEntries"] = 2);
      var oldest;
      var length = 0;
      for (var key in item[host][subfoldersStr]) {
        (!oldest) && (oldest = key);
        length += 1;
      }
      length -= 1;
      (isNaN(oldest)) && (oldest = 1);
      var outer = item[host][subfoldersStr][oldest].outer;
      if (length >= item[host][subfoldersStr]["maxEntries"]) {
        delete item[host][subfoldersStr][oldest];
      }
      var number = parseInt(oldest) + length;
      var href;
      var title;
      var indexHREF = -1;
      var indexTitle = -1;
      $(autoItem).find("a").each(function (i, v) {
        if (v.innerText) {
          href = $(v).attr("href");
          title = v.innerText;
          if (indexHREF == -1) {
            indexHREF = remembered.link.findIndex(function (element) {
              return element == $(v).attr("href");
            });
          }
          if (indexTitle == -1) {
            indexTitle = remembered.title.findIndex(function (element) {
              return element == v.innerText;
            });
          }
        }
      });
      if (indexHREF = -1 && indexTitle == -1) {
        item[host][subfoldersStr][number] = {
          class: remembered.class,
          href: href,
          nth: getNth(autoItem),
          title: title,
          outer: outer,
          page: page,
          date: getFullDate(),
          time: getTimeValue(),
          autoMarked: true
        }
        console.log(item);
        chrome.storage.local.set(item);
        styleMark(autoItem, { r:255, g:255, b:0, a:1 });
      }
    });
  }
}

function findAutoSelectLevel(level, host) {
  var url = window.location.href;
  if (url.indexOf(host) >= 0) {
    remembered.level = level;
  }
}

function findAutoSelectSubfolder(subfolder, host) {
  var url = window.location.href;
  if (url.indexOf(host) >= 0 && url.indexOf(subfolder) >= 0) {
    if (subfolder.length > remembered.category.depth) {
      remembered.category.category = subfolder;
      remembered.category.depth = subfolder.length;
    }
  }
}

// recheck size
document.getElementsByTagName("body")[0].onload = function() {
  $("body").find(".postmark-mark").each(function (index, value) {
    var parentSize = {
      w: value.parentElement.offsetWidth,
      h: value.parentElement.offsetHeight
    }
    $(value).css("width", parentSize.w + "px");
    $(value).css("height", parentSize.h + "px");
  });
}

