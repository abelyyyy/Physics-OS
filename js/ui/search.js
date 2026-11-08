/* PHYSICS OS — globális kereső (Ctrl+K): témakörök, képletek, mennyiségek, szimulációk, feladatok, oldalak */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const { h, norm } = PO.util;

  /** Képlet teljes kereshető szövege (ékezet nélkül). */
  PO.searchText = (f) => norm([
    f.nev, f.fejezet, f.kulcsszavak, f.jelentes, f.tex.replace(/\\[a-z]+/gi, (m) => " " + m.slice(1) + " "),
    ...Object.values(f.vars).map((v) => `${v.nev} ${v.tex.replace(/\\/g, " ")} ${PO.units[v.dim].si} ${PO.units[v.dim].list.map((r) => r[0]).join(" ")}`),
    f.szint === "emelt" ? "emelt" : "kozep",
  ].join(" ")).replace(/[{}_^]/g, " ") + " " + greek(f);
  function greek(f) {
    const map = { alpha: "α", beta: "β", omega: "ω", varphi: "φ", Delta: "Δ", pi: "π" };
    return Object.entries(map).filter(([k]) => f.tex.includes("\\" + k) || Object.values(f.vars).some((v) => v.tex.includes("\\" + k))).map(([, g]) => g).join(" ");
  }

  let index = null;
  function build() {
    const items = [];
    const pages = [["kezdolap", "Kezdőlap", "haladás statisztika mentés"], ["tananyag", "Tananyag", "témakörök"], ["kepletter", "Képlettár", "képletek kalkulátor"], ["labor", "Labor", "szimulációk"], ["meresek", "Mérések", "szóbeli mérési feladatok"], ["gyakorlas", "Gyakorlás", "feladatbank feladatok"], ["vizsga", "Vizsga", "érettségi szimulátor írásbeli szóbeli"], ["adatok", "Adatok", "állandók mértékegységek átváltás"]];
    pages.forEach(([id, t, k]) => items.push({ kind: "Oldal", title: t, href: "#" + id, hay: norm(t + " " + k) }));
    PO.topics.forEach((T) => T.sub.forEach(([id, nev]) => {
      const ready = !!PO.topicPages[id];
      items.push({ kind: "Témakör", title: nev, sub: `${T.nr}. ${T.nev}${ready ? "" : " · fejlesztés alatt"}`, href: ready ? "#tema-" + id : null, hay: norm(`${nev} ${T.nev} ${ready ? PO.topicPages[id].kulcsszavak : ""}`) });
    }));
    Object.values(PO.topicPages).forEach((T) => T.sections.forEach((S) => {
      if (!S.html) return;
      const heads = [...S.html.matchAll(/<h3>(.*?)<\/h3>/g)].map((m) => m[1].replace(/<[^>]+>/g, "").replace(/^\d+\.\s*/, ""));
      heads.forEach((hd) => items.push({ kind: "Fejezet", title: hd, sub: T.nev + " · " + S.cim, href: "#tema-" + T.id, hay: norm(hd + " " + T.nev) }));
    }));
    PO.formulas.forEach((f) => items.push({ kind: "Képlet", title: f.nev, sub: `${(PO.subInfo[f.temakor] || {}).temaNev || ""} · ${f.fejezet}`, href: "#keplet-" + f.id, tex: f.tex, hay: PO.searchText(f), boost: norm(f.kulcsszavak) }));
    (PO.MERESEK || []).forEach((M) => items.push({ kind: "Mérés", title: `${M.nr}. ${M.cim}`, sub: "Szóbeli mérés · adatfeldolgozó", href: "#meres-" + M.id, hay: norm(`${M.cim} meres szobeli ${M.eszkozok} ${M.cel}`) }));
    items.push({ kind: "Oldal", title: "Képletkártyák", sub: "Gyakorlás · ismétlő rendszer", href: "#kartyak", hay: norm("kepletkartyak kartya flashcard ismetles leitner memorizalas") });
    (PO.CONSTANTS || []).forEach((c) => items.push({ kind: "Állandó", title: c.nev.replace(/\$[^$]*\$/g, "").trim(), sub: `${c.kerek} · Adatok`, href: "#adatok", tex: c.jel, hay: norm(`${c.nev} ${c.jel} allando ${c.alk}`) }));
    (PO.MATERIALS || []).forEach((M) => items.push({ kind: "Táblázat", title: M.cim, sub: "Anyagjellemzők · Adatok", href: "#adatok", hay: norm(`${M.cim} ${M.sorok.map((r) => r[0]).join(" ")} anyagjellemzo tablazat`) }));
    items.push({ kind: "Eszköz", title: "Mértékegység-átváltó", sub: "Adatok", href: "#adatok", hay: norm("mertekegyseg atvalto atvaltas egyseg konverter") });
    items.push({ kind: "Táblázat", title: "Égitestek adatai (Föld, Hold, Nap, bolygók)", sub: "Adatok", href: "#adatok", hay: norm("egitest fold hold nap bolygok tomeg sugar keringesi ido naprendszer") });
    Object.values(PO.sims).forEach((s) => items.push({ kind: "Szimuláció", title: s.nev, sub: "Labor", href: "#sim-" + s.id, hay: norm(s.nev + " " + s.kulcsszavak + " " + s.leiras) }));
    (PO.exams || []).forEach((E) => {
      items.push({ kind: "Vizsga", title: `Próbavizsga – ${E.cim}`, sub: E.datum + " · emelt szintű írásbeli", href: "#vizsga-" + E.id, hay: norm(`probavizsga vizsga erettsegi ${E.cim} ${E.II.temak.map((t) => t.cim).join(" ")}`) });
      E.I.forEach((q) => items.push({ kind: "Vizsgakérdés", title: q.szoveg.replace(/^\d+\.\s*/, "").slice(0, 90) + "…", sub: `${E.cim} · I/${q.nr}`, href: "#vizsga-" + E.id, hay: norm(q.szoveg) }));
      E.II.temak.forEach((t) => items.push({ kind: "Témakifejtés", title: t.cim, sub: `${E.cim} · II/${t.nr}`, href: "#vizsga-" + E.id, hay: norm(t.cim + " " + t.szoveg) }));
      E.III.forEach((p) => items.push({ kind: "Vizsgafeladat", title: p.szoveg.replace(/^\d+\.\s*/, "").slice(0, 90) + "…", sub: `${E.cim} · III/${p.nr}`, href: "#vizsga-" + E.id, hay: norm(p.szoveg) }));
    });
    PO.tasks.forEach((t) => items.push({ kind: "Feladat", title: t.cim, sub: `Szint ${t.szint} · Gyakorlás`, href: "#gyakorlas", hay: norm(t.cim + " " + t.szoveg.replace(/<[^>]+>|\\[a-z]+|[$]/gi, " ")) }));
    return items;
  }

  function query(q) {
    index = index || build();
    const words = norm(q).split(" ").filter(Boolean);
    if (!words.length) return [];
    const res = [];
    for (const it of index) {
      if (!words.every((w) => it.hay.includes(w))) continue;
      const t = norm(it.title);
      let score = 0;
      words.forEach((w) => { if (t.startsWith(w)) score += 6; else if (t.includes(w)) score += 4; else if (it.boost && it.boost.includes(w)) score += 3; else score += 1; });
      if (it.kind === "Képlet") score += 0.5;
      if (!it.href) score -= 3;
      res.push([score, it]);
    }
    return res.sort((a, b) => b[0] - a[0]).slice(0, 40).map((r) => r[1]);
  }

  function init() {
    const input = h("input", { type: "search", placeholder: "Keress témát, képletet, mennyiséget, mértékegységet…", "aria-label": "Globális keresés", autocomplete: "off" });
    const results = h("div.search-results", { role: "listbox" });
    const box = h("div.search-box", { role: "dialog", "aria-label": "Keresés" }, input, results);
    const ov = h("div.po-overlay", box);
    document.body.append(ov);
    let sel = 0, items = [];
    function render() {
      items = query(input.value);
      results.innerHTML = "";
      if (!input.value.trim()) { results.append(h("div.search-empty", "Például: „szabadesés”, „ω”, „m/s²”, „fékút”, „centripetális”, „hajítás”.")); return; }
      if (!items.length) { results.append(h("div.search-empty", "Nincs találat.")); return; }
      sel = Math.min(sel, items.length - 1);
      items.forEach((it, i) => {
        const a = h(it.href ? "a.sr" : "div.sr", { href: it.href || null, role: "option", "aria-selected": String(i === sel), "aria-disabled": it.href ? null : "true", style: it.href ? null : { opacity: 0.5, cursor: "default" } },
          h("span.sr-kind", it.kind), h("span", h("div", it.title), it.sub ? h("div.sr-sub", it.sub) : null), it.tex ? h("span.sr-tex", PO.tex.el(it.tex)) : null);
        if (it.href) a.addEventListener("click", close);
        a.addEventListener("mousemove", () => { if (sel !== i) { sel = i; mark(); } });
        results.append(a);
      });
    }
    function mark() { [...results.children].forEach((c, i) => c.setAttribute("aria-selected", String(i === sel))); const c = results.children[sel]; c && c.scrollIntoView && c.scrollIntoView({ block: "nearest" }); }
    function open() { ov.classList.add("open"); input.value = ""; sel = 0; render(); setTimeout(() => input.focus(), 10); }
    function close() { ov.classList.remove("open"); }
    input.addEventListener("input", () => { sel = 0; render(); });
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(items.length - 1, sel + 1); mark(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(0, sel - 1); mark(); }
      else if (e.key === "Enter") { const it = items[sel]; if (it && it.href) { location.hash = it.href; close(); } }
    });
    ov.addEventListener("click", (e) => { if (e.target === ov) close(); });
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); ov.classList.contains("open") ? close() : open(); }
      else if (e.key === "Escape" && ov.classList.contains("open")) close();
      else if (e.key === "/" && !/input|textarea|select/i.test(document.activeElement.tagName) && !ov.classList.contains("open")) { e.preventDefault(); open(); }
    });
    PO.search = { open, close, query };
  }
  PO.searchInit = init;
  PO.searchQuery = query;
})(typeof globalThis !== "undefined" ? globalThis : this);
