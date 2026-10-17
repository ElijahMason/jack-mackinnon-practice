(function () {
  var CONTACT_EMAIL = "";

  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  if (toggle && nav) {
    document.body.classList.add("js-nav");
    toggle.hidden = false;
    toggle.setAttribute("aria-expanded", "false");
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
      nav.classList.toggle("is-open", !open);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        toggle.focus();
      }
    });
  }

  var mailNote = document.querySelector("[data-mail-note]");
  if (mailNote && CONTACT_EMAIL) {
    mailNote.textContent = "You can also open a mail draft to " + CONTACT_EMAIL + ".";
  }

  var form = document.querySelector("[data-brief-form]");
  if (!form) return;

  var panel = document.querySelector("[data-brief-panel]");
  var output = document.querySelector("[data-brief-output]");
  var status = document.querySelector("[data-brief-status]");
  var mail = document.querySelector("[data-brief-mail]");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var data = new FormData(form);
    var name = String(data.get("name") || "").trim();
    var team = String(data.get("team") || "").trim();
    var note = String(data.get("note") || "").trim();
    var works = data.getAll("work").map(function (item) { return String(item); });

    if (!name || !note || works.length === 0) {
      if (status) {
        status.textContent = "Add your name, at least one kind of work, and a note. Then submit again.";
      }
      return;
    }

    var brief = [
      "Brief for Jack MacKinnon",
      "The desk is part of the system.",
      "",
      "Name: " + name,
      "Team: " + (team || "(not given)"),
      "Work: " + works.join(", "),
      "",
      note
    ].join("\n");

    if (panel) panel.hidden = false;
    if (output) {
      output.value = brief;
      output.focus();
      output.select();
    }

    function showCopied(didCopy) {
      if (!status) return;
      status.textContent = didCopy
        ? "Copied. The brief is on this page."
        : "The brief is on this page. Select it and copy.";
    }

    var didCopy = false;
    try {
      didCopy = document.execCommand("copy");
    } catch (err) {
      didCopy = false;
    }
    showCopied(didCopy);

    if (!didCopy && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(brief).then(function () {
        showCopied(true);
      }).catch(function () {
        showCopied(false);
      });
    }

    if (mail && CONTACT_EMAIL) {
      mail.hidden = false;
      mail.href = "mailto:" + CONTACT_EMAIL
        + "?subject=" + encodeURIComponent("Brief for Jack MacKinnon")
        + "&body=" + encodeURIComponent(brief);
      mail.textContent = "Open a message to " + CONTACT_EMAIL;
    }
  });
})();
