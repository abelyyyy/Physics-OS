/* PHYSICS OS — Canvas grafikonmotor
 * Függvény- és pontsorozatok, zoom, mozgatás, kurzoros leolvasás, időjelölő, terület, CSV.
 *
 *   const p = PO.plot(container, { xLabel: "t", xUnit: "s", yLabel: "v", yUnit: "m/s" });
 *   p.set([{ name: "v(t)", fn: t => 3 + 2*t, domain: [0, 5], area: true }]);
 *   p.marker(2.5);
 */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const { h, niceStep, fixed } = PO.util;

  const STYLES = [
    { color: "#FFFFFF", width: 2, dash: [] },
    { color: "#A0A0A0", width: 2, dash: [7, 5] },
    { color: "#EAEAEA", width: 1.5, dash: [2, 4] },
    { color: "#A0A0A0", width: 1.25, dash: [] },
    { color: "#FFFFFF", width: 1, dash: [10, 4, 2, 4] },
  ];
  const ICON = {
    plus: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M10 4v12M4 10h12"/></svg>',
    minus: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 10h12"/></svg>',
    fit: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 7V3h4M13 3h4v4M17 13v4h-4M7 17H3v-4"/></svg>',
    csv: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="6" width="10" height="11" rx="2"/><path d="M4 13V4a1 1 0 0 1 1-1h8"/></svg>',
  };

  function plot(container, opt = {}) {
    const o = Object.assign({ xLabel: "x", yLabel: "y", xUnit: "", yUnit: "", height: 260, equal: false, xMinZero: false, yMinZero: false }, opt);
    const canvas = h("canvas", { role: "img", "aria-label": `${o.yLabel}–${o.xLabel} grafikon` });
    const readout = h("div.plot-readout");
    const btn = (icon, title, fn) => h("button.icon-btn", { type: "button", title, "aria-label": title, html: icon, onclick: fn });
    const tools = h("div.plot-tools",
      btn(ICON.plus, "Nagyítás", () => zoom(0.7)),
      btn(ICON.minus, "Kicsinyítés", () => zoom(1 / 0.7)),
      btn(ICON.fit, "Alaphelyzet (automatikus skála)", () => { view = null; draw(); }),
      o.noCsv ? null : btn(ICON.csv, "Adatok másolása CSV-ként", copyCSV));
    const wrap = h("div.plot-wrap", canvas, readout, tools);
    const legend = h("div.legend");
    const hint = h("div.small.muted", { style: { marginTop: "4px" } }, "Húzás: mozgatás · Ctrl + görgő vagy csípés: nagyítás · dupla kattintás: alaphelyzet");
    container.append(wrap, legend, o.noHint ? "" : hint);

    let series = [];
    let view = null;      // {x0,x1,y0,y1} – null = automatikus
    let markerX = null;
    let hover = null;
    let W = 0, H = 0, dpr = 1;
    const pad = { l: 58, r: 14, t: 14, b: 40 };

    const ctx = canvas.getContext("2d");
    const ro = new ResizeObserver(() => resize());
    ro.observe(wrap);

    function resize() {
      dpr = window.devicePixelRatio || 1;
      W = wrap.clientWidth;
      H = o.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.height = H + "px";
      draw();
    }

    /* ---- adatok ---- */
    function sampled(s, x0, x1) {
      if (s.points) return s.points;
      const a = Math.max(x0, s.domain ? s.domain[0] : -Infinity);
      const b = Math.min(x1, s.domain ? s.domain[1] : Infinity);
      if (!(b > a)) return [];
      const n = s.samples || 400;
      const pts = [];
      for (let i = 0; i <= n; i++) {
        const x = a + ((b - a) * i) / n;
        const y = s.fn(x);
        pts.push([x, Number.isFinite(y) ? y : NaN]);
      }
      return pts;
    }
    function valueAt(s, x) {
      if (s.fn) {
        if (s.domain && (x < s.domain[0] - 1e-12 || x > s.domain[1] + 1e-12)) return NaN;
        return s.fn(x);
      }
      const p = s.points;
      if (!p || !p.length || s.scatter) return NaN;
      for (let i = 1; i < p.length; i++) {
        if ((p[i - 1][0] - x) * (p[i][0] - x) <= 0 && p[i][0] !== p[i - 1][0]) {
          const k = (x - p[i - 1][0]) / (p[i][0] - p[i - 1][0]);
          return p[i - 1][1] + k * (p[i][1] - p[i - 1][1]);
        }
      }
      return NaN;
    }
    function autoView() {
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (const s of series) {
        if (s.domain) { x0 = Math.min(x0, s.domain[0]); x1 = Math.max(x1, s.domain[1]); }
        if (s.points) for (const [x] of s.points) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); }
      }
      if (!Number.isFinite(x0)) { x0 = 0; x1 = 1; }
      if (o.xRange) { x0 = o.xRange[0]; x1 = o.xRange[1]; }
      for (const s of series) for (const [, y] of sampled(s, x0, x1)) if (Number.isFinite(y)) { y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
      if (!Number.isFinite(y0)) { y0 = 0; y1 = 1; }
      if (o.yMinZero || y0 > 0) y0 = Math.min(0, y0);
      if (y1 < 0) y1 = 0;
      if (o.yRange) { y0 = Math.min(y0, o.yRange[0]); y1 = Math.max(y1, o.yRange[1]); }
      if (y1 - y0 < 1e-9) { y0 -= 1; y1 += 1; }
      const my = (y1 - y0) * 0.08;
      const mx = (x1 - x0) * 0.02;
      let v = { x0: o.xMinZero ? Math.min(0, x0) : x0 - mx, x1: x1 + mx, y0: y0 - (y0 < 0 ? my : 0), y1: y1 + my };
      if (o.equal) v = equalize(v);
      return v;
    }
    function equalize(v) {
      const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;
      const sx = (v.x1 - v.x0) / pw, sy = (v.y1 - v.y0) / ph;
      if (sx > sy) { const c = (v.y0 + v.y1) / 2, half = (sx * ph) / 2; v.y0 = Math.max(v.y0, c - half); v.y1 = v.y0 + 2 * half; }
      else { const half = (sy * pw) / 2; v.x1 = v.x0 + 2 * half; }
      return v;
    }
    const cur = () => view || autoView();

    /* ---- koordináták ---- */
    function tx(v, x) { return pad.l + ((x - v.x0) / (v.x1 - v.x0)) * (W - pad.l - pad.r); }
    function ty(v, y) { return H - pad.b - ((y - v.y0) / (v.y1 - v.y0)) * (H - pad.t - pad.b); }
    function ix(v, px) { return v.x0 + ((px - pad.l) / (W - pad.l - pad.r)) * (v.x1 - v.x0); }
    function iy(v, py) { return v.y0 + ((H - pad.b - py) / (H - pad.t - pad.b)) * (v.y1 - v.y0); }

    function tickLabel(x, step) {
      const d = Math.max(0, -Math.floor(Math.log10(step) + 1e-9));
      return fixed(x, Math.min(d, 6));
    }

    /* ---- rajzolás ---- */
    let raf = 0;
    function draw() {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; paint(); });
    }
    function paint() {
      if (!W) return;
      const v = cur();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.font = "11px Inter, Segoe UI, system-ui, sans-serif";

      // rács + skála
      const sx = niceStep(v.x1 - v.x0, Math.max(3, Math.floor((W - pad.l) / 80)));
      const sy = niceStep(v.y1 - v.y0, Math.max(3, Math.floor((H - pad.b) / 46)));
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#1c1c1c";
      ctx.fillStyle = "#A0A0A0";
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (let x = Math.ceil(v.x0 / sx) * sx; x <= v.x1 + 1e-9; x += sx) {
        const px = Math.round(tx(v, x)) + 0.5;
        ctx.beginPath(); ctx.moveTo(px, pad.t); ctx.lineTo(px, H - pad.b); ctx.stroke();
        ctx.fillText(tickLabel(x, sx), px, H - pad.b + 6);
      }
      ctx.textAlign = "right"; ctx.textBaseline = "middle";
      for (let y = Math.ceil(v.y0 / sy) * sy; y <= v.y1 + 1e-9; y += sy) {
        const py = Math.round(ty(v, y)) + 0.5;
        ctx.beginPath(); ctx.moveTo(pad.l, py); ctx.lineTo(W - pad.r, py); ctx.stroke();
        ctx.fillText(tickLabel(y, sy), pad.l - 7, py);
      }
      // tengelyek (nullvonalak)
      ctx.strokeStyle = "#555555";
      ctx.lineWidth = 1.25;
      if (v.y0 <= 0 && v.y1 >= 0) { const py = Math.round(ty(v, 0)) + 0.5; ctx.beginPath(); ctx.moveTo(pad.l, py); ctx.lineTo(W - pad.r, py); ctx.stroke(); }
      if (v.x0 <= 0 && v.x1 >= 0) { const px = Math.round(tx(v, 0)) + 0.5; ctx.beginPath(); ctx.moveTo(px, pad.t); ctx.lineTo(px, H - pad.b); ctx.stroke(); }
      ctx.strokeStyle = "#202020";
      ctx.strokeRect(pad.l + 0.5, pad.t + 0.5, W - pad.l - pad.r - 1, H - pad.t - pad.b - 1);
      // tengelyfeliratok
      ctx.fillStyle = "#EAEAEA";
      ctx.textAlign = "right"; ctx.textBaseline = "bottom";
      ctx.font = "italic 12px Inter, Segoe UI, system-ui, sans-serif";
      PO.util.fillSub(ctx, `${o.xLabel}${o.xUnit ? " [" + o.xUnit + "]" : ""}`, W - pad.r, H - 3);
      ctx.save();
      ctx.translate(14, pad.t + 4); ctx.rotate(-Math.PI / 2);
      ctx.textAlign = "right"; ctx.textBaseline = "top";
      PO.util.fillSub(ctx, `${o.yLabel}${o.yUnit ? " [" + o.yUnit + "]" : ""}`, 0, 0);
      ctx.restore();

      // sorozatok
      ctx.save();
      ctx.beginPath(); ctx.rect(pad.l, pad.t, W - pad.l - pad.r, H - pad.t - pad.b); ctx.clip();
      series.forEach((s, i) => {
        const st = Object.assign({}, STYLES[i % STYLES.length], s.style || {});
        const pts = sampled(s, v.x0, v.x1);
        if (!pts.length) return;
        if (s.area) {
          ctx.fillStyle = s.areaColor || "rgba(255,255,255,0.09)";
          ctx.beginPath();
          let started = false;
          const upto = s.areaTo !== undefined ? s.areaTo : Infinity;
          let lastX = null;
          for (const [x, y] of pts) {
            if (!Number.isFinite(y) || x > upto) continue;
            if (!started) { ctx.moveTo(tx(v, x), ty(v, 0)); started = true; }
            ctx.lineTo(tx(v, x), ty(v, y)); lastX = x;
          }
          if (started && s.fn && upto < Infinity && upto > pts[0][0]) { ctx.lineTo(tx(v, upto), ty(v, s.fn(upto))); lastX = upto; }
          if (started) { ctx.lineTo(tx(v, lastX), ty(v, 0)); ctx.closePath(); ctx.fill(); }
        }
        if (s.scatter) {
          ctx.fillStyle = st.color; ctx.strokeStyle = st.color;
          for (const [x, y] of pts) {
            ctx.beginPath(); ctx.arc(tx(v, x), ty(v, y), 3.5, 0, Math.PI * 2);
            s.hollow ? ctx.stroke() : ctx.fill();
          }
          return;
        }
        ctx.strokeStyle = st.color; ctx.lineWidth = st.width; ctx.setLineDash(st.dash); ctx.lineJoin = "round";
        ctx.beginPath();
        let pen = false;
        for (const [x, y] of pts) {
          if (!Number.isFinite(y)) { pen = false; continue; }
          const px = tx(v, x), py = ty(v, y);
          pen ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
          pen = true;
        }
        ctx.stroke();
        ctx.setLineDash([]);
      });
      // időjelölő
      if (markerX !== null && markerX >= v.x0 && markerX <= v.x1) {
        const px = tx(v, markerX);
        ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(px, pad.t); ctx.lineTo(px, H - pad.b); ctx.stroke(); ctx.setLineDash([]);
        series.forEach((s) => {
          if (s.noMarker) return;
          const y = valueAt(s, markerX);
          if (!Number.isFinite(y)) return;
          ctx.fillStyle = "#050505"; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(px, ty(v, y), 4.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        });
      }
      // kurzor
      if (hover) {
        ctx.strokeStyle = "rgba(160,160,160,.45)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(hover.px, pad.t); ctx.lineTo(hover.px, H - pad.b); ctx.stroke();
        series.forEach((s) => {
          const y = valueAt(s, hover.x);
          if (!Number.isFinite(y)) return;
          ctx.fillStyle = "#EAEAEA";
          ctx.beginPath(); ctx.arc(hover.px, ty(v, y), 3, 0, Math.PI * 2); ctx.fill();
        });
      }
      ctx.restore();
    }

    function updateReadout() {
      if (!hover) { readout.style.display = "none"; return; }
      const v = cur();
      const sx = niceStep(v.x1 - v.x0, 60);
      const lines = [`${o.xLabel} = ${tickLabel(hover.x, sx / 10)} ${o.xUnit}`];
      series.forEach((s) => {
        const y = valueAt(s, hover.x);
        if (Number.isFinite(y)) lines.push(`${s.name || o.yLabel} = ${PO.util.fmt(y, 4)} ${s.unit || o.yUnit}`);
      });
      if (lines.length === 1) lines.push(`${o.yLabel} = ${fixed(iy(v, hover.py), 2)} ${o.yUnit}`);
      readout.textContent = lines.join("\n");
      readout.style.display = "block";
    }

    function renderLegend() {
      legend.innerHTML = "";
      series.forEach((s, i) => {
        if (!s.name || s.noLegend) return;
        const st = Object.assign({}, STYLES[i % STYLES.length], s.style || {});
        const sw = s.scatter
          ? `<svg viewBox="0 0 26 8"><circle cx="13" cy="4" r="3" fill="${st.color}"/></svg>`
          : `<svg viewBox="0 0 26 8"><line x1="0" y1="4" x2="26" y2="4" stroke="${st.color}" stroke-width="${st.width}" stroke-dasharray="${st.dash.join(" ")}"/></svg>`;
        legend.append(h("span", { html: sw + `<span>${PO.util.subHtml(s.name)}</span>` }));
      });
    }

    /* ---- interakció ---- */
    function zoom(f, cx, cy) {
      const v = Object.assign({}, cur());
      const x = cx === undefined ? (v.x0 + v.x1) / 2 : cx;
      const y = cy === undefined ? (v.y0 + v.y1) / 2 : cy;
      view = { x0: x - (x - v.x0) * f, x1: x + (v.x1 - x) * f, y0: y - (y - v.y0) * f, y1: y + (v.y1 - y) * f };
      draw();
    }
    const pointers = new Map();
    let drag = null, pinch = null;
    canvas.addEventListener("pointerdown", (e) => {
      canvas.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.offsetX, y: e.offsetY });
      if (pointers.size === 1) drag = { x: e.offsetX, y: e.offsetY, v: Object.assign({}, cur()) };
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), v: Object.assign({}, cur()), cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 };
        drag = null;
      }
    });
    canvas.addEventListener("pointermove", (e) => {
      const v = cur();
      if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.offsetX, y: e.offsetY });
      if (pinch && pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const f = pinch.d / Math.max(10, Math.hypot(a.x - b.x, a.y - b.y));
        const x = ix(pinch.v, pinch.cx), y = iy(pinch.v, pinch.cy);
        view = { x0: x - (x - pinch.v.x0) * f, x1: x + (pinch.v.x1 - x) * f, y0: y - (y - pinch.v.y0) * f, y1: y + (pinch.v.y1 - y) * f };
        draw();
        return;
      }
      if (drag) {
        const dx = ((e.offsetX - drag.x) / (W - pad.l - pad.r)) * (drag.v.x1 - drag.v.x0);
        const dy = ((e.offsetY - drag.y) / (H - pad.t - pad.b)) * (drag.v.y1 - drag.v.y0);
        if (Math.abs(e.offsetX - drag.x) + Math.abs(e.offsetY - drag.y) > 3) {
          view = { x0: drag.v.x0 - dx, x1: drag.v.x1 - dx, y0: drag.v.y0 + dy, y1: drag.v.y1 + dy };
        }
      }
      if (e.offsetX >= pad.l && e.offsetX <= W - pad.r) hover = { px: e.offsetX, py: e.offsetY, x: ix(cur(), e.offsetX) };
      else hover = null;
      updateReadout();
      draw();
    });
    const up = (e) => { pointers.delete(e.pointerId); drag = null; if (pointers.size < 2) pinch = null; };
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("pointerleave", () => { hover = null; updateReadout(); draw(); });
    canvas.addEventListener("dblclick", () => { view = null; draw(); });
    canvas.addEventListener("wheel", (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      const v = cur();
      zoom(e.deltaY > 0 ? 1.15 : 1 / 1.15, ix(v, e.offsetX), iy(v, e.offsetY));
    }, { passive: false });

    function copyCSV() {
      const v = cur();
      const head = [o.xLabel + (o.xUnit ? ` [${o.xUnit}]` : "")];
      series.forEach((s) => head.push((s.name || o.yLabel) + (o.yUnit ? ` [${s.unit || o.yUnit}]` : "")));
      const rows = [head.join(";")];
      const pointSeries = series.find((s) => s.points);
      const xs = pointSeries ? pointSeries.points.map((p) => p[0]) : Array.from({ length: 51 }, (_, i) => v.x0 + ((v.x1 - v.x0) * i) / 50);
      for (const x of xs) rows.push([x, ...series.map((s) => valueAt(s, x))].map((n) => (Number.isFinite(n) ? String(+n.toPrecision(6)).replace(".", ",") : "")).join(";"));
      const text = rows.join("\n");
      (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject())
        .then(() => PO.toast && PO.toast("CSV a vágólapon (pontosvesszővel tagolt)"))
        .catch(() => PO.toast && PO.toast("A másolás nem sikerült ebben a böngészőben"));
    }

    return {
      set(s, keepView) { series = s; if (!keepView) view = null; renderLegend(); draw(); },
      marker(x) { markerX = x; draw(); },
      reset() { view = null; draw(); },
      options(p) { Object.assign(o, p); draw(); },
      redraw: draw,
      destroy() { ro.disconnect(); },
      el: wrap,
    };
  }

  PO.plot = plot;
  PO.PLOT_STYLES = STYLES;
})(typeof globalThis !== "undefined" ? globalThis : this);
