/* PHYSICS OS — újrahasznosítható felületi elemek: képletkártya, képletadatlap, feladat */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const { h, parseNum, fmt } = PO.util;

  const ICON = {
    star: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 2.8l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L2.8 8.1l5-.7z"/></svg>',
    starOn: '<svg viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1.5"><path d="M10 2.8l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L2.8 8.1l5-.7z"/></svg>',
    copy: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="6" width="10" height="11" rx="2"/><path d="M4 13V4a1 1 0 0 1 1-1h8"/></svg>',
  };
  PO.ICON = ICON;

  const szintTag = (s) => h("span.tag", s === "emelt" ? "Emelt" : "Közép");
  const statusLabel = { tanulom: "Tanulom", tudom: "Tudom" };

  function favButton(id) {
    const on = () => !!PO.store.get().favorites[id];
    const b = h("button.icon-btn", { type: "button", title: "Kedvenc", "aria-label": "Kedvencekhez", "aria-pressed": String(on()), html: on() ? ICON.starOn : ICON.star });
    b.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation();
      PO.store.update((s) => { s.favorites[id] ? delete s.favorites[id] : (s.favorites[id] = true); });
      b.setAttribute("aria-pressed", String(on())); b.innerHTML = on() ? ICON.starOn : ICON.star;
    });
    return b;
  }

  function copyButton(text, label = "Képlet másolása (LaTeX)") {
    const b = h("button.icon-btn", { type: "button", title: label, "aria-label": label, html: ICON.copy });
    b.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation();
      (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(() => PO.toast("Képlet a vágólapon (LaTeX)"), () => PO.toast("A másolás nem sikerült"));
    });
    return b;
  }

  /** Kártya a képlettár listájához. */
  function formulaCard(F) {
    const st = PO.store.get().formulas[F.id];
    const card = h("a.panel.card-link.formula-card", { href: "#keplet-" + F.id },
      h("div.fhead", h("div.fname", F.nev), h("span.spacer"), favButton(F.id)),
      h("div.ftex", PO.tex.el(F.tex)),
      h("div.fmeta", szintTag(F.szint), h("span.tag", F.fejezet), st ? h("span.tag.solid", statusLabel[st]) : null, F.sim ? h("span.tag", "szimuláció") : null));
    return card;
  }

  /** Teljes képletadatlap kalkulátorral. */
  function formulaSheet(F) {
    const s = PO.store.get();
    const statusSeg = h("div.seg", { role: "group", "aria-label": "Tanulási állapot" });
    [["", "Nincs jelölve"], ["tanulom", "Tanulom"], ["tudom", "Tudom"]].forEach(([k, lab]) => {
      const b = h("button", { type: "button", "aria-pressed": String((s.formulas[F.id] || "") === k) }, lab);
      b.addEventListener("click", () => {
        PO.store.update((st) => { k ? (st.formulas[F.id] = k) : delete st.formulas[F.id]; });
        [...statusSeg.children].forEach((c) => c.setAttribute("aria-pressed", "false")); b.setAttribute("aria-pressed", "true");
      });
      statusSeg.append(b);
    });
    const verified = h("label.row.small", { style: { cursor: "pointer" } },
      h("input", { type: "checkbox", checked: !!s.verified[F.id], onchange: (e) => PO.store.update((st) => { e.target.checked ? (st.verified[F.id] = true) : delete st.verified[F.id]; }) }),
      "Ellenőriztem a függvénytáblázattal / tankönyvvel");

    const sym = h("dl.symbols", Object.entries(F.vars).flatMap(([k, v]) => [
      h("dt", PO.tex.el(v.tex)), h("dd", v.nev), h("dd.unit", PO.units[v.dim].si || "–"),
    ]));
    const rearr = h("div.grid", { style: { gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "6px" } },
      Object.values(F.solve).map((S) => h("div", { style: { padding: "4px 0" } }, PO.tex.el(S.tex, true))));
    const related = F.kapcsolodo.map((id) => PO.formulaById[id]).filter(Boolean);
    const sim = F.sim && PO.sims[F.sim];

    return h("div",
      h("div.eyebrow", `Képlettár · ${F.fejezet}`),
      h("div.row", h("h1", F.nev), h("span.spacer"), favButton(F.id), copyButton(F.tex)),
      h("div.fmeta", { style: { marginBottom: "14px" } }, szintTag(F.szint), h("a.tag", { href: "#kepletter", onclick: () => { PO.kepletterTema = (PO.subInfo[F.temakor] || {}).tema || ""; } }, (PO.subInfo[F.temakor] || {}).nev || F.temakor), F.fgvt ? h("span.tag", "a függvénytáblázatban is") : null),
      h("div.panel.formula-big", { style: { textAlign: "center", padding: "26px 16px" } }, PO.tex.el(F.tex, true)),
      h("div.row", { style: { margin: "12px 0 4px" } }, statusSeg, h("span.spacer"), verified),
      h("div.grid.g2", { style: { marginTop: "14px" } },
        h("div.panel", h("div.panel-title", "Fizikai jelentés"), h("p", { html: PO.tex.rich(F.jelentes) }),
          h("div.panel-title", { style: { marginTop: "14px" } }, "Jelölések és SI-egységek"), sym),
        h("div.panel", h("div.panel-title", "Mikor használható?"), h("p", { html: PO.tex.rich(F.feltetel) }),
          h("div.panel-title", { style: { marginTop: "14px" } }, "Mikor nem?"), h("p", { html: PO.tex.rich(F.nem) }),
          h("div.panel-title", { style: { marginTop: "14px" } }, "Tipikus hiba"), h("p", { html: PO.tex.rich(F.hiba) }))),
      h("div.panel", h("div.panel-title", "Kalkulátor"), PO.calc.calculator(F)),
      h("div.panel", h("div.panel-title", "Algebrai átrendezések"), rearr),
      h("div.panel", h("div.panel-title", "Számpélda"), h("p", { html: PO.tex.rich(F.pelda.szoveg) })),
      related.length || sim ? h("div.panel", h("div.panel-title", "Kapcsolódó"),
        h("div.btn-row", related.map((R) => h("a.btn.sm.ghost", { href: "#keplet-" + R.id }, R.nev)),
          sim ? h("a.btn.sm", { href: "#sim-" + sim.id }, "Szimuláció: " + sim.nev) : null)) : null);
  }

  /** Feladat kártya automatikus ellenőrzéssel. */
  function taskCard(T) {
    const rec = () => PO.store.get().tasks[T.id];
    const status = h("span");
    const paintStatus = () => {
      const r = rec();
      status.innerHTML = "";
      if (r) status.append(h("span.tag" + (r.ok ? ".solid" : ""), r.ok ? "Megoldva" : `Még nem jó (${r.tries} próba)`));
    };
    paintStatus();
    const fb = h("div");
    const record = (ok) => {
      PO.store.update((s) => { const r = s.tasks[T.id] || { tries: 0, ok: false }; s.tasks[T.id] = { ok: ok || r.ok, tries: r.tries + 1, last: Date.now(), temakor: T.temakor, lastOk: ok }; });
      paintStatus();
    };
    let answer;
    if (T.tipus === "mc") {
      const name = "mc-" + T.id + "-" + Math.random().toString(36).slice(2, 7);
      answer = h("div.grid", { style: { gap: "6px" } }, T.opciok.map((o, i) => h("label.choice", h("input", { type: "radio", name, value: i }), h("span", { html: PO.tex.html(o) }))));
    } else {
      answer = h("div.answer-row",
        h("input", { type: "text", inputmode: "decimal", placeholder: "Válasz", "aria-label": "Válasz " + T.egyseg + "-ben", onkeydown: (e) => { if (e.key === "Enter") check(); } }),
        h("span.muted", T.egyseg));
    }
    function check() {
      fb.className = "feedback";
      if (T.tipus === "mc") {
        const sel = answer.querySelector("input:checked");
        if (!sel) { fb.textContent = "Válassz egy lehetőséget."; return; }
        const ok = Number(sel.value) === T.helyes;
        fb.classList.add(ok ? "ok" : "bad");
        fb.textContent = ok ? `Helyes! (${T.pont} pont)` : "Nem ez a helyes válasz. Nézd meg a tippeket, vagy próbáld újra.";
        record(ok);
      } else {
        const x = parseNum(answer.querySelector("input").value);
        if (!Number.isFinite(x)) { fb.textContent = "Számot adj meg (tizedesvesszővel is lehet), " + T.egyseg + "-ben."; return; }
        const err = Math.abs(x - T.valasz) / Math.max(Math.abs(T.valasz), 1e-12);
        const ok = err <= T.tol;
        fb.classList.add(ok ? "ok" : "bad");
        if (ok) fb.textContent = `Helyes! ${fmt(T.valasz, 3)} ${T.egyseg} (${T.pont} pont)`;
        else if (err < 0.1) fb.textContent = "Közel jársz, de nem elég pontos. Ellenőrizd a kerekítést és a g értékét.";
        else if (Math.abs(x * 3.6 - T.valasz) / T.valasz < T.tol || Math.abs(x / 3.6 - T.valasz) / T.valasz < T.tol) fb.textContent = "Mértékegység-hiba gyanú: 3,6-szeres eltérés (km/h ↔ m/s).";
        else if (Math.abs(x + T.valasz) / Math.abs(T.valasz) < T.tol) fb.textContent = "Az előjel nem jó.";
        else fb.textContent = "Nem jó. Kérj tippet, vagy nézd meg a megoldást.";
        record(ok);
      }
    }
    let hintIdx = 0;
    const hints = h("div.grid", { style: { gap: "6px" } });
    const hintBtn = h("button.btn.sm.ghost", { type: "button" }, "Tipp (1/" + T.tippek.length + ")");
    hintBtn.addEventListener("click", () => {
      if (hintIdx >= T.tippek.length) return;
      hints.append(h("div.callout.small", { html: `<div class="callout-t">${hintIdx + 1}. tipp</div>` + PO.tex.html(T.tippek[hintIdx]) }));
      hintIdx++;
      hintBtn.textContent = hintIdx < T.tippek.length ? `Tipp (${hintIdx + 1}/${T.tippek.length})` : "Nincs több tipp";
      hintBtn.disabled = hintIdx >= T.tippek.length;
    });
    const graphBox = h("div");
    if (T.grafikon) {
      const g = T.grafikon;
      setTimeout(() => PO.plot(graphBox, { xLabel: g.xLabel, xUnit: g.xUnit, yLabel: g.yLabel, yUnit: g.yUnit, height: 200, noHint: true, noCsv: true }).set([{ name: g.yLabel + "(" + g.xLabel + ")", points: g.points }]), 0);
    }
    return h("div.panel.task",
      h("div.task-head", h("span.tag", `${T.szint} · ${["", "Alapfogalom", "Behelyettesítés", "Középszint", "Emelt", "Komplex emelt"][T.szint]}`), h("strong", T.cim), h("span.spacer"), h("span.small.muted", T.pont + " pont"), status),
      h("div", { html: PO.tex.html(T.szoveg) }),
      graphBox,
      answer,
      h("div.btn-row", h("button.btn.sm", { type: "button", onclick: check }, "Ellenőrzés"), hintBtn),
      fb, hints,
      h("details.solution", h("summary", "Teljes megoldás"), h("div", { html: PO.tex.html(T.megoldas) })));
  }

  PO.ui = { formulaCard, formulaSheet, taskCard, favButton, copyButton, szintTag };
})(typeof globalThis !== "undefined" ? globalThis : this);
