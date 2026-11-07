/* PHYSICS OS — érettségi próbavizsga (hivatalos feladatsorok alapján)
 * Vizsgamód: 240 perc, beadás után értékelés. Gyakorló mód: szüneteltethető, kérdésenként ellenőrizhető.
 * I. rész automatikusan javítva; II–III. rész önértékelés a hivatalos javítási útmutató alapján. */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const { h, fmt } = PO.util;

  /* ------------------------------------------------------------------ */
  /* Tiszta logika (tesztelhető)                                          */
  /* ------------------------------------------------------------------ */
  const wordCount = (t) => String(t || "").trim().split(/\s+/).filter(Boolean).length;
  const ITEM_KEYS = (E) => [...E.I.map((q) => "I-" + q.nr), "II", ...E.III.map((p) => "III-" + p.nr)];

  function newAttempt(mode) {
    return { mode, elapsed: 0, running: true, startedAt: Date.now(), I: {}, II: { tema: null, text: "" }, III: {}, flags: {}, checked: {}, view: "I-1", submitted: false, self: { II: { t: null, ny: null, sz: null }, III: {} }, saved: false };
  }

  function score(E, cur) {
    const notes = (PO.examNotes && PO.examNotes[E.id]) || { I: {}, III: {} };
    const Ilist = E.I.map((q) => {
      const v = cur.I[q.nr] || null;
      return { nr: q.nr, valasz: v, helyes: q.helyes, ok: v === q.helyes, pont: v === q.helyes ? q.pont : 0, max: q.pont, tema: (notes.I[q.nr] || [])[0] || null };
    });
    const pI = Ilist.reduce((a, x) => a + x.pont, 0);
    const words = wordCount(cur.II.text);
    const s2 = cur.self.II;
    const kifOk = words > 100;
    const pII = s2.t === null ? null : s2.t + (kifOk ? (s2.ny || 0) + (s2.sz || 0) : 0);
    const IIIlist = E.III.map((p) => ({ nr: p.nr, pont: cur.self.III[p.nr] ?? null, max: p.pont, tema: (notes.III || {})[p.nr] || null }));
    const pIII = IIIlist.every((x) => x.pont !== null) ? IIIlist.reduce((a, x) => a + x.pont, 0) : null;
    const complete = pII !== null && pIII !== null && (kifOk ? s2.ny !== null && s2.sz !== null : true);
    const total = complete ? pI + pII + pIII : null;
    // témakörönkénti bontás (I. rész + III. rész)
    const byTopic = {};
    const add = (t, got, max) => { if (!t) return; const b = (byTopic[t] = byTopic[t] || { got: 0, max: 0 }); b.got += got; b.max += max; };
    Ilist.forEach((x) => add(x.tema, x.pont, x.max));
    IIIlist.forEach((x) => { if (x.pont !== null) add(x.tema, x.pont, x.max); });
    return { I: { pont: pI, max: E.I.reduce((a, q) => a + q.pont, 0), list: Ilist }, II: { pont: pII, words, kifOk }, III: { pont: pIII, list: IIIlist }, total, complete, byTopic };
  }

  /* ------------------------------------------------------------------ */
  /* Állapot                                                              */
  /* ------------------------------------------------------------------ */
  const rec = (id) => { const s = PO.store.get(); return (s.exams && s.exams[id]) || { history: [] }; };
  const upd = (id, fn) => PO.store.update((s) => { s.exams = s.exams || {}; s.exams[id] = s.exams[id] || { history: [] }; fn(s.exams[id]); });
  const byId = (id) => PO.exams.find((e) => e.id === id);
  const mmss = (sec) => { const neg = sec < 0; sec = Math.abs(Math.round(sec)); const hh = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60; return (neg ? "+" : "") + (hh ? hh + ":" + String(m).padStart(2, "0") : m) + ":" + String(s).padStart(2, "0"); };

  /* ------------------------------------------------------------------ */
  /* Közös elemek                                                         */
  /* ------------------------------------------------------------------ */
  function paper(list, alt) {
    const box = h("div.paper", { title: "Kattints a nagyításhoz / kicsinyítéshez" }, list.map((im) => h("img", { src: im.src, alt: alt || "", loading: "lazy", width: im.w, height: im.h, style: { width: Math.round(im.w * 0.64) + "px" } })));
    box.addEventListener("click", () => box.classList.toggle("zoom"));
    return box;
  }
  function confirmBtn(label, confirmLabel, onConfirm, cls = "btn") {
    let armed = false, t;
    const b = h("button." + cls.replace(/ /g, "."), { type: "button" }, label);
    b.addEventListener("click", () => {
      if (!armed) { armed = true; b.textContent = confirmLabel; t = setTimeout(() => { armed = false; b.textContent = label; }, 4000); return; }
      clearTimeout(t); onConfirm();
    });
    return b;
  }
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

  /* ------------------------------------------------------------------ */
  /* Vizsga menü: lista                                                   */
  /* ------------------------------------------------------------------ */
  function list() {
    const card = (E) => {
      const r = rec(E.id);
      const last = r.history && r.history[r.history.length - 1];
      const best = (r.history || []).reduce((m, x) => Math.max(m, x.total), -1);
      const state = r.cur ? (r.cur.submitted ? (r.cur.saved ? "Kiértékelve" : "Kiértékelésre vár") : "Folyamatban") : null;
      return h("a.panel.card-link", { href: "#vizsga-" + E.id },
        h("div.fmeta", h("span.tag", "Hivatalos feladatsor"), state ? h("span.tag.solid", state) : null),
        h("div.panel-title", { style: { marginTop: "8px" } }, `${E.cim} – emelt szintű írásbeli`),
        h("div.small.muted", `${E.datum} · 240 perc · 100 pont`),
        h("div.small.muted", { style: { marginTop: "4px" } }, E.II.temak.map((t) => t.cim).join(" · ")),
        last ? h("div.small", { style: { marginTop: "8px" } }, `Utolsó eredmény: ${last.total} pont (${last.total}%) · legjobb: ${best} pont`) : h("div.small", { style: { marginTop: "8px" } }, "Még nem írtad meg."));
    };
    return h("div.page",
      h("div.eyebrow", "Vizsga"),
      h("h1", "Érettségi szimulátor"),
      h("p.lead", "Hivatalos emelt szintű írásbeli feladatsorok a javítási-értékelési útmutatóval. Az I. részt a program javítja, a II. és III. részt a hivatalos útmutató alapján te pontozod."),
      h("div.grid.g3", { style: { marginBottom: "10px" } },
        h("div.panel", h("div.panel-title", "I. Feleletválasztós"), h("div.small.muted", "15 kérdés · 30 pont · automatikus javítás, magyarázattal")),
        h("div.panel", h("div.panel-title", "II. Témakifejtés"), h("div.small.muted", "3 témából 1 · 18 + 5 pont · szószámláló, 100 szó alatt nincs pont a kifejtés módjára")),
        h("div.panel", h("div.panel-title", "III. Összetett feladatok"), h("div.small.muted", "4 feladat · 47 pont · hivatalos megoldás részpontokkal"))),
      h("h2", "Írásbeli próbavizsgák"),
      h("div.grid.g2", PO.exams.map(card)),
      h("h2", "Szóbeli"),
      h("div.panel.card-link.disabled", h("div", "Szóbeli tételhúzás és mérések (A és B feladat)"), h("div.fmeta", { style: { marginTop: "6px" } }, h("span.tag.dev", "Fejlesztés alatt"))),
      h("p.small.muted", { style: { marginTop: "18px" } }, "Forrás: Oktatási Hivatal, emelt szintű fizika írásbeli feladatlapok és javítási-értékelési útmutatók (2024–2026). A feladatok és megoldások az eredeti dokumentumokból kivágott képek. A feleletválasztós kérdések magyarázatai saját kiegészítések; a helyes válasz minden esetben a hivatalos kulcs."));
  }

  /* ------------------------------------------------------------------ */
  /* Egy vizsga                                                           */
  /* ------------------------------------------------------------------ */
  function run(id) {
    const E = byId(id);
    if (!E) return PO.pages.notFound();
    const host = h("div.page");
    let timer = null;
    const stopTimer = () => { if (timer) { clearInterval(timer); timer = null; } };
    function render() {
      stopTimer();
      host.innerHTML = "";
      const r = rec(id);
      if (!r.cur) host.append(startScreen(E, r, render));
      else if (!r.cur.submitted) host.append(runner(E, render, (t) => (timer = t)));
      else host.append(results(E, render));
    }
    render();
    return { el: host, destroy: stopTimer };
  }

  function historyTable(r) {
    if (!r.history || !r.history.length) return null;
    return h("div.panel", h("div.panel-title", "Korábbi eredményeid"),
      h("table.data", h("thead", h("tr", h("th", "Dátum"), h("th", "Mód"), h("th", "I."), h("th", "II."), h("th", "III."), h("th", "Összesen"), h("th", "Idő"))),
        h("tbody", r.history.slice().reverse().map((x) => h("tr", h("td", new Date(x.date).toLocaleDateString("hu-HU")), h("td", x.mode === "vizsga" ? "Vizsga" : "Gyakorló"), h("td", x.I + "/30"), h("td", x.II + "/23"), h("td", x.III + "/47"), h("td", h("strong", x.total + " pont")), h("td", mmss(x.elapsed)))))));
  }

  function startScreen(E, r, rerender) {
    let mode = "vizsga";
    const seg = h("div.seg", { role: "group", "aria-label": "Mód" });
    [["vizsga", "Vizsgamód"], ["gyakorlo", "Gyakorló mód"]].forEach(([k, l]) => {
      const b = h("button", { type: "button", "aria-pressed": String(k === mode) }, l);
      b.addEventListener("click", () => { mode = k; [...seg.children].forEach((c) => c.setAttribute("aria-pressed", "false")); b.setAttribute("aria-pressed", "true"); desc.textContent = DESC[k]; });
      seg.append(b);
    });
    const DESC = {
      vizsga: "240 perc, szünet nélkül. A helyes válaszokat és a megoldásokat csak beadás után látod. Az idő lejártakor a dolgozat automatikusan beadódik.",
      gyakorlo: "Az időmérő szüneteltethető, a feleletválasztós kérdéseket egyenként ellenőrizheted, a számolós feladatoknál megnézheted a hivatalos megoldást.",
    };
    const desc = h("p.small.muted", DESC[mode]);
    return h("div",
      h("a.small.muted", { href: "#vizsga", style: { textDecoration: "none" } }, "← Érettségi szimulátor"),
      h("div.eyebrow", { style: { marginTop: "10px" } }, "Hivatalos feladatsor · " + E.datum),
      h("h1", `Fizika emelt szint – ${E.cim}`),
      h("p.lead", "Írásbeli vizsga, 240 perc, 100 pont. Használható segédeszköz: függvénytáblázat és szöveg tárolására nem alkalmas zsebszámológép."),
      h("div.grid.g2",
        h("div.panel", h("div.panel-title", "Felépítés"), h("table.data", h("tbody",
          h("tr", h("td", "I. Feleletválasztós kérdéssor"), h("td", `${E.I.length} kérdés`), h("td", "30 pont")),
          h("tr", h("td", "II. Témakifejtés"), h("td", E.II.temak.map((t) => t.cim).join(", ")), h("td", "23 pont")),
          h("tr", h("td", "III. Összetett feladatok"), h("td", `${E.III.length} feladat`), h("td", E.III.reduce((a, p) => a + p.pont, 0) + " pont"))))),
        h("div.panel", h("div.panel-title", "Mód"), seg, desc,
          h("p.small.muted", "Az idő csak akkor telik, amikor a vizsga nyitva van; a válaszaid automatikusan mentődnek, bármikor folytathatod."),
          h("button.btn.primary", { type: "button", style: { marginTop: "6px" }, onclick: () => { upd(E.id, (x) => { x.cur = newAttempt(mode); }); rerender(); } }, "Vizsga indítása"))),
      historyTable(r));
  }

  /* ---------------- futó vizsga ---------------- */
  function runner(E, rerender, setTimer) {
    const id = E.id;
    const cur = () => rec(id).cur;
    const keys = ITEM_KEYS(E);
    const limit = E.ido * 60;
    const wrap = h("div.exam");
    const timeEl = h("span.exam-time", { "aria-live": "off" });
    const pauseBtn = cur().mode === "gyakorlo" ? h("button.btn.sm.ghost", { type: "button" }) : null;
    const navBox = h("nav.exam-nav", { "aria-label": "Feladatok" });
    const main = h("div.exam-main");
    const submit = confirmBtn("Beadás", "Biztosan beadod? Kattints újra", () => doSubmit(), "btn primary sm");

    // időmérés
    let last = Date.now(), dirty = 0;
    const paintTime = () => {
      const c = cur();
      const rem = limit - c.elapsed;
      timeEl.textContent = (rem >= 0 ? "Hátralévő idő " + mmss(rem) : "Túllépés " + mmss(-rem)) + (c.running ? "" : " · szünet");
      timeEl.classList.toggle("warn", rem < 15 * 60);
      if (pauseBtn) pauseBtn.textContent = c.running ? "❚❚ Szünet" : "▶ Folytatás";
    };
    const tick = () => {
      const now = Date.now(), dt = (now - last) / 1000; last = now;
      const c = cur();
      if (!c || c.submitted) return;
      if (c.running) {
        c.elapsed += dt; dirty += dt;
        if (dirty > 10) { dirty = 0; PO.store.update(() => {}); }
        if (c.mode === "vizsga" && c.elapsed >= limit) { PO.toast("Lejárt az idő – a dolgozatot beadtuk."); doSubmit(); return; }
      }
      paintTime();
    };
    setTimer(setInterval(tick, 1000));
    if (pauseBtn) pauseBtn.addEventListener("click", () => { upd(id, (x) => { x.cur.running = !x.cur.running; }); last = Date.now(); paintTime(); });

    function doSubmit() { upd(id, (x) => { x.cur.submitted = true; x.cur.submittedAt = Date.now(); }); rerender(); window.scrollTo(0, 0); }
    const save = (fn) => upd(id, (x) => fn(x.cur));

    function navState(k) {
      const c = cur();
      if (k.startsWith("I-")) return c.I[+k.slice(2)] ? "done" : "";
      if (k === "II") return c.II.tema ? (wordCount(c.II.text) > 0 ? "done" : "half") : "";
      return (c.III[+k.slice(4)] || "").trim() ? "done" : "";
    }
    function paintNav() {
      navBox.innerHTML = "";
      const c = cur();
      const group = (label, ks) => h("div.exam-nav-group", h("div.small.muted", label), h("div.exam-nav-btns", ks.map((k) => {
        const lab = k.startsWith("I-") ? k.slice(2) : k === "II" ? "Téma" : k.slice(4);
        return h("button", { type: "button", class: ["exam-nav-btn", navState(k), c.flags[k] ? "flag" : "", c.view === k ? "current" : ""].join(" "), "aria-current": c.view === k ? "step" : null, title: c.flags[k] ? "Megjelölve" : "", onclick: () => go(k) }, lab);
      })));
      const answered = E.I.filter((q) => c.I[q.nr]).length;
      navBox.append(
        group(`I. rész · ${answered}/${E.I.length}`, keys.filter((k) => k.startsWith("I-"))),
        group("II. rész", ["II"]),
        group("III. rész", keys.filter((k) => k.startsWith("III-"))),
        h("div.small.muted", { style: { marginTop: "8px" } }, "Jelmagyarázat: kitöltött = fehér, megjelölt = szaggatott keret."));
    }
    function go(k) { save((c) => { c.view = k; }); paintNav(); paintMain(); main.scrollIntoView({ block: "start", behavior: "smooth" }); }

    function paintMain() {
      main.innerHTML = "";
      const c = cur();
      const k = c.view;
      const i = keys.indexOf(k);
      const flagBtn = h("button.btn.sm.ghost", { type: "button", "aria-pressed": String(!!c.flags[k]) }, "Megjelölöm később");
      flagBtn.addEventListener("click", () => { save((x) => { x.flags[k] ? delete x.flags[k] : (x.flags[k] = true); }); flagBtn.setAttribute("aria-pressed", String(!!cur().flags[k])); paintNav(); });
      const nav = h("div.row", { style: { marginTop: "16px" } },
        h("button.btn.sm", { type: "button", disabled: i === 0, onclick: () => go(keys[i - 1]) }, "← Előző"),
        h("button.btn.sm", { type: "button", disabled: i === keys.length - 1, onclick: () => go(keys[i + 1]) }, "Következő →"),
        h("span.spacer"), flagBtn);

      if (k.startsWith("I-")) main.append(mcView(E.I.find((q) => q.nr === +k.slice(2))), nav);
      else if (k === "II") main.append(essayView(), nav);
      else main.append(problemView(E.III.find((p) => p.nr === +k.slice(4))), nav);
    }

    function mcView(q) {
      const c = cur();
      const note = PO.examNotes && PO.examNotes[id] && PO.examNotes[id].I[q.nr];
      const fb = h("div");
      const letters = q.betuk.length ? q.betuk : ["A", "B", "C", "D"];
      const seg = h("div.seg.answer-seg", { role: "radiogroup", "aria-label": "Válasz" });
      letters.forEach((L) => {
        const b = h("button", { type: "button", role: "radio", "aria-checked": String(c.I[q.nr] === L), "aria-pressed": String(c.I[q.nr] === L) }, L);
        b.addEventListener("click", () => {
          save((x) => { x.I[q.nr] = x.I[q.nr] === L ? undefined : L; if (!x.I[q.nr]) delete x.I[q.nr]; });
          [...seg.children].forEach((ch) => { const on = cur().I[q.nr] === ch.textContent; ch.setAttribute("aria-pressed", String(on)); ch.setAttribute("aria-checked", String(on)); });
          fb.innerHTML = ""; paintNav();
        });
        seg.append(b);
      });
      const check = c.mode === "gyakorlo" ? h("button.btn.sm", { type: "button", onclick: () => {
        const v = cur().I[q.nr];
        fb.className = "feedback " + (v === q.helyes ? "ok" : "bad");
        fb.innerHTML = (v ? (v === q.helyes ? "<strong>Helyes!</strong> " : `<strong>Nem jó.</strong> A helyes válasz: <strong>${q.helyes}</strong>. `) : `A helyes válasz: <strong>${q.helyes}</strong>. `) + (note ? PO.tex.html(note[1]) : "");
        save((x) => { x.checked[q.nr] = true; });
      } }, "Ellenőrzés") : null;
      return h("div",
        h("div.row", h("h2", { style: { margin: "0" } }, `I. rész · ${q.nr}. kérdés`), h("span.spacer"), h("span.small.muted", q.pont + " pont"), note && c.mode === "gyakorlo" ? h("span.tag", note[0]) : null),
        h("div", { style: { height: "10px" } }),
        paper(q.kepek, q.szoveg),
        h("div.row", { style: { marginTop: "14px" } }, h("span.small.muted", "Válaszod:"), seg, check),
        fb);
    }

    function essayView() {
      const c = cur();
      if (!c.II.tema) {
        return h("div",
          h("h2", { style: { marginTop: 0 } }, "II. rész · Témakifejtés"),
          paper(E.II.bevezeto, "Útmutató a témakifejtéshez"),
          h("p.small.muted", { style: { marginTop: "10px" } }, "Válassz egy témát! A választás később módosítható."),
          h("div.grid.g3", E.II.temak.map((t) => h("button.panel.card-link", { type: "button", style: { textAlign: "left", cursor: "pointer" }, onclick: () => { save((x) => { x.II.tema = t.nr; }); paintMain(); paintNav(); } },
            h("div.eyebrow", t.nr + ". téma"), h("div.panel-title", t.cim), h("div.small.muted", "Kiválasztom")))));
      }
      const t = E.II.temak.find((x) => x.nr === c.II.tema);
      const ta = h("textarea.essay", { rows: 18, placeholder: "Itt fejtsd ki a témát összefüggő szövegben (másfél-két oldal). A válasz automatikusan mentődik.", "aria-label": "Témakifejtés szövege" });
      ta.value = c.II.text || "";
      const wc = h("div.small");
      const paintWc = () => {
        const n = wordCount(ta.value);
        wc.textContent = `${n} szó` + (n <= 100 ? " · 100 szó alatt a kifejtés módjára (5 pont) nem jár pont" : " · a kifejtés módja is értékelhető");
        wc.className = "small " + (n <= 100 ? "muted" : "");
      };
      paintWc();
      let tt; ta.addEventListener("input", () => { paintWc(); clearTimeout(tt); tt = setTimeout(() => { save((x) => { x.II.text = ta.value; }); paintNav(); }, 500); });
      const change = confirmBtn("Másik témát választok", (c.II.text || "").trim() ? "A szöveged megmarad – biztosan?" : "Biztosan?", () => { save((x) => { x.II.tema = null; }); paintMain(); paintNav(); }, "btn sm ghost");
      return h("div",
        h("div.row", h("h2", { style: { margin: 0 } }, `II. rész · ${t.nr}. ${t.cim}`), h("span.spacer"), change),
        h("details.solution", h("summary", "Általános útmutató"), h("div", paper(E.II.bevezeto))),
        h("div", { style: { height: "10px" } }),
        paper(t.kepek, t.szoveg),
        h("div", { style: { marginTop: "14px" } }, ta),
        wc);
    }

    function problemView(p) {
      const c = cur();
      const ta = h("textarea", { rows: 10, placeholder: "Piszkozat: ide írhatod a megoldásod lépéseit és eredményeit. (Papíron is dolgozhatsz – a javításnál a hivatalos útmutató alapján te pontozod.)", "aria-label": "Megoldás jegyzete" });
      ta.value = c.III[p.nr] || "";
      let tt; ta.addEventListener("input", () => { clearTimeout(tt); tt = setTimeout(() => { save((x) => { x.III[p.nr] = ta.value; }); paintNav(); }, 500); });
      const parts = p.reszek.length ? p.reszek.map((r) => `${r.betu}) ${r.pont} p`).join(" · ") + " · " : "";
      return h("div",
        h("div.row", h("h2", { style: { margin: 0 } }, `III. rész · ${p.nr}. feladat`), h("span.spacer"), h("span.small.muted", parts + p.pont + " pont")),
        h("div", { style: { height: "10px" } }),
        paper(p.kepek, p.szoveg),
        h("div", { style: { marginTop: "14px" } }, ta),
        cur().mode === "gyakorlo" && p.megoldas ? h("details.solution", h("summary", "Hivatalos megoldás és pontozás"), h("div", paper(p.megoldas, "Hivatalos megoldás"))) : null);
    }

    const bar = h("div.exam-bar",
      h("div.exam-bar-title", h("strong", E.cim), h("span.small.muted", cur().mode === "vizsga" ? " · vizsgamód" : " · gyakorló mód")),
      h("span.spacer"), timeEl, pauseBtn, submit);
    wrap.append(bar, h("div.exam-layout", navBox, main));
    paintTime(); paintNav(); paintMain();
    return wrap;
  }

  /* ---------------- kiértékelés ---------------- */
  function results(E, rerender) {
    const id = E.id;
    const cur = () => rec(id).cur;
    const notes = (PO.examNotes && PO.examNotes[id]) || { I: {}, III: {} };
    const sumBox = h("div");
    const topicBox = h("div");

    const cardsBox = h("div");
    const saveBtn = h("button.btn.primary", { type: "button" });
    saveBtn.addEventListener("click", () => {
      const s2 = score(E, cur());
      if (!s2.complete || cur().saved) return;
      upd(id, (x) => { x.history.push({ date: Date.now(), mode: x.cur.mode, I: s2.I.pont, II: s2.II.pont, III: s2.III.pont, total: s2.total, elapsed: x.cur.elapsed }); x.cur.saved = true; });
      PO.toast("Eredmény rögzítve"); paintSummary();
    });
    const timeInfo = h("span.small.muted");
    sumBox.append(cardsBox, h("div.row", { style: { marginTop: "12px" } }, saveBtn,
      confirmBtn("Új próbálkozás", "A mostani válaszok törlődnek – biztosan?", () => { upd(id, (x) => { delete x.cur; }); rerender(); }, "btn ghost"),
      h("span.spacer"), timeInfo));

    function paintSummary() {
      const S = score(E, cur());
      const card = (label, val, max, sub) => h("div.panel", h("div.stat-value", val === null ? "–" : `${val}/${max}`), h("div.stat-label", label), sub ? h("div.small.muted", sub) : null, val !== null ? h("div.bar", h("i", { style: { width: pct(val, max) + "%" } })) : null);
      cardsBox.innerHTML = "";
      cardsBox.append(h("div.grid.g4",
        card("I. rész – automatikus", S.I.pont, 30),
        card("II. rész – önértékelés", S.II.pont, 23, `${S.II.words} szó`),
        card("III. rész – önértékelés", S.III.pont, 47),
        card("Összesen", S.total, 100, S.total === null ? "Pontozd a II. és III. részt" : `${S.total}% – nem hivatalos becslés`)));
      saveBtn.disabled = !S.complete || !!cur().saved;
      saveBtn.textContent = cur().saved ? "✓ Eredmény rögzítve" : "Eredmény rögzítése";
      timeInfo.textContent = `Felhasznált idő: ${mmss(cur().elapsed)}`;
      // témakörök
      topicBox.innerHTML = "";
      const rows = Object.entries(S.byTopic).sort((a, b) => a[1].got / a[1].max - b[1].got / b[1].max);
      topicBox.append(h("table.data", h("thead", h("tr", h("th", "Témakör"), h("th", "Pont"), h("th", "Arány"), h("th", ""))),
        h("tbody", rows.map(([t, b]) => h("tr", h("td", t), h("td", `${b.got}/${b.max}`), h("td", { style: { width: "40%" } }, h("div.bar", { style: { marginTop: "6px" } }, h("i", { style: { width: pct(b.got, b.max) + "%" } }))), h("td", pct(b.got, b.max) + "%"))))),
        h("p.small.muted", { style: { marginTop: "8px" } }, "Az I. rész kérdései és a már pontozott III. részbeli feladatok alapján. A legalacsonyabb arányú témakörökkel érdemes kezdeni az ismétlést."));
    }

    // I. rész
    const S0 = score(E, cur());
    const wrong = S0.I.list.filter((x) => !x.ok);
    const Irows = h("div.grid", { style: { gap: "8px" } }, E.I.map((q) => {
      const x = S0.I.list.find((y) => y.nr === q.nr);
      const note = notes.I[q.nr];
      return h("details.solution" + (x.ok ? "" : ".wrong"),
        h("summary", h("span", { style: { fontFamily: "var(--mono)", width: "28px", display: "inline-block" } }, q.nr + "."),
          h("span", x.ok ? "✓ Helyes" : x.valasz ? `✗ Te: ${x.valasz} · helyes: ${q.helyes}` : `– Nincs válasz · helyes: ${q.helyes}`),
          h("span.spacer"), note ? h("span.tag", note[0]) : null),
        h("div", paper(q.kepek, q.szoveg), note ? h("div.callout.small", { html: `<div class="callout-t">Magyarázat · helyes válasz: ${q.helyes}</div>` + PO.tex.html(note[1]) }) : h("p.small.muted", `Helyes válasz: ${q.helyes}`)));
    }));
    const retryBox = h("div");
    const retryBtn = wrong.length ? h("button.btn.sm", { type: "button", onclick: () => { retryBox.innerHTML = ""; retryBox.append(retry(wrong.map((w) => E.I.find((q) => q.nr === w.nr)))); retryBtn.remove(); } }, `Hibás kérdések újragyakorlása (${wrong.length})`) : null;

    // II. rész
    const c0 = cur();
    const tema = E.II.temak.find((t) => t.nr === c0.II.tema);
    const words = wordCount(c0.II.text);
    const numIn = (val, max, onSet, label) => {
      const i = h("input", { type: "number", min: 0, max, step: 1, value: val ?? "", placeholder: "0–" + max, "aria-label": label, style: { width: "90px" } });
      i.addEventListener("change", () => { let v = i.value === "" ? null : Math.round(Number(i.value)); if (v !== null) { v = Math.max(0, Math.min(max, v)); i.value = v; } onSet(v); paintSummary(); });
      return i;
    };
    const selIn = (val, max, onSet, label, disabled) => {
      const s = h("select", { "aria-label": label, disabled }, h("option", { value: "" }, "–"), Array.from({ length: max + 1 }, (_, i) => h("option", { value: i, selected: val === i }, i + " pont")));
      s.addEventListener("change", () => { onSet(s.value === "" ? null : Number(s.value)); paintSummary(); });
      return s;
    };
    const setSelf = (fn) => upd(id, (x) => { x.cur.saved = false; fn(x.cur.self); });
    const IIbox = tema ? h("div",
      h("div.grid.g2",
        h("div.panel", h("div.panel-title", `${tema.nr}. ${tema.cim}`), h("div.small.muted", `${words} szó`), h("div.essay-view", c0.II.text || "(üres)")),
        h("div.panel", h("div.panel-title", "Pontozd magad a hivatalos útmutató alapján"),
          h("div.params",
            h("div.row", h("span", "Tartalom (0–18)"), h("span.spacer"), numIn(c0.self.II.t, 18, (v) => setSelf((s) => { s.II.t = v; }), "Tartalom pontszáma")),
            h("div.row", h("span", "Nyelvhelyesség (0–2)"), h("span.spacer"), selIn(c0.self.II.ny, 2, (v) => setSelf((s) => { s.II.ny = v; }), "Nyelvhelyesség", words <= 100)),
            h("div.row", h("span", "A szöveg egésze (0–3)"), h("span.spacer"), selIn(c0.self.II.sz, 3, (v) => setSelf((s) => { s.II.sz = v; }), "A szöveg egésze", words <= 100))),
          words <= 100 ? h("p.small.muted", { style: { marginTop: "8px" } }, "A válasz nem haladja meg a 100 szót, ezért a kifejtés módjára nem adható pont.") : null)),
      h("details.solution", { open: true }, h("summary", "Hivatalos pontozási szempontok"), h("div", paper(tema.utmutato || [], "Javítási útmutató"), paper(E.II.kifejtes, "A kifejtés módjának értékelése"))))
      : h("div.panel.muted", "Nem választottál témát – a II. rész 0 pont.");
    if (!tema && c0.self.II.t === null) upd(id, (x) => { x.cur.self.II = { t: 0, ny: 0, sz: 0 }; });

    // III. rész
    const IIIbox = h("div.grid", E.III.map((p) => h("div.panel",
      h("div.row", h("div.panel-title", { style: { margin: 0 } }, `${p.nr}. feladat`), notes.III && notes.III[p.nr] ? h("span.tag", notes.III[p.nr]) : null, h("span.spacer"),
        h("span.small.muted", (p.reszek.length ? p.reszek.map((r) => `${r.betu}) ${r.pont}`).join(" · ") + " · " : "") + "max. " + p.pont), numIn(c0.self.III[p.nr], p.pont, (v) => setSelf((s) => { s.III[p.nr] = v; }), `${p.nr}. feladat pontszáma`)),
      (c0.III[p.nr] || "").trim() ? h("div.essay-view.small", c0.III[p.nr]) : null,
      h("details.solution", h("summary", "Feladat"), h("div", paper(p.kepek, p.szoveg))),
      h("details.solution", { open: true }, h("summary", "Hivatalos megoldás és részpontok"), h("div", paper(p.megoldas || [], "Hivatalos megoldás"))))));

    paintSummary();
    return h("div",
      h("a.small.muted", { href: "#vizsga", style: { textDecoration: "none" } }, "← Érettségi szimulátor"),
      h("div.eyebrow", { style: { marginTop: "10px" } }, "Kiértékelés · " + E.datum),
      h("h1", `Fizika emelt szint – ${E.cim}`),
      h("div.callout.small", h("div.callout-t", "Fontos"), "Az I. részt a program a hivatalos kulcs alapján javította. A II. és III. rész pontszámát te adod meg a hivatalos javítási útmutató alapján – ez önértékelés, nem hivatalos javítás."),
      sumBox,
      h("h2", "Témakörök"), topicBox,
      h("h2", `I. rész · ${S0.I.pont}/30 pont`), h("div.row", { style: { marginBottom: "10px" } }, retryBtn), retryBox, Irows,
      h("h2", "II. rész · Témakifejtés"), IIbox,
      h("h2", "III. rész · Összetett feladatok"), IIIbox);
  }

  /** Hibás kérdések újragyakorlása (nem befolyásolja a pontszámot). */
  function retry(qs) {
    const box = h("div.grid", { style: { marginBottom: "16px" } });
    qs.forEach((q) => {
      const fb = h("div");
      const seg = h("div.seg.answer-seg");
      (q.betuk.length ? q.betuk : ["A", "B", "C", "D"]).forEach((L) => seg.append(h("button", { type: "button", onclick: (e) => {
        [...seg.children].forEach((c) => c.setAttribute("aria-pressed", "false")); e.currentTarget.setAttribute("aria-pressed", "true");
        const note = PO.examNotes && PO.examNotes[q._exam] && PO.examNotes[q._exam].I[q.nr];
        fb.className = "feedback " + (L === q.helyes ? "ok" : "bad");
        fb.innerHTML = L === q.helyes ? "<strong>Most már helyes!</strong> " + (note ? PO.tex.html(note[1]) : "") : "Még nem jó – gondold át újra.";
      } }, L)));
      box.append(h("div.panel", h("div.small.muted", `${q.nr}. kérdés`), paper(q.kepek, q.szoveg), h("div.row", { style: { marginTop: "10px" } }, seg), fb));
    });
    return box;
  }

  PO.examUI = { list, run, score, wordCount, newAttempt };
  // a retry-hez szükséges vizsga-azonosító
  (PO.exams || []).forEach((E) => E.I.forEach((q) => (q._exam = E.id)));
  if (typeof module !== "undefined") module.exports = PO.examUI;
})(typeof globalThis !== "undefined" ? globalThis : this);
