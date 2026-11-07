/* PHYSICS OS — Labor: egyenáramú kör, lencse, fotoeffektus, radioaktív bomlás, gáz-állapotváltozások */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const { define, COL } = PO.simkit;
  const { fixed, fmt } = PO.util;
  const f2 = (x, u) => fixed(x, 2) + " " + u;
  const f3 = (x, u) => fmt(x, 3) + " " + u;

  /* =========================== EGYENÁRAMÚ KÖR =========================== */
  define({
    id: "aramkor", nev: "Áramforrás és fogyasztók", temakor: "egyenaram",
    leiras: "Belső ellenállás, kapocsfeszültség, soros és párhuzamos kapcsolás, teljesítményillesztés – számolt értékekkel és jelleggörbékkel.",
    kulcsszavak: "áramkör belső ellenállás kapocsfeszültség soros párhuzamos teljesítmény illesztés ohm szimuláció",
    kepletek: ["teljes-aramkor", "kapocsfeszultseg", "soros-parhuzamos", "elektromos-P"],
    params: [
      { k: "kap", label: "Kapcsolás", options: [["soros", "R₁ és R₂ sorosan"], ["par", "R₁ és R₂ párhuzamosan"], ["egy", "csak R₁"]] },
      { k: "eps", label: "Elektromotoros erő ε", unit: "V", min: 1, max: 24, step: 0.5 },
      { k: "Rb", label: "Belső ellenállás R_b", unit: "Ω", min: 0, max: 10, step: 0.1 },
      { k: "R1", label: "R₁", unit: "Ω", min: 0.5, max: 100, step: 0.5 },
      { k: "R2", label: "R₂", unit: "Ω", min: 0.5, max: 100, step: 0.5 },
    ],
    initial: { kap: "soros", eps: 12, Rb: 2, R1: 10, R2: 20 },
    presets: [["Laposelem", { kap: "egy", eps: 4.5, Rb: 1.5, R1: 10 }], ["Rövidzár-közeli", { kap: "par", R1: 0.5, R2: 0.5 }], ["Teljesítményillesztés", { kap: "egy", Rb: 2, R1: 2 }]],
    formulas: "$$I = \\dfrac{\\varepsilon}{R_k + R_b}, \\qquad U_k = \\varepsilon - I R_b$$$$R_s = R_1 + R_2, \\qquad \\dfrac{1}{R_p} = \\dfrac{1}{R_1} + \\dfrac{1}{R_2}$$ A külső teljesítmény $R_k = R_b$ esetén maximális.",
    canvas: 230,
    plots: [
      { k: "U", title: "Kapocsfeszültség–áramerősség (az áramforrás jelleggörbéje)", opt: { xLabel: "I", xUnit: "A", yLabel: "U_k", yUnit: "V", yMinZero: true, xMinZero: true } },
      { k: "P", title: "Külső teljesítmény a külső ellenállás függvényében", opt: { xLabel: "R_k", xUnit: "Ω", yLabel: "P", yUnit: "W", yMinZero: true, xMinZero: true } },
    ],
    readouts: [["Rk", "külső ellenállás"], ["I", "főág árama"], ["Uk", "kapocsfeszültség"], ["Pk", "külső teljesítmény"], ["eta", "hatásfok"]],
    model(st) {
      const Rk = st.kap === "soros" ? st.R1 + st.R2 : st.kap === "par" ? (st.R1 * st.R2) / (st.R1 + st.R2) : st.R1;
      const I = st.eps / (Rk + st.Rb), Uk = st.eps - I * st.Rb;
      const I1 = st.kap === "par" ? Uk / st.R1 : I, I2 = st.kap === "par" ? Uk / st.R2 : st.kap === "soros" ? I : 0;
      return { Rk, I, Uk, I1, I2, U1: I1 * st.R1, U2: I2 * st.R2, Pk: I * Uk, Pb: I * I * st.Rb };
    },
    series(st, M) {
      const Imax = st.Rb > 0 ? st.eps / st.Rb : 2 * M.I;
      const Rmax = Math.max(3 * M.Rk, 4 * Math.max(st.Rb, 0.5));
      return {
        U: [{ name: "U_k(I)", fn: (I) => st.eps - st.Rb * I, domain: [0, Math.min(Imax, 6 * M.I + 1)], samples: 2 }],
        P: [{ name: "P(R_k)", fn: (R) => (st.eps * st.eps * R) / (R + st.Rb) ** 2, domain: [0, Rmax] }],
      };
    },
    marker: (st, M) => ({ U: M.I, P: M.Rk }),
    values(st, M) {
      return { Rk: f3(M.Rk, "Ω"), I: f3(M.I, "A"), Uk: f3(M.Uk, "V"), Pk: f3(M.Pk, "W"), eta: fixed((100 * M.Rk) / (M.Rk + st.Rb), 1) + " %" };
    },
    draw(g, st, M) {
      const W = g.W, H = g.H, L = 50, R = W - 50, T = 40, B = H - 40;
      const box = (cx, cy, lab, sub, vertical) => {
        const w = vertical ? 22 : 64, hh = vertical ? 64 : 22;
        g.rect(cx - w / 2, cy - hh / 2, w, hh, COL.hi, "#141414");
        g.text(lab, cx + (vertical ? 18 : 0), cy - (vertical ? 8 : 26), { align: vertical ? "left" : "center", color: COL.fg, size: 12, bold: true });
        g.text(sub, cx + (vertical ? 18 : 0), cy + (vertical ? 10 : 26), { align: vertical ? "left" : "center", color: COL.mid, size: 11 });
      };
      // áramforrás a bal oldalon
      const my = (T + B) / 2;
      g.line(L, T, L, my - 14, COL.mid); g.line(L, my + 14, L, B, COL.mid);
      g.line(L - 16, my - 6, L + 16, my - 6, COL.hi, 2.5); g.line(L - 8, my + 6, L + 8, my + 6, COL.hi, 4);
      g.text("ε = " + fixed(st.eps, 1) + " V", L + 22, my - 8, { color: COL.fg, size: 12 });
      g.text("R_b = " + fixed(st.Rb, 1) + " Ω", L + 22, my + 10, { color: COL.mid, size: 11 });
      g.line(L, T, R, T, COL.mid); g.line(L, B, R, B, COL.mid);
      const cx = (L + R) / 2 + 30;
      if (st.kap === "par") {
        g.line(R, T, R, B, COL.mid);
        const x1 = cx - 60, x2 = cx + 60;
        g.line(x1, T, x1, B, COL.mid); g.line(x2, T, x2, B, COL.mid);
        box(x1, my, "R₁ = " + fixed(st.R1, 1) + " Ω", f3(M.I1, "A") + " · " + f3(M.U1, "V"), true);
        box(x2, my, "R₂ = " + fixed(st.R2, 1) + " Ω", f3(M.I2, "A") + " · " + f3(M.U2, "V"), true);
        g.line(R, T, R, B, "#0A0A0A", 3);
        g.line(x2, T, R, T, "#0A0A0A", 3); g.line(x2, B, R, B, "#0A0A0A", 3);
      } else {
        g.line(R, T, R, B, COL.mid);
        if (st.kap === "soros") {
          box(cx - 70, T, "R₁ = " + fixed(st.R1, 1) + " Ω", f3(M.U1, "V"));
          box(cx + 70, T, "R₂ = " + fixed(st.R2, 1) + " Ω", f3(M.U2, "V"));
        } else box(cx, T, "R₁ = " + fixed(st.R1, 1) + " Ω", f3(M.U1, "V"));
      }
      // áramirány
      g.arrow(L + 30, B, L + 70, B, COL.fg, "", 1.5);
      g.text("I = " + f3(M.I, "A"), L + 80, B + 16, { color: COL.fg, size: 12 });
      g.text("U_k = " + f3(M.Uk, "V"), R - 4, B + 16, { color: COL.mid, size: 11, align: "right" });
    },
    note(st, M) {
      const best = M.Rk > 0 && st.Rb > 0 ? Math.abs(M.Rk - st.Rb) / st.Rb < 0.05 : false;
      let s = `A kapocsfeszültség ${fixed(st.eps - M.Uk, 2)} V-tal kisebb az elektromotoros erőnél – ennyi esik a belső ellenálláson. A belső ellenálláson ${f3(M.Pb, "W")} hővé alakul.`;
      if (best) s += " Most R_k ≈ R_b: a külső teljesítmény maximális, de a hatásfok csak 50 %.";
      else if (st.Rb > 0) s += ` A külső teljesítmény R_k = R_b = ${fixed(st.Rb, 1)} Ω-nál lenne maximális (${f3((st.eps * st.eps) / (4 * st.Rb), "W")}).`;
      if (st.kap === "par") s += " Párhuzamos kapcsolásnál az eredő ellenállás kisebb a legkisebbnél is.";
      return s;
    },
  });

  /* =========================== LENCSE =========================== */
  define({
    id: "lencse", nev: "Lencse leképezése", temakor: "geom-optika",
    leiras: "Nevezetes sugármenetek gyűjtő- és szórólencsére: hol keletkezik a kép, valódi vagy látszólagos, mekkora a nagyítás.",
    kulcsszavak: "lencse leképezés sugármenet gyűjtőlencse szórólencse kép valódi látszólagos nagyítás fókusz szimuláció",
    kepletek: ["lekepezesi", "nagyitas", "dioptria"],
    params: [
      { k: "tip", label: "Lencse", options: [["gy", "Gyűjtőlencse (f > 0)"], ["sz", "Szórólencse (f < 0)"]] },
      { k: "f", label: "Fókusztávolság |f|", unit: "cm", min: 4, max: 30, step: 0.5 },
      { k: "t", label: "Tárgytávolság t", unit: "cm", min: 2, max: 80, step: 0.5 },
      { k: "T", label: "Tárgy magassága T", unit: "cm", min: 1, max: 10, step: 0.5 },
    ],
    initial: { tip: "gy", f: 10, t: 25, T: 4 },
    presets: [["t > 2f (fényképezőgép)", { tip: "gy", t: 30, f: 10 }], ["f < t < 2f (vetítő)", { tip: "gy", t: 14, f: 10 }], ["t < f (nagyító)", { tip: "gy", t: 6, f: 10 }], ["Szórólencse", { tip: "sz", t: 20, f: 10 }]],
    formulas: "$$\\dfrac1f = \\dfrac1t + \\dfrac1k, \\qquad N = \\dfrac{K}{T} = \\dfrac{k}{t}$$ Előjelek: látszólagos kép és szórólencse esetén $k$, illetve $f$ negatív.",
    canvas: 320,
    plots: [{ k: "k", title: "Képtávolság a tárgytávolság függvényében (k–t)", opt: { xLabel: "t", xUnit: "cm", yLabel: "k", yUnit: "cm", xRange: [0, 80] } }],
    plotCols: 1,
    readouts: [["k", "képtávolság"], ["N", "nagyítás"], ["K", "képmagasság"], ["j", "kép jellege"], ["D", "dioptria"]],
    model(st) {
      const f = st.tip === "gy" ? st.f : -st.f;
      const atF = Math.abs(st.t - f) < 1e-9;
      const k = atF ? Infinity : (f * st.t) / (st.t - f);
      const K = atF ? Infinity : (st.T * f) / (f - st.t);
      return { f, k, K, atF };
    },
    series(st, M) {
      const f = M.f;
      return { k: [{ name: "k(t)", fn: (t) => { const k = (f * t) / (t - f); return Math.abs(k) > 150 ? NaN : k; }, domain: [0.5, 80], samples: 800 }] };
    },
    marker: (st) => ({ k: st.t }),
    values(st, M) {
      if (M.atF) return { k: "∞", N: "∞", K: "∞", j: "nincs kép (párhuzamos sugarak)", D: fixed(100 / M.f, 1) + " dpt" };
      const N = Math.abs(M.k / st.t);
      const j = [M.k > 0 ? "valódi" : "látszólagos", M.K < 0 ? "fordított" : "egyenes állású", N > 1.0001 ? "nagyított" : N < 0.9999 ? "kicsinyített" : "azonos méretű"].join(", ");
      return { k: f2(M.k, "cm"), N: fixed(N, 2) + "×", K: f2(Math.abs(M.K), "cm"), j, D: fixed(100 / M.f, 1) + " dpt" };
    },
    draw(g, st, M) {
      const W = g.W, H = g.H, ay = H / 2;
      const kAbs = Number.isFinite(M.k) ? Math.min(Math.abs(M.k), 120) : 120;
      const left = Math.max(st.t, Math.abs(M.f) * 1.3, M.k < 0 ? kAbs : 0) * 1.1;
      const right = Math.max(Math.abs(M.f) * 1.3, M.k > 0 ? kAbs : 0, 15) * 1.1;
      const s = (W - 40) / (left + right), cx = 20 + left * s;
      const imgH = Number.isFinite(M.K) ? Math.min(Math.abs(M.K), st.T * 4) : st.T;
      const sv = (H / 2 - 24) / Math.max(st.T, imgH, 1);
      const X = (x) => cx + x * s, Y = (y) => ay - y * sv;
      const ctx = g.ctx;
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
      g.line(0, ay, W, ay, COL.dim, 1);
      // lencse
      const lh = H / 2 - 12;
      g.line(cx, ay - lh, cx, ay + lh, COL.fg, 2);
      if (M.f > 0) { g.arrow(cx, ay, cx, ay - lh, COL.fg, "", 2); g.arrow(cx, ay, cx, ay + lh, COL.fg, "", 2); }
      else { g.arrow(cx, ay - lh + 12, cx, ay - lh, COL.fg, "", 2); g.arrow(cx, ay + lh - 12, cx, ay + lh, COL.fg, "", 2); g.line(cx - 6, ay - lh, cx + 6, ay - lh, COL.fg, 2); g.line(cx - 6, ay + lh, cx + 6, ay + lh, COL.fg, 2); }
      // fókuszok, 2f
      [[M.f, "F"], [-M.f, "F"], [2 * M.f, "2F"], [-2 * M.f, "2F"]].forEach(([x, l]) => { g.line(X(x), ay - 4, X(x), ay + 4, COL.mid, 1.5); g.text(l, X(x), ay + 14, { align: "center", color: COL.mid, size: 11 }); });
      // tárgy
      const h = st.T;
      g.arrow(X(-st.t), ay, X(-st.t), Y(h), COL.hi, "T", 2.5);
      const far = right + 5, back = -left - 5;
      const ray = (pts, dash) => g.poly(pts.map(([x, y]) => [X(x), Y(y)]), "rgba(255,255,255,.75)", 1.2, false, null, dash || []);
      // 1. tengellyel párhuzamos → fókuszon át
      ray([[-st.t, h], [0, h], [far, h - (h / M.f) * far]]);
      // 2. optikai középponton át
      ray([[-st.t, h], [far, -(h / st.t) * far]]);
      // 3. fókuszon át → párhuzamos
      if (!M.atF && Math.abs(M.f - st.t) > 0.3) {
        const y3 = (h * M.f) / (M.f - st.t);
        if (Math.abs(y3) < lh / sv) ray([[-st.t, h], [0, y3], [far, y3]]);
      }
      // kép
      if (!M.atF && Math.abs(M.k) < 1e4) {
        if (M.k < 0) {
          // látszólagos: a megtört sugarak meghosszabbításai
          ray([[0, h], [back, h - (h / M.f) * back]], [4, 4]);
          const y3 = (h * M.f) / (M.f - st.t);
          if (Math.abs(y3) < lh / sv) ray([[0, y3], [back, y3]], [4, 4]);
        }
        g.ctx.setLineDash(M.k < 0 ? [5, 4] : []);
        g.arrow(X(M.k), ay, X(M.k), Y(M.K), COL.fg, "K", 2.5);
        g.ctx.setLineDash([]);
      }
      ctx.restore();
    },
    note(st, M) {
      if (M.atF) return "A tárgy a fókuszpontban van: a megtört sugarak párhuzamosak, nem keletkezik kép (a kép a végtelenben van).";
      if (M.f < 0) return "Szórólencse mindig látszólagos, egyenes állású, kicsinyített képet ad, a tárggyal azonos oldalon. A szaggatott vonalak a megtört sugarak meghosszabbításai.";
      if (st.t < M.f) return "t < f: látszólagos, egyenes állású, nagyított kép – így működik a nagyító. A kép ernyőn nem fogható fel.";
      if (st.t < 2 * M.f) return "f < t < 2f: valódi, fordított, nagyított kép a 2F-en túl – vetítőgép, mikroszkóp objektívje.";
      return "t > 2f: valódi, fordított, kicsinyített kép F és 2F között – fényképezőgép, szem. t = 2f esetén a kép azonos méretű.";
    },
  });

  /* =========================== FOTOEFFEKTUS =========================== */
  const METALS = [["Cs", "Cézium", 2.14], ["K", "Kálium", 2.3], ["Na", "Nátrium", 2.36], ["Ca", "Kalcium", 2.87], ["Zn", "Cink", 4.33], ["Cu", "Réz", 4.65], ["Pt", "Platina", 5.65]];
  /** Látható hullámhossz → szín (a színkép az egyetlen engedett színes elem). */
  function wlColor(nm, a = 1) {
    let r = 0, gg = 0, b = 0;
    if (nm < 380) return `rgba(150,120,255,${a * 0.6})`;
    if (nm > 780) return `rgba(180,40,40,${a * 0.5})`;
    if (nm < 440) { r = (440 - nm) / 60; b = 1; } else if (nm < 490) { gg = (nm - 440) / 50; b = 1; } else if (nm < 510) { gg = 1; b = (510 - nm) / 20; }
    else if (nm < 580) { r = (nm - 510) / 70; gg = 1; } else if (nm < 645) { r = 1; gg = (645 - nm) / 65; } else r = 1;
    return `rgba(${Math.round(r * 255)},${Math.round(gg * 255)},${Math.round(b * 255)},${a})`;
  }
  define({
    id: "fotoeffektus", nev: "Fotoeffektus", temakor: "kvantum",
    leiras: "Fénnyel megvilágított fémfelület: határfrekvencia, a kilépő elektronok energiája, zárófeszültség, és mit változtat (és mit nem) a fény erőssége.",
    kulcsszavak: "fotoeffektus fényelektromos jelenség kilépési munka határfrekvencia zárófeszültség foton einstein fotocella szimuláció",
    kepletek: ["einstein-foto", "hatarfrekvencia", "zarofeszultseg", "foton-lambda"],
    params: [
      { k: "fem", label: "Katód anyaga", options: METALS.map(([id, n, W]) => [id, `${n} (W = ${String(W).replace(".", ",")} eV)`]) },
      { k: "lam", label: "Hullámhossz λ", unit: "nm", min: 150, max: 750, step: 1 },
      { k: "Ip", label: "Fényerősség", unit: "%", min: 0, max: 100, step: 1 },
      { k: "U", label: "Anódfeszültség U", unit: "V", min: -4, max: 4, step: 0.05 },
    ],
    initial: { fem: "Na", lam: 400, Ip: 60, U: 1 },
    presets: [["Vörös fény", { lam: 680, Ip: 100 }], ["Ibolya", { lam: 400 }], ["UV", { lam: 220 }], ["Fékezés", { U: -1 }]],
    formulas: "$$hf = W_{ki} + E_{m}$$$$f_0 = \\dfrac{W_{ki}}{h}, \\qquad eU_0 = E_m$$ A fényerősség a fotonok számát (és így az áramot) növeli, az egyes elektronok energiáját nem.",
    canvas: 230,
    plots: [
      { k: "E", title: "Kilépő elektronok max. energiája a frekvencia függvényében", opt: { xLabel: "f", xUnit: "10¹⁴ Hz", yLabel: "E_m", yUnit: "eV", yMinZero: true, xMinZero: true } },
      { k: "I", title: "Fotoáram–feszültség jelleggörbe", opt: { xLabel: "U", xUnit: "V", yLabel: "I", yUnit: "μA", yMinZero: true, yRange: [0, 10] } },
    ],
    readouts: [["f", "frekvencia"], ["Ef", "fotonenergia"], ["Em", "E_m (max)"], ["U0", "zárófeszültség"], ["I", "fotoáram"]],
    model(st) {
      const W = METALS.find((m) => m[0] === st.fem)[2];
      const f = PO.K.c / (st.lam * 1e-9), Ef = (PO.K.h * f) / PO.K.e, Em = Math.max(0, Ef - W);
      const Isat = (10 * st.Ip) / 100;
      const I = (U) => (Em <= 0 ? 0 : U >= 0 ? Isat : U <= -Em ? 0 : Isat * (1 + U / Em));
      return { W, f, Ef, Em, Isat, I, f0: (W * PO.K.e) / PO.K.h };
    },
    series(st, M) {
      return {
        E: [{ name: "E_m(f)", fn: (x) => (x * 1e14 * PO.K.h) / PO.K.e - M.W, domain: [M.f0 / 1e14, 20], samples: 2 }],
        I: [{ name: "I(U)", fn: M.I, domain: [-4, 4], samples: 800 }],
      };
    },
    marker: (st, M) => ({ E: M.f / 1e14, I: st.U }),
    values(st, M) {
      return { f: fixed(M.f / 1e14, 2) + " · 10¹⁴ Hz", Ef: f3(M.Ef, "eV"), Em: M.Em > 0 ? f3(M.Em, "eV") : "nincs kilépés", U0: M.Em > 0 ? f3(M.Em, "V") : "—", I: fixed(M.I(st.U), 2) + " μA" };
    },
    draw(g, st, M) {
      const W = g.W, H = g.H;
      // színkép-sáv
      const sx = 20, sw = W - 40, sy = 14, lamX = (l) => sx + ((l - 150) / 600) * sw;
      for (let l = 150; l < 750; l += 2) { g.ctx.fillStyle = wlColor(l, l < 380 || l > 750 ? 0.25 : 0.85); g.ctx.fillRect(lamX(l), sy, (sw / 600) * 2 + 0.5, 10); }
      const l0 = (PO.K.h * PO.K.c) / (M.W * PO.K.e) * 1e9;
      if (l0 < 750) { g.line(lamX(l0), sy - 4, lamX(l0), sy + 14, COL.hi, 1.5); g.text("λ_0 = " + fixed(l0, 0) + " nm (határ)", lamX(l0) + (l0 > 560 ? -4 : 4), sy + 22, { color: COL.fg, size: 11, align: l0 > 560 ? "right" : "left" }); }
      g.arrow(lamX(st.lam), sy + 34, lamX(st.lam), sy + 12, COL.hi, "", 1.5);
      g.text("UV", sx, sy + 22, { color: COL.mid, size: 10 }); g.text("látható", lamX(750), sy + 22, { color: COL.mid, size: 10, align: "right" });
      // fotocella
      const cy = 150, kx = W * 0.32, ax = W * 0.72;
      g.rect(kx - 6, cy - 50, 12, 100, COL.hi, "#202020");
      g.rect(ax - 3, cy - 40, 6, 80, COL.fg, "#141414");
      g.text("katód (" + st.fem + ")", kx, cy + 64, { align: "center", color: COL.mid, size: 11 });
      g.text("anód", ax, cy + 64, { align: "center", color: COL.mid, size: 11 });
      g.text("U = " + fixed(st.U, 2) + " V", (kx + ax) / 2, cy + 64, { align: "center", color: COL.fg, size: 11 });
      // fénysugarak
      const a = 0.15 + 0.6 * (st.Ip / 100);
      for (let i = -2; i <= 2; i++) g.line(kx - 120, cy - 70 + i * 10, kx - 8, cy + i * 18, wlColor(st.lam, a), 2);
      // elektronok
      if (M.Em > 0 && st.Ip > 0) {
        const n = Math.max(1, Math.round(st.Ip / 14));
        const vmax = Math.sqrt(M.Em);
        for (let i = 0; i < n; i++) {
          const yy = cy - 40 + (80 * (i + 0.5)) / n;
          const reach = st.U >= 0 ? 1 : Math.max(0, 1 + st.U / M.Em);
          const len = (ax - kx - 20) * Math.min(1, reach) * (0.6 + 0.4 * ((i * 7) % 5) / 4);
          g.arrow(kx + 8, yy, kx + 8 + Math.max(6, len * Math.min(1, 0.4 + vmax / 3)), yy, COL.fg, "", 1.2);
          g.circle(kx + 10, yy, 2.5, null, COL.hi);
        }
      }
    },
    note(st, M) {
      if (M.Em <= 0) return `A foton energiája (${fixed(M.Ef, 2)} eV) kisebb a kilépési munkánál (${fixed(M.W, 2)} eV): elektron nem lép ki, akármilyen erős a fény. Ehhez λ < ${fixed((PO.K.h * PO.K.c) / (M.W * PO.K.e) * 1e9, 0)} nm kell.`;
      return `A kilépő elektronok legnagyobb mozgási energiája ${fixed(M.Em, 2)} eV, ezért ${fixed(M.Em, 2)} V fékezőfeszültség minden elektront megállít. Az E_m–f egyenes meredeksége minden fémre ugyanaz (h/e), csak a határfrekvencia más. ${st.U < 0 ? "Fékező feszültségnél csak a gyorsabb elektronok érik el az anódot." : "A telítési áram a fényerősséggel arányos."}`;
    },
  });

  /* =========================== RADIOAKTÍV BOMLÁS =========================== */
  define({
    id: "bomlas", nev: "Radioaktív bomlás", temakor: "radioaktivitas",
    leiras: "Véletlenszerűen bomló magok: az egyes mag bomlása megjósolhatatlan, a sokaságé mégis pontos törvényt követ.",
    kulcsszavak: "radioaktív bomlás felezési idő bomlástörvény statisztikus véletlen exponenciális aktivitás szimuláció",
    kepletek: ["bomlastorveny", "aktivitas", "bomlasi-allando"],
    params: [
      { k: "N0", label: "Kezdeti magszám N₀", options: [[64, "64"], [400, "400"], [1600, "1600"]] },
      { k: "T", label: "Felezési idő T₁/₂ (szimulált)", unit: "s", min: 1, max: 10, step: 0.5 },
      { k: "seed", label: "Sorsolás", options: [[1, "1. sorsolás"], [2, "2. sorsolás"], [3, "3. sorsolás"], [4, "4. sorsolás"]] },
    ],
    initial: { N0: 400, T: 3, seed: 1 },
    presets: [["Kevés mag (64)", { N0: 64 }], ["Sok mag (1600)", { N0: 1600 }]],
    formulas: "$$N = N_0\\cdot 2^{-t/T_{1/2}}$$$$A = \\lambda N, \\qquad \\lambda = \\dfrac{\\ln 2}{T_{1/2}}$$ Logaritmikus ábrázolásban a bomlástörvény egyenes, meredeksége $-\\lambda$.",
    canvas: 210,
    plots: [
      { k: "N", title: "Bomlatlan magok száma (folytonos: szimuláció, szaggatott: bomlástörvény)", opt: { xLabel: "t", xUnit: "s", yLabel: "N", yUnit: "db", yMinZero: true } },
      { k: "L", title: "ln(N/N₀) – t: egyenes, meredeksége −λ", opt: { xLabel: "t", xUnit: "s", yLabel: "ln(N/N₀)", yUnit: "" } },
    ],
    readouts: [["t", "eltelt idő"], ["N", "bomlatlan"], ["Nth", "elméleti"], ["h", "felezési idők"], ["A", "aktivitás"]],
    model(st) {
      // determinisztikus álvéletlen (mulberry32), hogy a sorsolás visszaállítható legyen
      let s = (st.seed * 2654435761 + st.N0 * 97 + Math.round(st.T * 10)) >>> 0;
      const rnd = () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
      const lam = Math.LN2 / st.T;
      const life = Array.from({ length: st.N0 }, () => -Math.log(1 - rnd()) / lam);
      const sorted = life.slice().sort((a, b) => a - b);
      const dur = 5 * st.T;
      const Nsim = (t) => { let lo = 0, hi = sorted.length; while (lo < hi) { const m = (lo + hi) >> 1; if (sorted[m] <= t) lo = m + 1; else hi = m; } return st.N0 - lo; };
      return { lam, life, sorted, dur, Nsim };
    },
    duration: (st, M) => M.dur,
    speed: (st) => Math.max(1, st.T / 2),
    series(st, M, t) {
      const step = [[0, st.N0]];
      for (const x of M.sorted) { if (x > t) break; step.push([x, step[step.length - 1][1]], [x, step[step.length - 1][1] - 1]); }
      step.push([t, M.Nsim(t)]);
      const lg = step.filter((p) => p[1] > 0).map(([x, n]) => [x, Math.log(n / st.N0)]);
      return {
        N: [{ name: "szimuláció", points: step }, { name: "elmélet", fn: (x) => st.N0 * Math.pow(2, -x / st.T), domain: [0, M.dur] }],
        L: [{ name: "szimuláció", points: lg }, { name: "elmélet", fn: (x) => -M.lam * x, domain: [0, M.dur], samples: 2 }],
      };
    },
    values(st, M, t) {
      const N = M.Nsim(t);
      return { t: f2(t, "s"), N: N + " db", Nth: fixed(st.N0 * Math.pow(2, -t / st.T), 1) + " db", h: fixed(t / st.T, 2), A: fixed(M.lam * N, 1) + " Bq" };
    },
    draw(g, st, M, t) {
      const W = g.W, H = g.H, n = st.N0;
      const cols = Math.ceil(Math.sqrt((n * W) / H)), rows = Math.ceil(n / cols);
      const cw = W / cols, ch = H / rows, sz = Math.max(1.5, Math.min(cw, ch) - (n > 1000 ? 1 : 2));
      for (let i = 0; i < n; i++) {
        const x = (i % cols) * cw + (cw - sz) / 2, y = Math.floor(i / cols) * ch + (ch - sz) / 2;
        const alive = M.life[i] > t, fresh = !alive && t - M.life[i] < 0.25 * st.T;
        g.ctx.fillStyle = alive ? "#EAEAEA" : fresh ? "#A0A0A0" : "#202020";
        g.ctx.fillRect(x, y, sz, sz);
      }
    },
    note(st) {
      return st.N0 <= 64
        ? "Kevés magnál a szimulált görbe erősen eltér az elméletitől: a bomlástörvény statisztikus, csak sok magra érvényes. Próbáld ki a többi sorsolást!"
        : `Felezési időnként (${fixed(st.T, 1)} s) a bomlatlan magok száma kb. a felére csökken – függetlenül attól, hány mag volt kezdetben. Az, hogy melyik mag bomlik el, teljesen véletlen (a világos négyzet bomlatlan, a halványuló most bomlott el).`;
    },
  });

  /* =========================== GÁZ-ÁLLAPOTVÁLTOZÁSOK =========================== */
  define({
    id: "gaz", nev: "Ideális gáz állapotváltozásai", temakor: "termodinamika",
    leiras: "Izoterm, izobár, izochor és adiabatikus folyamat a p–V diagramon: munka (terület), hő, belső energia – az I. főtétel mérlegével.",
    kulcsszavak: "ideális gáz állapotváltozás izoterm izobár izochor adiabatikus p-v diagram munka hő belső energia főtétel szimuláció",
    kepletek: ["fotetel1", "belso-energia", "izobar-munka", "allapotegyenlet"],
    params: [
      { k: "proc", label: "Folyamat", options: [["izoterm", "Izoterm (T = áll.)"], ["izobar", "Izobár (p = áll.)"], ["izochor", "Izochor (V = áll.)"], ["adiab", "Adiabatikus (Q = 0)"]] },
      { k: "f", label: "A gáz", options: [[3, "Egyatomos (He, Ne, Ar)"], [5, "Kétatomos (N₂, O₂, levegő)"]] },
      { k: "p1", label: "Kezdeti nyomás p₁", unit: "kPa", min: 50, max: 300, step: 5 },
      { k: "V1", label: "Kezdeti térfogat V₁", unit: "dm³", min: 5, max: 50, step: 1 },
      { k: "r", label: "Arány (V₂/V₁, izochornál p₂/p₁)", unit: "", min: 0.3, max: 3, step: 0.05 },
    ],
    initial: { proc: "izoterm", f: 3, p1: 100, V1: 20, r: 2 },
    presets: [["Izoterm tágulás", { proc: "izoterm", r: 2 }], ["Izobár melegítés", { proc: "izobar", r: 1.5 }], ["Izochor hűtés", { proc: "izochor", r: 0.6 }], ["Adiabatikus összenyomás", { proc: "adiab", r: 0.5 }]],
    formulas: "$$pV = nRT, \\qquad \\Delta E_b = Q + W$$$$E_b = \\tfrac{f}{2}nRT, \\qquad W_{gáz} = \\int p\\,dV$$ ($W$: a gázon végzett munka, $W = -W_{gáz}$; a p–V görbe alatti terület a gáz munkája.)",
    canvas: 200,
    plots: [{ k: "pV", title: "p–V diagram (a satírozott terület a gáz által végzett munka nagysága)", opt: { xLabel: "V", xUnit: "dm³", yLabel: "p", yUnit: "kPa", yMinZero: true, xMinZero: true } }],
    plotCols: 1,
    readouts: [["p", "nyomás"], ["V", "térfogat"], ["T", "hőmérséklet"], ["Q", "felvett hő Q"], ["W", "gázon végzett W"], ["dE", "ΔE_b"]],
    model(st) {
      const Rg = PO.K.R, p1 = st.p1 * 1e3, V1 = st.V1 * 1e-3, T1 = 300, n = (p1 * V1) / (Rg * T1), kap = (st.f + 2) / st.f;
      const iso = st.proc === "izochor";
      const V2 = iso ? V1 : V1 * st.r;
      const pOf = (V) => (st.proc === "izoterm" ? (p1 * V1) / V : st.proc === "izobar" ? p1 : st.proc === "adiab" ? p1 * Math.pow(V1 / V, kap) : NaN);
      const p2 = iso ? p1 * st.r : pOf(V2);
      // állapot az s ∈ [0,1] paraméter mentén
      const state = (s) => { if (iso) { const p = p1 + (p2 - p1) * s; return { p, V: V1, T: (p * V1) / (n * Rg) }; } const V = V1 + (V2 - V1) * s, p = pOf(V); return { p, V, T: (p * V) / (n * Rg) }; };
      const Wg = (s) => {
        const S = state(s), V = S.V;
        switch (st.proc) {
          case "izoterm": return p1 * V1 * Math.log(V / V1);
          case "izobar": return p1 * (V - V1);
          case "adiab": return (p1 * V1 - S.p * V) / (kap - 1);
          default: return 0;
        }
      };
      const dE = (s) => (st.f / 2) * n * Rg * (state(s).T - T1);
      return { n, T1, p1, V1, p2, V2, kap, state, Wg, dE, iso, pOf };
    },
    duration: () => 4,
    series(st, M, t) {
      const s = t / 4;
      if (M.iso) return { pV: [{ name: "p(V)", points: [[M.V1 * 1e3, M.p1 / 1e3], [M.V1 * 1e3, M.p2 / 1e3]] }, { name: "most", points: [[M.V1 * 1e3, M.state(s).p / 1e3]], scatter: true }] };
      const a = Math.min(M.V1, M.V2) * 1e3, b = Math.max(M.V1, M.V2) * 1e3;
      const pk = (Vd) => M.pOf(Vd * 1e-3) / 1e3;
      const cur = M.state(s).V * 1e3;
      const series = [{ name: "p(V)", fn: pk, domain: [a, b], area: true }];
      if (st.proc !== "izoterm") series.push({ name: "izoterma (T₁)", fn: (Vd) => (M.p1 * M.V1) / (Vd * 1e-3) / 1e3, domain: [Math.min(a, M.V1 * 1e3) * 0.8, Math.max(b, M.V1 * 1e3) * 1.2] });
      series.push({ name: "most", points: [[cur, pk(cur)]], scatter: true });
      return { pV: series };
    },
    markers: false,
    marker: (st, M, t) => ({ pV: M.state(t / 4).V * 1e3 }),
    values(st, M, t) {
      const s = t / 4, S = M.state(s), Wg = M.Wg(s), dE = M.dE(s), Q = dE + Wg;
      return { p: f3(S.p / 1e3, "kPa"), V: f3(S.V * 1e3, "dm³"), T: f3(S.T, "K"), Q: f3(Math.abs(Q) < 1e-9 ? 0 : Q, "J"), W: f3(-Wg === 0 ? 0 : -Wg, "J"), dE: f3(Math.abs(dE) < 1e-9 ? 0 : dE, "J") };
    },
    draw(g, st, M, t) {
      const W = g.W, H = g.H, s = t / 4, S = M.state(s);
      const Vmax = Math.max(M.V1, M.V2) * 1.1;
      const x0 = 40, wMax = Math.min(W - 220, 520), y0 = 30, hh = H - 60;
      const wv = (S.V / Vmax) * wMax;
      g.rect(x0, y0, wMax + 20, hh, COL.dim, null, 1);
      g.ctx.fillStyle = "rgba(255,255,255,0.04)"; g.ctx.fillRect(x0, y0, wv, hh);
      g.rect(x0 + wv, y0 - 6, 8, hh + 12, COL.hi, "#202020");
      g.line(x0 + wv + 8, y0 + hh / 2, x0 + wv + 40, y0 + hh / 2, COL.hi, 3);
      // részecskék: sebességük √T-vel arányos
      const k = Math.sqrt(S.T / M.T1);
      for (let i = 0; i < 36; i++) {
        const sx = ((i * 0.618) % 1), sy = ((i * 0.382 + 0.17) % 1), vx = 0.3 + ((i * 13) % 7) / 10, vy = 0.2 + ((i * 7) % 5) / 8;
        const tri = (u) => { u = ((u % 2) + 2) % 2; return u < 1 ? u : 2 - u; };
        const px = x0 + 4 + tri(sx * 2 + vx * k * t * 1.5) * Math.max(1, wv - 8), py = y0 + 4 + tri(sy * 2 + vy * k * t * 1.5) * (hh - 8);
        g.circle(px, py, 2.4, null, COL.fg);
      }
      // hőcsere-nyíl
      const Q = M.dE(s) + M.Wg(s), tx = x0 + wMax + 70;
      if (st.proc === "adiab") g.text("hőszigetelt (Q = 0)", tx, y0 + hh / 2, { color: COL.mid, size: 12 });
      else if (Math.abs(Q) > 1e-6) {
        g.arrow(Q > 0 ? tx + 60 : tx, y0 + hh / 2, Q > 0 ? tx : tx + 60, y0 + hh / 2, COL.fg, "", 2);
        g.text(Q > 0 ? "hőfelvétel" : "hőleadás", tx + 30, y0 + hh / 2 + 18, { color: COL.mid, size: 11, align: "center" });
      }
      g.text("T = " + fixed(S.T, 0) + " K", tx, y0 + 12, { color: COL.fg, size: 12 });
    },
    note(st, M) {
      const Wg = M.Wg(1), dE = M.dE(1), Q = dE + Wg;
      const T2 = M.state(1).T;
      const base = `Végállapot: T₂ = ${fixed(T2, 0)} K (kezdetben ${M.T1} K). A gáz munkája ${fixed(Wg, 0)} J, a felvett hő ${fixed(Math.abs(Q) < 1e-9 ? 0 : Q, 0)} J, a belső energia változása ${fixed(dE, 0)} J. `;
      const why = {
        izoterm: "Izoterm folyamatban a belső energia nem változik, így a felvett hő teljes egészében munkává alakul (Q = −W).",
        izobar: `Izobár tágulásnál a felvett hő egy része munkára, a nagyobb része a belső energia növelésére fordítódik (${st.f === 3 ? "egyatomos gáznál ΔE = 3/5 · Q" : "kétatomos gáznál ΔE = 5/7 · Q"}).`,
        izochor: "Izochor folyamatban nincs munkavégzés (nincs terület a görbe alatt), a hő teljes egészében a belső energiát változtatja.",
        adiab: `Adiabatikus folyamatban nincs hőcsere: a munka a belső energiát változtatja (ΔE = W). A görbe meredekebb az izotermánál (κ = ${fixed(M.kap, 2)}). ${st.r < 1 ? "Összenyomáskor a gáz felmelegszik (dízelmotor, pumpa)." : "Táguláskor lehűl (felhőképződés)."}`,
      };
      return base + why[st.proc];
    },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
