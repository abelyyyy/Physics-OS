/* PHYSICS OS — Mérések menü: a 20 szóbeli mérés leírása + adatfeldolgozó (illesztés, átlag, számolás) */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const { h, fmt, parseNum } = PO.util;

  const page = (...c) => h("div.page", ...c);
  const rich = (t) => h("span", { html: PO.tex.rich(t) });
  const getSaved = (id) => (PO.store.get().meresek || {})[id];
  const save = (id, data) => PO.store.update((s) => { s.meresek = s.meresek || {}; s.meresek[id] = data; });

  function list() {
    const byTheme = PO.topics.map((T) => [T, PO.MERESEK.filter((M) => (PO.subInfo[M.temakor] || {}).tema === T.id)]).filter(([, l]) => l.length);
    return page(
      h("div.eyebrow", "Mérések"), h("h1", "Szóbeli mérések (A feladat)"),
      h("p.lead", "A 20 emelt szintű mérési feladat: cél, eszközök, elmélet, lépések, hibaforrások – és mindegyikhez adatfeldolgozó, amely a mért értékeidből egyenest illeszt, grafikont rajzol és kiszámolja a végeredményt."),
      h("div.callout.small", h("div.callout-t", "Melyik évi lista?"), "A 2026. tavaszi vizsgaidőszak mérései (forrás: a vizsgát szervező kormányhivatalok által közzétett eszközlista). Az Oktatási Hivatal a listát évente részben cseréli – a saját vizsgaéved listáját mindig ellenőrizd az oktatas.hu oldalon."),
      byTheme.map(([T, l]) => [h("h2", `${T.nr}. ${T.nev}`), h("div.grid.g2", l.map((M) => {
        const saved = getSaved(M.id);
        return h("a.panel.card-link", { href: "#meres-" + M.id },
          h("div.fmeta", h("span.tag", { style: { fontFamily: "var(--mono)" } }, String(M.nr).padStart(2, "0")), h("span.tag", { fit: "Egyenesillesztés", avg: "Átlagolás", calc: "Számolás" }[M.kiertekeles.tipus]), saved ? h("span.tag.solid", "Saját adatok") : null),
          h("div.panel-title", { style: { marginTop: "8px" } }, M.cim), h("p.small.muted", M.cel));
      }))]));
  }

  function numInput(value, label, onChange, w) {
    const inp = h("input", { type: "text", inputmode: "decimal", value: value == null ? "" : String(value).replace(".", ","), "aria-label": label, style: { width: w || "100%" } });
    inp.addEventListener("input", () => { const v = parseNum(inp.value); inp.classList.toggle("invalid", inp.value.trim() !== "" && !Number.isFinite(v)); onChange(v); });
    return inp;
  }
  const resTable = (rows) => h("table.data", h("tbody", rows.map(([a, b, c]) => h("tr", h("td", rich(a)), h("td", { style: { fontFamily: "var(--mono)", textAlign: "right", whiteSpace: "nowrap" } }, b), h("td.muted", c || "")))));

  function evaluator(M) {
    const K = M.kiertekeles;
    const box = h("div");
    const out = h("div");
    let plot = null;

    if (K.tipus === "calc") {
      const saved = getSaved(M.id);
      const v = Object.fromEntries(K.be.map(([k, , , d]) => [k, saved && Number.isFinite(saved[k]) ? saved[k] : d]));
      const render = () => { out.innerHTML = ""; if (K.be.some(([k]) => !Number.isFinite(v[k]))) { out.append(h("p.small.muted", "Tölts ki minden mezőt.")); return; } out.append(resTable(K.szamol(v))); };
      box.append(h("div.grid.g2", { style: { gap: "10px" } }, K.be.map(([k, lab, unit]) => h("label.small", h("div.muted", { style: { marginBottom: "4px" } }, rich(lab), unit ? ` [${unit}]` : ""), numInput(v[k], lab, (x) => { v[k] = x; save(M.id, Object.assign({}, v)); render(); })))),
        h("div.btn-row", { style: { margin: "10px 0" } }, h("button.btn.sm.ghost", { type: "button", onclick: () => { save(M.id, null); PO.router.go("meres-" + M.id, true); } }, "Mintaértékek visszaállítása")), out);
      render();
      return { el: box, destroy() {} };
    }

    // fit / avg: szerkeszthető táblázat
    const saved = getSaved(M.id);
    let rows = saved && saved.rows ? saved.rows.map((r) => r.slice()) : K.minta.map((r) => r.slice());
    const param = Object.fromEntries((K.param || []).map(([k, , , d]) => [k, saved && saved.param && Number.isFinite(saved.param[k]) ? saved.param[k] : d]));
    const persist = () => save(M.id, { rows, param });
    const tbody = h("tbody");
    const rowObj = (r) => Object.fromEntries(K.oszlopok.map(([k], i) => [k, r[i]]));
    const valid = (r) => r.every((x) => Number.isFinite(x));

    function drawTable() {
      tbody.innerHTML = "";
      rows.forEach((r, i) => tbody.append(h("tr",
        h("td.muted", { style: { width: "28px", fontFamily: "var(--mono)" } }, String(i + 1)),
        K.oszlopok.map(([, lab], j) => h("td", numInput(r[j], lab + " (" + (i + 1) + ". sor)", (x) => { rows[i][j] = x; persist(); compute(); }))),
        K.tipus === "avg" ? h("td.rowval", { style: { fontFamily: "var(--mono)", textAlign: "right" } }) : null,
        h("td", { style: { width: "36px" } }, h("button.btn.sm.ghost", { type: "button", "aria-label": "Sor törlése", onclick: () => { rows.splice(i, 1); persist(); drawTable(); compute(); } }, "×")))));
    }
    function compute() {
      out.innerHTML = "";
      const good = rows.filter(valid).map(rowObj);
      if (K.tipus === "avg") {
        const vals = good.map((r) => K.ertek(r));
        [...tbody.querySelectorAll(".rowval")].forEach((td, i) => { const r = rows[i]; td.textContent = valid(r) ? fmt(K.ertek(rowObj(r)), 4) : "—"; });
        if (!vals.length) { out.append(h("p.small.muted", "Adj meg legalább egy teljes sort.")); return; }
        const mean = vals.reduce((a, b) => a + b, 0) / vals.length, dev = Math.max(...vals.map((x) => Math.abs(x - mean)));
        out.append(resTable([[`${K.ertekNev} átlaga`, fmt(mean, 4), K.ertekEgyseg], ["Legnagyobb eltérés az átlagtól", fmt(dev, 2), K.ertekEgyseg], ["Relatív hiba", fmt((100 * dev) / Math.abs(mean), 2), "%"], ["Eredmény", `${fmt(mean, 3)} ± ${fmt(dev, 1)}`, K.ertekEgyseg]]));
        return;
      }
      const pts = good.map((r) => [K.X(r, param), K.Y(r, param)]).filter((p) => Number.isFinite(p[0]) && Number.isFinite(p[1]));
      const f = PO.linFit(pts, K.origo);
      if (!f) { out.append(h("p.small.muted", "Legalább két érvényes mérési pont kell az illesztéshez.")); if (plot) plot.set([]); return; }
      const xs = pts.map((p) => p[0]);
      let lo = Math.min(...xs), hi = Math.max(...xs);
      if (K.origo) { lo = Math.min(lo, 0); hi = Math.max(hi, 0); }
      const pad = (hi - lo) * 0.08 || 1;
      plot.set([{ name: "mért pontok", points: pts, scatter: true }, { name: "illesztett egyenes", fn: (x) => f.m * x + f.b, domain: [lo - pad, hi + pad], samples: 2 }]);
      const base = [[K.origo ? "Illesztés: y = m·x (origón át)" : "Illesztés: y = m·x + b", "", ""], ["Meredekség m", fmt(f.m, 4), ""]];
      if (!K.origo) base.push(["Tengelymetszet b", fmt(f.b, 4), ""]);
      base.push(["R² (illeszkedés)", fmt(f.r2, 5), f.r2 > 0.995 ? "kiváló" : f.r2 > 0.98 ? "jó" : "nézd át a pontokat"]);
      out.append(resTable(base.concat(K.eredmeny(f, param))));
    }

    if (K.param) box.append(h("div.grid.g2", { style: { gap: "10px", marginBottom: "10px" } }, K.param.map(([k, lab, unit]) => h("label.small", h("div.muted", { style: { marginBottom: "4px" } }, rich(lab), unit ? ` [${unit}]` : ""), numInput(param[k], lab, (x) => { param[k] = x; persist(); compute(); })))));
    const table = h("div", { style: { overflowX: "auto" } }, h("table.data.meas-table", h("thead", h("tr", h("th", "#"), K.oszlopok.map(([, lab, unit]) => h("th", rich(lab), unit ? h("span.muted", ` [${unit}]`) : null)), K.tipus === "avg" ? h("th", { style: { textAlign: "right" } }, rich(K.ertekNev), ` [${K.ertekEgyseg}]`) : null, h("th"))), tbody));
    box.append(table,
      h("div.btn-row", { style: { margin: "10px 0" } },
        h("button.btn.sm", { type: "button", onclick: () => { rows.push(K.oszlopok.map(() => NaN)); persist(); drawTable(); const ins = tbody.querySelectorAll("input"); ins[ins.length - K.oszlopok.length].focus(); } }, "+ Új sor"),
        h("button.btn.sm.ghost", { type: "button", onclick: () => { rows = K.minta.map((r) => r.slice()); persist(); drawTable(); compute(); } }, "Mintaadatok"),
        h("button.btn.sm.ghost", { type: "button", onclick: () => { rows = [K.oszlopok.map(() => NaN)]; persist(); drawTable(); compute(); } }, "Táblázat ürítése")));
    if (K.tipus === "fit") {
      const pbox = h("div");
      box.append(h("div.small.muted", { style: { margin: "8px 0 4px" } }, "Linearizált grafikon"), pbox);
      plot = PO.plot(pbox, { height: 240, noHint: true, xLabel: K.xLabel, xUnit: K.xUnit, yLabel: K.yLabel, yUnit: K.yUnit });
    }
    box.append(h("div", { style: { marginTop: "10px" } }, out));
    drawTable();
    compute();
    return { el: box, destroy() { plot && plot.destroy(); } };
  }

  function meres(id) {
    const M = PO.MERESEK.find((x) => x.id === id);
    if (!M) return PO.pages.notFound();
    const ev = evaluator(M);
    const sub = PO.subInfo[M.temakor];
    const idx = PO.MERESEK.indexOf(M), prev = PO.MERESEK[idx - 1], next = PO.MERESEK[idx + 1];
    const el = page(
      h("a.small.muted", { href: "#meresek", style: { textDecoration: "none" } }, "← Mérések"),
      h("div.eyebrow", { style: { marginTop: "10px" } }, `${M.nr}. mérés`),
      h("h1", M.cim),
      h("div.fmeta", { style: { margin: "4px 0 16px" } }, sub ? h("a.tag", { href: "#tema-" + M.temakor }, "Tananyag: " + sub.nev) : null),
      h("div.meas-layout",
        h("div",
          h("div.panel", h("div.panel-title", "Cél"), h("p", rich(M.cel))),
          h("div.panel", h("div.panel-title", "Eszközök"), h("p.small", M.eszkozok)),
          h("div.panel", h("div.panel-title", "Elmélet és kiértékelés"), h("div.prose", { html: PO.tex.html(M.elmelet) })),
          h("div.panel", h("div.panel-title", "A mérés menete"), h("ol.small", M.lepesek.map((l) => h("li", rich(l))))),
          h("div.panel", h("div.panel-title", "Hibaforrások, amikre a vizsgáztató rákérdezhet"), h("ul.small", M.hibak.map((l) => h("li", rich(l)))))),
        h("div", h("div.panel.meas-eval", h("div.panel-title", "Adatfeldolgozó"), h("p.small.muted", "Írd be a saját mért értékeidet (tizedesvessző is jó) – az eredmény azonnal frissül, és a böngésződ megjegyzi."), ev.el))),
      h("div.row", { style: { marginTop: "18px", justifyContent: "space-between" } },
        prev ? h("a.btn.ghost", { href: "#meres-" + prev.id }, "← " + prev.nr + ". mérés") : h("span"),
        next ? h("a.btn.ghost", { href: "#meres-" + next.id }, next.nr + ". mérés →") : h("span")));
    PO.store.update((s) => { s.last.meres = id; });
    return { el, destroy: ev.destroy };
  }

  PO.meresUI = { list, meres };
})(typeof globalThis !== "undefined" ? globalThis : this);
