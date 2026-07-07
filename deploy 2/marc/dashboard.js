/* ============================================================
   Chrysa — Beta Dashboard interactions
   View switching (persisted) · Ask Chrysa answer · source toggles
   ============================================================ */
(function () {
  "use strict";

  /* ---- view switching ---- */
  const KEY = "chrysa-dash-view";
  const btns = Array.from(document.querySelectorAll(".rbtn[data-view]"));
  const views = Array.from(document.querySelectorAll(".dview"));

  function setView(name, persist) {
    if (!document.getElementById("view-" + name)) name = "today";
    btns.forEach((b) => b.classList.toggle("active", b.dataset.view === name));
    views.forEach((v) => v.classList.toggle("active", v.id === "view-" + name));
    if (persist) {
      try { localStorage.setItem(KEY, name); } catch (e) {}
    }
    const main = document.querySelector(".dmain");
    if (main) main.scrollTop = 0;
  }

  btns.forEach((b) => b.addEventListener("click", () => setView(b.dataset.view, true)));
  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  setView(saved || "today", false);

  /* ---- ask chrysa ---- */
  const askForm = document.getElementById("ask-form");
  const askInput = document.getElementById("ask-input");
  const answer = document.getElementById("answer");

  function openAnswer() {
    if (answer) answer.classList.add("open");
  }
  function closeAnswer() {
    if (answer) answer.classList.remove("open");
  }
  if (askForm) {
    askForm.addEventListener("submit", (e) => {
      e.preventDefault();
      openAnswer();
      if (askInput) askInput.blur();
    });
  }
  const answerClose = document.getElementById("answer-close");
  if (answerClose) answerClose.addEventListener("click", closeAnswer);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAnswer();
  });
  document.addEventListener("click", (e) => {
    if (answer && answer.classList.contains("open") &&
        !answer.contains(e.target) && !askForm.contains(e.target)) {
      closeAnswer();
    }
  });

  /* ---- insight actions ---- */
  document.querySelectorAll(".iact button.pri").forEach((b) => {
    b.addEventListener("click", () => {
      b.textContent = "✓ Queued";
      b.classList.add("done");
    });
  });

  /* ---- source connect: handled by connect.js ---- */

  /* ---- workspace rename ---- */
  const wsChip = document.getElementById("ws-chip");
  const wsName = document.getElementById("ws-name");
  const WKEY = "chrysa-ws-name";
  let wsSaved = null;
  try { wsSaved = localStorage.getItem(WKEY); } catch (e) {}
  if (wsSaved && wsName) wsName.textContent = wsSaved;
  function wsRename() {
    if (!wsName) return;
    const cur = wsName.textContent;
    const v = window.prompt("Name your workspace", cur === "Your brand" ? "" : cur);
    if (v && v.trim()) {
      wsName.textContent = v.trim();
      try { localStorage.setItem(WKEY, v.trim()); } catch (e) {}
      avatarRefresh();
    }
  }

  /* ---- avatar: initial from your name, else workspace ---- */
  const avatar = document.getElementById("avatar");
  const AKEY = "chrysa-user-name";
  function avatarRefresh() {
    if (!avatar) return;
    let un = null;
    try { un = localStorage.getItem(AKEY); } catch (e) {}
    const ws = wsName ? wsName.textContent.trim() : "";
    const base = un || (ws && ws !== "Your brand" ? ws : "Chrysa");
    avatar.textContent = base.trim().charAt(0).toUpperCase();
    avatar.title = un ? un + " — click to change" : "Set your name";
  }
  function avatarAsk() {
    let cur = null;
    try { cur = localStorage.getItem(AKEY); } catch (e) {}
    const v = window.prompt("Your name", cur || "");
    if (v && v.trim()) {
      try { localStorage.setItem(AKEY, v.trim()); } catch (e) {}
      avatarRefresh();
    }
  }
  if (avatar) {
    avatar.addEventListener("click", avatarAsk);
    avatar.addEventListener("keydown", (e) => { if (e.key === "Enter") avatarAsk(); });
  }
  avatarRefresh();
  if (wsChip) {
    wsChip.addEventListener("click", wsRename);
    wsChip.addEventListener("keydown", (e) => { if (e.key === "Enter") wsRename(); });
  }

  /* ---- calendar gap suggestion ---- */
  document.querySelectorAll(".evt.gap").forEach((g) => {
    g.addEventListener("click", () => {
      g.classList.remove("gap");
      g.classList.add("creator");
      g.innerHTML = "<small>Creator · added</small>UGC test — customer-story angle";
    });
  });
})();
