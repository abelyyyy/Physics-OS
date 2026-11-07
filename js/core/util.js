/* PHYSICS OS — közös segédfüggvények (böngészőben és Node-ban is fut) */
(function (root) {
  const PO = (root.PO = root.PO || {});

  /** Szám formázása értékes jegyekre, magyar tizedesvesszővel. */
  function fmt(x, sig = 3) {
    if (x === null || x === undefined || Number.isNaN(x)) return "—";
    if (!Number.isFinite(x)) return x > 0 ? "∞" : "−∞";
    if (x === 0) return "0";
    const ax = Math.abs(x);
    let exp = Math.floor(Math.log10(ax));
    let s;
    if (exp >= 6 || exp <= -4) {
      let m = Number((x / Math.pow(10, exp)).toPrecision(sig));
      if (Math.abs(m) >= 10) { m /= 10; exp += 1; } // kerekítés miatt 10,0 lehet
      s = Number(m.toPrecision(sig)).toString().replace(".", ",") + " · 10" + sup(exp);
      return s.replace(/^-/, "−");
    }
    s = Number(x.toPrecision(sig)).toString();
    // ne mutasson tudományos alakot kis kitevőnél
    if (/e/.test(s)) s = Number(s).toFixed(Math.max(0, sig - 1 - exp));
    return s.replace("-", "−").replace(".", ",");
  }
  function sup(n) {
    const map = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
    return String(n).split("").map((c) => map[c] || c).join("");
  }

  /** Fix tizedesjegyre formáz (kijelzőkhöz). */
  function fixed(x, d = 2) {
    if (!Number.isFinite(x)) return "—";
    const v = Math.abs(x) < 0.5 * Math.pow(10, -d) ? 0 : x;
    return v.toFixed(d).replace("-", "−").replace(".", ",");
  }

  /** Magyar számbevitel értelmezése: tizedesvessző, szóköz, 1,5e3, 3·10^4 */
  function parseNum(str) {
    if (typeof str === "number") return str;
    if (str === null || str === undefined) return NaN;
    let s = String(str).trim().replace(/\s+/g, "").replace(/−/g, "-").replace(",", ".");
    if (s === "") return NaN;
    const m = s.match(/^([+-]?\d*\.?\d+)(?:[*·x×]10\^?([+-]?\d+))$/i);
    if (m) return Number(m[1]) * Math.pow(10, Number(m[2]));
    if (!/^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(s)) return NaN;
    return Number(s);
  }

  /** Ékezet- és kisbetű-független kereséshez normalizál. */
  function norm(s) {
    return String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[–—−-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /** "Szép" tengelybeosztás lépésköz. */
  function niceStep(range, target = 6) {
    if (!(range > 0)) return 1;
    const raw = range / target;
    const p = Math.pow(10, Math.floor(Math.log10(raw)));
    const f = raw / p;
    const nf = f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10;
    return nf * p;
  }

  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const deg = (r) => (r * 180) / Math.PI;
  const rad = (d) => (d * Math.PI) / 180;

  /** Kis DOM-építő: h('div.panel', {onclick}, [gyerekek]) */
  function h(sel, attrs, ...kids) {
    const [tag, ...cls] = sel.split(".");
    const el = document.createElement(tag || "div");
    if (cls.length) el.className = cls.join(" ");
    if (attrs && (typeof attrs !== "object" || attrs instanceof Node || Array.isArray(attrs))) {
      kids.unshift(attrs);
      attrs = null;
    }
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v === null || v === undefined || v === false) continue;
        if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
        else if (k === "html") el.innerHTML = v;
        else if (k === "class") el.className += (el.className ? " " : "") + v;
        else if (k === "style" && typeof v === "object") Object.assign(el.style, v);
        else if (k in el && typeof v !== "string") el[k] = v;
        else el.setAttribute(k, v === true ? "" : v);
      }
    }
    const add = (k) => {
      if (k === null || k === undefined || k === false) return;
      if (Array.isArray(k)) return k.forEach(add);
      el.appendChild(k instanceof Node ? k : document.createTextNode(String(k)));
    };
    kids.forEach(add);
    return el;
  }

  /* Alsó index egyszerű jelöléssel: "E_m", "R_{b}", "U_k(I)" */
  const SUB_RE = /([A-Za-zΑ-Ωα-ωΔ])_(\{[^}]*\}|[0-9A-Za-záéíóöőúüűÁÉÍÓÖŐÚÜŰ]+)/g;
  const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  /** Szöveg → HTML, a X_sub részek <sub>-bal. */
  function subHtml(str) { return esc(str).replace(SUB_RE, (m, a, b) => `${a}<sub>${b.replace(/^\{|\}$/g, "")}</sub>`); }
  /** Vászonra írás alsó indexekkel; a ctx aktuális textAlign-ját tiszteletben tartja. */
  function fillSub(ctx, str, x, y) {
    str = String(str);
    if (!str.includes("_")) { ctx.fillText(str, x, y); return; }
    const parts = []; let last = 0;
    str.replace(SUB_RE, (m, a, b, i) => { parts.push([str.slice(last, i) + a, false], [b.replace(/^\{|\}$/g, ""), true]); last = i + m.length; return m; });
    parts.push([str.slice(last), false]);
    const font = ctx.font, m = font.match(/(\d+(?:\.\d+)?)px/), size = m ? +m[1] : 12;
    const subFont = font.replace(/(\d+(?:\.\d+)?)px/, Math.round(size * 0.75) + "px");
    const widths = parts.map(([t, sub]) => { ctx.font = sub ? subFont : font; return ctx.measureText(t).width; });
    ctx.font = font;
    const total = widths.reduce((a, b) => a + b, 0), al = ctx.textAlign;
    let cx = al === "center" ? x - total / 2 : al === "right" || al === "end" ? x - total : x;
    ctx.textAlign = "left";
    parts.forEach(([t, sub], i) => { ctx.font = sub ? subFont : font; ctx.fillText(t, cx, y + (sub ? size * 0.3 : 0)); cx += widths[i]; });
    ctx.font = font; ctx.textAlign = al;
  }
  PO.util = { fmt, fixed, parseNum, norm, niceStep, clamp, deg, rad, h, sup, subHtml, fillSub };
  if (typeof module !== "undefined") module.exports = PO.util;
})(typeof globalThis !== "undefined" ? globalThis : this);
