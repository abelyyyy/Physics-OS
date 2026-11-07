/* PHYSICS OS — Labor: hajítások (szabadesés, függőleges, vízszintes és ferde hajítás)
 * Modell: homogén nehézségi mező, közegellenállás nélkül → analitikus (pontos) megoldás.
 */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const { h, fixed, rad, deg, parseNum, clamp } = PO.util;

  const G_PRESETS = [["Föld", 9.81], ["Hold", 1.62], ["Mars", 3.71], ["Jupiter", 24.79]];
  const PRESETS = [
    { nev: "Szabadesés", p: { v0: 0, alpha: 0, h0: 20 } },
    { nev: "Függőleges hajítás", p: { v0: 15, alpha: 90, h0: 0 } },
    { nev: "Vízszintes hajítás", p: { v0: 8, alpha: 0, h0: 20 } },
    { nev: "Ferde, 45°", p: { v0: 20, alpha: 45, h0: 0 } },
    { nev: "Súlylökés", p: { v0: 13, alpha: 40, h0: 2 } },
  ];
  const GRAPHS = [
    { key: "y", label: "y–t", y: "y", unit: "m", f: (P) => (t) => P.pos(t).y },
    { key: "x", label: "x–t", y: "x", unit: "m", f: (P) => (t) => P.pos(t).x },
    { key: "vy", label: "vᵧ–t", y: "vᵧ", unit: "m/s", f: (P) => (t) => P.vel(t).y },
    { key: "vx", label: "vₓ–t", y: "vₓ", unit: "m/s", f: (P) => (t) => P.vel(t).x },
    { key: "v", label: "|v|–t", y: "|v|", unit: "m/s", f: (P) => (t) => { const v = P.vel(t); return Math.hypot(v.x, v.y); } },
  ];

  function mount(container, opts = {}) {
    const state = Object.assign({ v0: 20, alpha: 45, h0: 0, g: 9.81, t: 0, running: false, speed: 1, showPath: true, showVec: true, graph: "y" }, opts.initial || {});
    let P = null;
    const pinned = [];

    /* ---------- felület ---------- */
    const world = h("canvas.sim-canvas", { role: "img", "aria-label": "A hajított test pályája" });
    const playBtn = h("button.btn.primary", { type: "button", onclick: () => (state.running ? pause() : play()) }, "▶ Indítás");
    const resetBtn = h("button.btn", { type: "button", onclick: () => { pause(); state.t = 0; frame(); } }, "↺ Újra");
    const pinBtn = h("button.btn.ghost", { type: "button", title: "A mostani pályát szaggatott vonallal megtartja összehasonlításhoz", onclick: pin }, "Pálya rögzítése");
    const clearBtn = h("button.btn.ghost", { type: "button", onclick: () => { pinned.length = 0; frame(); } }, "Rögzítettek törlése");
    const speedSeg = seg([["0,25×", 0.25], ["0,5×", 0.5], ["1×", 1], ["2×", 2]], state.speed, (v) => (state.speed = v), "Lejátszási sebesség");
    const tgPath = toggle("Teljes pálya", "showPath");
    const tgVec = toggle("Sebességvektorok", "showVec");

    const graphSeg = seg(GRAPHS.map((g) => [g.label, g.key]), state.graph, (k) => { state.graph = k; setGraph(); }, "Grafikon");
    const graphBox = h("div");
    const plot = PO.plot(graphBox, { xLabel: "t", xUnit: "s", yLabel: "y", yUnit: "m", height: 220 });

    const RO = {};
    const readouts = h("div.readouts", ["t", "x", "y", "vₓ", "vᵧ", "|v|"].map((k) => {
      RO[k] = h("div.v", "—");
      return h("div.readout", h("div.k", k), RO[k]);
    }));
    readouts.setAttribute("aria-live", "off");

    const RES = {};
    const results = h("table.data", h("tbody", [
      ["tRep", "Repülési idő"], ["tTop", "Tetőpont ideje"], ["d", "Hajítási távolság"], ["hMax", "Legnagyobb magasság"], ["vLand", "Becsapódási sebesség"],
    ].map(([k, label]) => { RES[k] = h("td", { style: { textAlign: "right", fontFamily: "var(--mono)" } }); return h("tr", h("td.muted", label), RES[k]); })));

    const inputs = {};
    const params = h("div.params",
      param("v0", "Kezdősebesség v₀", "m/s", 0, 50, 0.5),
      param("alpha", "Hajítási szög α", "°", 0, 90, 1),
      param("h0", "Kezdőmagasság h₀", "m", 0, 50, 0.5),
      gParam());

    const presetRow = h("div.btn-row", PRESETS.map((pr) => h("button.btn.sm.ghost", { type: "button", onclick: () => applyPreset(pr.p) }, pr.nev)));

    const formulas = h("div.small");
    formulas.innerHTML = PO.tex.html(
      "$$x(t) = v_0\\cos\\alpha\\cdot t$$" +
      "$$y(t) = h_0 + v_0\\sin\\alpha\\cdot t - \\tfrac{g}{2}t^2$$" +
      "$$v_x = v_0\\cos\\alpha,\\qquad v_y = v_0\\sin\\alpha - g\\,t$$");

    const task = simTask();

    const stage = h("div.sim-stage",
      world,
      h("div.row", playBtn, resetBtn, speedSeg, h("span.spacer"), tgPath, tgVec),
      readouts,
      h("div.row", h("span.small.muted", "Grafikon:"), graphSeg),
      graphBox,
      h("div.row", pinBtn, clearBtn));
    const side = h("aside.grid",
      h("div.panel", h("div.panel-title", "Paraméterek"), params, h("hr.sep"), h("div.small.muted", { style: { marginBottom: "6px" } }, "Előre beállított példák"), presetRow),
      h("div.panel", h("div.panel-title", "Eredmények"), results),
      h("div.panel", h("div.panel-title", "Képletek"), formulas, h("div.small.muted", "Feltétel: homogén nehézségi mező, közegellenállás nincs. A valóságban a közegellenállás csökkenti a távolságot és a magasságot.")),
      task);
    const root = h("div.sim", stage, side);
    container.append(root);

    /* ---------- vezérlők ---------- */
    function seg(items, value, onChange, label) {
      const box = h("div.seg", { role: "group", "aria-label": label });
      items.forEach(([lab, v]) => {
        const b = h("button", { type: "button", "aria-pressed": String(v === value) }, lab);
        b.addEventListener("click", () => { [...box.children].forEach((c) => c.setAttribute("aria-pressed", "false")); b.setAttribute("aria-pressed", "true"); onChange(v); });
        box.append(b);
      });
      return box;
    }
    function toggle(label, key) {
      const b = h("button.btn.sm.ghost", { type: "button", "aria-pressed": String(state[key]) }, label);
      b.addEventListener("click", () => { state[key] = !state[key]; b.setAttribute("aria-pressed", String(state[key])); frame(); });
      return b;
    }
    function param(key, label, unit, min, max, step) {
      const range = h("input", { type: "range", min, max, step, value: state[key], "aria-label": label });
      const num = h("input", { type: "number", min, max, step, value: state[key], "aria-label": label + " pontos értéke" });
      const set = (v, from) => {
        v = clamp(v, min, max);
        state[key] = v;
        if (from !== range) range.value = v;
        if (from !== num) num.value = String(v);
        num.classList.remove("invalid");
        changed();
      };
      range.addEventListener("input", () => set(Number(range.value), range));
      num.addEventListener("change", () => { const v = parseNum(num.value); if (Number.isFinite(v)) set(v, num); else num.classList.add("invalid"); });
      inputs[key] = { range, num, set };
      return h("div.param", h("label", h("span", label), h("span", unit)), range, num);
    }
    function gParam() {
      const sel = h("select", { "aria-label": "Égitest" }, G_PRESETS.map(([n, g]) => h("option", { value: g }, `${n} (${fixed(g, 2)})`)), h("option", { value: "egyeni" }, "Egyéni…"));
      const num = h("input", { type: "number", min: 0.1, max: 50, step: 0.01, value: state.g, "aria-label": "Nehézségi gyorsulás pontos értéke" });
      sel.addEventListener("change", () => { if (sel.value !== "egyeni") { state.g = Number(sel.value); num.value = state.g; changed(); } else num.focus(); });
      num.addEventListener("change", () => {
        const v = parseNum(num.value);
        if (Number.isFinite(v) && v > 0) { state.g = clamp(v, 0.1, 50); num.value = state.g; num.classList.remove("invalid"); const m = G_PRESETS.find((p) => p[1] === state.g); sel.value = m ? m[1] : "egyeni"; changed(); }
        else num.classList.add("invalid");
      });
      return h("div.param", h("label", h("span", "Nehézségi gyorsulás g"), h("span", "m/s²")), sel, num);
    }
    function applyPreset(p) {
      Object.entries(p).forEach(([k, v]) => inputs[k].set(v));
      play(true);
    }
    function pin() {
      if (pinned.length >= 6) pinned.shift();
      pinned.push({ P, label: `${fixed(state.alpha, 0)}°, ${fixed(state.v0, 1)} m/s` });
      frame();
      PO.toast && PO.toast("Pálya rögzítve – állíts be új értékeket az összehasonlításhoz");
    }

    /* ---------- modell ---------- */
    function compute() {
      P = PO.kin.projectile(state.v0, rad(state.alpha), state.g, state.h0);
      RES.tRep.textContent = fixed(P.tFlight, 2) + " s";
      RES.tTop.textContent = P.vy > 0 ? fixed(P.tTop, 2) + " s" : "– (nincs emelkedés)";
      RES.d.textContent = fixed(P.range, 2) + " m";
      RES.hMax.textContent = fixed(P.hMax, 2) + " m";
      RES.vLand.textContent = fixed(P.vLand, 2) + " m/s";
    }
    function changed() {
      pause();
      compute();
      state.t = P.tFlight;   // paraméterváltozáskor rögtön a teljes pálya látszik
      setGraph();
      frame();
    }
    function setGraph() {
      const g = GRAPHS.find((x) => x.key === state.graph);
      plot.options({ yLabel: g.y, yUnit: g.unit });
      const T = Math.max(P.tFlight, 1e-6);
      const series = [{ name: g.y + "(t)", fn: g.f(P), domain: [0, T] }];
      pinned.forEach((pp, i) => series.push({ name: pp.label, fn: g.f(pp.P), domain: [0, pp.P.tFlight], style: { color: "#555555", width: 1.25, dash: [5, 4] }, noMarker: true }));
      plot.set(series);
      plot.marker(state.t);
    }

    /* ---------- animáció ---------- */
    let raf = 0, last = 0;
    function play(fromStart) {
      if (fromStart || state.t >= P.tFlight - 1e-9) state.t = 0;
      state.running = true;
      playBtn.textContent = "❚❚ Szünet";
      last = performance.now();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
      PO.store && PO.store.update((s) => { s.last.sim = "hajitas"; });
    }
    function pause() {
      state.running = false;
      playBtn.textContent = "▶ Indítás";
      cancelAnimationFrame(raf);
    }
    function tick(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      state.t += dt * state.speed;
      if (state.t >= P.tFlight) { state.t = P.tFlight; frame(); pause(); return; }
      frame();
      raf = requestAnimationFrame(tick);
    }

    /* ---------- rajzolás ---------- */
    const ctx = world.getContext("2d");
    let CW = 0, CH = 0, dpr = 1;
    const ro = new ResizeObserver(() => {
      dpr = window.devicePixelRatio || 1;
      CW = world.clientWidth;
      CH = CW < 520 ? 250 : 330;
      world.width = Math.round(CW * dpr);
      world.height = Math.round(CH * dpr);
      world.style.height = CH + "px";
      frame();
    });
    ro.observe(world);

    function frame() {
      if (!P) return;
      const t = state.t;
      const pos = P.pos(t), vel = P.vel(t);
      RO.t.textContent = fixed(t, 2) + " s";
      RO.x.textContent = fixed(pos.x, 2) + " m";
      RO.y.textContent = fixed(Math.max(0, pos.y), 2) + " m";
      RO["vₓ"].textContent = fixed(vel.x, 2) + " m/s";
      RO["vᵧ"].textContent = fixed(vel.y, 2) + " m/s";
      RO["|v|"].textContent = fixed(Math.hypot(vel.x, vel.y), 2) + " m/s";
      plot.marker(t);
      drawWorld(pos, vel);
    }

    function drawWorld(pos, vel) {
      if (!CW) return;
      const m = { l: 46, r: 48, t: 26, b: 58 };
      let xmax = Math.max(P.range, 1), ymax = Math.max(P.hMax, P.h0, 1);
      pinned.forEach((pp) => { xmax = Math.max(xmax, pp.P.range); ymax = Math.max(ymax, pp.P.hMax); });
      xmax *= 1.06; ymax *= 1.12;
      const k = Math.min((CW - m.l - m.r) / xmax, (CH - m.t - m.b) / ymax);
      const X = (x) => m.l + x * k;
      const Y = (y) => CH - m.b - y * k;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, CW, CH);

      // talaj és skála
      const step = PO.util.niceStep((CW - m.l - m.r) / k, Math.max(3, Math.floor(CW / 90)));
      ctx.font = "11px Inter, system-ui, sans-serif"; ctx.fillStyle = "#A0A0A0"; ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.strokeStyle = "#1c1c1c"; ctx.lineWidth = 1;
      for (let x = 0; X(x) <= CW - m.r + 1; x += step) {
        ctx.beginPath(); ctx.moveTo(X(x) + 0.5, m.t); ctx.lineTo(X(x) + 0.5, Y(0)); ctx.stroke();
        ctx.fillText(fixed(x, step < 1 ? 1 : 0), X(x), Y(0) + 8);
      }
      ctx.textAlign = "right"; ctx.textBaseline = "middle";
      for (let y = step; Y(y) >= m.t; y += step) {
        ctx.beginPath(); ctx.moveTo(m.l, Y(y) + 0.5); ctx.lineTo(CW - m.r, Y(y) + 0.5); ctx.stroke();
        ctx.fillText(fixed(y, step < 1 ? 1 : 0), m.l - 8, Y(y));
      }
      ctx.fillText("m", m.l - 8, Y(0) + 14);
      ctx.strokeStyle = "#A0A0A0"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(0, Y(0) + 0.5); ctx.lineTo(CW, Y(0) + 0.5); ctx.stroke();
      // sraffozás a talaj alatt
      ctx.strokeStyle = "#202020"; ctx.lineWidth = 1;
      for (let x = -10; x < CW; x += 10) { ctx.beginPath(); ctx.moveTo(x, Y(0) + 12); ctx.lineTo(x + 10, Y(0) + 2); ctx.stroke(); }
      // kiinduló emelvény
      if (P.h0 > 0) {
        ctx.fillStyle = "#141414"; ctx.strokeStyle = "#555555";
        ctx.fillRect(X(0) - 18, Y(P.h0), 18, Y(0) - Y(P.h0));
        ctx.strokeRect(X(0) - 18 + 0.5, Y(P.h0) + 0.5, 18, Y(0) - Y(P.h0));
      }

      // rögzített pályák
      pinned.forEach((pp) => {
        path(pp.P, pp.P.tFlight, "#555555", [5, 4], 1.25);
        const e = pp.P.pos(pp.P.tFlight);
        ctx.fillStyle = "#A0A0A0"; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
        ctx.fillText(pp.label, X(e.x), Y(0) - 16);
      });
      // teljes (előre jelzett) pálya + nyom
      if (state.showPath) path(P, P.tFlight, "#555555", [3, 4], 1);
      path(P, state.t, "#FFFFFF", [], 2);

      // tetőpont jelölése
      if (P.vy > 0 && state.showPath) {
        const top = P.pos(P.tTop);
        ctx.strokeStyle = "#555555"; ctx.setLineDash([2, 3]); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(X(top.x), Y(top.y)); ctx.lineTo(X(top.x), Y(0)); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = "#A0A0A0"; ctx.textAlign = "left"; ctx.textBaseline = "bottom";
        ctx.fillText(`hₘₐₓ = ${fixed(P.hMax, 2)} m`, X(top.x) + 6, Y(top.y) - 4);
      }

      // test
      const px = X(pos.x), py = Y(Math.max(0, pos.y));
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath(); ctx.arc(px, py, 6.5, 0, Math.PI * 2); ctx.fill();

      // sebességvektorok
      if (state.showVec && P.v0 > 0) {
        const s = 48 / Math.max(P.v0, Math.hypot(P.vx, P.vy - P.g * P.tFlight), 1);
        arrow(px, py, px + vel.x * s, py, "#A0A0A0", [4, 3], "vₓ");
        arrow(px, py, px, py - vel.y * s, "#A0A0A0", [4, 3], "vᵧ");
        arrow(px, py, px + vel.x * s, py - vel.y * s, "#FFFFFF", [], "v");
      }

      function path(PP, tEnd, color, dash, width) {
        if (tEnd <= 0) return;
        ctx.strokeStyle = color; ctx.setLineDash(dash); ctx.lineWidth = width;
        ctx.beginPath();
        const n = 160;
        for (let i = 0; i <= n; i++) {
          const q = PP.pos((tEnd * i) / n);
          i ? ctx.lineTo(X(q.x), Y(Math.max(0, q.y))) : ctx.moveTo(X(q.x), Y(q.y));
        }
        ctx.stroke(); ctx.setLineDash([]);
      }
      function arrow(x0, y0, x1, y1, color, dash, label) {
        const L = Math.hypot(x1 - x0, y1 - y0);
        if (L < 4) return;
        ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 1.75; ctx.setLineDash(dash);
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.setLineDash([]);
        const a = Math.atan2(y1 - y0, x1 - x0);
        ctx.beginPath(); ctx.moveTo(x1, y1);
        ctx.lineTo(x1 - 9 * Math.cos(a - 0.4), y1 - 9 * Math.sin(a - 0.4));
        ctx.lineTo(x1 - 9 * Math.cos(a + 0.4), y1 - 9 * Math.sin(a + 0.4));
        ctx.closePath(); ctx.fill();
        ctx.font = "italic 12px Inter, system-ui, sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "bottom";
        ctx.fillText(label, x1 + 4, y1 - 2);
      }
    }

    /* ---------- szimulációs feladat ---------- */
    function simTask() {
      const v0 = 15, h0 = 10, g = 9.81;
      const best = deg(Math.atan(v0 / Math.sqrt(v0 * v0 + 2 * g * h0)));
      const inp = h("input", { type: "text", inputmode: "decimal", placeholder: "pl. 40", "aria-label": "Szög fokban", style: { width: "110px" } });
      const fb = h("div");
      const check = () => {
        const a = parseNum(inp.value);
        fb.className = "feedback";
        if (!Number.isFinite(a)) { fb.textContent = "Adj meg egy számot (fokban)."; return; }
        if (Math.abs(a - best) <= 1.5) {
          fb.classList.add("ok");
          fb.textContent = `Helyes! A legjobb szög ≈ ${fixed(best, 1)}°. Magasból hajítva a 45°-nál laposabb pálya a jobb, mert a test lefelé is „ráhagy” a repülési időre.`;
          PO.store && PO.store.update((s) => { s.tasks["sim-hajitas-opt"] = { ok: true, tries: ((s.tasks["sim-hajitas-opt"] || {}).tries || 0) + 1, last: Date.now(), temakor: "kinematika" }; });
        } else {
          fb.classList.add("bad");
          fb.textContent = a > best ? "Ennél kisebb szögnél nagyobb a távolság. Próbálj laposabb pályát!" : "Ennél nagyobb szög jobb. Próbálj meredekebb pályát!";
          PO.store && PO.store.update((s) => { const r = s.tasks["sim-hajitas-opt"] || { tries: 0 }; s.tasks["sim-hajitas-opt"] = { ok: false, tries: r.tries + 1, last: Date.now(), temakor: "kinematika" }; });
        }
      };
      inp.addEventListener("keydown", (e) => { if (e.key === "Enter") check(); });
      return h("div.panel",
        h("div.panel-title", "Vizsgálati feladat"),
        h("p.small", `Talajról indítva 45°-nál a legnagyobb a távolság. De mi a helyzet, ha a testet h₀ = ${h0} m magasról, v₀ = ${v0} m/s sebességgel hajítjuk (g = 9,81 m/s²)? Kísérletezz, majd írd be a legjobb szöget!`),
        h("div.answer-row", inp, h("span.muted", "°"), h("button.btn.sm", { type: "button", onclick: check }, "Ellenőrzés"),
          h("button.btn.sm.ghost", { type: "button", onclick: () => { inputs.v0.set(v0); inputs.h0.set(h0); PO.toast && PO.toast("v₀ és h₀ beállítva – most a szöget keresd"); } }, "Beállítás")),
        fb);
    }

    compute();
    state.t = P.tFlight;
    setGraph();
    frame();

    return {
      destroy() { pause(); ro.disconnect(); plot.destroy(); },
    };
  }

  PO.sims = PO.sims || {};
  PO.sims.hajitas = {
    id: "hajitas",
    nev: "Hajítások",
    temakor: "kinematika",
    leiras: "Szabadesés, függőleges, vízszintes és ferde hajítás animációval, sebességvektorokkal és szinkronizált grafikonokkal.",
    kulcsszavak: "szimuláció ferde hajítás vízszintes függőleges szabadesés pálya parabola",
    mount,
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
