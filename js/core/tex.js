/* PHYSICS OS — képletmegjelenítés KaTeX-szel (helyben, a vendor/katex mappából) */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const cache = new Map();
  function render(tex, display = false) {
    const key = (display ? "D" : "I") + tex;
    if (cache.has(key)) return cache.get(key);
    let out;
    try {
      out = root.katex.renderToString(tex, { displayMode: display, throwOnError: false, strict: "ignore", output: root.PO_TEX_OUTPUT || "htmlAndMathml" });
    } catch (e) {
      out = `<code>${tex.replace(/</g, "&lt;")}</code>`;
    }
    cache.set(key, out);
    return out;
  }
  /** Szövegben a $$…$$ (kiemelt) és $…$ (soron belüli) képleteket rendereli. */
  function html(s) {
    return String(s)
      .replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => render(t.trim(), true))
      .replace(/\$([^$\n]+?)\$/g, (_, t) => render(t.trim(), false));
  }
  /** DOM-elem: a képlet, a forráskód (másoláshoz) a data-tex attribútumban. */
  function el(tex, display = false, cls = "") {
    const span = document.createElement(display ? "div" : "span");
    span.className = cls;
    span.dataset.tex = tex;
    span.innerHTML = render(tex, display);
    return span;
  }
  /** Szöveg biztonságosan HTML-be: a $…$ részek képletek, a többi escape-elt szöveg. */
  function rich(str) {
    const parts = [];
    let s = String(str == null ? "" : str).replace(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g, (m, a, b) => {
      parts.push(a != null ? render(a.trim(), true) : render(b.trim(), false));
      return "\u0000" + (parts.length - 1) + "\u0000";
    });
    s = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    // sima szövegben írt indexek (W_ki, v_max) → alsó index
    s = s.replace(/([A-Za-zΑ-Ωα-ω])_\{?([0-9A-Za-záéíóöőúüűÁÉÍÓÖŐÚÜŰ]+)\}?/g, "$1<sub>$2</sub>");
    return s.replace(/\u0000(\d+)\u0000/g, (_, i) => parts[+i]);
  }
  PO.tex = { render, html, el, rich };
})(typeof globalThis !== "undefined" ? globalThis : this);
