

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
  if (e.target) {
    if (e.target.tagName == "A") {
      linkData.item = e.target;
    } else {
      var parents = $(e.target).parents();
      var count = parents.length - 2;
      for (var i = 0; i < count; i++) {
        if (parents.get(i).tagName == "A") {
          linkData.item = parents.get(i);
          break
        }
      }
    }
    var title = $(linkData.item).attr("title");
    if (title && title.length > 0) {
      linkData.title = title;
    } else {
      linkData.title = e.target.innerText;
    }
    if (linkData.item && linkData.item.hasAttribute("href")) {
      linkData.href = $(linkData.item).attr("href");
      var question = linkData.href.indexOf("?");
      if (question > 0) {
        linkData.href = linkData.href.substring(0, question);
      }
    }
  }
}


// variables //
var checkStatus = {
  checked: false,
  matched: false
}
var remembered = {
  selector: undefined,
  level: undefined,
  category: { category: undefined, depth: 0 },
  title: [],
  href: []
}
var matchedItem = [];

/*
  passive mark action
*/
// nah, only seem to response to elements added with different structure, not length change, so I write my own one
/* function registerObserver() {
  // Select the node that will be observed for mutations
  var targetNode = $("body")[0];

  // Options for the observer (which mutations to observe)
  var config = { childList: true };

  // Callback function to execute when mutations are observed
  var callback = function (mutationsList) {
    for (var mutation of mutationsList) {
      if (mutation.type == "childList") {
        lookupElements(true);
      }
    }
  };

  // Create an observer instance linked to the callback function
  var observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
} */
var pageData = {
  containerCount: 0,
  href: ""
}
function registerObserver() {
  if ($(remembered.selector).length > pageData.containerCount) {
    console.log("container count: " + $(remembered.selector).length);
    lookupElements(true);
    pageData.containerCount = $(remembered.selector).length;
  }
  if (window.location.href != pageData.href) {
    console.log("current href: " + window.location.href);
    $(remembered.selector).each(function (index, value) {
      value.removeAttribute("_post");
    });
    pageData.containerCount = 0;
    matchedItem = [];
    pageData.href = window.location.href;
  }
  setTimeout(function () {
    registerObserver();
  }, 500);
}

function checkMark()
{
  // initialize icon
  chrome.runtime.sendMessage({task: "icon", path: "icons/i-2.svg"});
  
  if (!checkStatus.checked) {
    lookupElements();
    registerObserver();
    console.log("current href: " + window.location.href);
  }
  
  markItems();
}
checkMark();

function lookupElements(dynamic) {
  chrome.storage.local.get([window.location.hostname], function (item) {
    for (var site in item) {
      for (var sub in item[site]) {
        if (window.location.href.indexOf(sub) >= 0) {
          var checkedElements = [];
          findAutoSelectSubfolder(sub, site);
          for (var entry in item[site][sub]) {
            if (!isNaN(entry)) {
              var level = item[site][sub][entry].level;
              findAutoSelectLevel(level, site);
              var title = item[site][sub][entry].title;
              var href = item[site][sub][entry].href;
              var depth = item[site][sub][entry].depth;
              var generation = depth - level;
              var nth = item[site][sub][entry].nth;
              var tag = item[site][sub][entry].tag;
              var classes = item[site][sub][entry].class;
              var classSelector = getClassSelector(classes);
              remembered.selector = tag+classSelector;
              // set initial values for observer
              pageData.containerCount = $(tag+classSelector).length;
              pageData.href = window.location.href;
              if (href && href.length && window.location.href.indexOf(href) == -1) {
                $(tag+classSelector).each(function (index, value) {
                  if (dynamic || $(value).parents().length == generation) {
                    if (!(value.hasAttribute("_post"))) {
                      var match = false;
                      if (value.hasAttribute("href") && value.getAttribute("href").indexOf(href) >= 0) {
                        match = true;
                        pushElements(value, value, undefined, href);
                      }
                      if (!match) {
                        var num = 1;
                        $(value).find("a").each(function (i, v) {
                          if (v.hasAttribute("href") && v.getAttribute("href").indexOf(href) >= 0) {
                            if (dynamic) {
                              if (num == nth && v.getAttribute("title") == title) {
                                match = true;
                                pushElements(value, v, undefined, href);
                                return false;
                              }
                            } else {
                              match = true;
                              pushElements(value, v, undefined, href);
                              return false;
                            }
                          }
                          num++;
                        });
                      }
                      (match) && (checkStatus.matched = true);
                    }
                    // don't check the checked element again
                    // put it outside this block will cause execute sequence disorder
                    checkedElements.pushIfUnique(value);
                  }
                });
              } else {
                $(tag+classSelector).each(function (index, value) {
                  if (dynamic || $(value).parents().length == generation) {
                    var match = false;
                    if (value.innerText == title) {
                      match = true;
                      pushElements(value, value, title, undefined);
                    }
                    if (!match) {
                      $(value).find("a").each(function (i, v) {
                        if (v.innerText == title) {
                          match = true;
                          pushElements(value, v, title, undefined);
                          return false;
                        }
                      });
                    }
                    (match) && (checkStatus.matched = true);
                  }
                });
              }
            }
          }
          checkedElements.forEach(function (item) {
            item.setAttribute("_post", "checked"); 
          });
        }
      }
      markItems();
      checkStatus.checked = true;
    }
  });
}

function pushElements(container, anchor, title, href) {
  var data = {
    container: container,
    anchor: anchor
  }
  matchedItem.push(data);
  if (title) {
    remembered.title.pushIfUnique(title);
  }
  if (href) {
    remembered.href.pushIfUnique(href);
  }
}

function markItems() {
  (checkStatus.matched) && (chrome.runtime.sendMessage({task: "icon", path: "icons/i-2-match.svg"}));
  console.log("matched item: " + matchedItem.length);
  matchedItem.forEach(function (item) {
    styleMark(item.container, "#48929B", "ff", false, false);
    // container, color, alpha, for displaying area, newly added
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

