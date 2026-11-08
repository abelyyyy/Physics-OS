/* PHYSICS OS — oldalak */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const { h, fmt, norm } = PO.util;

  const page = (...kids) => h("div.page", ...kids);
  const devTag = () => h("span.tag.dev", "Fejlesztés alatt");

  /* ================= KEZDŐLAP ================= */
  function kezdolap() {
    const s = PO.store.get();
    const F = PO.formulas;
    const known = F.filter((f) => s.formulas[f.id] === "tudom").length;
    const learning = F.filter((f) => s.formulas[f.id] === "tanulom").length;
    const taskIds = new Set(PO.tasks.map((t) => t.id));
    const tried = Object.entries(s.tasks).filter(([id]) => taskIds.has(id));
    const solved = tried.filter(([, r]) => r.ok).length;
    const allSubs = PO.topics.reduce((n, t) => n + t.sub.length, 0);
    const readySubs = Object.keys(PO.topicPages).length;
    const doneSubs = Object.keys(s.topicsDone).length;
    const verified = Object.keys(s.verified).length;

    // folytatás
    const last = s.last;
    let cont = null;
    if (last.topic && PO.topicPages[last.topic]) cont = { href: "#tema-" + last.topic, title: PO.topicPages[last.topic].nev, sub: "Tananyag" };
    else if (last.sim && PO.sims[last.sim]) cont = { href: "#sim-" + last.sim, title: PO.sims[last.sim].nev, sub: "Labor" };
    // ajánlás
    let next;
    if (!s.topicsDone.kinematika) next = { href: "#tema-kinematika", title: "Kinematika", why: "A mozgások leírása – minden további témakör alapja." };
    else if (solved < PO.tasks.length) next = { href: "#gyakorlas", title: "Gyakorló feladatok", why: `${PO.tasks.length - solved} feladat vár még megoldásra.` };
    else next = { href: "#kepletter", title: "Képletek ismétlése", why: "Jelöld „Tudom”-ra azokat a képleteket, amelyeket fejből is tudsz." };

    // gyenge témakörök
    const byTopic = {};
    tried.forEach(([id, r]) => { const t = PO.tasks.find((x) => x.id === id); if (!t) return; const b = (byTopic[t.temakor] = byTopic[t.temakor] || { ok: 0, n: 0, tries: 0 }); b.n++; b.tries += r.tries; if (r.ok) b.ok++; });
    const weak = Object.entries(byTopic).filter(([, b]) => b.ok / b.n < 0.7 || b.tries / b.n > 2);

    function examStat(st) {
      const hist = Object.values(st.exams || {}).flatMap((x) => x.history || []);
      if (!hist.length) return h("a.panel.card-link", { href: "#vizsga" }, h("div.stat-value", "0 / " + PO.exams.length), h("div.stat-label", "megírt próbavizsga – kezdd el!"));
      const best = Math.max(...hist.map((x) => x.total));
      const done = Object.values(st.exams).filter((x) => (x.history || []).length).length;
      return h("a.panel.card-link", { href: "#vizsga" }, h("div.stat-value", best + "%"), h("div.stat-label", `legjobb próbavizsga · ${done}/${PO.exams.length} feladatsor megírva`), h("div.bar", h("i", { style: { width: best + "%" } })));
    }
    const stat = (value, label, ratio) => h("div.panel", h("div.stat-value", value), h("div.stat-label", label), ratio !== undefined ? h("div.bar", h("i", { style: { width: Math.round(ratio * 100) + "%" } })) : null);

    const backupArea = h("textarea", { rows: 4, placeholder: "Ide illeszd be a korábban kimásolt mentést, majd kattints a Betöltésre.", "aria-label": "Mentés szövege" });
    let resetArmed = false;
    const resetBtn = h("button.btn.sm.ghost", { type: "button" }, "Haladás törlése");
    resetBtn.addEventListener("click", () => {
      if (!resetArmed) { resetArmed = true; resetBtn.textContent = "Biztosan? Kattints újra a törléshez"; setTimeout(() => { resetArmed = false; resetBtn.textContent = "Haladás törlése"; }, 4000); return; }
      PO.store.reset(); PO.toast("Haladás törölve"); PO.router.go("kezdolap", true);
    });

    return page(
      h("div.eyebrow", "PHYSICS OS"),
      h("h1", "A fizika teljes univerzuma"),
      h("p.lead", "Interaktív tanulórendszer a nulláról az emelt szintű fizikaérettségiig: tananyag, kereshető képlettár kalkulátorral, szimulációk, mérések és gyakorlás."),
      h("div.grid.g2",
        cont ? h("a.panel.card-link", { href: cont.href }, h("div.eyebrow", "Folytatás · " + cont.sub), h("div.panel-title", cont.title), h("div.small.muted", "Ott folytathatod, ahol abbahagytad.")) :
          h("div.panel", h("div.eyebrow", "Kezdés"), h("div.panel-title", "Üdv a PHYSICS OS-ben!"), h("div.small.muted", "Kezdd az Alapokkal vagy a Kinematikával, esetleg keress rá bármire a Keresés gombbal (gépen: ", h("kbd", "Ctrl"), " + ", h("kbd", "K"), ").")),
        h("a.panel.card-link", { href: next.href }, h("div.eyebrow", "Ajánlott következő lépés"), h("div.panel-title", next.title), h("div.small.muted", next.why))),
      h("h2", "Haladás"),
      h("div.grid.g4",
        stat(`${doneSubs} / ${allSubs}`, "elvégzett alfejezet", doneSubs / allSubs),
        stat(`${known} / ${F.length}`, `képlet „Tudom” (${learning} tanulás alatt)`, known / F.length),
        stat(`${solved} / ${PO.tasks.length}`, "megoldott feladat", solved / PO.tasks.length),
        examStat(s)),
      h("div.grid.g2", { style: { marginTop: "14px" } },
        h("div.panel", h("div.panel-title", "Gyenge területek"),
          weak.length ? h("ul.clean.small", weak.map(([k, b]) => h("li", `${(PO.subInfo[k] || {}).nev || k}: ${b.ok}/${b.n} helyes, átlag ${fmt(b.tries / b.n, 2)} próbálkozás`))) :
            h("p.small.muted", tried.length ? "Eddig nincs kiugróan gyenge terület." : "Még nincs elég adat – oldj meg néhány feladatot a Gyakorlás menüben."),
          s.last.sim && PO.sims[s.last.sim] ? h("p.small", "Utoljára használt szimuláció: ", h("a", { href: "#sim-" + s.last.sim }, PO.sims[s.last.sim].nev)) : null),
        h("div.panel", h("div.panel-title", "Lefedettség – őszintén"),
          h("p.small", `Kidolgozott alfejezet: ${readySubs} / ${allSubs}. Képletek az adatbázisban: ${F.length} (mind a 7 témakörből). Általad ellenőrzött képlet: ${verified} / ${F.length}.`),
          h("div.bar", h("i", { style: { width: Math.round((readySubs / allSubs) * 100) + "%" } })),
          h("p.small.muted", { style: { marginTop: "8px" } }, "A teljes érettségi anyag lefedettségét csak akkor mutatjuk 100%-nak, ha minden követelménypont ki van dolgozva és ellenőrizve. Ez nem hivatalos előrejelzés."))),
      h("h2", "Mentés"),
      h("div.panel",
        h("p.small", PO.store.available() ? "A haladásod ebben a böngészőben automatikusan mentődik. Másik eszközre a mentés szövegével viheted át." : "Ebben a böngészőben a helyi mentés nem érhető el – a haladás az oldal bezárásakor elveszik. Másold ki a mentést!"),
        h("div.btn-row",
          h("button.btn.sm", { type: "button", onclick: () => { const t = PO.store.exportJSON(); backupArea.value = t; (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => PO.toast("Mentés a vágólapon"), () => PO.toast("A mentés a szövegmezőben van – másold ki kézzel")); } }, "Mentés kimásolása"),
          h("button.btn.sm", { type: "button", onclick: () => { try { PO.store.importJSON(backupArea.value); PO.toast("Mentés betöltve"); PO.router.go("kezdolap", true); } catch (e) { PO.toast("Hibás mentés: " + e.message); } } }, "Betöltés"),
          h("label.btn.sm.ghost", "Fájlból…", h("input", { type: "file", accept: ".json,.txt,application/json", style: { display: "none" }, onchange: (e) => { const f = e.target.files[0]; if (f) f.text().then((t) => { backupArea.value = t; }); } })),
          h("span.spacer"), resetBtn),
        h("div", { style: { marginTop: "10px" } }, backupArea)));
  }

  /* ================= TANANYAG ================= */
  function tananyag() {
    const s = PO.store.get();
    return page(
      h("div.eyebrow", "Tananyag"),
      h("h1", "Teljes tananyag"),
      h("p.lead", "A hivatalos követelmény hét nagy témaköre, előtte az alapozással. A kidolgozott alfejezetek megnyithatók; a többi fejlesztés alatt áll."),
      h("div.grid", PO.topics.map((T) => h("div.panel",
        h("div.row", h("span.small.muted", { style: { fontFamily: "var(--mono)" } }, String(T.nr).padStart(2, "0")), h("div.panel-title", { style: { margin: 0 } }, T.nev)),
        h("p.small.muted", { style: { margin: "2px 0 12px" } }, T.alcim),
        h("div.grid.g3", T.sub.map(([id, nev]) => {
          const ready = !!PO.topicPages[id];
          return ready
            ? h("a.panel.card-link", { href: "#tema-" + id, style: { padding: "12px 14px" } }, h("div", { style: { fontWeight: 600, color: "var(--c7)" } }, nev), h("div.fmeta", { style: { marginTop: "6px" } }, h("span.tag.solid", "Kidolgozva"), s.topicsDone[id] ? h("span.tag", "Elvégezve") : null))
            : h("div.panel.card-link.disabled", { style: { padding: "12px 14px" }, "aria-disabled": "true" }, h("div", nev), h("div.fmeta", { style: { marginTop: "6px" } }, devTag()));
        }))))));
  }

  /* ================= TÉMAKÖR OLDAL ================= */
  function tema(id) {
    const T = PO.topicPages[id];
    if (!T) return notFound();
    PO.store.update((s) => { s.last.topic = id; });
    const sims = [];
    const toc = h("nav.toc", { "aria-label": "A témakör részei" });
    const body = h("div");
    const hasSims = Object.values(PO.sims).some((x) => x.temakor === id);
    const hasF = PO.formulas.some((f) => f.temakor === id);
    const hasT = (PO.tasks || []).some((t) => t.temakor === id);
    const shown = T.sections.filter((S) => !(S.special === "sims" && !hasSims) && !(S.special === "formulas" && !hasF) && !(S.special === "tasks" && !hasT));
    shown.forEach((S, i) => {
      const sec = h("section.topic-section", { id: "sec-" + S.id }, h("h2", h("span.idx", String.fromCharCode(65 + i)), S.cim));
      if (S.html) sec.append(h("div", { html: PO.tex.html(S.html) }));
      if (S.special === "formulas") {
        const list = PO.formulas.filter((f) => f.temakor === id);
        const chapters = [...new Set(list.map((f) => f.fejezet))];
        chapters.forEach((ch) => sec.append(h("h3", ch), h("div.grid.g3", list.filter((f) => f.fejezet === ch).map(PO.ui.formulaCard))));
        sec.append(h("p.small.muted", { style: { marginTop: "10px" } }, "Kattints egy képletre az adatlapjáért és a kalkulátorért."));
      }
      if (S.special === "sims") {
        Object.values(PO.sims).filter((x) => x.temakor === id).forEach((sim) => {
          const box = h("div");
          sec.append(h("h3", sim.nev), h("p.small.muted", sim.leiras), box);
          sims.push(sim.mount(box));
        });
      }
      if (S.special === "tasks") {
        sec.append(h("div.grid", PO.tasks.filter((t) => t.temakor === id).map(PO.ui.taskCard)));
      }
      body.append(sec);
      const a = h("a", { href: "#tema-" + id, "data-sec": S.id }, S.cim);
      a.addEventListener("click", (e) => { e.preventDefault(); sec.scrollIntoView({ behavior: "smooth", block: "start" }); });
      toc.append(a);
    });
    const done = () => !!PO.store.get().topicsDone[id];
    const doneBtn = h("button.btn" + (done() ? "" : ".primary"), { type: "button" }, done() ? "✓ Elvégezve – visszavonás" : "Témakör elvégezve");
    doneBtn.addEventListener("click", () => {
      PO.store.update((s) => { done() ? delete s.topicsDone[id] : (s.topicsDone[id] = Date.now()); });
      doneBtn.className = "btn" + (done() ? "" : " primary");
      doneBtn.textContent = done() ? "✓ Elvégezve – visszavonás" : "Témakör elvégezve";
    });
    const notes = h("textarea", { rows: 4, placeholder: "Saját jegyzetek ehhez a témakörhöz (automatikusan mentődik)…", "aria-label": "Saját jegyzetek" });
    notes.value = PO.store.get().notes[id] || "";
    let nt; notes.addEventListener("input", () => { clearTimeout(nt); nt = setTimeout(() => PO.store.update((s) => { s.notes[id] = notes.value; }), 400); });
    body.append(h("section.topic-section", h("h2", "Jegyzetek"), notes, h("div.row", { style: { marginTop: "16px" } }, doneBtn, h("a.btn.ghost", { href: "#gyakorlas" }, "Tovább a gyakorláshoz"))));

    // aktív szakasz kiemelése
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => { if (e.isIntersecting) toc.querySelectorAll("a").forEach((a) => a.classList.toggle("active", "sec-" + a.dataset.sec === e.target.id)); });
    }, { rootMargin: "-20% 0px -70% 0px" });
    body.querySelectorAll("section[id]").forEach((s) => io.observe(s));

    const parent = PO.topics.find((t) => t.id === T.parent);
    const el = page(
      h("div.eyebrow", h("a", { href: "#tananyag", style: { color: "inherit" } }, "Tananyag"), ` · ${parent.nr}. ${parent.nev}`),
      h("h1", T.nev),
      h("p.muted", T.alcim),
      h("div.fmeta", { style: { margin: "8px 0 20px" } }, h("span.tag", T.szint), h("span.tag", "Előfeltétel: " + T.elofeltetel.join(", "))),
      h("div.topic-layout", body, h("div", toc)));
    return { el, destroy() { io.disconnect(); sims.forEach((s) => s.destroy()); } };
  }

  /* ================= KÉPLETTÁR ================= */
  function kepletter() {
    let q = "", szint = "", szuro = "", tema = PO.kepletterTema || "";
    PO.kepletterTema = "";
    const input = h("input", { type: "search", placeholder: "Keresés: név, jel, mértékegység, jelenség (pl. „energia”, „m/s²”, „ω”, „fékút”)…", "aria-label": "Képletek keresése", style: { width: "100%" } });
    const list = h("div");
    const count = h("span.small.muted");
    const seg = (items, onChange) => {
      const box = h("div.seg", { role: "group" });
      items.forEach(([lab, v], i) => {
        const b = h("button", { type: "button", "aria-pressed": String(i === 0) }, lab);
        b.addEventListener("click", () => { [...box.children].forEach((c) => c.setAttribute("aria-pressed", "false")); b.setAttribute("aria-pressed", "true"); onChange(v); render(); });
        box.append(b);
      });
      return box;
    };
    const temaCount = (id) => PO.formulas.filter((f) => (PO.subInfo[f.temakor] || {}).tema === id).length;
    const temaSel = h("select", { "aria-label": "Témakör" },
      h("option", { value: "" }, `Minden témakör (${PO.formulas.length})`),
      PO.topics.map((T) => h("option", { value: T.id, disabled: !temaCount(T.id) }, `${T.nr}. ${T.nev} (${temaCount(T.id)})`)));
    temaSel.value = tema;
    temaSel.addEventListener("change", () => { tema = temaSel.value; render(); });
    function render() {
      const nq = norm(q);
      const st = PO.store.get();
      const items = PO.formulas.filter((f) => {
        if (tema && (PO.subInfo[f.temakor] || {}).tema !== tema) return false;
        if (szint && f.szint !== szint) return false;
        if (szuro === "kedvenc" && !st.favorites[f.id]) return false;
        if (szuro === "tanulom" && st.formulas[f.id] !== "tanulom") return false;
        if (szuro === "tudom" && st.formulas[f.id] !== "tudom") return false;
        if (!nq) return true;
        const hay = PO.searchText(f);
        return nq.split(" ").every((w) => hay.includes(w));
      });
      list.innerHTML = "";
      count.textContent = `${items.length} képlet`;
      if (!items.length) { list.append(h("div.panel.muted", "Nincs találat. Próbálj rövidebb kulcsszót, vagy válts „Minden témakör”-re.")); return; }
      PO.topics.forEach((T) => {
        const inT = items.filter((f) => (PO.subInfo[f.temakor] || {}).tema === T.id);
        if (!inT.length) return;
        list.append(h("h2", `${T.nr}. ${T.nev}`));
        [...new Set(inT.map((f) => f.fejezet))].forEach((ch) => list.append(h("h3", ch), h("div.grid.g3", inT.filter((f) => f.fejezet === ch).map(PO.ui.formulaCard))));
      });
    }
    input.addEventListener("input", () => { q = input.value; render(); });
    render();
    const emelt = PO.formulas.filter((f) => f.szint === "emelt").length;
    return page(
      h("div.eyebrow", "Képlettár"),
      h("h1", "Képlettár"),
      h("p.lead", "Minden képletnek saját adatlapja van: jelölések, feltételek, átrendezések, számpélda, tipikus hiba – és beépített kalkulátor mértékegység-váltással."),
      h("div.callout.small", h("div.callout-t", "Tartalom"), `${PO.formulas.length} képlet mind a 7 tartalmi témakörből (ebből ${emelt} csak emelt szinten szükséges), összesen ${PO.formulas.reduce((n, f) => n + Object.keys(f.solve).length, 0)} automatikusan ellenőrzött átrendezéssel. Az állandók és anyagjellemzők az `, h("a", { href: "#adatok" }, "Adatok"), " menüben vannak."),
      h("div.panel", { style: { marginTop: "12px" } }, input,
        h("div.row", { style: { marginTop: "10px", flexWrap: "wrap" } }, temaSel, seg([["Minden szint", ""], ["Közép", "kozep"], ["Emelt", "emelt"]], (v) => (szint = v)),
          seg([["Összes", ""], ["★ Kedvencek", "kedvenc"], ["Tanulom", "tanulom"], ["Tudom", "tudom"]], (v) => (szuro = v)), h("span.spacer"), count)),
      list);
  }
  function keplet(id) {
    const F = PO.formulaById[id];
    if (!F) return notFound();
    return page(h("a.small.muted", { href: "#kepletter", style: { textDecoration: "none" } }, "← Képlettár"), h("div", { style: { height: "8px" } }), PO.ui.formulaSheet(F));
  }

  /* ================= LABOR ================= */
  const PLANNED_SIMS = [];
  function labor() {
    return page(
      h("div.eyebrow", "Labor"),
      h("h1", "Interaktív labor"),
      h("p.lead", "Valódi matematikai modellel számoló szimulációk, élő grafikonokkal. Minden paraméter állítható, a grafikon jelölője az animációval együtt mozog."),
      PO.topics.filter((T) => Object.values(PO.sims).some((S) => (PO.subInfo[S.temakor] || {}).tema === T.id)).map((T) => [
        h("h2", `${T.nr}. ${T.nev}`),
        h("div.grid.g2", Object.values(PO.sims).filter((S) => (PO.subInfo[S.temakor] || {}).tema === T.id).map((S) => h("a.panel.card-link", { href: "#sim-" + S.id }, h("div.fmeta", h("span.tag", (PO.subInfo[S.temakor] || {}).nev || "")), h("div.panel-title", { style: { marginTop: "8px" } }, S.nev), h("p.small.muted", S.leiras))))]),
      PLANNED_SIMS.length ? [h("h2", "Következő szimulációk"), h("div.grid.g3", PLANNED_SIMS.map((n) => h("div.panel.card-link.disabled", { "aria-disabled": "true" }, h("div", n), h("div.fmeta", { style: { marginTop: "6px" } }, devTag()))))] : null);
  }
  function sim(id) {
    const S = PO.sims[id];
    if (!S) return notFound();
    const box = h("div");
    const el = page(h("a.small.muted", { href: "#labor", style: { textDecoration: "none" } }, "← Labor"), h("h1", { style: { marginTop: "8px" } }, S.nev), h("p.lead", S.leiras), box);
    const inst = S.mount(box);
    PO.store.update((s) => { s.last.sim = id; });
    return { el, destroy: () => inst.destroy() };
  }

  /* ================= GYAKORLÁS ================= */
  function gyakorlas() {
    let lvl = 0, only = "", tema = "";
    const list = h("div.grid");
    function render() {
      const st = PO.store.get();
      list.innerHTML = "";
      PO.tasks.filter((t) => (!tema || t.temakor === tema) && (!lvl || t.szint === lvl) && (!only || (only === "hibas" ? st.tasks[t.id] && !st.tasks[t.id].ok : !st.tasks[t.id]))).forEach((t) => list.append(PO.ui.taskCard(t)));
      if (!list.children.length) list.append(h("div.panel.muted", only === "hibas" ? "Nincs hibás feladat – szép munka!" : "Nincs ilyen feladat."));
    }
    const lvlSel = h("select", { "aria-label": "Nehézségi szint" }, [["0", "Minden szint"], ["1", "1 · Alapfogalmak"], ["2", "2 · Behelyettesítés"], ["3", "3 · Középszint"], ["4", "4 · Emelt"], ["5", "5 · Komplex emelt"]].map(([v, l]) => h("option", { value: v }, l)));
    lvlSel.addEventListener("change", () => { lvl = Number(lvlSel.value); render(); });
    const onlySel = h("select", { "aria-label": "Szűrés" }, [["", "Összes feladat"], ["uj", "Még nem próbált"], ["hibas", "Hibás – újragyakorlás"]].map(([v, l]) => h("option", { value: v }, l)));
    onlySel.addEventListener("change", () => { only = onlySel.value; render(); });
    const subsWithTasks = PO.topics.flatMap((T) => T.sub.filter(([id]) => PO.tasks.some((t) => t.temakor === id)).map(([id, nev]) => [id, `${T.nr}. ${nev} (${PO.tasks.filter((t) => t.temakor === id).length})`]));
    const temaSel = h("select", { "aria-label": "Témakör" }, h("option", { value: "" }, `Minden témakör (${PO.tasks.length})`), subsWithTasks.map(([v, l]) => h("option", { value: v }, l)));
    temaSel.addEventListener("change", () => { tema = temaSel.value; render(); });
    render();
    return page(
      h("div.eyebrow", "Gyakorlás"),
      h("h1", "Feladatbank"),
      h("div.row", { style: { gap: "8px", margin: "4px 0 10px" } }, h("span.btn.sm.primary", "Feladatbank"), h("a.btn.sm", { href: "#kartyak" }, "Képletkártyák"), h("a.btn.sm", { href: "#vizsga" }, "Próbavizsgák")),
      h("p.lead", "A számszerű válaszokat a program tényleges számítással, tűréssel ellenőrzi. Két fokozatú tipp és teljes megoldás minden feladathoz."),
      h("div.callout.small", h("div.callout-t", "Állapot"), `${PO.tasks.length} feladat ${subsWithTasks.length} alfejezetből. A képletek bemagolásához használd a Képletkártyákat.`),
      h("div.row", { style: { margin: "14px 0", flexWrap: "wrap" } }, temaSel, lvlSel, onlySel),
      list);
  }

  function meresek() { return PO.meresUI.list(); }
  function vizsga() {
    return PO.examUI.list();
  }
  function adatok() {
    const wrap = (tbl) => h("div", { style: { overflowX: "auto" } }, tbl);
    const rich = (t) => h("span", { html: PO.tex.rich(t) });
    const simpleTable = (head, rows) => wrap(h("table.data", head ? h("thead", h("tr", head.map((c) => h("th", c)))) : null,
      h("tbody", rows.map((r) => h("tr", r.map((c, i) => (i ? h("td", c) : h("td", { style: { color: "var(--c5)" } }, c))))))));

    /* --- állandók --- */
    const constTable = wrap(h("table.data",
      h("thead", h("tr", h("th", "Jel"), h("th", "Mennyiség"), h("th", "Érték"), h("th", "Számoláshoz"), h("th", "Hol kell?"))),
      h("tbody", PO.CONSTANTS.map((c) => h("tr",
        h("td", PO.tex.el(c.jel)),
        h("td", rich(c.nev), c.pontos ? h("div.small.muted", "definíció szerint pontos") : null),
        h("td", { style: { fontFamily: "var(--mono)", whiteSpace: "nowrap" } }, c.ertek + " " + c.egyseg),
        h("td", { style: { whiteSpace: "nowrap" } }, c.kerek),
        h("td.small", rich(c.alk), h("div", { style: { marginTop: "4px" } }, (c.kepletek || []).filter((id) => PO.formulaById[id]).map((id, i) => [i ? " · " : "", h("a", { href: "#keplet-" + id }, PO.formulaById[id].nev)]))))))));

    /* --- átváltó --- */
    const dims = Object.keys(PO.units).filter((k) => PO.units[k].list.length > 1).sort((a, b) => PO.units[a].nev.localeCompare(PO.units[b].nev, "hu"));
    const dimSel = h("select", { "aria-label": "Mennyiség" }, dims.map((k) => h("option", { value: k }, PO.units[k].nev)));
    dimSel.value = "energia";
    const valIn = h("input", { type: "text", inputmode: "decimal", value: "1", "aria-label": "Érték", style: { width: "140px" } });
    const fromSel = h("select", { "aria-label": "Miből" });
    const allOut = h("div");
    function fillUnits() {
      const u = PO.units[dimSel.value];
      fromSel.innerHTML = "";
      u.list.forEach((r) => fromSel.append(h("option", { value: r[0] }, r[0])));
      fromSel.value = dimSel.value === "energia" ? "kWh" : PO.unitDefault(dimSel.value);
      convert();
    }
    function convert() {
      const d = dimSel.value, u = PO.units[d];
      const x = PO.util.parseNum(valIn.value);
      allOut.innerHTML = "";
      if (!Number.isFinite(x)) { allOut.append(h("p.small.muted", "Adj meg egy számot (tizedesvessző vagy pont, normálalak pl. 3e8 vagy 3·10^8).")); return; }
      const si = PO.toSI(d, fromSel.value, x);
      allOut.append(wrap(h("table.data", h("tbody", u.list.map((r) => h("tr" + (r[0] === fromSel.value ? ".hl" : ""),
        h("td", { style: { fontFamily: "var(--mono)", textAlign: "right", width: "55%" } }, fmt(PO.fromSI(d, r[0], si), 5)),
        h("td", r[0], r[0] === u.si || (r[1] === 1 && !r[2]) ? h("span.tag", { style: { marginLeft: "8px" } }, "SI") : null)))))));
    }
    dimSel.addEventListener("change", fillUnits);
    fromSel.addEventListener("change", convert);
    valIn.addEventListener("input", convert);
    fillUnits();

    /* --- anyagjellemzők --- */
    const matBox = h("div");
    const showMat = (id) => { const M = PO.MATERIALS.find((m) => m.id === id); matBox.innerHTML = ""; matBox.append(simpleTable(M.oszlop, M.sorok)); };
    const matSeg = h("div.seg", { role: "group", "aria-label": "Táblázat", style: { flexWrap: "wrap" } });
    PO.MATERIALS.forEach((M, i) => {
      const b = h("button", { type: "button", "aria-pressed": String(i === 0) }, M.cim);
      b.addEventListener("click", () => { [...matSeg.children].forEach((c) => c.setAttribute("aria-pressed", "false")); b.setAttribute("aria-pressed", "true"); showMat(M.id); });
      matSeg.append(b);
    });
    showMat(PO.MATERIALS[0].id);

    const B = PO.BODIES;
    const jump = [["allandok", "Állandók"], ["atvalto", "Átváltó"], ["atvaltasok", "Hasznos átváltások"], ["anyagok", "Anyagjellemzők"], ["egitestek", "Égitestek"]];
    const sec = (id, title) => h("h2", { id: "adat-" + id, style: { scrollMarginTop: "16px" } }, title);
    return page(
      h("div.eyebrow", "Adatok"), h("h1", "Állandók, anyagjellemzők, mértékegységek"),
      h("p.lead", "Kikereshető adatok a számolásokhoz, kattintható kapcsolattal a képletekhez."),
      h("div.callout.small", h("div.callout-t", "Fontos a vizsgán"), "Írásbelin mindig a feladatban megadott vagy a függvénytáblázatban szereplő értékkel számolj – ezek néhány ezreléknyit eltérhetnek az itteni (CODATA 2018 / tankönyvi) értékektől. Ha a feladat g = 10 m/s²-et ad meg, azzal számolj."),
      h("div.btn-row", { style: { margin: "14px 0 0" } }, jump.map(([id, t]) => h("button.btn.sm.ghost", { type: "button", onclick: () => document.getElementById("adat-" + id).scrollIntoView({ behavior: "smooth" }) }, t))),
      sec("allandok", "Fizikai állandók"),
      h("div.panel", constTable),
      sec("atvalto", "Mértékegység-átváltó"),
      h("div.panel",
        h("div.row", { style: { flexWrap: "wrap", gap: "8px" } }, dimSel, valIn, fromSel),
        h("p.small.muted", { style: { margin: "8px 0" } }, "Az érték az összes egységben:"), allOut),
      sec("atvaltasok", "Hasznos átváltások"),
      h("div.panel", simpleTable(null, PO.UNIT_FACTS)),
      sec("anyagok", "Anyagjellemzők"),
      h("div.panel", matSeg, h("div", { style: { marginTop: "12px" } }, matBox), h("p.small.muted", { style: { marginTop: "8px" } }, "Szobahőmérsékleten, normál légnyomáson, ha másképp nincs jelölve.")),
      sec("egitestek", "Égitestek"),
      h("div.grid.g3",
        h("div.panel", h("div.panel-title", "Föld"), simpleTable(null, B.fold)),
        h("div.panel", h("div.panel-title", "Hold"), simpleTable(null, B.hold)),
        h("div.panel", h("div.panel-title", "Nap"), simpleTable(null, B.nap))),
      h("div.panel", h("div.panel-title", "A Naprendszer bolygói"), simpleTable(B.bolygok.oszlop, B.bolygok.sorok),
        h("p.small.muted", { style: { marginTop: "8px" } }, "Ellenőrizd Kepler III. törvényét: a pályasugár köbének és a keringési idő négyzetének aránya (CSE³/év²) minden bolygóra ≈ 1. ", h("a", { href: "#keplet-kepler3" }, "Kepler III. törvénye →"))),
      h("div.panel", h("div.panel-title", "Csillagászati és kozmológiai adatok"), simpleTable(null, B.egyeb)));
  }

  function notFound() {
    return page(h("h1", "Nincs ilyen oldal"), h("p", h("a", { href: "#kezdolap" }, "Vissza a kezdőlapra")));
  }

  function kartyak() { return PO.cardsUI.page(); }
  PO.pages = { kartyak, kezdolap, tananyag, tema, kepletter, keplet, labor, sim, gyakorlas, meresek, vizsga, adatok, notFound };
})(typeof globalThis !== "undefined" ? globalThis : this);
