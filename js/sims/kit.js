/* PHYSICS OS — közös szimulációs keret
 * Egy szimuláció leírása:
 *   PO.simkit.define({
 *     id, nev, temakor, leiras, kulcsszavak,
 *     params: [{ k, label, unit, min, max, step } | { k, label, options: [[érték, felirat], …] }],
 *     initial: { … }, presets: [["felirat", { … }], …],
 *     formulas: "$$…$$" (TeX), canvas: 260 (magasság px) vagy null,
 *     plots: [{ k, title, opt: { …PO.plot opciók } }], plotCols: 2,
 *     readouts: [["kulcs", "felirat"], …],
 *     duration(st, M) → s   (ha nincs: statikus, nincs lejátszás),
 *     model(st) → M         (paraméterváltozáskor fut),
 *     series(st, M, t) → { plotKulcs: [sorozatok] },
 *     values(st, M, t) → { readoutKulcs: "szöveg" },
 *     draw(g, st, M, t)     (g: rajzoló segéd, lásd lent),
 *     note(st, M) → HTML,
 *   });
 */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const { h, parseNum, clamp } = PO.util;

  const COL = { bg: "#0A0A0A", grid: "#202020", dim: "#555555", mid: "#A0A0A0", fg: "#EAEAEA", hi: "#FFFFFF" };

  /** Rajzoló segéd a vászonhoz: CSS-pixelben dolgozik. */
  function painter(ctx) {
    const g = {
      ctx, W: 0, H: 0, COL,
      clear() { ctx.clearRect(0, 0, g.W, g.H); },
      line(x1, y1, x2, y2, color = COL.mid, w = 1.5, dash = []) { ctx.strokeStyle = color; ctx.lineWidth = w; ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.setLineDash([]); },
      poly(pts, color = COL.mid, w = 1.5, close = false, fill = null, dash = []) {
        if (!pts.length) return;
        ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (const p of pts.slice(1)) ctx.lineTo(p[0], p[1]); if (close) ctx.closePath();
        if (fill) { ctx.fillStyle = fill; ctx.fill(); }
        if (color) { ctx.strokeStyle = color; ctx.lineWidth = w; ctx.setLineDash(dash); ctx.stroke(); ctx.setLineDash([]); }
      },
      circle(x, y, r, stroke = COL.fg, fill = null, w = 1.5) { ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = w; ctx.stroke(); } },
      rect(x, y, w, hh, stroke = COL.fg, fill = null, lw = 1.5) { if (fill) { ctx.fillStyle = fill; ctx.fillRect(x, y, w, hh); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.strokeRect(x, y, w, hh); } },
      text(s, x, y, o = {}) {
        ctx.fillStyle = o.color || COL.mid; ctx.font = `${o.italic ? "italic " : ""}${o.bold ? "600 " : ""}${o.size || 12}px Inter, system-ui, sans-serif`;
        ctx.textAlign = o.align || "left"; ctx.textBaseline = o.base || "middle"; PO.util.fillSub(ctx, s, x, y);
      },
      /** Nyíl (x1,y1)-ből (x2,y2)-be, opcionális felirattal a hegyénél. */
      arrow(x1, y1, x2, y2, color = COL.hi, label = "", w = 2) {
        const L = Math.hypot(x2 - x1, y2 - y1); if (L < 2) return;
        const ux = (x2 - x1) / L, uy = (y2 - y1) / L, hs = Math.min(9, L * 0.4);
        g.line(x1, y1, x2 - ux * hs * 0.6, y2 - uy * hs * 0.6, color, w);
        ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - ux * hs - uy * hs * 0.45, y2 - uy * hs + ux * hs * 0.45); ctx.lineTo(x2 - ux * hs + uy * hs * 0.45, y2 - uy * hs - ux * hs * 0.45); ctx.closePath(); ctx.fill();
        if (label) g.text(label, x2 + ux * 10 + (Math.abs(uy) > 0.7 ? 8 : 0), y2 + uy * 10, { color, italic: true, size: 13, align: ux < -0.3 ? "right" : "left" });
      },
      spring(x1, y1, x2, y2, coils = 10, amp = 8, color = COL.mid) {
        const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, nx = -uy, ny = ux;
        const pts = [[x1, y1]], lead = Math.min(12, L * 0.1);
        pts.push([x1 + ux * lead, y1 + uy * lead]);
        const n = coils * 2;
        for (let i = 1; i < n; i++) { const s = lead + ((L - 2 * lead) * i) / n, a = i % 2 ? amp : -amp; pts.push([x1 + ux * s + nx * a, y1 + uy * s + ny * a]); }
        pts.push([x2 - ux * lead, y2 - uy * lead], [x2, y2]);
        g.poly(pts, color, 1.5);
      },
    };
    return g;
  }

  function define(D) {
    function mount(container) {
      const st = Object.assign({ t: 0, running: false }, D.initial || {});
      const inputs = {};
      let M = null;

      /* ---- paraméterek ---- */
      function param(p) {
        if (p.options) {
          const sel = h("select", { "aria-label": p.label }, p.options.map(([v, lab]) => h("option", { value: String(v) }, lab)));
          sel.value = String(st[p.k]);
          const set = (v) => { st[p.k] = typeof p.options[0][0] === "number" ? Number(v) : v; sel.value = String(v); changed(); };
          sel.addEventListener("change", () => set(sel.value));
          inputs[p.k] = { set };
          return h("div.param", h("label", h("span", { html: PO.util.subHtml(p.label) })), h("div", { style: { gridColumn: "1 / -1" } }, sel));
        }
        const range = h("input", { type: "range", min: p.min, max: p.max, step: p.step, value: st[p.k], "aria-label": p.label });
        const num = h("input", { type: "number", min: p.min, max: p.max, step: p.step, value: st[p.k], "aria-label": p.label + " pontos értéke" });
        const set = (v, from) => { v = clamp(v, p.min, p.max); st[p.k] = v; if (from !== range) range.value = v; if (from !== num) num.value = String(+v.toPrecision(6)); num.classList.remove("invalid"); changed(); };
        range.addEventListener("input", () => set(Number(range.value), range));
        num.addEventListener("change", () => { const v = parseNum(num.value); Number.isFinite(v) ? set(v, num) : num.classList.add("invalid"); });
        inputs[p.k] = { set };
        return h("div.param", h("label", h("span", { html: PO.util.subHtml(p.label) }), h("span", p.unit || "")), range, num);
      }
      const paramEls = D.params.map(param);
      function preset(vals) {
        quiet = true;
        Object.entries(vals).forEach(([k, v]) => inputs[k] ? inputs[k].set(v) : (st[k] = v));
        quiet = false;
        changed();
        if (D.duration) play(true);
      }
      let quiet = false;

      /* ---- vászon, grafikonok, kiírások ---- */
      const canvas = D.canvas ? h("canvas.sim-canvas", { role: "img", "aria-label": D.canvasLabel || D.nev, style: { height: D.canvas + "px" } }) : null;
      const g = canvas ? painter(canvas.getContext("2d")) : null;
      const plots = {};
      const plotEls = (D.plots || []).map((P) => {
        const box = h("div");
        plots[P.k] = PO.plot(box, Object.assign({ height: 200, noHint: true }, P.opt));
        return h("div", h("div.small.muted", P.title), box);
      });
      const RO = {};
      const readouts = D.readouts ? h("div.readouts", D.readouts.map(([k, lab]) => { RO[k] = h("div.v", "—"); return h("div.readout", h("div.k", { html: PO.util.subHtml(lab) }), RO[k]); })) : null;
      const note = h("div.callout.small");

      let playBtn = null, tSlider = null;
      if (D.duration) {
        playBtn = h("button.btn.primary", { type: "button", onclick: () => (st.running ? pause() : play()) }, "▶ Indítás");
        tSlider = h("input", { type: "range", min: 0, max: 1, step: 0.001, value: 0, "aria-label": "Időpont" });
        tSlider.addEventListener("input", () => { pause(); st.t = Number(tSlider.value) * T(); frame(true); });
      }
      const T = () => (D.duration ? Math.max(1e-6, D.duration(st, M)) : 0);

      const side = h("aside.grid",
        h("div.panel", h("div.panel-title", "Paraméterek"), h("div.params", paramEls),
          D.presets ? [h("hr.sep"), h("div.btn-row", D.presets.map(([lab, vals]) => h("button.btn.sm.ghost", { type: "button", onclick: () => preset(vals) }, lab)))] : null),
        D.formulas ? h("div.panel", h("div.panel-title", "Képletek"), h("div.small", { html: PO.tex.rich(D.formulas) }),
          D.kepletek ? h("div.small", { style: { marginTop: "8px" } }, D.kepletek.filter((id) => PO.formulaById && PO.formulaById[id]).map((id, i) => [i ? " · " : "", h("a", { href: "#keplet-" + id }, PO.formulaById[id].nev)])) : null) : null,
        note);
      const stage = h("div.sim-stage",
        canvas,
        D.duration ? h("div.row", playBtn, h("div", { style: { flex: 1, minWidth: "160px" } }, tSlider)) : null,
        readouts,
        D.below ? D.below(st, () => changed()) : null,
        plotEls.length ? h("div.grid" + (plotEls.length > 1 && D.plotCols !== 1 ? ".g2" : ""), plotEls) : null);
      container.append(h("div.sim", stage, side));

      /* ---- működés ---- */
      function changed() {
        if (quiet) return;
        M = D.model ? D.model(st) : {};
        if (D.duration) st.t = Math.min(st.t, T());
        note.innerHTML = D.note ? `<div class="callout-t">Megfigyelés</div>${D.note(st, M)}` : "";
        if (!note.innerHTML) note.style.display = "none"; else note.style.display = "";
        frame(false);
      }
      let raf = 0, last = 0;
      function play(fromStart) {
        if (fromStart || st.t >= T() - 1e-9) st.t = 0;
        st.running = true; playBtn.textContent = "❚❚ Szünet"; last = performance.now();
        if (D.onPlay) D.onPlay(st, M);
        cancelAnimationFrame(raf); raf = requestAnimationFrame(tick);
      }
      function pause() { if (!playBtn) return; st.running = false; playBtn.textContent = "▶ Indítás"; cancelAnimationFrame(raf); }
      function tick(now) {
        const speed = D.speed ? D.speed(st, M) : 1;
        st.t += Math.min(0.05, (now - last) / 1000) * speed; last = now;
        if (st.t >= T()) { st.t = T(); frame(true); pause(); return; }
        frame(true); raf = requestAnimationFrame(tick);
      }
      function frame(keep) {
        const t = st.t;
        if (tSlider) tSlider.value = t / T();
        if (D.series) { const S = D.series(st, M, t); Object.entries(S).forEach(([k, s]) => plots[k] && plots[k].set(s, keep)); }
        if (D.duration && D.markers !== false) Object.entries(plots).forEach(([k, p]) => { if (!D.noMarker || !D.noMarker.includes(k)) p.marker(t); });
        if (D.marker) Object.entries(D.marker(st, M, t) || {}).forEach(([k, x]) => plots[k] && plots[k].marker(x));
        if (D.values) Object.entries(D.values(st, M, t)).forEach(([k, s]) => { if (RO[k]) RO[k].textContent = s; });
        paint();
      }

      let CW = 0, dpr = 1, ro = null;
      function paint() {
        if (!g || !CW) return;
        const ctx = g.ctx;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        g.W = CW; g.H = D.canvas;
        g.clear();
        D.draw(g, st, M, st.t);
      }
      if (canvas) {
        ro = new ResizeObserver(() => { dpr = window.devicePixelRatio || 1; CW = canvas.clientWidth; canvas.width = Math.round(CW * dpr); canvas.height = Math.round(D.canvas * dpr); paint(); });
        ro.observe(canvas);
      }
      changed();
      return { destroy() { pause(); ro && ro.disconnect(); Object.values(plots).forEach((p) => p.destroy()); }, state: st, set: (k, v) => inputs[k] && inputs[k].set(v), play: () => play(true) };
    }

    PO.sims = PO.sims || {};
    PO.sims[D.id] = { id: D.id, nev: D.nev, temakor: D.temakor, leiras: D.leiras, kulcsszavak: D.kulcsszavak, kepletek: D.kepletek || [], def: D, mount };
    return PO.sims[D.id];
  }

  PO.simkit = { define, painter, COL };
})(typeof globalThis !== "undefined" ? globalThis : this);
