/* PHYSICS OS — alkalmazás: navigáció (hash-útvonalak), értesítések, indulás */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const { h } = PO.util;

  PO.formulaById = Object.fromEntries(PO.formulas.map((f) => [f.id, f]));
  /** alfejezet-azonosító → { nev, tema (főtémakör id), temaNev, nr } */
  PO.subInfo = {};
  PO.topics.forEach((T) => T.sub.forEach(([id, nev]) => { PO.subInfo[id] = { nev, tema: T.id, temaNev: T.nev, nr: T.nr }; }));
  // a szimulációk által felsorolt képletek adatlapja linkelje a szimulációt
  Object.values(PO.sims).forEach((S) => (S.kepletek || []).forEach((id) => { const F = PO.formulaById[id]; if (F && !F.sim) F.sim = S.id; }));

  /* ---- értesítés ---- */
  let toastEl, toastT;
  PO.toast = (msg) => {
    if (!toastEl) { toastEl = h("div.toast", { role: "status", "aria-live": "polite" }); document.body.append(toastEl); }
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove("show"), 2600);
  };

  /* ---- navigáció ---- */
  const I = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const NAV = [
    ["kezdolap", "Kezdőlap", "Kezdő", I('<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>')],
    ["tananyag", "Tananyag", "Anyag", I('<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>')],
    ["kepletter", "Képlettár", "Képlet", I('<path d="M17 4H7l6 8-6 8h10"/>')],
    ["labor", "Labor", "Labor", I('<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3"/><path d="M7.5 15h9"/>')],
    ["meresek", "Mérések", "Mérés", I('<rect x="3" y="8" width="18" height="8" rx="1.5"/><path d="M7 8v3M11 8v4M15 8v3M19 8v2"/>')],
    ["gyakorlas", "Gyakorlás", "Gyakorl.", I('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>')],
    ["vizsga", "Vizsga", "Vizsga", I('<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>')],
    ["adatok", "Adatok", "Adatok", I('<ellipse cx="12" cy="5.5" rx="7" ry="2.5"/><path d="M5 5.5v13c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-13"/><path d="M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5"/>')],
  ];
  const SECTION = { tema: "tananyag", keplet: "kepletter", sim: "labor", vizsga: "vizsga", meres: "meresek" };

  let current = null;
  function route() {
    const hash = decodeURIComponent(location.hash.replace(/^#/, "")) || "kezdolap";
    const m = hash.match(/^(tema|keplet|sim|vizsga|meres)-(.+)$/);
    let result;
    if (m) result = m[1] === "vizsga" ? PO.examUI.run(m[2]) : m[1] === "meres" ? PO.meresUI.meres(m[2]) : PO.pages[m[1]](m[2]);
    else result = (PO.pages[hash] || PO.pages.notFound)();
    if (current && current.destroy) current.destroy();
    const el = result instanceof Node ? result : result.el;
    current = result instanceof Node ? null : result;
    const main = document.getElementById("main");
    main.innerHTML = "";
    main.append(el);
    const active = m ? SECTION[m[1]] : hash === "kartyak" ? "gyakorlas" : hash;
    document.querySelectorAll(".nav a").forEach((a) => {
      if (a.dataset.id === active) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    window.scrollTo(0, 0);
    const title = el.querySelector("h1");
    document.title = (title ? title.textContent + " · " : "") + "PHYSICS OS";
    PO.store.update((s) => { s.last.page = hash; });
  }
  PO.router = { go(id, force) { if (location.hash === "#" + id && force) route(); else location.hash = id; } };

  function shell() {
    const nav = h("nav.nav", { "aria-label": "Fő navigáció" }, NAV.map(([id, label, short, icon]) =>
      h("a", { href: "#" + id, "data-id": id, html: icon + `<span class="nav-label">${label}</span><span class="nav-label-short">${short}</span>` })));
    const logo = '<svg class="brand-mark" viewBox="0 0 32 32" fill="none" stroke="#fff" stroke-width="1.4"><circle cx="16" cy="16" r="3" fill="#fff"/><ellipse cx="16" cy="16" rx="13" ry="5"/><ellipse cx="16" cy="16" rx="13" ry="5" transform="rotate(60 16 16)"/><ellipse cx="16" cy="16" rx="13" ry="5" transform="rotate(120 16 16)"/></svg>';
    const searchBtn = () => h("button.search-btn", { type: "button", onclick: () => PO.search.open(), "aria-label": "Keresés" },
      h("span", { html: '<svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="9" cy="9" r="5.5"/><path d="M13 13l4 4"/></svg>' }), "Keresés", h("kbd", "Ctrl K"));
    const side = h("aside.sidebar",
      h("div.brand", { html: logo + '<div><div class="brand-name">PHYSICS OS</div><div class="brand-sub">A fizika teljes univerzuma</div></div>' }),
      searchBtn(), nav,
      h("div.sidebar-foot", "Emelt szintű fizikaérettségi"));
    const top = h("div.mobile-top", { html: logo + '<span class="brand-name">PHYSICS OS</span>' });
    top.append(searchBtn());
    const main = h("main.main", { id: "main", tabindex: "-1" });
    document.getElementById("app").append(h("div.shell", side, h("div", top, main)));
  }

  function start() {
    if (!root.katex) console.warn("KaTeX nem töltődött be – a képletek forráskódként jelennek meg.");
    shell();
    PO.searchInit();
    window.addEventListener("hashchange", route);
    route();
    PO.install.register();
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", start) : start();
})(typeof globalThis !== "undefined" ? globalThis : this);
