/* PHYSICS OS — képletek: 3. Víz, levegő, környezet */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const { v, mono, gen, fail } = PO.fb;
  const nz = (x, m) => (Math.abs(x) < 1e-300 ? fail(m) : x);

  const HS = "Nyomás, hidrosztatika";
  PO.addFormulas("hidrosztatika", [
    mono({ id: "nyomas", fejezet: HS, nev: "Nyomás", tex: "p = \\dfrac{F}{A}", out: "p", terms: { F: 1, A: -1 },
      vars: { p: v("p"), F: v("F", { nev: "a felületre merőleges nyomóerő", min: 0 }), A: v("A", { nev: "nyomott felület" }) }, minta: { F: 600, A: 0.04 },
      jelentes: "Az egységnyi felületre merőlegesen ható erő. 1 Pa = 1 N/m².", feltetel: "Egyenletesen eloszló, a felületre merőleges erő.",
      hiba: "cm²-t nem váltják m²-re (10⁻⁴-szeres hiba).", pelda: { szoveg: "600 N-os ember két talpon (400 cm²): p = 15 kPa." },
      kulcsszavak: "nyomás pascal nyomóerő felület", kapcsolodo: ["hidrosztatikai", "hidraulika"] }),
    mono({ id: "hidrosztatikai", fejezet: HS, nev: "Hidrosztatikai nyomás", tex: "p_h = \\rho\\,g\\,h", out: "p", terms: { rho: 1, g: 1, h: 1 },
      vars: { p: v("p", { tex: "p_h", nev: "hidrosztatikai nyomás" }), rho: v("rho", { nev: "a folyadék sűrűsége" }), g: v("g"), h: v("h", { nev: "mélység a folyadék felszínétől", min: 0 }) }, minta: { rho: 1000, g: 9.81, h: 10 },
      jelentes: "A folyadék súlyából eredő nyomás; csak a mélységtől függ, az edény alakjától nem (hidrosztatikai paradoxon). A teljes nyomás: $p = p_0 + \\rho g h$.",
      feltetel: "Nyugvó, összenyomhatatlan folyadék.", nem: "Gázokban a sűrűség a magassággal változik – ott csak kis magasságkülönbségre jó közelítés.",
      hiba: "A külső légnyomást kihagyják, ha a teljes nyomást kérdezik.", pelda: { szoveg: "10 m mély vízben: ≈ 98 kPa ≈ 1 atm többletnyomás." },
      kulcsszavak: "hidrosztatikai nyomás mélység folyadék", kapcsolodo: ["felhajtoero", "nyomas"] }),
    mono({ id: "felhajtoero", fejezet: HS, nev: "Arkhimédész törvénye (felhajtóerő)", tex: "F_f = \\rho_{f}\\,V_{b}\\,g", out: "F", terms: { rho: 1, V: 1, g: 1 },
      vars: { F: v("F", { tex: "F_f", nev: "felhajtóerő", min: 0 }), rho: v("rho", { tex: "\\rho_f", nev: "a folyadék (gáz) sűrűsége" }), V: v("Vt", { tex: "V_b", nev: "a test bemerülő térfogata" }), g: v("g") }, minta: { rho: 1000, V: 0.002, g: 9.81 },
      jelentes: "A folyadékba (gázba) merülő testre a kiszorított közeg súlyával egyenlő felhajtóerő hat. Úszásnál $F_f = mg$, ekkor $\\rho_{test}V = \\rho_f V_b$.",
      feltetel: "Nyugvó folyadék vagy gáz, nehézségi erőtérben.", nem: "Súlytalanságban nincs felhajtóerő.",
      hiba: "A test sűrűségével számolnak a folyadéké helyett, vagy a teljes térfogattal a bemerülő helyett.", pelda: { szoveg: "2 dm³-es test vízben: F_f ≈ 19,6 N." },
      kulcsszavak: "felhajtóerő arkhimédész úszás lebegés kiszorított folyadék", kapcsolodo: ["suruseg", "hidrosztatikai"] }),
    mono({ id: "suruseg", fejezet: HS, nev: "Sűrűség", tex: "\\rho = \\dfrac{m}{V}", out: "rho", terms: { m: 1, V: -1 },
      vars: { rho: v("rho"), m: v("m"), V: v("Vt") }, minta: { m: 0.54, V: 0.0002 },
      jelentes: "Az egységnyi térfogatú anyag tömege; az anyagra jellemző. 1 g/cm³ = 1000 kg/m³.", feltetel: "Homogén test (különben átlagsűrűség).",
      hiba: "g/cm³ és kg/m³ összekeverése.", pelda: { szoveg: "540 g, 200 cm³ → ρ = 2700 kg/m³ (alumínium). (szóbeli mérés)" },
      kulcsszavak: "sűrűség tömeg térfogat mérés", kapcsolodo: ["felhajtoero"] }),
    mono({ id: "hidraulika", fejezet: HS, nev: "Hidraulikus emelő (Pascal-törvény)", tex: "\\dfrac{F_1}{A_1} = \\dfrac{F_2}{A_2}", out: "F2", terms: { F1: 1, A2: 1, A1: -1 },
      rtex: { F2: "F_2 = F_1\\dfrac{A_2}{A_1}", F1: "F_1 = F_2\\dfrac{A_1}{A_2}", A2: "A_2 = A_1\\dfrac{F_2}{F_1}", A1: "A_1 = A_2\\dfrac{F_1}{F_2}" },
      vars: { F1: v("F", { tex: "F_1", nev: "erő a kis dugattyún", min: 0, pos: true }), A1: v("A", { tex: "A_1", nev: "a kis dugattyú felülete" }), F2: v("F", { tex: "F_2", nev: "erő a nagy dugattyún", min: 0 }), A2: v("A", { tex: "A_2", nev: "a nagy dugattyú felülete" }) },
      minta: { F1: 200, A2: 0.05, A1: 0.001 },
      jelentes: "Zárt folyadékban a külső nyomás mindenütt ugyanakkora (Pascal). Erőt nyerünk, de az utat elveszítjük: $F_1 s_1 = F_2 s_2$.",
      feltetel: "Összenyomhatatlan folyadék, súrlódás nélkül, azonos magasságú dugattyúk.", hiba: "Átmérők arányát veszik a felületek aránya helyett (négyzet!).",
      pelda: { szoveg: "200 N a 10 cm²-es dugattyún → 10 kN az 500 cm²-esen." }, kulcsszavak: "hidraulika pascal törvény emelő fék dugattyú", kapcsolodo: ["nyomas"] }),
  ]);

  const AR = "Áramlások";
  PO.addFormulas("aramlasok", [
    mono({ id: "folytonossag", fejezet: AR, nev: "Folytonossági egyenlet", tex: "A_1 v_1 = A_2 v_2", out: "v2", terms: { A1: 1, v1: 1, A2: -1 },
      rtex: { v2: "v_2 = v_1\\dfrac{A_1}{A_2}", v1: "v_1 = v_2\\dfrac{A_2}{A_1}", A1: "A_1 = A_2\\dfrac{v_2}{v_1}", A2: "A_2 = A_1\\dfrac{v_1}{v_2}" },
      vars: { A1: v("A", { tex: "A_1", nev: "keresztmetszet az 1. helyen" }), v1: v("v", { tex: "v_1", nev: "áramlási sebesség az 1. helyen", min: 0, pos: true }), A2: v("A", { tex: "A_2", nev: "keresztmetszet a 2. helyen" }), v2: v("v", { tex: "v_2", nev: "áramlási sebesség a 2. helyen", min: 0 }) },
      minta: { A1: 0.002, v1: 1.5, A2: 0.0005 },
      jelentes: "Összenyomhatatlan közegben a térfogatáram ($Av$) mindenütt ugyanakkora: a szűkületben gyorsabb az áramlás.", feltetel: "Összenyomhatatlan folyadék, stacionárius áramlás.",
      hiba: "Átmérőt helyettesítenek keresztmetszet helyett.", pelda: { szoveg: "Negyedére szűkülő csőben négyszeres sebesség." },
      kulcsszavak: "folytonossági egyenlet áramlás szűkület térfogatáram", kapcsolodo: ["bernoulli", "terfogataram"] }),
    mono({ id: "terfogataram", fejezet: AR, nev: "Térfogatáram", tex: "\\dfrac{\\Delta V}{\\Delta t} = A\\,v", out: "Iv", terms: { A: 1, v: 1 },
      vars: { Iv: { tex: "\\Delta V/\\Delta t", nev: "térfogatáram", dim: "terfogataram" }, A: v("A"), v: v("v", { min: 0 }) }, minta: { A: 3e-4, v: 2 },
      jelentes: "Időegység alatt átáramló térfogat (m³/s).", feltetel: "A keresztmetszetben egyenletes sebesség (átlagsebesség).", hiba: "—",
      pelda: { szoveg: "3 cm² keresztmetszetű csapból 2 m/s-mal: 6 · 10⁻⁴ m³/s = 0,6 l/s." }, kulcsszavak: "térfogatáram vízhozam", kapcsolodo: ["folytonossag"] }),
    gen({ id: "bernoulli", fejezet: AR, nev: "Bernoulli-törvény (vízszintes cső)", tex: "p_1 + \\tfrac12\\rho v_1^2 = p_2 + \\tfrac12\\rho v_2^2",
      vars: { p1: v("p", { tex: "p_1", nev: "nyomás az 1. helyen" }), v1: v("v", { tex: "v_1", nev: "sebesség az 1. helyen", min: 0 }), p2: v("p", { tex: "p_2", nev: "nyomás a 2. helyen" }), v2: v("v", { tex: "v_2", nev: "sebesség a 2. helyen", min: 0 }), rho: v("rho") },
      solve: {
        p2: { tex: "p_2 = p_1 + \\tfrac12\\rho(v_1^2 - v_2^2)", f: ({ p1, v1, v2, rho }) => p1 + 0.5 * rho * (v1 * v1 - v2 * v2) },
        p1: { tex: "p_1 = p_2 + \\tfrac12\\rho(v_2^2 - v_1^2)", f: ({ p2, v1, v2, rho }) => p2 + 0.5 * rho * (v2 * v2 - v1 * v1) },
        v2: { tex: "v_2 = \\sqrt{v_1^2 + \\dfrac{2(p_1 - p_2)}{\\rho}}", f: ({ p1, v1, p2, rho }) => { const x = v1 * v1 + (2 * (p1 - p2)) / rho; if (x < 0) fail("Ekkora nyomásnövekedés ezzel a sebességgel nem lehetséges."); return Math.sqrt(x); } },
        v1: { tex: "v_1 = \\sqrt{v_2^2 - \\dfrac{2(p_1 - p_2)}{\\rho}}", f: ({ p1, p2, v2, rho }) => { const x = v2 * v2 - (2 * (p1 - p2)) / rho; if (x < 0) fail("Ellentmondásos adatok."); return Math.sqrt(x); } },
      },
      minta: { p1: 2e5, v1: 1.5, p2: 2e5 + 0.5 * 1000 * (1.5 * 1.5 - 36), v2: 6, rho: 1000 },
      pelda: { szoveg: "Vízvezetékben 2 bar, 1,5 m/s; a szűkületben 6 m/s: p₂ = 2 · 10⁵ + 500 · (2,25 − 36) ≈ 1,83 bar.", adott: { p1: 2e5, v1: 1.5, v2: 6, rho: 1000 }, keres: "p2" },
      jelentes: "Áramló közegben ahol nagyobb a sebesség, ott kisebb a nyomás. Általános alak: $p + \\tfrac12\\rho v^2 + \\rho g h = \\text{áll.}$ Alkalmazás: szárnyfelhajtóerő, porlasztó, vízsugárszivattyú, tetők leszakítása viharban.",
      feltetel: "Összenyomhatatlan, súrlódásmentes közeg; ugyanazon áramvonal mentén.", hiba: "A gyorsabb helyen nagyobb nyomást várnak.",
      kulcsszavak: "bernoulli áramlás nyomás sebesség szárny porlasztó", kapcsolodo: ["folytonossag", "torricelli"] }),
    mono({ id: "torricelli", fejezet: AR, nev: "Kiömlési sebesség (Torricelli)", tex: "v = \\sqrt{2\\,g\\,h}", out: "v", c: Math.SQRT2, ctex: "\\sqrt2", terms: { g: 0.5, h: 0.5 },
      rtex: { g: "g = \\dfrac{v^2}{2h}", h: "h = \\dfrac{v^2}{2g}" },
      vars: { v: v("v", { min: 0, nev: "kiömlési sebesség" }), g: v("g"), h: v("h", { nev: "a nyílás mélysége a folyadékfelszín alatt", min: 0 }) }, minta: { g: 9.81, h: 0.8 },
      jelentes: "A kis nyíláson kiömlő folyadék akkora sebességgel áramlik ki, mintha h magasságból esett volna.", feltetel: "Nagy edény (a felszín süllyedése elhanyagolható), súrlódás nélkül.",
      hiba: "—", pelda: { szoveg: "80 cm-rel a vízszint alatt: v ≈ 4 m/s." }, kulcsszavak: "torricelli kiömlés folyadék sebesség", kapcsolodo: ["bernoulli", "szabadeses-v-h"] }),
  ]);

  const FF = "Felületi feszültség";
  PO.addFormulas("feluleti", [
    mono({ id: "feluleti-F", fejezet: FF, nev: "Felületi feszültség", tex: "\\alpha = \\dfrac{F}{l}", out: "al", terms: { F: 1, l: -1 },
      vars: { al: { tex: "\\alpha", nev: "felületi feszültség", dim: "feluleti", min: 0 }, F: v("F", { nev: "a felszín mentén ható erő", min: 0 }), l: v("l", { nev: "a határvonal hossza (kettős hártyánál 2l)" }) }, minta: { F: 0.0073, l: 0.1 },
      jelentes: "A folyadékfelszín összehúzódni igyekszik; a felület határvonalának egységnyi hosszára ható erő. Víz: ≈ 0,073 N/m.",
      feltetel: "Adott hőmérsékleten (melegítéskor és mosószertől csökken).", hiba: "Kettős hártyánál (pl. drótkereten) a két felület miatt 2l-lel kell számolni.",
      pelda: { szoveg: "0,0073 N erő 10 cm hosszon: α = 0,073 N/m." }, kulcsszavak: "felületi feszültség hártya folyadék", kapcsolodo: ["kapillaris"] }),
    mono({ id: "kapillaris", fejezet: FF, nev: "Kapilláris emelkedés", tex: "h = \\dfrac{2\\alpha}{\\rho\\,g\\,r}", out: "h", c: 2, ctex: "2", cinv: "\\tfrac12", terms: { al: 1, rho: -1, g: -1, r: -1 },
      rtex: { al: "\\alpha = \\dfrac{\\rho g r h}{2}", r: "r = \\dfrac{2\\alpha}{\\rho g h}", rho: "\\rho = \\dfrac{2\\alpha}{g r h}", g: "g = \\dfrac{2\\alpha}{\\rho r h}" },
      vars: { h: v("h", { nev: "emelkedési magasság" }), al: { tex: "\\alpha", nev: "felületi feszültség", dim: "feluleti", min: 0, pos: true }, rho: v("rho"), g: v("g"), r: v("r", { nev: "a cső belső sugara" }) },
      minta: { al: 0.073, rho: 1000, g: 9.81, r: 0.0005 },
      jelentes: "Nedvesítő folyadék a vékony csőben felemelkedik (nem nedvesítő, pl. higany, lesüllyed). Minél vékonyabb a cső, annál magasabbra. Ezen alapul az egyik szóbeli mérés.",
      feltetel: "Tökéletesen nedvesítő folyadék (illeszkedési szög ≈ 0), vékony cső.", hiba: "Átmérőt helyettesítenek a sugár helyére.",
      pelda: { szoveg: "Víz 0,5 mm sugarú csőben: h ≈ 3 cm." }, kulcsszavak: "kapillaritás kapilláris emelkedés hajszálcsövesség felületi feszültség mérés", kapcsolodo: ["feluleti-F"] }),
  ]);
})(typeof globalThis !== "undefined" ? globalThis : this);
