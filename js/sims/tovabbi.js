/* PHYSICS OS — Labor: körmozgás, interferencia, bolygómozgás, tömegspektrométer */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const { define, COL } = PO.simkit;
  const { fixed, fmt } = PO.util;
  const f2 = (x, u) => fixed(x, 2) + " " + u;
  const f3 = (x, u) => fmt(x, 3) + " " + u;

  /* =========================== KÖRMOZGÁS =========================== */
  define({
    id: "kormozgas", nev: "Körmozgás és centripetális erő", temakor: "dinamika",
    leiras: "Egyenletes és egyenletesen változó körmozgás: sebesség- és gyorsulásvektorok, a centripetális erő nagysága.",
    kulcsszavak: "körmozgás centripetális erő gyorsulás szögsebesség kerületi sebesség tangenciális szöggyorsulás szimuláció",
    kepletek: ["cp-ero"],
    params: [
      { k: "r", label: "Sugár r", unit: "m", min: 0.2, max: 3, step: 0.1 },
      { k: "w0", label: "Kezdeti szögsebesség ω₀", unit: "1/s", min: 0, max: 6, step: 0.1 },
      { k: "beta", label: "Szöggyorsulás β", unit: "1/s²", min: -1, max: 1, step: 0.05 },
      { k: "m", label: "Tömeg m", unit: "kg", min: 0.1, max: 5, step: 0.1 },
    ],
    initial: { r: 1.5, w0: 2, beta: 0, m: 1 },
    presets: [["Egyenletes", { beta: 0, w0: 2 }], ["Gyorsuló", { w0: 0.5, beta: 0.5 }], ["Lassuló", { w0: 4, beta: -0.6 }]],
    formulas: "$$v = r\\omega \\qquad a_{cp} = \\frac{v^2}{r} = r\\omega^2 \\qquad a_t = r\\beta$$$$F_{cp} = m\\frac{v^2}{r}$$ Egyenletes körmozgásnál a gyorsulás a középpont felé mutat; változó körmozgásnál érintő irányú összetevője is van.",
    canvas: 300,
    plots: [
      { k: "w", title: "Szögsebesség–idő (ω–t)", opt: { xLabel: "t", xUnit: "s", yLabel: "ω", yUnit: "1/s" } },
      { k: "a", title: "Gyorsulás (folytonos: centripetális, szaggatott: érintő irányú)", opt: { xLabel: "t", xUnit: "s", yLabel: "a", yUnit: "m/s²" } },
    ],
    readouts: [["v", "kerületi sebesség"], ["acp", "a_cp"], ["at", "a_t"], ["F", "eredő erő"], ["T", "periódusidő"]],
    model(st) {
      const tStop = st.beta < 0 ? -st.w0 / st.beta : Infinity;
      return { dur: Math.min(10, tStop), tStop };
    },
    duration: (st, M) => Math.max(0.5, M.dur),
    series(st, M) {
      const d = [0, Math.max(0.5, M.dur)], w = (t) => st.w0 + st.beta * t;
      return { w: [{ name: "ω", fn: w, domain: d, samples: 2 }], a: [{ name: "a_cp", fn: (t) => st.r * w(t) ** 2, domain: d }, { name: "a_t", fn: () => st.r * st.beta, domain: d, samples: 2 }] };
    },
    values(st, M, t) {
      const w = st.w0 + st.beta * t, v = st.r * w, acp = st.r * w * w, at = st.r * st.beta, a = Math.hypot(acp, at);
      return { v: f2(v, "m/s"), acp: f2(acp, "m/s²"), at: f2(at, "m/s²"), F: f2(st.m * a, "N"), T: Math.abs(w) > 1e-6 ? f2((2 * Math.PI) / Math.abs(w), "s") : "—" };
    },
    draw(g, st, M, t) {
      const cx = g.W / 2, cy = g.H / 2, R = (g.H / 2 - 30) * (0.45 + 0.55 * (st.r / 3));
      g.circle(cx, cy, R, COL.grid, null, 1);
      g.circle(cx, cy, 3, null, COL.mid);
      const phi = st.w0 * t + 0.5 * st.beta * t * t, w = st.w0 + st.beta * t;
      const x = cx + R * Math.cos(phi), y = cy - R * Math.sin(phi);
      g.line(cx, cy, x, y, COL.dim, 1, [4, 4]);
      const ux = -Math.sin(phi), uy = -Math.cos(phi); // érintő (képernyő-koordinátában)
      const v = st.r * w, ks = 22;
      if (Math.abs(v) > 0.01) g.arrow(x, y, x + ux * v * ks, y + uy * v * ks, COL.fg, "v", 2);
      const acp = st.r * w * w, at = st.r * st.beta, ka = 10;
      if (acp > 0.01) g.arrow(x, y, x + (cx - x) / R * Math.min(acp * ka, R * 0.9), y + (cy - y) / R * Math.min(acp * ka, R * 0.9), COL.hi, "a_cp", 2);
      if (Math.abs(at) > 0.01) g.arrow(x, y, x + ux * at * ka * 3, y + uy * at * ka * 3, COL.mid, "a_t", 1.5);
      g.circle(x, y, 9 + 3 * Math.cbrt(st.m), COL.hi, "#202020", 2);
    },
    note(st, M) {
      if (st.beta === 0) return `Egyenletes körmozgás: a sebesség nagysága állandó, iránya folyamatosan változik – ezért van gyorsulás, és ehhez ${fixed(st.m * st.r * st.w0 ** 2, 2)} N középpont felé mutató erő kell (pl. kötélerő, súrlódás, gravitáció).`;
      if (st.beta < 0 && Number.isFinite(M.tStop)) return `Lassuló körmozgás: a test ${fixed(M.tStop, 2)} s múlva áll meg. A gyorsulásnak érintő irányú összetevője is van, ezért a gyorsulásvektor nem a középpont felé mutat.`;
      return "Gyorsuló körmozgás: a centripetális gyorsulás a szögsebesség négyzetével nő, az érintő irányú állandó (rβ).";
    },
  });

  /* =========================== INTERFERENCIA =========================== */
  define({
    id: "interferencia", nev: "Hullámok interferenciája", temakor: "mech-hullamok",
    leiras: "Két pontforrás hullámai: erősítés ott, ahol az útkülönbség a hullámhossz egész számú többszöröse, gyengítés a félhullámnyi különbségeknél.",
    kulcsszavak: "interferencia két forrás útkülönbség erősítés gyengítés hullámkád koherens young szimuláció",
    kepletek: ["optikai-racs", "hullam-c"],
    params: [
      { k: "lam", label: "Hullámhossz λ", unit: "cm", min: 1, max: 6, step: 0.1 },
      { k: "d", label: "Források távolsága d", unit: "cm", min: 1, max: 20, step: 0.5 },
      { k: "ph", label: "Fáziskülönbség", options: [[0, "azonos fázis"], [180, "ellentétes fázis (180°)"]] },
      { k: "mode", label: "Megjelenítés", options: [["pill", "Pillanatkép (hullámok)"], ["int", "Átlagos intenzitás"]] },
    ],
    initial: { lam: 3, d: 10, ph: 0, mode: "pill" },
    presets: [["Sok maximum (d ≫ λ)", { d: 18, lam: 2 }], ["Kevés maximum", { d: 4, lam: 3 }], ["Ellentétes fázis", { ph: 180 }]],
    formulas: "Erősítés: $$\\Delta s = k\\lambda$$ Gyengítés: $$\\Delta s = (2k + 1)\\frac\\lambda2$$ Távol a forrásoktól: $d\\sin\\alpha_k = k\\lambda$.",
    canvas: 320,
    plots: [{ k: "I", title: "Intenzitás a jobb oldali „ernyőn” (függőlegesen)", opt: { xLabel: "y", xUnit: "cm", yLabel: "I", yUnit: "rel.", yMinZero: true } }],
    plotCols: 1,
    readouts: [["n", "maximumok száma (ernyő felé)"], ["a1", "első mellékmaximum iránya"]],
    model(st) {
      const k = (2 * Math.PI) / st.lam, phi = (st.ph * Math.PI) / 180;
      return { k, phi, nmax: Math.floor(st.d / st.lam) };
    },
    duration: () => 12,
    speed: () => 1,
    series(st, M) {
      // ernyő: x = 40 cm-re a forrásoktól, y ∈ [-30, 30] cm
      const X = 40;
      const I = (y) => { const r1 = Math.hypot(X, y - st.d / 2), r2 = Math.hypot(X, y + st.d / 2); return 1 + Math.cos(M.k * (r1 - r2) + M.phi); };
      return { I: [{ name: "I(y)", fn: I, domain: [-30, 30], samples: 600 }] };
    },
    markers: false,
    values(st, M) {
      const s = st.lam / st.d;
      return { n: String(2 * M.nmax + 1 - (st.ph ? 1 : 0)), a1: s <= 1 ? fixed((Math.asin(s) * 180) / Math.PI, 1) + "°" : "nincs" };
    },
    draw(g, st, M, t) {
      const W = g.W, H = g.H, scale = H / 60; // px/cm, a függőleges tartomány 60 cm
      const cx = 30, cy = H / 2, w = 2 * Math.PI * 0.8;
      const step = W > 700 ? 4 : 5;
      const ctx = g.ctx;
      for (let px = 0; px < W; px += step) {
        for (let py = 0; py < H; py += step) {
          const x = (px - cx) / scale, y = (py - cy) / scale;
          const r1 = Math.hypot(x, y - st.d / 2), r2 = Math.hypot(x, y + st.d / 2);
          let v;
          if (st.mode === "int") v = (1 + Math.cos(M.k * (r1 - r2) + M.phi)) / 2;
          else {
            const a1 = Math.cos(M.k * r1 - w * t) / Math.sqrt(1 + r1 / 6), a2 = Math.cos(M.k * r2 - w * t + M.phi) / Math.sqrt(1 + r2 / 6);
            v = 0.5 + 0.35 * (a1 + a2);
          }
          const c = Math.max(0, Math.min(255, Math.round(v * 230)));
          ctx.fillStyle = `rgb(${c},${c},${c})`;
          ctx.fillRect(px, py, step, step);
        }
      }
      const sx = cx + 40 * scale;
      if (sx < W - 4) { g.line(sx, 0, sx, H, "rgba(255,255,255,0.6)", 2, [6, 4]); g.text("ernyő (40 cm)", sx - 6, 12, { align: "right", color: "#fff", size: 11, bold: true }); }
      [[-st.d / 2, "S₁"], [st.d / 2, "S₂"]].forEach(([y, l]) => { const py = cy + y * scale; g.circle(cx, py, 5, "#000", "#fff", 2); g.text(l, cx + 10, py, { color: "#fff", size: 12, bold: true }); });
      // erősítési irányok
      for (let k = -M.nmax; k <= M.nmax; k++) {
        const s = (k * st.lam - (st.ph ? st.lam / 2 : 0)) / st.d;
        if (Math.abs(s) > 1) continue;
        const a = Math.asin(s);
        g.line(cx, cy, cx + Math.cos(a) * W, cy + Math.sin(a) * W, "rgba(255,255,255,0.18)", 1, [6, 6]);
      }
    },
    note(st, M) {
      return `A források ${fixed(st.d, 1)} cm-re vannak, a hullámhossz ${fixed(st.lam, 1)} cm, ezért legfeljebb |k| ≤ ${M.nmax} rendű erősítési irány létezik. Nagyobb forrástávolság vagy kisebb hullámhossz → sűrűbb interferenciakép. ${st.ph ? "Ellentétes fázisú forrásoknál a szimmetriatengelyen gyengítés van." : "A szimmetriatengelyen (útkülönbség 0) mindig erősítés van."}`;
    },
  });

  /* =========================== BOLYGÓMOZGÁS =========================== */
  define({
    id: "bolygo", nev: "Bolygómozgás, Kepler-törvények", temakor: "gravitacio",
    leiras: "Bolygó a Nap körül a gravitációs törvény alapján: ellipszispálya, egyenlő idők alatt egyenlő területek, a³/T² állandósága.",
    kulcsszavak: "kepler törvények bolygó ellipszis pálya excentricitás napközel naptávol területi sebesség keringési idő szökési sebesség szimuláció",
    kepletek: ["kepler3", "kering-seb", "gravitacios-ero"],
    params: [
      { k: "r0", label: "Kezdeti naptávolság", unit: "CSE", min: 0.4, max: 3, step: 0.1 },
      { k: "q", label: "Kezdősebesség / körpályás sebesség", unit: "", min: 0.4, max: 1.5, step: 0.01 },
      { k: "nseg", label: "Területszeletek száma", options: [[6, "6"], [8, "8"], [12, "12"]] },
    ],
    initial: { r0: 1, q: 1.2, nseg: 8 },
    presets: [["Körpálya", { q: 1 }], ["Elnyúlt ellipszis", { q: 1.3 }], ["Belső ellipszis", { q: 0.7 }], ["Szökés", { q: 1.45 }]],
    formulas: "Mértékegységek: CSE, év; így $\\gamma M_{Nap} = 4\\pi^2$. $$v_{kör} = \\sqrt{\\frac{\\gamma M}{r}} \\qquad v_{szökés} = \\sqrt2\\,v_{kör}$$$$\\frac{a^3}{T^2} = 1\\ \\mathrm{\\frac{CSE^3}{év^2}}$$",
    canvas: 360,
    plots: [{ k: "r", title: "Naptávolság (folytonos, CSE) és sebesség (szaggatott, CSE/év ÷ 2π)", opt: { xLabel: "t", xUnit: "év", yLabel: "r, v", yUnit: "", yMinZero: true } }],
    plotCols: 1,
    readouts: [["r", "naptávolság"], ["v", "sebesség"], ["T", "keringési idő"], ["e", "excentricitás"], ["k", "a³/T²"]],
    model(st) {
      const GM = 4 * Math.PI * Math.PI, v0 = st.q * Math.sqrt(GM / st.r0);
      const E = 0.5 * v0 * v0 - GM / st.r0, bound = E < 0;
      const a = bound ? -GM / (2 * E) : Infinity, T = bound ? Math.sqrt(a ** 3) : Infinity;
      const h = st.r0 * v0, e = Math.sqrt(Math.max(0, 1 + (2 * E * h * h) / (GM * GM)));
      const dur = bound ? T : 3;
      const n = 3000, dt = dur / n;
      let x = st.r0, y = 0, vx = 0, vy = v0;
      const acc = (x, y) => { const r3 = Math.pow(x * x + y * y, 1.5); return [(-GM * x) / r3, (-GM * y) / r3]; };
      const P = [[0, x, y, vx, vy]];
      for (let i = 1; i <= n; i++) {
        // sebesség-Verlet (szimplektikus, energiatartó)
        let [ax, ay] = acc(x, y);
        vx += (ax * dt) / 2; vy += (ay * dt) / 2;
        x += vx * dt; y += vy * dt;
        [ax, ay] = acc(x, y);
        vx += (ax * dt) / 2; vy += (ay * dt) / 2;
        P.push([i * dt, x, y, vx, vy]);
      }
      let ext = 0; P.forEach((p) => (ext = Math.max(ext, Math.abs(p[1]), Math.abs(p[2]))));
      return { GM, a, T, e, bound, dur, P, dt, ext: Math.min(ext, 8) };
    },
    duration: (st, M) => M.dur,
    speed: (st, M) => Math.max(0.3, M.dur / 8),
    series(st, M) {
      return { r: [{ name: "r", points: M.P.filter((_, i) => i % 5 === 0).map((p) => [p[0], Math.hypot(p[1], p[2])]) }, { name: "v", points: M.P.filter((_, i) => i % 5 === 0).map((p) => [p[0], Math.hypot(p[3], p[4]) / (2 * Math.PI)]) }] };
    },
    values(st, M, t) {
      const p = M.P[Math.min(M.P.length - 1, Math.round(t / M.dt))];
      return { r: f3(Math.hypot(p[1], p[2]), "CSE"), v: f3((Math.hypot(p[3], p[4]) * 1.496e8) / 3.156e7, "km/s"), T: M.bound ? f3(M.T, "év") : "∞ (elszökik)", e: M.bound ? fixed(M.e, 3) : "≥ 1", k: M.bound ? fixed(M.a ** 3 / M.T ** 2, 3) : "—" };
    },
    draw(g, st, M, t) {
      const W = g.W, H = g.H;
      // a pálya középpontja: ellipszisnél a nagytengely közepe
      const xs = M.P.map((p) => p[1]), ys = M.P.map((p) => p[2]);
      const minx = Math.max(-M.ext, Math.min(...xs)), maxx = Math.min(M.ext, Math.max(...xs)), miny = Math.max(-M.ext, Math.min(...ys)), maxy = Math.min(M.ext, Math.max(...ys));
      const s = Math.min((W - 40) / (maxx - minx || 1), (H - 40) / (maxy - miny || 1));
      const ox = W / 2 - ((minx + maxx) / 2) * s, oy = H / 2 + ((miny + maxy) / 2) * s;
      const X = (x) => ox + x * s, Y = (y) => oy - y * s;
      // területszeletek
      if (M.bound) {
        const n = st.nseg, per = Math.floor((M.P.length - 1) / n);
        for (let k = 0; k < n; k += 2) {
          const pts = [[X(0), Y(0)]];
          for (let i = k * per; i <= (k + 1) * per; i += 3) pts.push([X(M.P[i][1]), Y(M.P[i][2])]);
          g.poly(pts, null, 0, true, "rgba(255,255,255,0.07)");
        }
      }
      g.poly(M.P.filter((_, i) => i % 3 === 0).map((p) => [X(p[1]), Y(p[2])]), COL.dim, 1.2);
      g.circle(X(0), Y(0), 10, null, "#EAEAEA");
      g.text("Nap", X(0), Y(0) + 20, { align: "center", color: COL.mid, size: 11 });
      const p = M.P[Math.min(M.P.length - 1, Math.round(t / M.dt))];
      g.line(X(0), Y(0), X(p[1]), Y(p[2]), COL.mid, 1, [3, 4]);
      const vs = 6;
      g.arrow(X(p[1]), Y(p[2]), X(p[1]) + p[3] * vs, Y(p[2]) - p[4] * vs, COL.fg, "v", 1.5);
      g.circle(X(p[1]), Y(p[2]), 6, COL.hi, "#202020", 2);
    },
    note(st, M) {
      if (!M.bound) return `A kezdősebesség eléri a szökési sebességet (√2 ≈ 1,41-szerese a körpályásnak): a bolygó nem kering, hanem végleg eltávolodik (parabola/hiperbola pálya).`;
      if (Math.abs(st.q - 1) < 0.005) return "Körpálya: a gravitációs erő pontosan a szükséges centripetális erő, a sebesség nagysága állandó.";
      return `Ellipszispálya (e = ${fixed(M.e, 2)}), a Nap az egyik fókuszban (Kepler I.). A satírozott szeletek mind ugyanannyi idő alatt jönnek létre, és a területük egyenlő (Kepler II.): napközelben gyorsabb a bolygó. a³/T² = ${fixed(M.a ** 3 / M.T ** 2, 3)} – minden pályára ugyanannyi (Kepler III.).`;
    },
  });

  /* =========================== TÖMEGSPEKTROMÉTER =========================== */
  const IONS = [["Ne20", "²⁰Ne⁺ és ²²Ne⁺", [20, 22]], ["C12", "¹²C⁺ és ¹⁴C⁺", [12, 14]], ["U235", "²³⁵U⁺ és ²³⁸U⁺", [235, 238]], ["Cl35", "³⁵Cl⁺ és ³⁷Cl⁺", [35, 37]]];
  define({
    id: "tomegspektrometer", nev: "Töltött részecske mágneses mezőben", temakor: "magnesseg",
    leiras: "Tömegspektrométer: a feszültséggel gyorsított ionok a mágneses mezőben félkört írnak le; a nehezebb izotóp nagyobb sugarú pályán mozog.",
    kulcsszavak: "tömegspektrométer lorentz erő körpálya izotóp ion gyorsítás mágneses mező szimuláció",
    kepletek: ["kor-magneses", "lorentz", "e-munka"],
    params: [
      { k: "ion", label: "Ionpár", options: IONS.map(([id, n]) => [id, n]) },
      { k: "U", label: "Gyorsítófeszültség U", unit: "V", min: 100, max: 5000, step: 50 },
      { k: "B", label: "Mágneses indukció B", unit: "T", min: 0.05, max: 1, step: 0.01 },
      { k: "z", label: "Töltés", options: [[1, "egyszeresen ionizált"], [2, "kétszeresen ionizált"]] },
    ],
    initial: { ion: "Ne20", U: 1000, B: 0.2, z: 1 },
    presets: [["Neon-izotópok", { ion: "Ne20", U: 1000, B: 0.2 }], ["Urándúsítás elve", { ion: "U235", U: 3000, B: 0.8 }], ["Erősebb mező", { B: 0.6 }]],
    formulas: "$$qU = \\tfrac12 mv^2 \\qquad qvB = m\\frac{v^2}{r}$$$$r = \\frac{mv}{qB} = \\frac1B\\sqrt{\\frac{2mU}{q}}$$ A becsapódás a belépési ponttól $2r$ távolságra van.",
    canvas: 300,
    plots: [{ k: "r", title: "Pályasugár a tömegszám függvényében (r ∝ √m)", opt: { xLabel: "m", xUnit: "u", yLabel: "r", yUnit: "cm", yMinZero: true, xMinZero: true } }],
    plotCols: 1,
    readouts: [["v1", "v (könnyebb)"], ["r1", "r (könnyebb)"], ["r2", "r (nehezebb)"], ["dx", "becsapódások távolsága"], ["T", "félkör ideje"]],
    model(st) {
      const pair = IONS.find((x) => x[0] === st.ion)[2], u = 1.6605e-27, q = st.z * 1.602e-19;
      const ions = pair.map((A) => { const m = A * u, v = Math.sqrt((2 * q * st.U) / m); return { A, m, v, r: (m * v) / (q * st.B), T: (Math.PI * m) / (q * st.B) }; });
      return { ions, q, u };
    },
    duration: (st, M) => 4,
    markers: false,
    series(st, M) {
      const amax = Math.max(...M.ions.map((i) => i.A)) * 1.3;
      return { r: [{ name: "r(m)", fn: (A) => 100 * Math.sqrt((2 * A * M.u * st.U) / M.q) / st.B, domain: [1, amax] }, { name: "ionok", points: M.ions.map((i) => [i.A, i.r * 100]), scatter: true }] };
    },
    values(st, M) {
      const [a, b] = M.ions;
      return { v1: f3(a.v / 1000, "km/s"), r1: f3(a.r * 100, "cm"), r2: f3(b.r * 100, "cm"), dx: f3(200 * (b.r - a.r), "cm"), T: f3(a.T * 1e6, "μs") };
    },
    draw(g, st, M, t) {
      const W = g.W, H = g.H, [a, b] = M.ions;
      const rmax = b.r, x0 = W / 2 + 0, y0 = 40;
      const s = Math.min((W / 2 - 30) / rmax, (H - 70) / rmax);
      // mágneses mező tartomány
      g.rect(x0 - rmax * s - 20, y0, 2 * rmax * s + 40, rmax * s + 20, COL.grid, "rgba(255,255,255,0.02)", 1);
      for (let px = x0 - rmax * s - 5; px < x0 + rmax * s + 20; px += 28) for (let py = y0 + 16; py < y0 + rmax * s + 16; py += 28) g.text("×", px, py, { color: "#303030", size: 12, align: "center" });
      g.text("B (a síkba befelé)", x0 + rmax * s + 16, y0 + rmax * s + 34, { color: COL.mid, size: 11, align: "right" });
      // forrás, gyorsító
      g.line(x0, 14, x0, y0, COL.dim, 1);
      g.rect(x0 - 14, 6, 28, 8, COL.mid, "#141414", 1); g.text("U = " + st.U + " V", x0 + 22, 10, { color: COL.mid, size: 11 });
      // detektorlemez
      g.line(x0 - 2 * rmax * s - 10, y0, x0 - 4, y0, COL.fg, 3);
      const frac = Math.min(1, t / 3);
      [[a, COL.hi], [b, COL.mid]].forEach(([ion, col]) => {
        const r = ion.r * s, cx = x0 - r;
        g.ctx.strokeStyle = col; g.ctx.lineWidth = 1.5; g.ctx.setLineDash(ion === b ? [5, 4] : []);
        g.ctx.beginPath(); g.ctx.arc(cx, y0, r, 0, Math.PI * frac); g.ctx.stroke(); g.ctx.setLineDash([]);
        const ang = Math.PI * frac;
        g.circle(cx + r * Math.cos(ang), y0 + r * Math.sin(ang), 4, null, col);
        if (frac >= 1) g.text(ion.A + " u", x0 - 2 * r, y0 - 12, { align: "center", color: col, size: 11 });
      });
    },
    note(st, M) {
      const [a, b] = M.ions;
      return `Azonos feszültséggel gyorsítva a nehezebb ion lassabb, de a pályasugár √m-mel arányosan mégis nagyobb. A két izotóp becsapódási helye ${fixed(200 * (b.r - a.r), 2)} cm-re van egymástól. Erősebb mágneses mezőben kisebb a sugár; kétszeres töltésnél 1/√2-szeres.`;
    },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
