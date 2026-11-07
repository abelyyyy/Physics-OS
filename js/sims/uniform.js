/* PHYSICS OS — Labor: egyenletesen változó mozgás grafikonjai
 * x(t) = v0·t + a/2·t², v(t) = v0 + a·t, a(t) = a — szinkronizált mozgással és területtel.
 */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const { h, fixed, parseNum, clamp } = PO.util;

  function mount(container, opts = {}) {
    const st = Object.assign({ v0: 4, a: -1, T: 10, t: 0, running: false }, opts.initial || {});
    const inputs = {};

    const track = h("canvas.sim-canvas", { role: "img", "aria-label": "A test mozgása egy egyenes mentén", style: { height: "86px" } });
    const box = { x: h("div"), v: h("div"), a: h("div") };
    const plots = {
      x: PO.plot(box.x, { xLabel: "t", xUnit: "s", yLabel: "x", yUnit: "m", height: 190, noHint: true }),
      v: PO.plot(box.v, { xLabel: "t", xUnit: "s", yLabel: "v", yUnit: "m/s", height: 190, noHint: true }),
      a: PO.plot(box.a, { xLabel: "t", xUnit: "s", yLabel: "a", yUnit: "m/s²", height: 150, noHint: true }),
    };
    const RO = {};
    const readouts = h("div.readouts", [["t", "s"], ["x", "m"], ["v", "m/s"], ["a", "m/s²"], ["út", "m"]].map(([k]) => { RO[k] = h("div.v", "—"); return h("div.readout", h("div.k", k === "út" ? "megtett út" : k), RO[k]); }));
    const note = h("div.callout.small");

    const playBtn = h("button.btn.primary", { type: "button", onclick: () => (st.running ? pause() : play()) }, "▶ Indítás");
    const tSlider = h("input", { type: "range", min: 0, max: st.T, step: 0.01, value: 0, "aria-label": "Időpont" });
    tSlider.addEventListener("input", () => { pause(); st.t = Number(tSlider.value); frame(); });

    const side = h("aside.grid",
      h("div.panel", h("div.panel-title", "Paraméterek"),
        h("div.params", param("v0", "Kezdősebesség v₀", "m/s", -20, 20, 0.5), param("a", "Gyorsulás a", "m/s²", -5, 5, 0.1), param("T", "Vizsgált időtartam", "s", 1, 30, 1)),
        h("hr.sep"),
        h("div.btn-row",
          h("button.btn.sm.ghost", { type: "button", onclick: () => preset(10, 0) }, "Egyenletes"),
          h("button.btn.sm.ghost", { type: "button", onclick: () => preset(0, 2) }, "Gyorsulás nyugalomból"),
          h("button.btn.sm.ghost", { type: "button", onclick: () => preset(15, -3) }, "Fékezés"),
          h("button.btn.sm.ghost", { type: "button", onclick: () => preset(8, -2) }, "Visszafordul"))),
      h("div.panel", h("div.panel-title", "Képletek"), h("div.small", { html: PO.tex.html("$$x(t) = v_0 t + \\tfrac{a}{2}t^2$$$$v(t) = v_0 + a\\,t$$$$a(t) = a = \\text{állandó}$$") })),
      note);

    const stage = h("div.sim-stage",
      track,
      h("div.row", playBtn, h("div", { style: { flex: 1, minWidth: "160px" } }, tSlider)),
      readouts,
      h("div.grid.g2", h("div", h("div.small.muted", "Hely–idő (x–t)"), box.x), h("div", h("div.small.muted", "Sebesség–idő (v–t) · satírozva: elmozdulás"), box.v)),
      h("div", h("div.small.muted", "Gyorsulás–idő (a–t) · satírozva: sebességváltozás"), box.a));
    container.append(h("div.sim", stage, side));

    function param(key, label, unit, min, max, step) {
      const range = h("input", { type: "range", min, max, step, value: st[key], "aria-label": label });
      const num = h("input", { type: "number", min, max, step, value: st[key], "aria-label": label + " pontos értéke" });
      const set = (v, from) => { v = clamp(v, min, max); st[key] = v; if (from !== range) range.value = v; if (from !== num) num.value = String(v); num.classList.remove("invalid"); changed(); };
      range.addEventListener("input", () => set(Number(range.value), range));
      num.addEventListener("change", () => { const v = parseNum(num.value); Number.isFinite(v) ? set(v, num) : num.classList.add("invalid"); });
      inputs[key] = { set };
      return h("div.param", h("label", h("span", label), h("span", unit)), range, num);
    }
    function preset(v0, a) { inputs.v0.set(v0); inputs.a.set(a); play(true); }

    const X = (t) => st.v0 * t + 0.5 * st.a * t * t;
    const Vf = (t) => st.v0 + st.a * t;
    /** Megtett út (nem elmozdulás!): ha a sebesség előjelet vált, a két szakasz abszolút értékét adjuk össze. */
    function distance(t) {
      const tr = st.a !== 0 ? -st.v0 / st.a : -1;
      if (tr > 0 && tr < t) return Math.abs(X(tr)) + Math.abs(X(t) - X(tr));
      return Math.abs(X(t));
    }

    function changed() {
      st.t = Math.min(st.t, st.T);
      tSlider.max = st.T;
      plots.x.set([{ name: "x(t)", fn: X, domain: [0, st.T] }]);
      plots.v.set([{ name: "v(t)", fn: Vf, domain: [0, st.T], area: true, areaTo: st.t }]);
      plots.a.set([{ name: "a(t)", fn: () => st.a, domain: [0, st.T], area: true, areaTo: st.t, samples: 2 }]);
      const tr = st.a !== 0 ? -st.v0 / st.a : null;
      note.innerHTML = tr !== null && tr > 0 && tr < st.T
        ? `<div class="callout-t">Megfigyelés</div>A test t = ${fixed(tr, 2)} s-nál megáll és visszafordul (itt metszi a v–t grafikon az időtengelyt, az x–t grafikonnak itt szélsőértéke van). Ettől kezdve az elmozdulás és a megtett út különbözik!`
        : st.a === 0
          ? `<div class="callout-t">Megfigyelés</div>a = 0: egyenletes mozgás. Az x–t grafikon egyenes, meredeksége a sebesség.`
          : `<div class="callout-t">Megfigyelés</div>Az x–t grafikon parabola. Bármely pontjában az érintő meredeksége a pillanatnyi sebesség; a v–t grafikon meredeksége a gyorsulás.`;
      frame();
    }

    let raf = 0, last = 0;
    function play(fromStart) {
      if (fromStart || st.t >= st.T - 1e-9) st.t = 0;
      st.running = true; playBtn.textContent = "❚❚ Szünet"; last = performance.now();
      cancelAnimationFrame(raf); raf = requestAnimationFrame(tick);
      PO.store && PO.store.update((s) => { s.last.sim = "valtozo"; });
    }
    function pause() { st.running = false; playBtn.textContent = "▶ Indítás"; cancelAnimationFrame(raf); }
    function tick(now) {
      st.t += Math.min(0.05, (now - last) / 1000); last = now;
      if (st.t >= st.T) { st.t = st.T; frame(); pause(); return; }
      frame(); raf = requestAnimationFrame(tick);
    }

    function frame() {
      const t = st.t;
      tSlider.value = t;
      RO.t.textContent = fixed(t, 2) + " s";
      RO.x.textContent = fixed(X(t), 2) + " m";
      RO.v.textContent = fixed(Vf(t), 2) + " m/s";
      RO.a.textContent = fixed(st.a, 2) + " m/s²";
      RO["út"].textContent = fixed(distance(t), 2) + " m";
      Object.values(plots).forEach((p) => p.marker(t));
      plots.v.set([{ name: "v(t)", fn: Vf, domain: [0, st.T], area: true, areaTo: t }], true);
      plots.a.set([{ name: "a(t)", fn: () => st.a, domain: [0, st.T], area: true, areaTo: t, samples: 2 }], true);
      drawTrack();
    }

    const ctx = track.getContext("2d");
    let CW = 0, dpr = 1;
    const CH = 86;
    const ro = new ResizeObserver(() => { dpr = window.devicePixelRatio || 1; CW = track.clientWidth; track.width = CW * dpr; track.height = CH * dpr; drawTrack(); });
    ro.observe(track);
    function drawTrack() {
      if (!CW) return;
      // a pálya kiterjedése a teljes időtartamra
      let lo = 0, hi = 0;
      for (let i = 0; i <= 200; i++) { const x = X((st.T * i) / 200); lo = Math.min(lo, x); hi = Math.max(hi, x); }
      if (hi - lo < 1) hi = lo + 1;
      const m = 30, k = (CW - 2 * m) / (hi - lo);
      const P = (x) => m + (x - lo) * k;
      const y = 44;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, CW, CH);
      ctx.strokeStyle = "#555555"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(m - 10, y); ctx.lineTo(CW - m + 10, y); ctx.stroke();
      const step = PO.util.niceStep(hi - lo, Math.max(3, Math.floor(CW / 90)));
      ctx.fillStyle = "#A0A0A0"; ctx.font = "11px Inter, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (let x = Math.ceil(lo / step) * step; x <= hi + 1e-9; x += step) {
        ctx.strokeStyle = x === 0 ? "#EAEAEA" : "#555555";
        ctx.beginPath(); ctx.moveTo(P(x), y - (x === 0 ? 8 : 4)); ctx.lineTo(P(x), y + (x === 0 ? 8 : 4)); ctx.stroke();
        ctx.fillText(fixed(x, step < 1 ? 1 : 0) + (x === 0 ? " m" : ""), P(x), y + 12);
      }
      // nyom
      ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) { const xx = P(X((st.t * i) / 80)); i ? ctx.lineTo(xx, y) : ctx.moveTo(xx, y); }
      ctx.stroke();
      const px = P(X(st.t));
      ctx.fillStyle = "#FFFFFF"; ctx.fillRect(px - 12, y - 19, 24, 14);
      // sebességvektor
      const v = Vf(st.t);
      if (Math.abs(v) > 0.05) {
        const L = clamp(v * 4, -90, 90);
        ctx.strokeStyle = "#EAEAEA"; ctx.fillStyle = "#EAEAEA"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(px, y - 26); ctx.lineTo(px + L, y - 26); ctx.stroke();
        const s = Math.sign(L);
        ctx.beginPath(); ctx.moveTo(px + L, y - 26); ctx.lineTo(px + L - s * 7, y - 30); ctx.lineTo(px + L - s * 7, y - 22); ctx.closePath(); ctx.fill();
        ctx.font = "italic 12px Inter, system-ui, sans-serif"; ctx.textAlign = s > 0 ? "left" : "right"; ctx.textBaseline = "middle";
        ctx.fillText("v", px + L + s * 5, y - 26);
      }
    }

    changed();
    return { destroy() { pause(); ro.disconnect(); Object.values(plots).forEach((p) => p.destroy()); } };
  }

  PO.sims = PO.sims || {};
  PO.sims.valtozo = {
    id: "valtozo",
    nev: "Egyenletesen változó mozgás grafikonjai",
    temakor: "kinematika",
    leiras: "Hely–, sebesség– és gyorsulás–idő grafikonok szinkronban a mozgással; terület = elmozdulás, visszafordulás, megtett út.",
    kulcsszavak: "szimuláció grafikon hely idő sebesség idő gyorsulás terület meredekség egyenletesen változó",
    mount,
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
