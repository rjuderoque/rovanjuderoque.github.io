/* Portfolio scripts: theme, profile photo, activity cards, Activity 1 (DOM events), Activity 2 (Promises), Activity 3 (jQuery) */

/* =========================================================
   ADD YOUR NEW ACTIVITIES HERE
   Each object becomes a card in the Activities section.
   - title / description : required
   - date   : optional text, e.g. "October 2026"
   - image  : optional path or URL, e.g. "images/activity4.png" (falls back to emoji)
   - emoji  : optional, shown when there is no image
   - tags   : optional list of short labels
   - link   : optional URL for the "View activity" button
   - accent : optional card color: coral | sun | mint | sky | rose | grape
   ========================================================= */
const MY_ACTIVITIES = [
  // {
  //   title: "Activity 04",
  //   date: "October 2026",
  //   description: "What this activity is about and what I learned.",
  //   image: "images/activity4.png",
  //   emoji: "🧩",
  //   tags: ["HTML", "CSS", "JavaScript"],
  //   link: "activities/activity4/index.html",
  //   accent: "sky"
  // }
];

$(function () {
  // ---------- Theme ----------
  const root = document.documentElement;
  let saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = saved || (prefersDark ? "dark" : "light");
  $("#theme").on("click", function () {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
  $("#year").text(new Date().getFullYear());

  // ---------- Profile photo upload ----------
  const PHOTO_KEY = "profilePhoto";
  const PHOTO_W = 640, PHOTO_H = 800;          // 4:5 portrait, matches the frame
  const $img = $("#photoImg"), $initials = $("#photoInitials");
  const $note = $("#photoNote"), $remove = $("#photoRemove"), $avatar = $("#avatar");

  function applyPhoto(src) {
    if (src) {
      $img.attr("src", src).prop("hidden", false);
      $initials.prop("hidden", true);
      $remove.prop("hidden", false);
      $avatar.addClass("has-photo").css("background-image", "url(" + src + ")");
    } else {
      $img.removeAttr("src").prop("hidden", true);
      $initials.prop("hidden", false);
      $remove.prop("hidden", true);
      $avatar.removeClass("has-photo").css("background-image", "");
    }
  }

  // Center-crop to 4:5 and shrink so it is light enough to store.
  function cropToDataUrl(img) {
    const canvas = document.createElement("canvas");
    canvas.width = PHOTO_W; canvas.height = PHOTO_H;
    const target = PHOTO_W / PHOTO_H, ratio = img.width / img.height;
    let sw = img.width, sh = img.height, sx = 0, sy = 0;
    if (ratio > target) { sw = img.height * target; sx = (img.width - sw) / 2; }
    else { sh = img.width / target; sy = (img.height - sh) / 2; }
    canvas.getContext("2d").drawImage(img, sx, sy, sw, sh, 0, 0, PHOTO_W, PHOTO_H);
    return canvas.toDataURL("image/jpeg", 0.85);
  }

  try { applyPhoto(localStorage.getItem(PHOTO_KEY)); } catch (e) { applyPhoto(null); }

  $("#photoBtn").on("click", function () { $("#photoInput").trigger("click"); });

  $("#photoInput").on("change", function () {
    const file = this.files && this.files[0];
    this.value = "";                            // allows picking the same file again
    if (!file) return;
    if (!file.type.startsWith("image/")) { $note.text("Please choose an image file."); return; }
    const reader = new FileReader();
    reader.onerror = function () { $note.text("Couldn't read that file. Try another image."); };
    reader.onload = function () {
      const img = new Image();
      img.onerror = function () { $note.text("That image couldn't be opened. Try a JPG or PNG."); };
      img.onload = function () {
        const dataUrl = cropToDataUrl(img);
        applyPhoto(dataUrl);                    // shows immediately
        try {
          localStorage.setItem(PHOTO_KEY, dataUrl);
          $note.text("Photo updated and saved on this browser.");
        } catch (e) {
          $note.text("Photo updated, but it couldn't be saved (storage is full or blocked).");
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

  $remove.on("click", function () {
    try { localStorage.removeItem(PHOTO_KEY); } catch (e) {}
    applyPhoto(null);
    $note.text("Photo removed.");
  });

  // ---------- Activity cards: open / close demos ----------
  function closeDemos() {
    $(".demo").prop("hidden", true);
    $(".open-demo").attr("aria-expanded", "false").text("Open demo");
  }
  $(".open-demo").on("click", function () {
    const $btn = $(this), id = $btn.data("demo");
    const wasOpen = $btn.attr("aria-expanded") === "true";
    closeDemos();
    if (wasOpen) return;
    $btn.attr("aria-expanded", "true").text("Close demo");
    const $panel = $("#" + id).prop("hidden", false);
    $panel[0].scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
  $(".close-demo").on("click", function () {
    const id = $(this).closest(".demo").attr("id");
    closeDemos();
    $('[data-demo="' + id + '"]').trigger("focus");
  });

  // ---------- Activity cards: your added activities ----------
  const $grid = $("#activityGrid");
  MY_ACTIVITIES.forEach(function (a) {
    const $thumb = $('<div class="thumb" aria-hidden="true"></div>');
    if (a.image) $thumb.append($("<img>", { src: a.image, alt: "", loading: "lazy" }));
    else $thumb.text(a.emoji || "📌");
    const $card = $('<article class="card"></article>').addClass("c-" + (a.accent || "sky")).append($thumb);
    if (a.date) $card.append($('<p class="meta"></p>').text(a.date));
    $card.append($("<h3></h3>").text(a.title || "Untitled activity"));
    if (a.description) $card.append($("<p></p>").text(a.description));
    if (a.tags && a.tags.length) {
      const $chips = $('<p class="chips"></p>');
      a.tags.forEach(function (t) { $chips.append($("<span></span>").text(t)); });
      $card.append($chips);
    }
    if (a.link) $card.append($("<a class='btn' target='_blank' rel='noopener'>View activity</a>").attr("href", a.link));
    $grid.append($card);
  });
  if (!MY_ACTIVITIES.length) {
    $grid.append(
      '<article class="card placeholder c-sky"><div class="thumb" aria-hidden="true">✨</div>' +
      '<h3>Next activity</h3><p class="muted">New activities will show up here.</p></article>'
    );
  }

  // ---------- Activity 1: DOM events ----------
  const $evName = $("#evName"), $evImg = $("#evImg"), $evInput = $("#evInput"), $evStatus = $("#evStatus");
  $("#evClick").on("click", function () {
    $evName.text("Bituin");
    $evStatus.text("Click is Active");
  });
  $("#evDbl").on("dblclick", function () {
    $evName.css("color", "#12a672");
    $evStatus.text("Double Click is Active");
  });
  $evImg.on("mouseover", function () {
    $evImg.css("transform", "scale(1.1)");
    $evStatus.text("The Mouse is Over the Image");
  }).on("mouseleave", function () {
    $evImg.css("transform", "scale(1)");
    $evStatus.text("Mouse Leave the Image");
  });
  $evInput.on("focus", function () {
    $evInput.css("background-color", "yellow");
    $evStatus.text("Input is Active");
  }).on("blur", function () {
    $evInput.css("background-color", "white");
    $evStatus.text("Waiting for Interaction...");
  }).on("input", function () {
    $evStatus.text("Typing....");
  }).on("change", function () {
    if ($evInput.val().trim()) $evName.text($evInput.val());
  });

  // ---------- Activity 2: Promise.all dashboard ----------
  const tasks = [
    { el: $("#profile"),  name: "Profile",  delay: 1000 },
    { el: $("#grades"),   name: "Grades",   delay: 2000 },
    { el: $("#schedule"), name: "Schedule", delay: 3000 }
  ];
  const $msg = $("#message");

  function setState(task, state, label) {
    task.el.removeClass("loading done").addClass(state).find(".pill").text(label);
  }
  function loadTask(task) {
    return new Promise(function (resolve) {
      task.el.css("--t", task.delay + "ms");
      setState(task, "loading", "Loading...");
      setTimeout(function () {
        setState(task, "done", "Loaded");
        resolve(task.name);
      }, task.delay);
    });
  }

  $("#loadbtn").on("click", function () {
    const $btn = $(this).prop("disabled", true);
    $msg.text("Loading Dashboard...");
    tasks.forEach(function (t) {
      t.el.removeClass("loading done").find(".pill").text("Waiting");
    });
    // Let the reset paint, then start so the progress bars animate from 0.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        Promise.all(tasks.map(loadTask)).then(function () {
          $msg.text("Dashboard Ready!");
          $btn.prop("disabled", false).text("Reload Dashboard");
        });
      });
    });
  });

  // ---------- Activity 3: jQuery profile + table ----------
  const $log = $("#log");
  const say = function (text) { $log.text(text); };

  $("#btn1").on("click", function () {
    $("#h1").text("Good Morning..");
    say("You clicked Change Title");
  }).on("dblclick", function () {
    $("#h1").text("You Double Clicked the Title");
    say("You double clicked Change Title");
  });

  $("#btn2").on("click", function () {
    $(".information").slideUp("slow");
    say("You clicked Hide Profile");
  });
  $("#btn3").on("click", function () {
    $(".information").slideDown(500);
    say("You clicked Show Profile");
  });

  $("#select").on("change", function () {
    $("#course").text($(this).val());
    say("You chose: " + $(this).val());
  });

  const $rows = $("#students tbody tr");
  function stripe(first, second, label) {
    $rows.removeClass("hl-a hl-b");
    // jQuery :odd/:even are zero-indexed, so index 0 counts as "even".
    $rows.filter(":" + first).addClass("hl-a");
    $rows.filter(":" + second).addClass("hl-b");
    say(label);
  }
  $("#odd").on("click",  function () { stripe("odd", "even", "You clicked the Odd button"); });
  $("#even").on("click", function () { stripe("even", "odd", "You clicked the Even button"); });

  $("#hide").on("click", function () {
    $(".table-wrap").slideUp("slow");
    say("You clicked Hide Table");
  });
  $("#show").on("click", function () {
    $(".table-wrap").slideDown(500);
    say("You clicked Show Table");
  });
});