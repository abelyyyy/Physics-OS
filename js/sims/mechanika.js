/* PHYSICS OS — Labor: lejtő, ütközések, matematikai inga, rugós rezgő */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const { define, COL } = PO.simkit;
  const { fixed, fmt } = PO.util;
  const R = Math.PI / 180;
  const g0 = 9.81;
  const f2 = (x, u) => fixed(x, 2) + " " + u;
  const f3 = (x, u) => fmt(x, 3) + " " + u;

  /** RK4 integrátor: y' = F(t, y), visszaad: { t: [], y: [[]] } egyenletes lépéssel. */
  function rk4(F, y0, dt, n) {
    const ts = [0], ys = [y0.slice()];
    let y = y0.slice();
    for (let i = 0; i < n; i++) {
      const t = i * dt;
      const k1 = F(t, y), y2 = y.map((v, j) => v + (dt / 2) * k1[j]);
      const k2 = F(t + dt / 2, y2), y3 = y.map((v, j) => v + (dt / 2) * k2[j]);
      const k3 = F(t + dt / 2, y3), y4 = y.map((v, j) => v + dt * k3[j]);
      const k4 = F(t + dt, y4);
      y = y.map((v, j) => v + (dt / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
      ts.push(t + dt); ys.push(y);
    }
    return { ts, ys, dt };
  }
  /** Lineáris interpoláció egy RK4-eredményben. */
  const at = (S, t, j) => {
    const i = Math.min(S.ys.length - 2, Math.max(0, Math.floor(t / S.dt)));
    const k = (t - i * S.dt) / S.dt;
    return S.ys[i][j] + (S.ys[i + 1][j] - S.ys[i][j]) * Math.min(1, Math.max(0, k));
  };
  const pts = (S, f) => S.ts.map((t, i) => [t, f(S.ys[i], t)]);

  /* =========================== LEJTŐ =========================== */
  define({
    id: "lejto", nev: "Lejtő súrlódással", temakor: "dinamika",
    leiras: "Erővektorok, gyorsulás, sebesség és energiamérleg a lejtőn: mikor indul meg a test, mennyi energia alakul hővé.",
    kulcsszavak: "lejtő súrlódás erővektor nyomóerő gyorsulás energia hő szimuláció",
    kepletek: ["lejto-a", "surlodas", "munkatetel"],
    params: [
      { k: "alpha", label: "Hajlásszög α", unit: "°", min: 0, max: 60, step: 1 },
      { k: "mu", label: "Súrlódási együttható μ", unit: "", min: 0, max: 1, step: 0.01 },
      { k: "m", label: "Tömeg m", unit: "kg", min: 0.1, max: 10, step: 0.1 },
      { k: "L", label: "A lejtő hossza", unit: "m", min: 1, max: 10, step: 0.5 },
    ],
    initial: { alpha: 30, mu: 0.2, m: 2, L: 4 },
    presets: [["Súrlódásmentes", { mu: 0, alpha: 30 }], ["Éppen megcsúszik", { alpha: 25, mu: Math.round(Math.tan(25 * R) * 100) / 100 }], ["Nyugalomban marad", { alpha: 15, mu: 0.4 }]],
    formulas: "$$a = g(\\sin\\alpha - \\mu\\cos\\alpha)$$$$F_{ny} = mg\\cos\\alpha,\\quad F_s = \\mu F_{ny}$$$$mgh = \\tfrac12 mv^2 + \\mu mg\\cos\\alpha\\cdot s$$",
    canvas: 290,
    plots: [
      { k: "v", title: "Sebesség–idő (v–t)", opt: { xLabel: "t", xUnit: "s", yLabel: "v", yUnit: "m/s", yMinZero: true } },
      { k: "E", title: "Energiák (folytonos: helyzeti, szaggatott: mozgási, pontozott: hő)", opt: { xLabel: "t", xUnit: "s", yLabel: "E", yUnit: "J", yMinZero: true } },
    ],
    readouts: [["a", "gyorsulás"], ["v", "sebesség"], ["s", "megtett út"], ["N", "nyomóerő"], ["S", "súrlódási erő"]],
    model(st) {
      const al = st.alpha * R, N = st.m * g0 * Math.cos(al), lefele = st.m * g0 * Math.sin(al);
      const moves = Math.tan(al) > st.mu + 1e-9;
      const a = moves ? g0 * (Math.sin(al) - st.mu * Math.cos(al)) : 0;
      const tEnd = moves ? Math.sqrt((2 * st.L) / a) : 3;
      return { al, N, lefele, moves, a, tEnd, S: moves ? st.mu * N : lefele, h: st.L * Math.sin(al) };
    },
    duration: (st, M) => M.tEnd,
    series(st, M) {
      const s = (t) => 0.5 * M.a * t * t;
      const dom = [0, M.tEnd];
      return {
        v: [{ name: "v(t)", fn: (t) => M.a * t, domain: dom, samples: 2 }],
        E: [
          { name: "E_h", fn: (t) => st.m * g0 * (st.L - s(t)) * Math.sin(M.al), domain: dom },
          { name: "E_m", fn: (t) => 0.5 * st.m * (M.a * t) ** 2, domain: dom },
          { name: "hő", fn: (t) => st.mu * M.N * s(t) * (M.moves ? 1 : 0), domain: dom },
        ],
      };
    },
    values(st, M, t) {
      return { a: f2(M.a, "m/s²"), v: f2(M.a * t, "m/s"), s: f2(0.5 * M.a * t * t, "m"), N: f2(M.N, "N"), S: f2(M.S, "N") + (M.moves ? "" : " (tapadási)") };
    },
    draw(g, st, M, t) {
      const al = M.al, W = g.W, H = g.H;
      const x0 = 50, yb = H - 62;
      const Lp = Math.min((W - 110) / Math.max(0.2, Math.cos(al)), (H - 110) / Math.max(1e-3, Math.sin(al)));
      const top = [x0 + Lp * Math.cos(al), yb - Lp * Math.sin(al)];
      g.poly([[x0, yb], top, [top[0], yb]], COL.dim, 1.5, true, "#141414");
      g.line(10, yb, W - 10, yb, COL.dim, 1);
      // szögjel
      g.ctx.strokeStyle = COL.mid; g.ctx.lineWidth = 1; g.ctx.beginPath(); g.ctx.arc(x0, yb, 34, -al, 0); g.ctx.stroke();
      g.text("α = " + st.alpha + "°", x0 + 40, yb + 14, { color: COL.mid });
      // test
      const s = 0.5 * M.a * t * t;
      const u = [-Math.cos(al), Math.sin(al)], n = [-Math.sin(al), -Math.cos(al)];
      const bs = 34, d = (s / st.L) * (Lp - bs - 10);
      const c = [top[0] + u[0] * (d + bs / 2 + 4) + n[0] * (bs / 2), top[1] + u[1] * (d + bs / 2 + 4) + n[1] * (bs / 2)];
      const ctx = g.ctx;
      ctx.save(); ctx.translate(c[0], c[1]); ctx.rotate(-al); g.rect(-bs / 2, -bs / 2, bs, bs, COL.hi, "#202020"); ctx.restore();
      // erők
      const k = 52 / (st.m * g0);
      g.arrow(c[0], c[1], c[0], c[1] + k * st.m * g0, COL.hi, "mg");
      g.arrow(c[0], c[1], c[0] + n[0] * k * M.N, c[1] + n[1] * k * M.N, COL.fg, "F_ny");
      if (M.S > 1e-6) g.arrow(c[0], c[1], c[0] - u[0] * k * M.S, c[1] - u[1] * k * M.S, COL.mid, "F_s");
      // mg komponensei
      const pm = [c[0] + u[0] * k * M.lefele, c[1] + u[1] * k * M.lefele];
      g.line(c[0], c[1], pm[0], pm[1], COL.dim, 1, [4, 4]);
      g.line(pm[0], pm[1], c[0], c[1] + k * st.m * g0, COL.dim, 1, [4, 4]);
      g.text("h = " + fixed(M.h, 2) + " m", top[0] + 8, (top[1] + yb) / 2, { color: COL.mid });
    },
    note(st, M) {
      const crit = Math.atan(st.mu) / R;
      if (!M.moves) return `A test nyugalomban marad: tan α = ${fixed(Math.tan(M.al), 2)} ≤ μ = ${fixed(st.mu, 2)}. A tapadási súrlódási erő pontosan kiegyenlíti a lejtő irányú összetevőt (mg·sin α = ${fixed(M.lefele, 2)} N) – nem μF_ny! Megcsúszás ${fixed(crit, 1)}° felett.`;
      const v = M.a * M.tEnd;
      return `A test ${fixed(M.tEnd, 2)} s alatt ér le, ${fixed(v, 2)} m/s-mal. A gyorsulás nem függ a tömegtől. A helyzeti energia (${fixed(st.m * g0 * M.h, 1)} J) ${st.mu ? fixed((100 * st.mu * M.N * st.L) / (st.m * g0 * M.h), 0) + " %-a hővé alakul." : "teljes egészében mozgási energiává alakul."} Kritikus szög ennél a μ-nél: ${fixed(crit, 1)}°.`;
    },
  });

  /* =========================== ÜTKÖZÉS =========================== */
  define({
    id: "utkozes", nev: "Egyenes ütközések", temakor: "lendulet",
    leiras: "Két kocsi ütközése a rugalmastól a tökéletesen rugalmatlanig: a lendület mindig megmarad, a mozgási energia nem.",
    kulcsszavak: "ütközés lendület megmaradás rugalmas rugalmatlan kocsi energia szimuláció",
    kepletek: ["lendulet", "rugalmas", "rugalmatlan"],
    params: [
      { k: "m1", label: "Bal kocsi tömege m₁", unit: "kg", min: 0.1, max: 5, step: 0.1 },
      { k: "v1", label: "Bal kocsi sebessége v₁", unit: "m/s", min: -3, max: 3, step: 0.1 },
      { k: "m2", label: "Jobb kocsi tömege m₂", unit: "kg", min: 0.1, max: 5, step: 0.1 },
      { k: "v2", label: "Jobb kocsi sebessége v₂", unit: "m/s", min: -3, max: 3, step: 0.1 },
      { k: "k", label: "Rugalmasság (1: rugalmas, 0: rugalmatlan)", unit: "", min: 0, max: 1, step: 0.05 },
    ],
    initial: { m1: 1, v1: 2, m2: 1, v2: 0, k: 1 },
    presets: [
      ["Azonos tömeg, rugalmas", { m1: 1, m2: 1, v1: 2, v2: 0, k: 1 }],
      ["Összetapadnak", { m1: 1, m2: 1, v1: 2, v2: 0, k: 0 }],
      ["Könnyű a nehézbe", { m1: 0.5, m2: 4, v1: 2, v2: 0, k: 1 }],
      ["Szembe", { m1: 2, m2: 1, v1: 1.5, v2: -1.5, k: 1 }],
    ],
    formulas: "$$m_1v_1 + m_2v_2 = m_1v_1' + m_2v_2'$$Rugalmas ütközésnél a mozgási energia is megmarad; tökéletesen rugalmatlannál közös sebességgel haladnak: $$v' = \\dfrac{m_1v_1 + m_2v_2}{m_1 + m_2}$$",
    canvas: 150,
    plots: [
      { k: "v", title: "Sebességek (folytonos: bal, szaggatott: jobb kocsi)", opt: { xLabel: "t", xUnit: "s", yLabel: "v", yUnit: "m/s" } },
      { k: "PE", title: "Összes lendület (folytonos, kg·m/s) és mozgási energia (szaggatott, J)", opt: { xLabel: "t", xUnit: "s", yLabel: "p, E", yUnit: "" } },
    ],
    readouts: [["p", "össz. lendület"], ["E", "össz. mozgási E"], ["v1", "v₁"], ["v2", "v₂"], ["Q", "hővé alakult"]],
    model(st) {
      const w = 0.6, x1 = -2, x2 = 2;
      const P = st.m1 * st.v1 + st.m2 * st.v2, Ms = st.m1 + st.m2;
      const u1 = (P + st.m2 * st.k * (st.v2 - st.v1)) / Ms, u2 = (P + st.m1 * st.k * (st.v1 - st.v2)) / Ms;
      const tc = st.v1 > st.v2 ? (x2 - x1 - w) / (st.v1 - st.v2) : Infinity;
      const T = Number.isFinite(tc) ? Math.min(12, tc + 2.5) : 3;
      const pos = (t) => t < tc ? [x1 + st.v1 * t, x2 + st.v2 * t] : [x1 + st.v1 * tc + u1 * (t - tc), x2 + st.v2 * tc + u2 * (t - tc)];
      const vel = (t) => (t < tc ? [st.v1, st.v2] : [u1, u2]);
      let lo = Infinity, hi = -Infinity;
      for (let i = 0; i <= 100; i++) { const p = pos((T * i) / 100); lo = Math.min(lo, p[0] - w / 2); hi = Math.max(hi, p[1] + w / 2); }
      return { w, tc, T, P, u1, u2, pos, vel, lo: Math.min(lo, -3), hi: Math.max(hi, 3) };
    },
    duration: (st, M) => M.T,
    series(st, M) {
      const d = [0, M.T];
      const E = (t) => { const [a, b] = M.vel(t); return 0.5 * st.m1 * a * a + 0.5 * st.m2 * b * b; };
      return {
        v: [{ name: "v₁", fn: (t) => M.vel(t)[0], domain: d, samples: 600 }, { name: "v₂", fn: (t) => M.vel(t)[1], domain: d, samples: 600 }],
        PE: [{ name: "p össz.", fn: () => M.P, domain: d, samples: 2 }, { name: "E össz.", fn: E, domain: d, samples: 600 }],
      };
    },
    values(st, M, t) {
      const [a, b] = M.vel(t), E = 0.5 * st.m1 * a * a + 0.5 * st.m2 * b * b, E0 = 0.5 * st.m1 * st.v1 ** 2 + 0.5 * st.m2 * st.v2 ** 2;
      return { p: f2(M.P, "kg·m/s"), E: f2(E, "J"), v1: f2(a, "m/s"), v2: f2(b, "m/s"), Q: f2(E0 - E, "J") };
    },
    draw(g, st, M, t) {
      const W = g.W, y = 90, m = 30, k = (W - 2 * m) / (M.hi - M.lo), P = (x) => m + (x - M.lo) * k;
      g.line(10, y + 22, W - 10, y + 22, COL.dim, 1.5);
      const [x1, x2] = M.pos(t), [va, vb] = M.vel(t);
      const cart = (x, mass, v, lab) => {
        const wpx = M.w * k, hpx = 18 + 12 * Math.sqrt(mass);
        g.rect(P(x) - wpx / 2, y + 16 - hpx, wpx, hpx, COL.hi, "#202020");
        g.circle(P(x) - wpx / 3, y + 18, 4, COL.mid, "#0A0A0A"); g.circle(P(x) + wpx / 3, y + 18, 4, COL.mid, "#0A0A0A");
        g.text(lab + " · " + fixed(mass, 1) + " kg", P(x), y + 38, { align: "center", color: COL.mid, size: 11 });
        if (Math.abs(v) > 0.02) g.arrow(P(x), y - hpx + 4, P(x) + v * 30, y - hpx + 4, COL.fg, fixed(v, 2) + " m/s", 1.5);
      };
      cart(x1, st.m1, va, "1");
      cart(x2, st.m2, vb, "2");
    },
    note(st, M) {
      if (!Number.isFinite(M.tc)) return "A kocsik nem érik utol egymást (v₁ ≤ v₂), így nem ütköznek. Állítsd úgy a sebességeket, hogy a bal kocsi gyorsabb legyen.";
      const E0 = 0.5 * st.m1 * st.v1 ** 2 + 0.5 * st.m2 * st.v2 ** 2, E1 = 0.5 * st.m1 * M.u1 ** 2 + 0.5 * st.m2 * M.u2 ** 2;
      let s = `Ütközés után: v₁' = ${fixed(M.u1, 2)} m/s, v₂' = ${fixed(M.u2, 2)} m/s. A lendület (${fixed(M.P, 2)} kg·m/s) változatlan; a mozgási energia ${fixed(E0, 2)} J → ${fixed(E1, 2)} J.`;
      if (st.k === 1 && Math.abs(st.m1 - st.m2) < 1e-9 && st.v2 === 0) s += " Azonos tömegű testek rugalmas ütközésekor a sebességek kicserélődnek.";
      if (st.k === 0) s += " Tökéletesen rugalmatlan ütközésnél a legnagyobb az energiaveszteség.";
      return s;
    },
  });

  /* =========================== INGA =========================== */
  const agm = (a, b) => { for (let i = 0; i < 30; i++) { const an = (a + b) / 2; b = Math.sqrt(a * b); a = an; } return a; };
  define({
    id: "inga", nev: "Matematikai inga", temakor: "rezgesek",
    leiras: "Pontos numerikus megoldás és a kis kitérésű közelítés összevetése: meddig igaz, hogy T = 2π√(l/g)?",
    kulcsszavak: "matematikai inga lengésidő periódusidő kis kitérés g mérés hold szimuláció",
    kepletek: ["inga-T", "helyzeti-E", "mozgasi-E"],
    params: [
      { k: "L", label: "Fonalhossz l", unit: "m", min: 0.1, max: 3, step: 0.05 },
      { k: "phi0", label: "Kezdeti kitérés φ₀", unit: "°", min: 1, max: 170, step: 1 },
      { k: "g", label: "Nehézségi gyorsulás", options: [[9.81, "Föld – 9,81 m/s²"], [1.62, "Hold – 1,62 m/s²"], [3.71, "Mars – 3,71 m/s²"], [24.8, "Jupiter – 24,8 m/s²"]] },
      { k: "m", label: "Tömeg m", unit: "kg", min: 0.05, max: 2, step: 0.05 },
    ],
    initial: { L: 1, phi0: 10, g: 9.81, m: 0.2 },
    presets: [["Kis kitérés (5°)", { phi0: 5 }], ["Közepes (45°)", { phi0: 45 }], ["Nagy (120°)", { phi0: 120 }]],
    formulas: "Kis kitérésnél ($\\varphi_0 \\lesssim 10°$): $$T = 2\\pi\\sqrt{\\dfrac{l}{g}}$$ A lengésidő nem függ a tömegtől és (kis kitérésnél) az amplitúdótól.",
    canvas: 300,
    plots: [
      { k: "phi", title: "Kitérési szög (folytonos: pontos, szaggatott: harmonikus közelítés)", opt: { xLabel: "t", xUnit: "s", yLabel: "φ", yUnit: "°" } },
      { k: "E", title: "Energiák (helyzeti, mozgási, összes)", opt: { xLabel: "t", xUnit: "s", yLabel: "E", yUnit: "J", yMinZero: true } },
    ],
    readouts: [["T", "lengésidő (pontos)"], ["T0", "2π√(l/g)"], ["d", "eltérés"], ["phi", "kitérés"], ["v", "sebesség"]],
    model(st) {
      const p0 = st.phi0 * R, w0 = Math.sqrt(st.g / st.L), T0 = 2 * Math.PI / w0;
      const Tex = (4 / w0) * (Math.PI / (2 * agm(1, Math.cos(p0 / 2))));
      const dur = Math.min(30, 3 * Tex);
      const n = 1500;
      const S = rk4((t, y) => [y[1], -(st.g / st.L) * Math.sin(y[0])], [p0, 0], dur / n, n);
      return { p0, w0, T0, Tex, dur, S };
    },
    duration: (st, M) => M.dur,
    series(st, M) {
      const Eh = (y) => st.m * st.g * st.L * (1 - Math.cos(y[0])), Em = (y) => 0.5 * st.m * (st.L * y[1]) ** 2;
      return {
        phi: [{ name: "pontos", points: pts(M.S, (y) => y[0] / R) }, { name: "közelítés", fn: (t) => st.phi0 * Math.cos(M.w0 * t), domain: [0, M.dur] }],
        E: [{ name: "E_h", points: pts(M.S, Eh) }, { name: "E_m", points: pts(M.S, Em) }, { name: "E", points: pts(M.S, (y) => Eh(y) + Em(y)) }],
      };
    },
    values(st, M, t) {
      return { T: f3(M.Tex, "s"), T0: f3(M.T0, "s"), d: "+" + fixed((100 * (M.Tex - M.T0)) / M.T0, 2) + " %", phi: fixed(at(M.S, t, 0) / R, 1) + "°", v: f2(Math.abs(st.L * at(M.S, t, 1)), "m/s") };
    },
    draw(g, st, M, t) {
      const W = g.W, H = g.H, px = W / 2, py = 24;
      const Ls = (st.phi0 > 90 ? (H - 60) / 2 : H - 60) * (0.45 + (0.55 * st.L) / 3);
      g.line(px - 60, py, px + 60, py, COL.mid, 2);
      // ív a pályán
      g.ctx.strokeStyle = COL.grid; g.ctx.lineWidth = 1; g.ctx.setLineDash([3, 4]); g.ctx.beginPath(); g.ctx.arc(px, py, Ls, Math.PI / 2 - M.p0, Math.PI / 2 + M.p0); g.ctx.stroke(); g.ctx.setLineDash([]);
      g.line(px, py, px, py + Ls + 14, COL.grid, 1, [2, 4]);
      const ph = at(M.S, t, 0), om = at(M.S, t, 1);
      const bx = px + Ls * Math.sin(ph), by = py + Ls * Math.cos(ph);
      g.line(px, py, bx, by, COL.fg, 1.5);
      const r = 8 + 6 * Math.cbrt(st.m);
      g.circle(bx, by, r, COL.hi, "#202020", 2);
      const v = st.L * om, k = 22;
      if (Math.abs(v) > 0.02) g.arrow(bx, by, bx + Math.cos(ph) * v * k, by - Math.sin(ph) * v * k, COL.fg, "v", 1.5);
      g.text("l = " + fixed(st.L, 2) + " m", px + 8, py + 14, { color: COL.mid, size: 11 });
    },
    note(st, M) {
      const d = (100 * (M.Tex - M.T0)) / M.T0;
      return d < 0.5
        ? `${st.phi0}°-os kitérésnél a pontos lengésidő csak ${fixed(d, 2)} %-kal nagyobb a képletből számoltnál – a harmonikus közelítés kiváló. Ezért mérjük az ingát kis kitéréssel (szóbeli mérés).`
        : `${st.phi0}°-nál a pontos lengésidő már ${fixed(d, 1)} %-kal nagyobb: a visszatérítő erő (mg·sin φ) kisebb, mint a lineáris közelítésé (mg·φ), ezért lassabban leng vissza. Nagy kitérésnél a mozgás nem harmonikus.`;
    },
  });

  /* =========================== RUGÓS REZGŐ =========================== */
  define({
    id: "rugo", nev: "Rugós rezgő, csillapítás", temakor: "rezgesek",
    leiras: "Kitérés, sebesség és gyorsulás fázisviszonyai, a harmonikus rezgés mint a körmozgás vetülete, energiacsere és csillapodás.",
    kulcsszavak: "rugós rezgő harmonikus rezgőmozgás csillapítás fázis körmozgás vetülete energia periódusidő szimuláció",
    kepletek: ["rugo-T", "rezges-kiteres", "rezges-vmax", "rezges-amax", "rezges-E"],
    params: [
      { k: "m", label: "Tömeg m", unit: "kg", min: 0.1, max: 5, step: 0.1 },
      { k: "D", label: "Rugóállandó D", unit: "N/m", min: 5, max: 200, step: 1 },
      { k: "A", label: "Amplitúdó A", unit: "m", min: 0.02, max: 0.3, step: 0.01 },
      { k: "b", label: "Csillapítás b", unit: "kg/s", min: 0, max: 10, step: 0.1 },
    ],
    initial: { m: 1, D: 40, A: 0.15, b: 0 },
    presets: [["Csillapítatlan", { b: 0 }], ["Gyengén csillapított", { b: 0.6 }], ["Kritikus", { m: 1, D: 40, b: 2 * Math.sqrt(40) }], ["Négyszeres tömeg", { m: 4, b: 0 }]],
    formulas: "$$T = 2\\pi\\sqrt{\\dfrac{m}{D}}$$$$x = A\\cos\\omega t,\\ v = -A\\omega\\sin\\omega t,\\ a = -\\omega^2 x$$$$E = \\tfrac12 DA^2 = \\tfrac12 mv^2 + \\tfrac12 Dx^2$$",
    canvas: 200,
    plots: [
      { k: "x", title: "Kitérés–idő (x–t)", opt: { xLabel: "t", xUnit: "s", yLabel: "x", yUnit: "m", height: 170 } },
      { k: "v", title: "Sebesség–idő (v–t)", opt: { xLabel: "t", xUnit: "s", yLabel: "v", yUnit: "m/s", height: 170 } },
      { k: "a", title: "Gyorsulás–idő (a–t)", opt: { xLabel: "t", xUnit: "s", yLabel: "a", yUnit: "m/s²", height: 170 } },
      { k: "E", title: "Energiák (rugalmas, mozgási, összes)", opt: { xLabel: "t", xUnit: "s", yLabel: "E", yUnit: "J", height: 170, yMinZero: true } },
    ],
    readouts: [["T", "periódusidő"], ["f", "frekvencia"], ["x", "kitérés"], ["v", "sebesség"], ["a", "gyorsulás"]],
    model(st) {
      const w0 = Math.sqrt(st.D / st.m), T0 = (2 * Math.PI) / w0, dur = Math.min(25, 4 * T0);
      const n = 1600;
      const S = rk4((t, y) => [y[1], (-st.D * y[0] - st.b * y[1]) / st.m], [st.A, 0], dur / n, n);
      const gam = st.b / (2 * st.m), wd2 = w0 * w0 - gam * gam;
      return { w0, T0, dur, S, gam, Td: wd2 > 0 ? (2 * Math.PI) / Math.sqrt(wd2) : Infinity };
    },
    duration: (st, M) => M.dur,
    series(st, M) {
      const acc = (y) => (-st.D * y[0] - st.b * y[1]) / st.m;
      const Er = (y) => 0.5 * st.D * y[0] ** 2, Em = (y) => 0.5 * st.m * y[1] ** 2;
      return {
        x: [{ name: "x", points: pts(M.S, (y) => y[0]) }],
        v: [{ name: "v", points: pts(M.S, (y) => y[1]) }],
        a: [{ name: "a", points: pts(M.S, acc) }],
        E: [{ name: "E_r", points: pts(M.S, Er) }, { name: "E_m", points: pts(M.S, Em) }, { name: "E", points: pts(M.S, (y) => Er(y) + Em(y)) }],
      };
    },
    values(st, M, t) {
      const x = at(M.S, t, 0), v = at(M.S, t, 1);
      return { T: Number.isFinite(M.Td) ? f3(M.Td, "s") : "— (nem rezeg)", f: Number.isFinite(M.Td) ? f3(1 / M.Td, "Hz") : "—", x: f3(x, "m"), v: f3(v, "m/s"), a: f3((-st.D * x - st.b * v) / st.m, "m/s²") };
    },
    draw(g, st, M, t) {
      const W = g.W, H = g.H, y = H / 2 + 10;
      const circ = st.b === 0 && W > 520;
      const right = circ ? W - 200 : W - 20;
      const x0 = 30 + (right - 30) * 0.58, k = Math.min(380, (right - 30) * 0.3) / 0.3;
      g.line(30, y - 40, 30, y + 40, COL.mid, 3);
      g.line(30, y + 26, right, y + 26, COL.dim, 1);
      g.line(x0, y - 50, x0, y + 34, COL.grid, 1, [3, 4]); g.text("0", x0, y + 40, { align: "center", color: COL.dim, size: 11, base: "top" });
      const x = at(M.S, t, 0), v = at(M.S, t, 1), a = (-st.D * x - st.b * v) / st.m;
      const bx = x0 + x * k, bw = 26 + 14 * Math.cbrt(st.m);
      g.spring(30, y, bx - bw / 2, y, 12, 9, COL.mid);
      g.rect(bx - bw / 2, y - bw / 2, bw, bw, COL.hi, "#202020");
      if (Math.abs(v) > 1e-3) g.arrow(bx, y - bw / 2 - 10, bx + v * 60, y - bw / 2 - 10, COL.fg, "v", 1.5);
      if (Math.abs(a) > 1e-3) g.arrow(bx, y + bw / 2 + 2, bx + a * 6, y + bw / 2 + 2, COL.mid, "a", 1.5);
      if (circ) {
        const cx = W - 100, r = Math.min(70, st.A * k), ph = M.w0 * t;
        g.circle(cx, y, r, COL.grid, null, 1);
        const px = cx + r * Math.cos(ph), py = y - r * Math.sin(ph);
        g.line(px, py, px, y, COL.dim, 1, [3, 3]);
        g.circle(px, py, 5, null, COL.hi); g.circle(px, y, 4, null, COL.mid);
        g.line(cx, y, px, py, COL.dim, 1);
        g.text("körmozgás vetülete", cx, y + r + 16, { align: "center", color: COL.mid, size: 11 });
      }
    },
    note(st, M) {
      if (!Number.isFinite(M.Td)) return `A csillapítás olyan erős (b ≥ 2√(mD) = ${fixed(2 * Math.sqrt(st.m * st.D), 2)} kg/s), hogy a test rezgés nélkül, aperiodikusan tér vissza az egyensúlyi helyzetbe.`;
      if (st.b === 0) return `A sebesség negyed periódussal „siet” a kitéréshez képest, a gyorsulás pedig mindig ellentétes a kitéréssel (a = −ω²x). Az összes energia állandó: ${fixed(0.5 * st.D * st.A * st.A, 3)} J. A jobb oldali kör mutatja, hogy a harmonikus rezgés az egyenletes körmozgás vetülete.`;
      return `Csillapított rezgés: az amplitúdó exponenciálisan csökken, az energia hővé alakul. A periódusidő (${fixed(M.Td, 3)} s) alig nagyobb a csillapítatlannál (${fixed(M.T0, 3)} s).`;
    },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
