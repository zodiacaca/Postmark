
/*
  seek
*/
$("#slider-seek-slider").slider({
  range: true,
  min: 0,
  max: 99,
  values: [2, 5],
  slide: function (event, ui) {
    $("#slider-seek-range-from").text(ui.values[0]);
    $("#slider-seek-range-to").text(ui.values[1]);
  }
});
$("#slider-seek-btn-seek").on("click", function (e) {
  if (!$(this).hasClass("slider-seek-btn-seek--clicked")) {
    seekMark();
    $(this).toggleClass("slider-seek-btn-seek--clicked");
    this.innerText = "Seeking...";
    $("#slider-seek-result-cancel .shape").toggleClass("shape--open");
  }
});

function seekMark() {
  var start = parseInt($("#slider-seek-range-from").text());
  var end = parseInt($("#slider-seek-range-to").text());

  $("#slider-seek-cells").children().remove();
  $("#slider-seek-pages").children().remove();

  var cells = document.getElementById("slider-seek-cells");

  progressBar(end - start + 1);
  for (var i = start; i <= end; i++) {
    seek(i, cells.children[i - start]);
  }
}

function seek(num, cell) {
  var page = $("#slider-seek-url").find("input").val();
  page = page.replace("*num*", num)
  var host = getHostname(page);

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
                var href = item[site][sub][entry].href;
                var depth = item[site][sub][entry].depth;
                var level = item[site][sub][entry].level;
                var generation = depth - level;
                var tag = item[site][sub][entry].tag;
                var classes = item[site][sub][entry].class;
                var classSelector = getClassSelector(classes);
                if (href) {
                  $(html).find(tag+classSelector).each(function (index, value) {
                    if ($(value).parents().length == generation) {
                      var match = false;
                      if (value.hasAttribute("href") && $(value).attr("href").indexOf(href) >= 0) {
                        match = true;
                      }
                      if (!match) {
                        $(value).find("a").each(function (i, v) {
                          if (v.hasAttribute("href") && $(v).attr("href").indexOf(href) >= 0) {
                            match = true;
                            return false;
                          }
                        });
                      }
                      if (match) {
                        matched = true
                        return false;
                      }
                    }
                  });
                }
              }
            }
          }
        }
        $(cell).css("background-color", "#48929B");
        console.log("page:" + num + " " + matched);
        if (matched) {
          var foundPages = document.getElementById("slider-seek-pages");
          var pageBox = document.createElement("a");
          foundPages.appendChild(pageBox);
          pageBox.appendChild(document.createTextNode(num));
          $(pageBox).attr("href", page);
          $(pageBox).on("click", function (e) {
            return false;
          });
          $(pageBox).mousedown(function (e) {
            switch(e.which)
            {
              case 1:
                var batchChecked = $("#slider-seek-chk-batch").is(":checked");
                var windowChecked = $("#slider-seek-chk-window").is(":checked");
                if (batchChecked) {
                  var pages = [];
                  var start = parseInt($("#slider-seek-range-from").text());
                  for (var i = start; i <= num; i++) {
                    var page = $("#slider-seek-url").find("input").val();
                    page = page.replace("*num*", i)
                    if (windowChecked) {
                      pages.push(page);
                    } else {
                      window.open(page, "_blank");
                    }
                  }
                  if (windowChecked) {
                    var url = window.location.href.indexOf("url=");
                    url = window.location.href.substr(url + 4);
                    pages.unshift(url);
                    chrome.windows.create({
                      url: pages,
                      state: "maximized"
                    });
                  }
                } else {
                  window.open($(this).attr("href"), "_self");
                }
                break;
              case 2:
                break;
              case 3:
                break;
            }
            return true;
          });
        }
      }
    });
  }
}

function progressBar(count) {
  var cells = document.getElementById("slider-seek-cells");
  for (var i = 0; i < count; i++) {
    var cell = document.createElement("span");
    cells.appendChild(cell);
  }
}
