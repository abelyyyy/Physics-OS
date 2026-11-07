/* PHYSICS OS — képletkártyák Leitner-féle ismétlő rendszerrel
 * Minden képlet egy kártya. Doboz 0 = új; helyes válasz után a következő dobozba kerül,
 * hibás után vissza az 1-esbe. Ismétlési időközök (nap): 1→0, 2→1, 3→3, 4→7, 5→16. */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const { h } = PO.util;
  const DAY = 86400000;
  const INTERVAL = [0, 0, 1, 3, 7, 16];

  const cardOf = (id) => (PO.store.get().cards || {})[id] || { box: 0, due: 0 };
  function grade(id, ok) {
    PO.store.update((s) => {
      s.cards = s.cards || {};
      const c = s.cards[id] || { box: 0, due: 0 };
      const box = ok ? (c.box === 0 ? 2 : Math.min(5, c.box + 1)) : 1;
      s.cards[id] = { box, due: Date.now() + INTERVAL[box] * DAY, last: Date.now(), n: (c.n || 0) + 1 };
    });
  }
  /** A pakli sorrendje: lejárt (ismétlendő) kártyák a legalacsonyabb dobozzal elöl, majd az újak. */
  function queue(filter) {
    const now = Date.now();
    const list = PO.formulas.filter(filter).map((f) => [f, cardOf(f.id)]);
    const due = list.filter(([, c]) => c.box > 0 && c.due <= now).sort((a, b) => a[1].box - b[1].box || a[1].due - b[1].due);
    const fresh = list.filter(([, c]) => c.box === 0);
    return { due: due.map((x) => x[0]), fresh: fresh.map((x) => x[0]), all: list };
  }

  function page() {
    let tema = "", szint = "", mode = "due";
    let q = [], cur = null, flipped = false, done = 0;
    const stage = h("div");
    const stats = h("div");
    const filter = (f) => (!tema || (PO.subInfo[f.temakor] || {}).tema === tema) && (!szint || f.szint === szint);

    const temaSel = h("select", { "aria-label": "Témakör" }, h("option", { value: "" }, "Minden témakör"), PO.topics.filter((T) => PO.formulas.some((f) => (PO.subInfo[f.temakor] || {}).tema === T.id)).map((T) => h("option", { value: T.id }, `${T.nr}. ${T.nev}`)));
    const szintSel = h("select", { "aria-label": "Szint" }, h("option", { value: "" }, "Közép + emelt"), h("option", { value: "kozep" }, "Csak középszintű"), h("option", { value: "emelt" }, "Csak emelt"));
    temaSel.addEventListener("change", () => { tema = temaSel.value; start(); });
    szintSel.addEventListener("change", () => { szint = szintSel.value; start(); });

    function paintStats() {
      const Q = queue(filter);
      const boxes = [0, 1, 2, 3, 4, 5].map((b) => Q.all.filter(([, c]) => c.box === b).length);
      stats.innerHTML = "";
      stats.append(h("div.leitner", boxes.map((n, b) => h("div.lbox" + (b === 0 ? ".new" : ""), h("div.v", String(n)), h("div.k", b === 0 ? "új" : b + ". doboz")))),
        h("p.small.muted", { style: { marginTop: "8px" } }, `Ma esedékes ismétlés: ${Q.due.length} · új kártya: ${Q.fresh.length} · ebben a körben megoldva: ${done}`));
    }
    function start() {
      const Q = queue(filter);
      q = mode === "due" ? Q.due.concat(Q.fresh.slice(0, 15)) : Q.all.map((x) => x[0]).sort(() => Math.random() - 0.5);
      next();
    }
    function next() {
      flipped = false;
      cur = q.shift() || null;
      paint();
    }
    function paint() {
      paintStats();
      stage.innerHTML = "";
      if (!cur) {
        stage.append(h("div.panel.flashcard.empty", h("div.panel-title", "Mára végeztél ezzel a paklival! 🎉"),
          h("p.muted", "A legközelebbi ismétlés akkor jön, amikor a kártyák esedékessé válnak. Gyakorolhatsz tovább az összes kártyával is."),
          h("button.btn", { type: "button", onclick: () => { mode = "all"; start(); } }, "Összes kártya véletlen sorrendben")));
        return;
      }
      const F = cur, c = cardOf(F.id), sub = PO.subInfo[F.temakor] || {};
      const front = h("div.fc-front",
        h("div.fmeta", h("span.tag", sub.nev || ""), h("span.tag", F.szint === "emelt" ? "emelt" : "közép"), h("span.tag", c.box ? c.box + ". doboz" : "új")),
        h("div.fc-q", F.nev),
        h("p.small.muted", "Írd fel fejben (vagy papíron) a képletet, a jelölések jelentését és az érvényesség feltételét – aztán fordítsd meg a kártyát."));
      const back = h("div.fc-back",
        h("div.fc-formula", PO.tex.el(F.tex, true)),
        h("table.data.small", h("tbody", Object.values(F.vars).map((v) => h("tr", h("td", { style: { width: "60px" } }, PO.tex.el(v.tex)), h("td", v.nev), h("td.muted", PO.unitDefault ? PO.unitDefault(v.dim) : ""))))),
        h("p.small", h("strong", "Feltétel: "), h("span", { html: PO.tex.rich(F.feltetel) })),
        h("p.small.muted", { html: PO.tex.rich(F.jelentes) }),
        h("a.small", { href: "#keplet-" + F.id }, "Adatlap és kalkulátor →"));
      back.hidden = !flipped;
      const flipBtn = h("button.btn.primary", { type: "button", onclick: () => { flipped = true; back.hidden = false; flipBtn.remove(); gradeRow.hidden = false; } }, "Megfordítás (szóköz)");
      const gradeRow = h("div.btn-row",
        h("button.btn", { type: "button", onclick: () => { grade(F.id, false); q.push(F); done++; next(); } }, "✗ Nem tudtam (1)"),
        h("button.btn.primary", { type: "button", onclick: () => { grade(F.id, true); done++; next(); } }, "✓ Tudtam (2)"));
      gradeRow.hidden = !flipped;
      stage.append(h("div.panel.flashcard", front, back, h("div", { style: { marginTop: "14px" } }, flipped ? null : flipBtn, gradeRow)),
        h("p.small.muted", { style: { marginTop: "6px" } }, `Hátralévő kártya ebben a körben: ${q.length}`));
    }
    const onKey = (e) => {
      if (!cur || /input|select|textarea/i.test((e.target.tagName || ""))) return;
      if (e.key === " " && !flipped) { e.preventDefault(); stage.querySelector(".btn.primary").click(); }
      else if (flipped && e.key === "1") stage.querySelectorAll(".btn-row .btn")[0].click();
      else if (flipped && e.key === "2") stage.querySelectorAll(".btn-row .btn")[1].click();
    };
    document.addEventListener("keydown", onKey);
    start();
    const el = h("div.page",
      h("div.eyebrow", h("a", { href: "#gyakorlas", style: { color: "inherit" } }, "Gyakorlás"), " · Képletkártyák"),
      h("h1", "Képletkártyák"),
      h("p.lead", "Ismétlő rendszer: amit tudsz, ritkábban kérdezi, amit nem, hamar visszahozza. Napi 10–15 perc elég, hogy a vizsgára minden képlet és feltétele biztosan meglegyen."),
      h("div.row", { style: { margin: "12px 0", flexWrap: "wrap" } }, temaSel, szintSel),
      stats, stage,
      h("details.small", { style: { marginTop: "14px" } }, h("summary", "Hogyan működik?"), h("p.muted", "Minden képlet egy kártya. Ha tudtad, egy dobozzal feljebb kerül, és csak később jön újra (1., 2. doboz: még ma / holnap, 3.: 3 nap, 4.: 1 hét, 5.: 16 nap). Ha nem tudtad, visszakerül az 1. dobozba, és ebben a körben még egyszer előjön. Egy körben legfeljebb 15 új kártyát kapsz.")));
    return { el, destroy() { document.removeEventListener("keydown", onKey); } };
  }

  PO.cardsUI = { page, queue, grade, INTERVAL };
})(typeof globalThis !== "undefined" ? globalThis : this);
