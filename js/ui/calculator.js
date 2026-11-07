/* PHYSICS OS — univerzális képletkalkulátor
 * Bármelyik mennyiség kiszámítható a többiből; mértékegység-átváltás, lépések, hibakezelés. */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const { h, fmt, parseNum } = PO.util;

  /** Egy változó korlátainak ellenőrzése (SI-értéken). Hibaüzenetet ad vagy null-t. */
  function checkVar(v, x) {
    const name = v.nev;
    if (v.pos && !(x > 0)) return `${cap(name)} legyen pozitív.`;
    if (v.min !== undefined && x < v.min - 1e-12) return `${cap(name)} nem lehet negatív.`;
    if (v.max !== undefined && x > v.max + 1e-9) return v.dim === "szog" ? `${cap(name)} legfeljebb ${fmt(v.max * 180 / Math.PI, 3)}° lehet.` : `${cap(name)} túl nagy.`;
    return null;
  }
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  /** Tiszta számítás (UI nélkül, tesztelhető): { ok, values[], error, note } */
  function solve(F, target, inputsSI) {
    const S = F.solve[target];
    if (!S) return { ok: false, error: "Ez a mennyiség ebből a képletből nem számolható." };
    for (const [k, v] of Object.entries(F.vars)) {
      if (k === target) continue;
      const x = inputsSI[k];
      if (!Number.isFinite(x)) return { ok: false, error: `Hiányzó vagy hibás adat: ${v.nev}.`, field: k };
      const e = checkVar(v, x);
      if (e) return { ok: false, error: e, field: k };
    }
    let res;
    try { res = S.f(inputsSI); } catch (e) { return { ok: false, error: e.message || "A számítás nem végezhető el." }; }
    const all = (Array.isArray(res) ? res : [res]).filter((x) => x !== undefined);
    if (!all.length || all.some((x) => !Number.isFinite(x))) return { ok: false, error: "Az eredmény nem értelmezhető (nullával osztás vagy végtelen érték). Ellenőrizd az adatokat." };
    const tv = F.vars[target];
    const valid = all.filter((x) => !checkVar(tv, x));
    if (!valid.length) return { ok: false, error: `Fizikailag értelmetlen eredmény adódna (${tv.nev} = ${fmt(all[0], 4)} ${PO.units[tv.dim].si}). Ellenőrizd az előjeleket és az adatokat.` };
    return { ok: true, values: valid, note: S.note || null, dropped: all.length - valid.length };
  }

  /** A kalkulátor felülete egy képlethez. */
  function calculator(F, opts = {}) {
    const keys = Object.keys(F.vars);
    const targets = keys.filter((k) => F.solve[k]);
    let target = opts.target && F.solve[opts.target] ? opts.target : (F.pelda && F.solve[F.pelda.keres] ? F.pelda.keres : targets[0]);
    const si = Object.assign({}, F.minta, F.pelda ? F.pelda.adott : {});
    const unitSel = {};
    let sig = 3;

    const root = h("div.calc");
    const tSeg = h("div.calc-target", h("span.small.muted", "Kiszámítandó:"));
    const tBox = h("div.seg", { role: "group", "aria-label": "Kiszámítandó mennyiség" });
    targets.forEach((k) => {
      const b = h("button", { type: "button", "aria-pressed": String(k === target), title: F.vars[k].nev }, PO.tex.el(F.vars[k].tex));
      b.addEventListener("click", () => { target = k; [...tBox.children].forEach((c) => c.setAttribute("aria-pressed", "false")); b.setAttribute("aria-pressed", "true"); build(); });
      tBox.append(b);
    });
    tSeg.append(tBox);
    const sigSel = h("select", { "aria-label": "Értékes jegyek" }, [2, 3, 4, 5].map((n) => h("option", { value: n, selected: n === sig }, `${n} értékes jegy`)));
    sigSel.addEventListener("change", () => { sig = Number(sigSel.value); compute(); });
    tSeg.append(h("span.spacer"), sigSel);

    const inputsBox = h("div.calc-inputs");
    const out = h("div");
    root.append(tSeg, inputsBox, out);

    const fields = {};
    function unitSelect(k) {
      const v = F.vars[k];
      const list = PO.units[v.dim].list;
      if (!unitSel[k]) unitSel[k] = PO.unitDefault(v.dim);
      if (list.length < 2) return h("span.small.muted", { style: { paddingLeft: "6px" } }, list[0][0] === "–" ? "" : list[0][0]);
      const s = h("select", { "aria-label": v.nev + " mértékegysége" }, list.map(([lab]) => h("option", { value: lab, selected: lab === unitSel[k] }, lab)));
      s.addEventListener("change", () => {
        unitSel[k] = s.value;
        if (fields[k]) fields[k].input.value = toDisplay(k);
        compute();
      });
      return s;
    }
    const uOf = (k) => unitSel[k] || PO.unitDefault(F.vars[k].dim);
    const toSI = (k, x) => PO.toSI(F.vars[k].dim, uOf(k), x);
    const fromSI = (k, x) => PO.fromSI(F.vars[k].dim, uOf(k), x);
    function toDisplay(k) {
      const x = si[k];
      if (!Number.isFinite(x)) return "";
      return String(+fromSI(k, x).toPrecision(6)).replace(".", ",");
    }

    function build() {
      inputsBox.innerHTML = "";
      for (const k of keys) {
        if (k === target) continue;
        const v = F.vars[k];
        unitSel[k] = unitSel[k] || PO.unitDefault(v.dim);
        const input = h("input", { type: "text", inputmode: "decimal", "aria-label": v.nev, title: v.nev, autocomplete: "off" });
        input.value = toDisplay(k);
        input.addEventListener("input", () => {
          const x = parseNum(input.value);
          si[k] = Number.isFinite(x) ? toSI(k, x) : NaN;
          compute();
        });
        fields[k] = { input };
        inputsBox.append(h("div.calc-row", h("div.sym", { title: v.nev }, PO.tex.el(v.tex)), input, unitSelect(k)));
      }
      compute();
    }

    function compute() {
      Object.values(fields).forEach((f) => f.input.classList.remove("invalid"));
      const r = solve(F, target, si);
      out.innerHTML = "";
      const tv = F.vars[target];
      if (!r.ok) {
        if (r.field && fields[r.field]) fields[r.field].input.classList.add("invalid");
        out.append(h("div.calc-error", { role: "status" }, h("strong", "Nem számolható. "), r.error));
        return;
      }
      unitSel[target] = unitSel[target] || PO.unitDefault(tv.dim);
      const tUnit = unitSelect(target);
      const shown = r.values.map((x) => fmt(fromSI(target, x), sig)).join("  vagy  ");
      const res = h("div.calc-result", { role: "status" },
        h("div.row", PO.tex.el(tv.tex), h("span.res", "= " + shown), tUnit),
        r.note ? h("div.small.muted", r.note) : null);
      const steps = h("div.steps.small",
        h("div", h("div", h("div.muted", "Átrendezett alak"), PO.tex.el(F.solve[target].tex, true))),
        h("div", h("div", h("div.muted", "Behelyettesítés SI-egységekben"),
          h("div", keys.filter((k) => k !== target).map((k) => h("span", { style: { marginRight: "16px", whiteSpace: "nowrap" } }, PO.tex.el(F.vars[k].tex), ` = ${fmt(si[k], 4)} ${siUnit(k)}`))))),
        h("div", h("div", h("div.muted", "Eredmény"), PO.tex.el(`${tv.tex} = ${r.values.map((x) => numTex(x, sig)).join("\\ \\text{vagy}\\ ")}\\ ${texUnit(PO.units[tv.dim].si)}`))));
      out.append(res, h("div", { style: { height: "10px" } }), steps);
    }
    const siUnit = (k) => PO.units[F.vars[k].dim].si;
    build();
    return root;
  }
  /** Szám TeX-alakban: tizedesvessző {,}, normálalak \cdot 10^{n} */
  function numTex(x, sig) {
    const s = fmt(x, sig);
    const m = s.match(/^(.*) · 10(.*)$/);
    const mant = (m ? m[1] : s).replace("−", "-").replace(",", "{,}");
    return m ? `${mant}\\cdot 10^{${supToNum(m[2])}}` : mant;
  }
  function supToNum(s) {
    const m = { "⁻": "-", "⁰": 0, "¹": 1, "²": 2, "³": 3, "⁴": 4, "⁵": 5, "⁶": 6, "⁷": 7, "⁸": 8, "⁹": 9 };
    return s.split("").map((c) => m[c]).join("");
  }
  function texUnit(u) {
    if (!u) return "";
    return "\\mathrm{" + u.replace("²", "^2").replace("−", "-").replace(/\//g, "/") + "}";
  }

  PO.calc = { solve, calculator, checkVar };
  if (typeof module !== "undefined") module.exports = PO.calc;
})(typeof globalThis !== "undefined" ? globalThis : this);
