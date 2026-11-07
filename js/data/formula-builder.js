/* PHYSICS OS — képletépítő
 * mono(): hatványszorzat alakú képletek (y = c · x1^a1 · x2^a2 …). Minden változóra automatikusan
 *         elkészül a megoldó függvény ÉS az átrendezett alak TeX-kódja.
 * gen():  általános képletek, kézzel megadott átrendezésekkel (összegek, szögfüggvények, logaritmus).
 * V:      közös változókatalógus (jel, név, dimenzió, korlátok). */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const fail = (m) => { throw new Error(m); };

  const V = {
    m: { tex: "m", nev: "tömeg", dim: "tomeg", min: 0, pos: true },
    m1: { tex: "m_1", nev: "az első test tömege", dim: "tomeg", min: 0, pos: true },
    m2: { tex: "m_2", nev: "a második test tömege", dim: "tomeg", min: 0, pos: true },
    M: { tex: "M", nev: "a központi test tömege", dim: "tomeg", min: 0, pos: true },
    F: { tex: "F", nev: "erő", dim: "ero" },
    a: { tex: "a", nev: "gyorsulás", dim: "gyorsulas" },
    g: { tex: "g", nev: "nehézségi gyorsulás", dim: "gyorsulas", min: 0, pos: true },
    v: { tex: "v", nev: "sebesség", dim: "sebesseg" },
    h: { tex: "h", nev: "magasság", dim: "hossz" },
    s: { tex: "s", nev: "elmozdulás (út)", dim: "hossz" },
    l: { tex: "l", nev: "hossz", dim: "hossz", min: 0, pos: true },
    d: { tex: "d", nev: "távolság", dim: "hossz", min: 0, pos: true },
    r: { tex: "r", nev: "távolság (sugár)", dim: "hossz", min: 0, pos: true },
    R: { tex: "R", nev: "sugár", dim: "hossz", min: 0, pos: true },
    A: { tex: "A", nev: "felület (keresztmetszet)", dim: "terulet", min: 0, pos: true },
    Vt: { tex: "V", nev: "térfogat", dim: "terfogat", min: 0, pos: true },
    t: { tex: "t", nev: "idő", dim: "ido", min: 0 },
    dt: { tex: "\\Delta t", nev: "időtartam", dim: "ido", min: 0, pos: true },
    T: { tex: "T", nev: "periódusidő", dim: "ido", min: 0, pos: true },
    f: { tex: "f", nev: "frekvencia", dim: "frekvencia", min: 0, pos: true },
    omega: { tex: "\\omega", nev: "szögsebesség (körfrekvencia)", dim: "szogseb", min: 0 },
    alpha: { tex: "\\alpha", nev: "szög", dim: "szog" },
    E: { tex: "E", nev: "energia", dim: "energia" },
    W: { tex: "W", nev: "munka", dim: "energia" },
    P: { tex: "P", nev: "teljesítmény", dim: "teljesitmeny" },
    p: { tex: "p", nev: "nyomás", dim: "nyomas", min: 0 },
    rho: { tex: "\\rho", nev: "sűrűség", dim: "suruseg", min: 0, pos: true },
    D: { tex: "D", nev: "rugóállandó", dim: "rugoallando", min: 0, pos: true },
    Tk: { tex: "T", nev: "abszolút hőmérséklet", dim: "homerseklet", min: 0, pos: true },
    dT: { tex: "\\Delta T", nev: "hőmérséklet-változás", dim: "homdiff" },
    n: { tex: "n", nev: "anyagmennyiség", dim: "anyagmenny", min: 0, pos: true },
    Q: { tex: "Q", nev: "hő (hőmennyiség)", dim: "energia" },
    c: { tex: "c", nev: "fajhő", dim: "fajho", min: 0, pos: true },
    q: { tex: "q", nev: "töltés", dim: "toltes" },
    U: { tex: "U", nev: "feszültség", dim: "feszultseg" },
    I: { tex: "I", nev: "áramerősség", dim: "aram" },
    Re: { tex: "R", nev: "ellenállás", dim: "ellenallas", min: 0, pos: true },
    C: { tex: "C", nev: "kapacitás", dim: "kapacitas", min: 0, pos: true },
    L: { tex: "L", nev: "induktivitás", dim: "induktivitas", min: 0, pos: true },
    B: { tex: "B", nev: "mágneses indukció", dim: "indukcio" },
    N: { tex: "N", nev: "menetszám", dim: "egyseg", min: 0, pos: true },
    lambda: { tex: "\\lambda", nev: "hullámhossz", dim: "hossz", min: 0, pos: true },
    eta: { tex: "\\eta", nev: "hatásfok", dim: "szazalek", min: 0, max: 1 },
  };
  const v = (key, over) => Object.assign({}, V[key], over || {});

  /* ---------------- TeX-segédek ---------------- */
  const wrap = (t) => (/^[A-Za-z0-9]$|^\\[a-zA-Z]+$/.test(t) ? t : `{${t}}`);
  function powTex(t, p) {
    if (p === 1) return t;
    if (p === 0.5) return `\\sqrt{${t}}`;
    if (p === 1 / 3) return `\\sqrt[3]{${t}}`;
    if (Number.isInteger(p)) return `${wrap(t)}^{${p}}`;
    const fr = { 1.5: "3/2", 2.5: "5/2", 0.25: "1/4" }[p] || String(p);
    return `${wrap(t)}^{${fr}}`;
  }
  const prod = (arr) => (arr.length ? arr.join("\\,") : "1");
  const frac = (num, den) => (den.length ? `\\dfrac{${prod(num)}}{${prod(den)}}` : prod(num));
  function rootOf(expr, a, single) {
    // expr^(1/a)
    if (a === 1) return expr;
    if (a === 2) return `\\sqrt{${expr}}`;
    if (a === 3) return `\\sqrt[3]{${expr}}`;
    if (a === 0.5) return single ? `${wrap(expr)}^{2}` : `\\left(${expr}\\right)^{2}`;
    if (a === 4) return `\\sqrt[4]{${expr}}`;
    return `\\left(${expr}\\right)^{${+(1 / a).toFixed(3)}}`;
  }

  const base = (o) => Object.assign({ szint: "kozep", verified: false, kapcsolodo: [], sim: null, nem: "—", hiba: "—" }, o);

  /** Hatványszorzat: out = c · Π x^e */
  function mono(o) {
    const F = base(o);
    const keys = Object.keys(o.terms);
    const c = o.c === undefined ? 1 : o.c;
    const outTex = F.vars[o.out].tex;
    const eval_ = (vals) => keys.reduce((acc, k) => acc * Math.pow(vals[k], o.terms[k]), c);
    F.solve = {};
    F.solve[o.out] = { tex: o.tex, f: (vals) => eval_(vals) };
    keys.forEach((k) => {
      const a = o.terms[k];
      if (o.noSolve && o.noSolve.includes(k)) return;
      let num = [outTex], den = [];
      if (c !== 1) (o.cinv ? num.push(o.cinv) : den.push(o.ctex));
      keys.forEach((j) => {
        if (j === k) return;
        const e = o.terms[j], t = F.vars[j].tex;
        e < 0 ? num.push(powTex(t, -e)) : den.push(powTex(t, e));
      });
      let A = a;
      if (A < 0) { [num, den] = [den.length ? den : ["1"], num]; A = -A; if (c !== 1 && !o.cinv) { /* ctex már a számlálóba került a cserével */ } }
      const single = !den.length && num.length === 1;
      const tex = (o.rtex && o.rtex[k]) || `${F.vars[k].tex} = ${rootOf(frac(num, den), A, single)}`;
      F.solve[k] = {
        tex,
        f: (vals) => {
          const rest = keys.reduce((acc, j) => (j === k ? acc : acc * Math.pow(vals[j], o.terms[j])), c);
          if (rest === 0 || !Number.isFinite(rest)) fail("Nullával kellene osztani – ellenőrizd az adatokat.");
          const ratio = vals[o.out] / rest;
          const inv = 1 / a;
          if (ratio < 0 && !Number.isInteger(inv)) fail("Ezekkel az előjelekkel nincs valós megoldás.");
          if (ratio === 0 && a < 0) fail("Ehhez végtelen érték kellene.");
          return Math.sign(ratio) * Math.pow(Math.abs(ratio), inv) * (Number.isInteger(inv) && inv % 2 === 0 ? 1 : 1);
        },
      };
    });
    // teljes minta: a kimenet kiszámolva
    F.minta = Object.assign({}, o.minta);
    if (F.minta[o.out] === undefined) F.minta[o.out] = eval_(F.minta);
    if (!F.pelda || !F.pelda.adott) F.pelda = Object.assign({ adott: o.minta, keres: o.out }, F.pelda || {});
    if (!F.pelda.szoveg) F.pelda.szoveg = "";
    F.tipus = "mono";
    return F;
  }

  /** Általános képlet kézzel írt megoldókkal (a minta teljes legyen). */
  function gen(o) {
    const F = base(o);
    if (!F.pelda) F.pelda = { adott: Object.fromEntries(Object.entries(o.minta).filter(([k]) => k !== Object.keys(o.solve)[0])), keres: Object.keys(o.solve)[0], szoveg: "" };
    F.tipus = "gen";
    return F;
  }

  PO.fb = { V, v, mono, gen, fail, powTex };
  PO.formulas = PO.formulas || [];
  PO.addFormulas = (temakor, list) => list.forEach((F) => PO.formulas.push(Object.assign(F, { temakor: F.temakor || temakor })));
  if (typeof module !== "undefined") module.exports = PO.fb;
})(typeof globalThis !== "undefined" ? globalThis : this);
