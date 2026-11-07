/* PHYSICS OS — telepítés (PWA): service worker regisztrálása, iPhone/Android útmutató */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const { h } = PO.util;
  const nav = root.navigator || {};
  const isIOS = () => /iphone|ipad|ipod/i.test(nav.userAgent || "") || (nav.platform === "MacIntel" && nav.maxTouchPoints > 1);
  const isStandalone = () => !!(nav.standalone || (root.matchMedia && root.matchMedia("(display-mode: standalone)").matches));
  const isWeb = () => root.location && /^https?:$/.test(root.location.protocol);
  const offlineReady = () => !!(nav.serviceWorker && nav.serviceWorker.controller);

  /** Service worker: offline működés, ha az app http(s)-en fut (pl. Netlify). */
  function register() {
    if (!isWeb() || root.PO_NO_SW || !nav.serviceWorker) return;
    let hadController = !!nav.serviceWorker.controller;
    nav.serviceWorker.register("sw.js").catch((e) => console.warn("Service worker:", e));
    nav.serviceWorker.addEventListener("controllerchange", () => {
      if (hadController) PO.toast && PO.toast("Új verzió telepítve – újratöltés…"), setTimeout(() => location.reload(), 900);
      hadController = true;
    });
    // tartós tárolás kérése (a böngésző ne törölje a haladást)
    if (nav.storage && nav.storage.persist) nav.storage.persist().catch(() => {});
  }

  const STEPS_IOS = [
    ["Nyisd meg Safariban", "Az app webcímét (pl. a Netlify-linket) a Safari böngészőben nyisd meg – a Chrome iPhone-on nem tud főképernyőre telepíteni webappot offline támogatással."],
    ["Megosztás gomb", "Koppints a képernyő alján (iPaden fent) a Megosztás ikonra: négyzet felfelé mutató nyíllal."],
    ["Főképernyőhöz adás", "Görgess le a menüben, és válaszd a „Főképernyőhöz adás” (Add to Home Screen) pontot. Ha nem látod, a lista alján a „Műveletek szerkesztése” alatt kapcsolhatod be."],
    ["Hozzáadás", "Hagyd a „Physics OS” nevet, és koppints a „Hozzáadás” gombra. Megjelenik az atom-ikon a főképernyőn."],
    ["Első indítás interneten", "Indítsd el egyszer az ikonról, amíg van net: ekkor tölti le az összes tananyagot, képletet és vizsgafeladatot. Ezután internet nélkül is működik (pl. repülő üzemmódban)."],
  ];
  const STEPS_ANDROID = [["Chrome", "Nyisd meg a webcímet Chrome-ban, majd a ⋮ menüben válaszd a „Telepítés” / „Hozzáadás a kezdőképernyőhöz” pontot."]];

  function guide(open) {
    const status = isStandalone() ? "Az app telepítve fut a főképernyőről." : isWeb() ? (offlineReady() ? "Offline működés: kész – a tartalom a készülékre mentve." : "Offline működés: az első betöltés után aktiválódik.") : "Helyi fájlként fut – telepítéshez webcímre kell feltölteni (lásd lent).";
    return h("details.panel.install-guide", open ? { open: true } : {},
      h("summary", h("strong", "Telepítés iPhone-ra (és Androidra)"), h("span.small.muted", { style: { marginLeft: "8px" } }, status)),
      h("ol.install-steps", STEPS_IOS.map(([t, d]) => h("li", h("strong", t), h("div.small.muted", d)))),
      h("p.small", h("strong", "Android: "), STEPS_ANDROID[0][1]),
      h("div.callout.small", h("div.callout-t", "Webcím kell hozzá"),
        "A telepítéshez és az offline működéshez az appnak egy https-es webcímen kell lennie. A legegyszerűbb: a letöltött physics-os mappát húzd rá az app.netlify.com/drop oldalra (Netlify Drop) – pár másodperc alatt kapsz egy saját linket, amit Safariban megnyitva telepíthetsz. A claude.ai-os megosztási link is megnyitható iPhone-on, de az offline módot csak a saját webcím adja."),
      h("div.callout.small", h("div.callout-t", "A haladásod"),
        "A telepített app külön tárhelyet kap, mint a Safari. Ha váltasz (pl. a gépről a telefonra), használd a Kezdőlap → Mentés → „Mentés kimásolása” és „Betöltés” gombokat. Rendszeres biztonsági mentés ajánlott."));
  }

  /** Rövid figyelmeztetés a kezdőlap tetején: iPhone-on, ha még nincs telepítve. */
  function hint() {
    if (!isIOS() || isStandalone()) return null;
    let dismissed = false;
    try { dismissed = localStorage.getItem("po-install-hint") === "1"; } catch (e) {}
    if (dismissed) return null;
    const el = h("div.callout.install-hint", h("div.callout-t", "Tedd a főképernyőre!"),
      "Safariban: Megosztás ", h("span", { "aria-hidden": "true" }, "⬆︎"), " → „Főképernyőhöz adás”. Így teljes képernyős appként, internet nélkül is fut.",
      h("div.btn-row", { style: { marginTop: "8px" } },
        h("a.btn.sm", { href: "#telepites" }, "Részletes útmutató"),
        h("button.btn.sm.ghost", { type: "button", onclick: () => { try { localStorage.setItem("po-install-hint", "1"); } catch (e) {} el.remove(); } }, "Elrejtés")));
    return el;
  }

  function page() {
    return h("div.page", h("div.eyebrow", "Telepítés"), h("h1", "PHYSICS OS a telefonodon"),
      h("p.lead", "Az app telepíthető webalkalmazás (PWA): főképernyő-ikonnal, teljes képernyőn, internet nélkül is fut – App Store nélkül."),
      guide(true));
  }

  PO.install = { register, guide, hint, page, isIOS, isStandalone };
})(typeof globalThis !== "undefined" ? globalThis : this);
