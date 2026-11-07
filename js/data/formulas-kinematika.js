/* PHYSICS OS — képletadatbázis: KINEMATIKA
 * Minden képlet egyszer van leírva; ebből készül az adatlap, a kalkulátor, a keresés és a kártya.
 *  vars:   a képlet jelei (tex, név, dimenzió, korlátok)
 *  solve:  változónként az átrendezett alak (tex) és a megoldó függvény (SI-ben számol;
 *          több megoldásnál tömböt ad; értelmetlen bemenetnél Error-t dob magyar üzenettel)
 *  minta:  egymással konzisztens SI-értékek – az automatikus teszt ezzel ellenőrzi az összes átrendezést
 *  pelda:  a kalkulátor kezdőértékei + szöveges számpélda
 *  verified: a felhasználó saját ellenőrzése (függvénytáblázat/tankönyv) – kezdetben senki sem ellenőrizte
 */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const kin = PO.kin || (typeof require !== "undefined" ? require("../physics/kinematics.js") : null);
  const R = Math.PI / 180;
  const fail = (msg) => { throw new Error(msg); };
  const sqrtPos = (x, msg) => (x < -1e-12 ? fail(msg) : Math.sqrt(Math.max(0, x)));
  const nz = (x, msg) => (Math.abs(x) < 1e-15 ? fail(msg) : x);

  const V = {
    s: { tex: "s", nev: "megtett út", dim: "hossz", min: 0 },
    t: { tex: "t", nev: "eltelt idő", dim: "ido", min: 0 },
    v: { tex: "v", nev: "sebesség", dim: "sebesseg" },
    v0: { tex: "v_0", nev: "kezdősebesség", dim: "sebesseg" },
    a: { tex: "a", nev: "gyorsulás", dim: "gyorsulas" },
    g: { tex: "g", nev: "nehézségi gyorsulás", dim: "gyorsulas", min: 0, pos: true },
    h: { tex: "h", nev: "magasság (esési magasság)", dim: "hossz", min: 0 },
    alpha: { tex: "\\alpha", nev: "hajítási szög a vízszinteshez képest", dim: "szog", min: 0, max: Math.PI / 2 },
    r: { tex: "r", nev: "pályasugár", dim: "hossz", min: 0, pos: true },
    T: { tex: "T", nev: "periódusidő (keringési idő)", dim: "ido", min: 0, pos: true },
    f: { tex: "f", nev: "frekvencia (fordulatszám)", dim: "frekvencia", min: 0 },
    omega: { tex: "\\omega", nev: "szögsebesség", dim: "szogseb" },
    omega0: { tex: "\\omega_0", nev: "kezdeti szögsebesség", dim: "szogseb" },
    beta: { tex: "\\beta", nev: "szöggyorsulás", dim: "szoggyors" },
    acp: { tex: "a_{\\mathrm{cp}}", nev: "centripetális gyorsulás", dim: "gyorsulas", min: 0 },
    at: { tex: "a_{\\mathrm{t}}", nev: "érintőirányú (tangenciális) gyorsulás", dim: "gyorsulas" },
    phi: { tex: "\\Delta\\varphi", nev: "szögelfordulás", dim: "szog" },
  };
  const v = (key, over) => Object.assign({}, V[key], over || {});

  const F = [];
  const add = (o) => F.push(Object.assign({ temakor: "kinematika", szint: "kozep", verified: false, kapcsolodo: [], sim: null }, o));

  /* ------------------------------------------------------------------ */
  /* A) Egyenes vonalú mozgások                                          */
  /* ------------------------------------------------------------------ */
  const CH1 = "Egyenes vonalú mozgások";

  add({
    id: "atlagsebesseg", fejezet: CH1, nev: "Átlagsebesség (átlagos sebességnagyság)",
    tex: "v_{\\text{átl}} = \\dfrac{s_{\\text{össz}}}{t_{\\text{össz}}}",
    jelentes: "Az a sebesség, amellyel egyenletesen haladva a test ugyanannyi idő alatt ugyanakkora utat tenne meg. Nem a sebességek átlaga!",
    vars: { v: v("v", { tex: "v_{\\text{átl}}", nev: "átlagsebesség", min: 0 }), s: v("s", { tex: "s_{\\text{össz}}", nev: "teljes út" }), t: v("t", { tex: "t_{\\text{össz}}", nev: "teljes idő", pos: true }) },
    solve: {
      v: { tex: "v_{\\text{átl}} = \\dfrac{s_{\\text{össz}}}{t_{\\text{össz}}}", f: ({ s, t }) => s / nz(t, "Az idő nem lehet nulla.") },
      s: { tex: "s_{\\text{össz}} = v_{\\text{átl}}\\, t_{\\text{össz}}", f: ({ v, t }) => v * t },
      t: { tex: "t_{\\text{össz}} = \\dfrac{s_{\\text{össz}}}{v_{\\text{átl}}}", f: ({ s, v }) => s / nz(v, "Nulla átlagsebességgel nem tesz meg utat a test.") },
    },
    feltetel: "Bármilyen mozgásra érvényes. Az összes utat az összes (megállásokkal együtt eltelt) idővel kell osztani.",
    nem: "Nem szabad a szakaszok sebességeinek számtani közepét venni, ha a szakaszok ideje különböző.",
    hiba: "Az út felét 60 km/h-val, másik felét 40 km/h-val teszi meg → az átlagsebesség NEM 50 km/h, hanem 48 km/h.",
    pelda: { szoveg: "Egy kerékpáros 12 km-t 40 perc alatt tesz meg: v_átl = 12 000 m / 2400 s = 5 m/s = 18 km/h.", adott: { s: 12000, t: 2400 }, keres: "v" },
    minta: { s: 100, t: 20, v: 5 },
    kulcsszavak: "átlagsebesség átlag sebesség út idő",
    kapcsolodo: ["egyenletes"], fgvt: true,
  });

  add({
    id: "egyenletes", fejezet: CH1, nev: "Egyenes vonalú egyenletes mozgás",
    tex: "s = v \\cdot t",
    jelentes: "Állandó sebességnél a megtett út egyenesen arányos az idővel; a hely–idő grafikon egyenes, meredeksége a sebesség.",
    vars: { s: v("s"), v: v("v", { min: 0 }), t: v("t") },
    solve: {
      s: { tex: "s = v\\,t", f: ({ v, t }) => v * t },
      v: { tex: "v = \\dfrac{s}{t}", f: ({ s, t }) => s / nz(t, "Az idő nem lehet nulla.") },
      t: { tex: "t = \\dfrac{s}{v}", f: ({ s, v }) => s / nz(v, "Álló test nem tesz meg utat.") },
    },
    feltetel: "Csak állandó nagyságú és irányú sebességnél (gyorsulás nélkül).",
    nem: "Gyorsuló mozgásnál (pl. fékezés, szabadesés) nem használható – ott az egyenletesen változó mozgás képletei kellenek.",
    hiba: "km/h és m/s keverése: 72 km/h = 20 m/s (osztás 3,6-tal).",
    pelda: { szoveg: "Egy autó 20 m/s (72 km/h) sebességgel 15 s alatt s = 20 · 15 = 300 m utat tesz meg.", adott: { v: 20, t: 15 }, keres: "s" },
    minta: { s: 100, t: 20, v: 5 },
    kulcsszavak: "egyenletes mozgás állandó sebesség út idő",
    kapcsolodo: ["atlagsebesseg", "seb-ido"], fgvt: true,
  });

  add({
    id: "gyorsulas", fejezet: CH1, nev: "Gyorsulás (átlagos gyorsulás)",
    tex: "a = \\dfrac{\\Delta v}{\\Delta t}",
    jelentes: "Megmutatja, mennyit változik a sebesség egységnyi idő alatt. Egyenletesen változó mozgásnál állandó, ekkor ez a pillanatnyi gyorsulás is.",
    vars: { a: v("a"), dv: { tex: "\\Delta v", nev: "sebességváltozás", dim: "sebesseg" }, dt: { tex: "\\Delta t", nev: "eltelt idő", dim: "ido", min: 0, pos: true } },
    solve: {
      a: { tex: "a = \\dfrac{\\Delta v}{\\Delta t}", f: ({ dv, dt }) => dv / nz(dt, "Az idő nem lehet nulla.") },
      dv: { tex: "\\Delta v = a\\,\\Delta t", f: ({ a, dt }) => a * dt },
      dt: { tex: "\\Delta t = \\dfrac{\\Delta v}{a}", f: ({ dv, a }) => dv / nz(a, "Nulla gyorsulásnál a sebesség nem változik.") },
    },
    feltetel: "Δv = v_vég − v_kezdő (előjeles!). Fékezésnél Δv és így a is negatív.",
    nem: "Körmozgásnál a sebesség iránya is változik: ott a gyorsulás vektor, a nagysága nem Δ|v|/Δt.",
    hiba: "Előjelhiba fékezésnél: 20 m/s-ról 0-ra 4 s alatt → a = (0 − 20)/4 = −5 m/s².",
    pelda: { szoveg: "Egy autó 4 s alatt 0-ról 20 m/s-ra gyorsul: a = 20/4 = 5 m/s².", adott: { dv: 20, dt: 4 }, keres: "a" },
    minta: { a: 2, dv: 10, dt: 5 },
    kulcsszavak: "gyorsulás sebességváltozás lassulás fékezés",
    kapcsolodo: ["seb-ido"], fgvt: true,
  });

  add({
    id: "seb-ido", fejezet: CH1, nev: "Sebesség egyenletesen változó mozgásnál",
    tex: "v = v_0 + a\\,t",
    jelentes: "A sebesség–idő grafikon egyenes; tengelymetszete v₀, meredeksége a gyorsulás.",
    vars: { v: v("v"), v0: v("v0"), a: v("a"), t: v("t") },
    solve: {
      v: { tex: "v = v_0 + a\\,t", f: ({ v0, a, t }) => v0 + a * t },
      v0: { tex: "v_0 = v - a\\,t", f: ({ v, a, t }) => v - a * t },
      a: { tex: "a = \\dfrac{v - v_0}{t}", f: ({ v, v0, t }) => (v - v0) / nz(t, "Az idő nem lehet nulla.") },
      t: { tex: "t = \\dfrac{v - v_0}{a}", f: ({ v, v0, a }) => (v - v0) / nz(a, "Nulla gyorsulásnál a sebesség nem változik.") },
    },
    feltetel: "Állandó gyorsulás esetén. Az egy egyenesbe eső mennyiségek előjelesek (egy pozitív irányt kell választani).",
    nem: "Változó gyorsulásnál (pl. közegellenállásnál) nem érvényes.",
    hiba: "A fékezés gyorsulását pozitívnak írják; ekkor a megállási idő negatívnak jön ki.",
    pelda: { szoveg: "v₀ = 5 m/s, a = 2 m/s², t = 6 s → v = 5 + 2·6 = 17 m/s.", adott: { v0: 5, a: 2, t: 6 }, keres: "v" },
    minta: { v: 13, v0: 3, a: 2, t: 5 },
    kulcsszavak: "egyenletesen változó gyorsuló mozgás sebesség idő",
    kapcsolodo: ["gyorsulas", "ut-ido", "idotlen"], sim: "valtozo", fgvt: true,
  });

  add({
    id: "ut-ido", fejezet: CH1, nev: "Út egyenletesen változó mozgásnál",
    tex: "s = v_0\\,t + \\dfrac{a}{2}\\,t^2",
    jelentes: "A megtett út (pontosabban: elmozdulás a mozgás irányában) a sebesség–idő grafikon alatti terület.",
    vars: { s: v("s", { min: undefined, nev: "elmozdulás (út, ha nem fordul vissza)" }), v0: v("v0"), a: v("a"), t: v("t") },
    solve: {
      s: { tex: "s = v_0 t + \\dfrac{a}{2} t^2", f: ({ v0, a, t }) => v0 * t + 0.5 * a * t * t },
      v0: { tex: "v_0 = \\dfrac{s}{t} - \\dfrac{a}{2}\\,t", f: ({ s, a, t }) => s / nz(t, "Az idő nem lehet nulla.") - 0.5 * a * t },
      a: { tex: "a = \\dfrac{2\\,(s - v_0 t)}{t^2}", f: ({ s, v0, t }) => (2 * (s - v0 * t)) / nz(t * t, "Az idő nem lehet nulla.") },
      t: {
        tex: "t = \\dfrac{-v_0 \\pm \\sqrt{v_0^2 + 2as}}{a}",
        f: ({ s, v0, a }) => {
          const r = kin.timeForDistance(s, v0, a);
          if (!r.length) fail("Nincs nemnegatív megoldás: a test ezt a helyet nem éri el.");
          return r.length === 1 ? r[0] : r;
        },
        note: "Másodfokú egyenlet; csak a nemnegatív gyököket tartjuk meg. Két megoldásnál a test kétszer is áthalad az adott helyen.",
      },
    },
    feltetel: "Állandó gyorsulás esetén. Ha a test közben megfordul (pl. felfelé hajítás), s az elmozdulás, nem a megtett út.",
    nem: "Ha a mozgás közben megáll és visszafordul, a megtett utat szakaszonként kell számolni.",
    hiba: "Az a/2 szorzót elhagyják, vagy t helyett t²-et felejtenek el.",
    pelda: { szoveg: "Álló helyzetből a = 3 m/s²-tel 4 s alatt: s = 0 + 3/2 · 16 = 24 m.", adott: { v0: 0, a: 3, t: 4 }, keres: "s" },
    minta: { s: 40, v0: 3, a: 2, t: 5 },
    kulcsszavak: "egyenletesen gyorsuló mozgás út idő négyzetes négyzet",
    kapcsolodo: ["seb-ido", "atlag-valtozo", "idotlen"], sim: "valtozo", fgvt: true,
  });

  add({
    id: "atlag-valtozo", fejezet: CH1, nev: "Út a kezdő- és végsebességből",
    tex: "s = \\dfrac{v_0 + v}{2}\\, t",
    jelentes: "Egyenletesen változó mozgásnál az átlagsebesség a kezdő- és végsebesség számtani közepe (a v–t grafikon alatti trapéz területe).",
    vars: { s: v("s", { min: undefined, nev: "elmozdulás" }), v0: v("v0"), v: v("v", { nev: "végsebesség" }), t: v("t", { pos: true }) },
    solve: {
      s: { tex: "s = \\dfrac{v_0 + v}{2}\\,t", f: ({ v0, v, t }) => ((v0 + v) / 2) * t },
      t: { tex: "t = \\dfrac{2s}{v_0 + v}", f: ({ s, v0, v }) => (2 * s) / nz(v0 + v, "v₀ + v nem lehet nulla.") },
      v0: { tex: "v_0 = \\dfrac{2s}{t} - v", f: ({ s, v, t }) => (2 * s) / nz(t, "Az idő nem lehet nulla.") - v },
      v: { tex: "v = \\dfrac{2s}{t} - v_0", f: ({ s, v0, t }) => (2 * s) / nz(t, "Az idő nem lehet nulla.") - v0 },
    },
    feltetel: "Csak egyenletesen változó mozgásnál, ahol a gyorsulás állandó.",
    nem: "Változó gyorsulásnál a sebességek átlaga nem az átlagsebesség.",
    hiba: "Egyenletes mozgásokból összerakott útra is alkalmazzák (ott hibás).",
    pelda: { szoveg: "Fékezés 30 m/s-ról megállásig 6 s alatt: s = (30 + 0)/2 · 6 = 90 m.", adott: { v0: 30, v: 0, t: 6 }, keres: "s" },
    minta: { s: 40, v0: 3, v: 13, t: 5 },
    kulcsszavak: "fékút átlagsebesség trapéz egyenletesen változó",
    kapcsolodo: ["ut-ido", "idotlen"], fgvt: false,
  });

  add({
    id: "idotlen", fejezet: CH1, nev: "Időtlen összefüggés",
    tex: "v^2 = v_0^2 + 2\\,a\\,s",
    jelentes: "Az idő kiküszöbölésével kapott összefüggés: akkor hasznos, ha az időt sem nem ismerjük, sem nem kérdezik (pl. féktávolság).",
    vars: { v: v("v", { min: 0, nev: "végsebesség nagysága" }), v0: v("v0", { min: 0, nev: "kezdősebesség nagysága" }), a: v("a"), s: v("s", { min: undefined, nev: "elmozdulás" }) },
    solve: {
      v: { tex: "v = \\sqrt{v_0^2 + 2as}", f: ({ v0, a, s }) => sqrtPos(v0 * v0 + 2 * a * s, "A test megáll, mielőtt ekkora utat megtenne (v² negatív lenne).") },
      v0: { tex: "v_0 = \\sqrt{v^2 - 2as}", f: ({ v, a, s }) => sqrtPos(v * v - 2 * a * s, "Ezek az adatok ellentmondásosak (v₀² negatív lenne).") },
      a: { tex: "a = \\dfrac{v^2 - v_0^2}{2s}", f: ({ v, v0, s }) => (v * v - v0 * v0) / nz(2 * s, "Az elmozdulás nem lehet nulla.") },
      s: { tex: "s = \\dfrac{v^2 - v_0^2}{2a}", f: ({ v, v0, a }) => (v * v - v0 * v0) / nz(2 * a, "Nulla gyorsulásnál a sebesség nem változik.") },
    },
    feltetel: "Állandó gyorsulás, egyenes vonalú mozgás, a test nem fordul vissza.",
    nem: "Ha a test megfordul, az s elmozdulás, nem a megtett út.",
    hiba: "Fékezésnél a pozitív előjelű a-val negatív féktávolság jön ki.",
    pelda: { szoveg: "Féktáv 20 m/s-ról, a = −5 m/s²: s = (0 − 400)/(2·(−5)) = 40 m.", adott: { v: 0, v0: 20, a: -5 }, keres: "s" },
    minta: { v: 13, v0: 3, a: 2, s: 40 },
    kulcsszavak: "időtlen féktávolság féktáv fékút négyzetes sebesség",
    kapcsolodo: ["ut-ido", "szabadeses-v-h"], fgvt: false,
  });

  /* ------------------------------------------------------------------ */
  /* B) Szabadesés és hajítások                                          */
  /* ------------------------------------------------------------------ */
  const CH2 = "Szabadesés és hajítások";

  add({
    id: "szabadeses-ut", fejezet: CH2, nev: "Szabadesés: esési út",
    tex: "h = \\dfrac{g}{2}\\, t^2",
    jelentes: "Nyugalomból elengedett test által t idő alatt megtett út – egyenletesen gyorsuló mozgás g gyorsulással.",
    vars: { h: v("h", { nev: "esési út (magasság)" }), g: v("g"), t: v("t") },
    solve: {
      h: { tex: "h = \\dfrac{g}{2} t^2", f: ({ g, t }) => 0.5 * g * t * t },
      t: { tex: "t = \\sqrt{\\dfrac{2h}{g}}", f: ({ h, g }) => Math.sqrt((2 * h) / nz(g, "g nem lehet nulla.")) },
      g: { tex: "g = \\dfrac{2h}{t^2}", f: ({ h, t }) => (2 * h) / nz(t * t, "Az idő nem lehet nulla.") },
    },
    feltetel: "Kezdősebesség nélkül, közegellenállás elhanyagolásával, a Föld felszínének közelében (g állandó).",
    nem: "Ejtőernyős, tollpihe, nagy sebességű test esetén a közegellenállás nem hanyagolható el.",
    hiba: "g = 10 m/s² vagy 9,81 m/s²? Mindig azt használd, amit a feladat megad.",
    pelda: { szoveg: "Egy kő 3 s alatt h = 9,81/2 · 9 ≈ 44 m-t esik.", adott: { g: 9.81, t: 3 }, keres: "h" },
    minta: { h: 19.62, g: 9.81, t: 2 },
    kulcsszavak: "szabadesés esés ejtés magasság gravitáció nehézségi gyorsulás",
    kapcsolodo: ["szabadeses-seb", "szabadeses-v-h", "ut-ido"], sim: "hajitas", fgvt: true,
  });

  add({
    id: "szabadeses-seb", fejezet: CH2, nev: "Szabadesés: sebesség",
    tex: "v = g\\,t",
    jelentes: "Szabadon eső test sebessége másodpercenként g-vel (≈ 9,81 m/s-mal) nő.",
    vars: { v: v("v", { min: 0 }), g: v("g"), t: v("t") },
    solve: {
      v: { tex: "v = g\\,t", f: ({ g, t }) => g * t },
      t: { tex: "t = \\dfrac{v}{g}", f: ({ v, g }) => v / nz(g, "g nem lehet nulla.") },
      g: { tex: "g = \\dfrac{v}{t}", f: ({ v, t }) => v / nz(t, "Az idő nem lehet nulla.") },
    },
    feltetel: "Kezdősebesség nélkül, közegellenállás nélkül.",
    nem: "Ha van kezdősebesség, a v = v₀ + g t alakot kell használni.",
    hiba: "A t idő alatti sebességet összekeverik a t-edik másodpercben megtett úttal.",
    pelda: { szoveg: "2,5 s esés után v = 9,81 · 2,5 ≈ 24,5 m/s ≈ 88 km/h.", adott: { g: 9.81, t: 2.5 }, keres: "v" },
    minta: { v: 19.62, g: 9.81, t: 2 },
    kulcsszavak: "szabadesés sebesség esés",
    kapcsolodo: ["szabadeses-ut", "seb-ido"], sim: "hajitas", fgvt: true,
  });

  add({
    id: "szabadeses-v-h", fejezet: CH2, nev: "Szabadesés: becsapódási sebesség",
    tex: "v = \\sqrt{2\\,g\\,h}",
    jelentes: "h magasságból nyugalomból eső test sebessége a talajnál (az időtlen összefüggés v₀ = 0 esetre). Energiamegmaradásból is adódik.",
    vars: { v: v("v", { min: 0 }), g: v("g"), h: v("h") },
    solve: {
      v: { tex: "v = \\sqrt{2gh}", f: ({ g, h }) => sqrtPos(2 * g * h, "A magasság nem lehet negatív.") },
      h: { tex: "h = \\dfrac{v^2}{2g}", f: ({ v, g }) => (v * v) / nz(2 * g, "g nem lehet nulla.") },
      g: { tex: "g = \\dfrac{v^2}{2h}", f: ({ v, h }) => (v * v) / nz(2 * h, "A magasság nem lehet nulla.") },
    },
    feltetel: "Nyugalomból indul, közegellenállás nincs.",
    nem: "Nem függ a tömegtől – közegellenállás nélkül minden test ugyanúgy esik.",
    hiba: "A gyökvonást elfelejtik: v² = 2gh-ból v-t kell számolni.",
    pelda: { szoveg: "5 m magasról ugorva: v = √(2 · 9,81 · 5) ≈ 9,9 m/s.", adott: { g: 9.81, h: 5 }, keres: "v" },
    minta: { v: 19.62, g: 9.81, h: 19.62 },
    kulcsszavak: "becsapódási sebesség leérkezési szabadesés magasság",
    kapcsolodo: ["idotlen", "szabadeses-ut"], sim: "hajitas", fgvt: false,
  });

  add({
    id: "fuggoleges-hmax", fejezet: CH2, nev: "Függőleges hajítás felfelé: emelkedési magasság",
    tex: "h_{\\max} = \\dfrac{v_0^2}{2g}",
    jelentes: "A felfelé hajított test addig emelkedik, amíg sebessége nullára csökken.",
    vars: { h: v("h", { tex: "h_{\\max}", nev: "maximális emelkedési magasság" }), v0: v("v0", { min: 0 }), g: v("g") },
    solve: {
      h: { tex: "h_{\\max} = \\dfrac{v_0^2}{2g}", f: ({ v0, g }) => (v0 * v0) / nz(2 * g, "g nem lehet nulla.") },
      v0: { tex: "v_0 = \\sqrt{2 g h_{\\max}}", f: ({ h, g }) => sqrtPos(2 * g * h, "A magasság nem lehet negatív.") },
      g: { tex: "g = \\dfrac{v_0^2}{2 h_{\\max}}", f: ({ v0, h }) => (v0 * v0) / nz(2 * h, "A magasság nem lehet nulla.") },
    },
    feltetel: "Közegellenállás nélkül, a hajítás helyétől mérve.",
    nem: "Ha a test nem a talajról indul, a talajtól mért magassághoz hozzá kell adni a kezdőmagasságot.",
    hiba: "A pálya tetején a sebesség nulla, de a gyorsulás NEM nulla (végig g, lefelé).",
    pelda: { szoveg: "15 m/s-mal felhajított labda: h_max = 225/(2·9,81) ≈ 11,5 m.", adott: { v0: 15, g: 9.81 }, keres: "h" },
    minta: { h: 20, v0: 20, g: 10 },
    kulcsszavak: "függőleges hajítás felfelé emelkedési magasság legnagyobb magasság",
    kapcsolodo: ["fuggoleges-temelk", "szabadeses-v-h"], sim: "hajitas", fgvt: false,
  });

  add({
    id: "fuggoleges-temelk", fejezet: CH2, nev: "Függőleges hajítás felfelé: emelkedési idő",
    tex: "t_{\\text{em}} = \\dfrac{v_0}{g}",
    jelentes: "Ennyi idő alatt áll meg a felfelé hajított test. Közegellenállás nélkül ugyanennyi ideig esik vissza.",
    vars: { t: v("t", { tex: "t_{\\text{em}}", nev: "emelkedési idő" }), v0: v("v0", { min: 0 }), g: v("g") },
    solve: {
      t: { tex: "t_{\\text{em}} = \\dfrac{v_0}{g}", f: ({ v0, g }) => v0 / nz(g, "g nem lehet nulla.") },
      v0: { tex: "v_0 = g\\,t_{\\text{em}}", f: ({ t, g }) => g * t },
      g: { tex: "g = \\dfrac{v_0}{t_{\\text{em}}}", f: ({ v0, t }) => v0 / nz(t, "Az idő nem lehet nulla.") },
    },
    feltetel: "Közegellenállás nélkül.",
    nem: "Közegellenállással az emelkedés rövidebb, mint a visszaesés.",
    hiba: "A teljes repülési időt (2·v₀/g) összetévesztik az emelkedési idővel.",
    pelda: { szoveg: "20 m/s-mal felhajítva: t_em = 20/9,81 ≈ 2,04 s, visszaér ≈ 4,08 s után.", adott: { v0: 20, g: 9.81 }, keres: "t" },
    minta: { t: 2, v0: 20, g: 10 },
    kulcsszavak: "függőleges hajítás emelkedési idő",
    kapcsolodo: ["fuggoleges-hmax"], sim: "hajitas", fgvt: false,
  });

  add({
    id: "vizszintes-tav", fejezet: CH2, nev: "Vízszintes hajítás: hajítási távolság",
    tex: "d = v_0 \\sqrt{\\dfrac{2h}{g}}",
    jelentes: "A vízszintes és a függőleges mozgás függetlenül zajlik: az esési idő √(2h/g), ezalatt a test v₀ sebességgel halad vízszintesen.",
    vars: { d: { tex: "d", nev: "vízszintes hajítási távolság", dim: "hossz", min: 0 }, v0: v("v0", { min: 0 }), h: v("h", { nev: "kezdőmagasság" }), g: v("g") },
    solve: {
      d: { tex: "d = v_0\\sqrt{\\dfrac{2h}{g}}", f: ({ v0, h, g }) => v0 * Math.sqrt((2 * h) / nz(g, "g nem lehet nulla.")) },
      v0: { tex: "v_0 = d\\sqrt{\\dfrac{g}{2h}}", f: ({ d, h, g }) => d * Math.sqrt(g / nz(2 * h, "A magasság nem lehet nulla.")) },
      h: { tex: "h = \\dfrac{g\\,d^2}{2v_0^2}", f: ({ d, v0, g }) => (g * d * d) / nz(2 * v0 * v0, "v₀ nem lehet nulla.") },
      g: { tex: "g = \\dfrac{2h\\,v_0^2}{d^2}", f: ({ d, v0, h }) => (2 * h * v0 * v0) / nz(d * d, "A távolság nem lehet nulla.") },
    },
    feltetel: "Vízszintes kezdősebesség, közegellenállás nélkül, sík talaj.",
    nem: "Ferde kezdősebességnél a ferde hajítás képletei kellenek.",
    hiba: "Azt gondolják, a gyorsabban hajított test később ér földet – az esési idő NEM függ v₀-tól.",
    pelda: { szoveg: "Egy golyó 1,25 m magas asztalról 2 m/s-mal gurul le: t = √(2·1,25/9,81) ≈ 0,505 s, d ≈ 1,01 m.", adott: { v0: 2, h: 1.25, g: 9.81 }, keres: "d" },
    minta: { d: 10 * Math.sqrt(40 / 9.81), v0: 10, h: 20, g: 9.81 },
    kulcsszavak: "vízszintes hajítás távolság magasság",
    kapcsolodo: ["szabadeses-ut", "palyagorbe"], sim: "hajitas", fgvt: false,
  });

  add({
    id: "v0x", fejezet: CH2, nev: "Kezdősebesség vízszintes összetevője", szint: "emelt",
    tex: "v_{0x} = v_0 \\cos\\alpha",
    jelentes: "Ferde hajításnál a vízszintes sebességösszetevő végig állandó (nincs vízszintes erő).",
    vars: { vx: { tex: "v_{0x}", nev: "vízszintes sebességösszetevő", dim: "sebesseg", min: 0 }, v0: v("v0", { min: 0 }), alpha: v("alpha") },
    solve: {
      vx: { tex: "v_{0x} = v_0\\cos\\alpha", f: ({ v0, alpha }) => v0 * Math.cos(alpha) },
      v0: { tex: "v_0 = \\dfrac{v_{0x}}{\\cos\\alpha}", f: ({ vx, alpha }) => vx / nz(Math.cos(alpha), "90°-nál nincs vízszintes összetevő.") },
      alpha: { tex: "\\alpha = \\arccos\\dfrac{v_{0x}}{v_0}", f: ({ vx, v0 }) => { const c = vx / nz(v0, "v₀ nem lehet nulla."); if (c > 1 + 1e-12) fail("Az összetevő nem lehet nagyobb a teljes sebességnél."); return Math.acos(Math.min(1, c)); } },
    },
    feltetel: "α a vízszinteshez mért szög.",
    nem: "Ha a szöget a függőlegeshez mérik, sin és cos szerepet cserél.",
    hiba: "A számológép radiánban van fokok helyett.",
    pelda: { szoveg: "v₀ = 20 m/s, α = 30°: v₀ₓ = 20 · cos 30° ≈ 17,3 m/s.", adott: { v0: 20, alpha: 30 * R }, keres: "vx" },
    minta: { vx: 20 * Math.cos(30 * R), v0: 20, alpha: 30 * R },
    kulcsszavak: "ferde hajítás vízszintes összetevő komponens felbontás koszinusz",
    kapcsolodo: ["v0y", "ferde-tav"], sim: "hajitas", fgvt: false,
  });

  add({
    id: "v0y", fejezet: CH2, nev: "Kezdősebesség függőleges összetevője", szint: "emelt",
    tex: "v_{0y} = v_0 \\sin\\alpha",
    jelentes: "A függőleges összetevő úgy változik, mint egy függőleges hajításnál: v_y = v₀ sin α − g t.",
    vars: { vy: { tex: "v_{0y}", nev: "függőleges sebességösszetevő", dim: "sebesseg", min: 0 }, v0: v("v0", { min: 0 }), alpha: v("alpha") },
    solve: {
      vy: { tex: "v_{0y} = v_0\\sin\\alpha", f: ({ v0, alpha }) => v0 * Math.sin(alpha) },
      v0: { tex: "v_0 = \\dfrac{v_{0y}}{\\sin\\alpha}", f: ({ vy, alpha }) => vy / nz(Math.sin(alpha), "0°-nál nincs függőleges összetevő.") },
      alpha: { tex: "\\alpha = \\arcsin\\dfrac{v_{0y}}{v_0}", f: ({ vy, v0 }) => { const c = vy / nz(v0, "v₀ nem lehet nulla."); if (c > 1 + 1e-12) fail("Az összetevő nem lehet nagyobb a teljes sebességnél."); return Math.asin(Math.min(1, c)); } },
    },
    feltetel: "α a vízszinteshez mért szög.",
    nem: "Ha a szöget a függőlegeshez mérik, sin és cos szerepet cserél.",
    hiba: "A függőleges összetevőt állandónak veszik – csak a vízszintes állandó.",
    pelda: { szoveg: "v₀ = 20 m/s, α = 30°: v₀ᵧ = 20 · sin 30° = 10 m/s.", adott: { v0: 20, alpha: 30 * R }, keres: "vy" },
    minta: { vy: 10, v0: 20, alpha: 30 * R },
    kulcsszavak: "ferde hajítás függőleges összetevő komponens szinusz",
    kapcsolodo: ["v0x", "ferde-hmax"], sim: "hajitas", fgvt: false,
  });

  add({
    id: "ferde-tav", fejezet: CH2, nev: "Ferde hajítás: hajítási távolság", szint: "emelt",
    tex: "d = \\dfrac{v_0^2 \\sin 2\\alpha}{g}",
    jelentes: "Vízszintes talajról indított és oda visszaérkező test távolsága. Adott v₀-nál 45°-nál a legnagyobb, és α, illetve 90° − α ugyanakkora távolságot ad.",
    vars: { d: { tex: "d", nev: "hajítási távolság", dim: "hossz", min: 0 }, v0: v("v0", { min: 0 }), alpha: v("alpha"), g: v("g") },
    solve: {
      d: { tex: "d = \\dfrac{v_0^2\\sin 2\\alpha}{g}", f: ({ v0, alpha, g }) => (v0 * v0 * Math.sin(2 * alpha)) / nz(g, "g nem lehet nulla.") },
      v0: { tex: "v_0 = \\sqrt{\\dfrac{d\\,g}{\\sin 2\\alpha}}", f: ({ d, alpha, g }) => Math.sqrt((d * g) / nz(Math.sin(2 * alpha), "0° és 90° esetén a távolság nulla.")) },
      alpha: {
        tex: "\\alpha_{1,2}:\\ \\sin 2\\alpha = \\dfrac{d\\,g}{v_0^2}",
        f: ({ d, v0, g }) => {
          const s = (d * g) / nz(v0 * v0, "v₀ nem lehet nulla.");
          if (s > 1 + 1e-12) fail("Ekkora kezdősebességgel ez a távolság nem érhető el (legfeljebb v₀²/g).");
          const a1 = Math.asin(Math.min(1, s)) / 2;
          const a2 = Math.PI / 2 - a1;
          return Math.abs(a1 - a2) < 1e-9 ? a1 : [a1, a2];
        },
        note: "Két megoldás van: α és 90° − α (lapos és meredek pálya), kivéve 45°-nál.",
      },
      g: { tex: "g = \\dfrac{v_0^2\\sin 2\\alpha}{d}", f: ({ d, v0, alpha }) => (v0 * v0 * Math.sin(2 * alpha)) / nz(d, "A távolság nem lehet nulla.") },
    },
    feltetel: "Az indulás és az érkezés azonos magasságban van; közegellenállás nincs.",
    nem: "Magasból indított hajításnál (pl. súlylökés) nem érvényes – ott a mozgásegyenletekből kell számolni (lásd a szimulációt).",
    hiba: "sin 2α helyett 2 sin α-t számolnak.",
    pelda: { szoveg: "v₀ = 20 m/s, α = 30°: d = 400 · sin 60° / 9,81 ≈ 35,3 m.", adott: { v0: 20, alpha: 30 * R, g: 9.81 }, keres: "d" },
    minta: { d: (400 * Math.sin(60 * R)) / 9.81, v0: 20, alpha: 30 * R, g: 9.81 },
    kulcsszavak: "ferde hajítás távolság hatótávolság 45 fok",
    kapcsolodo: ["ferde-hmax", "ferde-ido", "palyagorbe"], sim: "hajitas", fgvt: false,
  });

  add({
    id: "ferde-hmax", fejezet: CH2, nev: "Ferde hajítás: emelkedési magasság", szint: "emelt",
    tex: "h_{\\max} = \\dfrac{v_0^2 \\sin^2\\alpha}{2g}",
    jelentes: "A függőleges összetevő (v₀ sin α) határozza meg, milyen magasra jut a test.",
    vars: { h: v("h", { tex: "h_{\\max}", nev: "emelkedési magasság" }), v0: v("v0", { min: 0 }), alpha: v("alpha"), g: v("g") },
    solve: {
      h: { tex: "h_{\\max} = \\dfrac{v_0^2\\sin^2\\alpha}{2g}", f: ({ v0, alpha, g }) => Math.pow(v0 * Math.sin(alpha), 2) / nz(2 * g, "g nem lehet nulla.") },
      v0: { tex: "v_0 = \\dfrac{\\sqrt{2 g h_{\\max}}}{\\sin\\alpha}", f: ({ h, alpha, g }) => Math.sqrt(2 * g * h) / nz(Math.sin(alpha), "0°-nál a test nem emelkedik.") },
      alpha: { tex: "\\alpha = \\arcsin\\dfrac{\\sqrt{2 g h_{\\max}}}{v_0}", f: ({ h, v0, g }) => { const s = Math.sqrt(2 * g * h) / nz(v0, "v₀ nem lehet nulla."); if (s > 1 + 1e-12) fail("Ekkora kezdősebességgel ez a magasság nem érhető el."); return Math.asin(Math.min(1, s)); } },
      g: { tex: "g = \\dfrac{v_0^2\\sin^2\\alpha}{2h_{\\max}}", f: ({ h, v0, alpha }) => Math.pow(v0 * Math.sin(alpha), 2) / nz(2 * h, "A magasság nem lehet nulla.") },
    },
    feltetel: "Közegellenállás nélkül, az indulási szinttől mérve.",
    nem: "—",
    hiba: "sin²α helyett sin α-t írnak.",
    pelda: { szoveg: "v₀ = 20 m/s, α = 30°: h_max = 400 · 0,25 / 19,62 ≈ 5,1 m.", adott: { v0: 20, alpha: 30 * R, g: 9.81 }, keres: "h" },
    minta: { h: Math.pow(20 * Math.sin(30 * R), 2) / (2 * 9.81), v0: 20, alpha: 30 * R, g: 9.81 },
    kulcsszavak: "ferde hajítás emelkedési magasság legnagyobb magasság",
    kapcsolodo: ["ferde-tav", "fuggoleges-hmax", "v0y"], sim: "hajitas", fgvt: false,
  });

  add({
    id: "ferde-ido", fejezet: CH2, nev: "Ferde hajítás: repülési idő", szint: "emelt",
    tex: "t_{\\text{rep}} = \\dfrac{2\\,v_0 \\sin\\alpha}{g}",
    jelentes: "Azonos szintre visszaérkezésig eltelt idő: a függőleges mozgás emelkedési idejének kétszerese.",
    vars: { t: v("t", { tex: "t_{\\text{rep}}", nev: "repülési idő" }), v0: v("v0", { min: 0 }), alpha: v("alpha"), g: v("g") },
    solve: {
      t: { tex: "t_{\\text{rep}} = \\dfrac{2v_0\\sin\\alpha}{g}", f: ({ v0, alpha, g }) => (2 * v0 * Math.sin(alpha)) / nz(g, "g nem lehet nulla.") },
      v0: { tex: "v_0 = \\dfrac{g\\,t_{\\text{rep}}}{2\\sin\\alpha}", f: ({ t, alpha, g }) => (g * t) / nz(2 * Math.sin(alpha), "0°-nál a repülési idő nulla.") },
      alpha: { tex: "\\alpha = \\arcsin\\dfrac{g\\,t_{\\text{rep}}}{2v_0}", f: ({ t, v0, g }) => { const s = (g * t) / nz(2 * v0, "v₀ nem lehet nulla."); if (s > 1 + 1e-12) fail("Ekkora kezdősebességgel ilyen hosszú repülés nem lehetséges."); return Math.asin(Math.min(1, s)); } },
      g: { tex: "g = \\dfrac{2v_0\\sin\\alpha}{t_{\\text{rep}}}", f: ({ t, v0, alpha }) => (2 * v0 * Math.sin(alpha)) / nz(t, "Az idő nem lehet nulla.") },
    },
    feltetel: "Az indulás és az érkezés azonos magasságban; közegellenállás nincs.",
    nem: "Magasból indított hajításnál a repülési idő hosszabb.",
    hiba: "A 2-es szorzó hiányzik (csak az emelkedési időt számolják).",
    pelda: { szoveg: "v₀ = 20 m/s, α = 30°: t = 2·20·0,5/9,81 ≈ 2,04 s.", adott: { v0: 20, alpha: 30 * R, g: 9.81 }, keres: "t" },
    minta: { t: (2 * 20 * 0.5) / 9.81, v0: 20, alpha: 30 * R, g: 9.81 },
    kulcsszavak: "ferde hajítás repülési idő",
    kapcsolodo: ["ferde-tav", "fuggoleges-temelk"], sim: "hajitas", fgvt: false,
  });

  add({
    id: "palyagorbe", fejezet: CH2, nev: "Ferde hajítás pályagörbéje (parabola)", szint: "emelt",
    tex: "y = x\\tan\\alpha - \\dfrac{g}{2v_0^2\\cos^2\\alpha}\\,x^2",
    jelentes: "Az x = v₀ cos α · t és y = v₀ sin α · t − g t²/2 egyenletekből t kiküszöbölésével adódó parabola.",
    vars: { y: { tex: "y", nev: "magasság az indulási szinthez képest", dim: "hossz" }, x: { tex: "x", nev: "vízszintes távolság", dim: "hossz", min: 0 }, v0: v("v0", { min: 0, pos: true }), alpha: v("alpha", { max: 89.999 * R }), g: v("g") },
    solve: {
      y: { tex: "y = x\\tan\\alpha - \\dfrac{g\\,x^2}{2v_0^2\\cos^2\\alpha}", f: ({ x, v0, alpha, g }) => x * Math.tan(alpha) - (g * x * x) / nz(2 * Math.pow(v0 * Math.cos(alpha), 2), "90°-os hajításnál nincs vízszintes elmozdulás.") },
      g: { tex: "g = \\dfrac{2v_0^2\\cos^2\\alpha\\,(x\\tan\\alpha - y)}{x^2}", f: ({ y, x, v0, alpha }) => (2 * Math.pow(v0 * Math.cos(alpha), 2) * (x * Math.tan(alpha) - y)) / nz(x * x, "x nem lehet nulla.") },
    },
    feltetel: "Közegellenállás nélkül; a koordináta-rendszer origója az indulási pont.",
    nem: "A valóságban (közegellenállással) a pálya nem szimmetrikus parabola.",
    hiba: "A cos²α-t a nevezőből kihagyják.",
    pelda: { szoveg: "v₀ = 20 m/s, α = 30°, x = 10 m: y = 10 · 0,577 − 9,81·100/(2·400·0,75) ≈ 4,14 m.", adott: { x: 10, v0: 20, alpha: 30 * R, g: 9.81 }, keres: "y" },
    minta: { y: 10 * Math.tan(30 * R) - (9.81 * 100) / (2 * 400 * Math.pow(Math.cos(30 * R), 2)), x: 10, v0: 20, alpha: 30 * R, g: 9.81 },
    kulcsszavak: "pályagörbe parabola pálya egyenlete ferde hajítás",
    kapcsolodo: ["ferde-tav", "v0x", "v0y"], sim: "hajitas", fgvt: false,
  });

  /* ------------------------------------------------------------------ */
  /* C) Körmozgás                                                        */
  /* ------------------------------------------------------------------ */
  const CH3 = "Körmozgás";

  add({
    id: "frekvencia", fejezet: CH3, nev: "Frekvencia (fordulatszám) és periódusidő",
    tex: "f = \\dfrac{1}{T}",
    jelentes: "A frekvencia az egységnyi idő alatt megtett körök száma; a periódusidő egy kör ideje.",
    vars: { f: v("f"), T: v("T") },
    solve: {
      f: { tex: "f = \\dfrac{1}{T}", f: ({ T }) => 1 / nz(T, "A periódusidő nem lehet nulla.") },
      T: { tex: "T = \\dfrac{1}{f}", f: ({ f }) => 1 / nz(f, "Nulla frekvenciánál nincs periódus.") },
    },
    feltetel: "Periodikus mozgásokra általában (körmozgás, rezgés, hullám).",
    nem: "—",
    hiba: "A fordulat/perc-ben adott fordulatszámot nem váltják át 1/s-ra (osztás 60-nal).",
    pelda: { szoveg: "Egy kerék 1200 fordulat/perc: f = 20 1/s, T = 0,05 s.", adott: { f: 20 }, keres: "T" },
    minta: { f: 0.25, T: 4 },
    kulcsszavak: "frekvencia fordulatszám periódusidő keringési idő",
    kapcsolodo: ["omega-T"], sim: null, fgvt: true,
  });

  add({
    id: "omega-T", fejezet: CH3, nev: "Szögsebesség és periódusidő",
    tex: "\\omega = \\dfrac{2\\pi}{T} = 2\\pi f",
    jelentes: "Egyenletes körmozgásnál a szögsebesség az egységnyi idő alatti szögelfordulás (radiánban).",
    vars: { omega: v("omega", { min: 0 }), T: v("T") },
    solve: {
      omega: { tex: "\\omega = \\dfrac{2\\pi}{T}", f: ({ T }) => (2 * Math.PI) / nz(T, "A periódusidő nem lehet nulla.") },
      T: { tex: "T = \\dfrac{2\\pi}{\\omega}", f: ({ omega }) => (2 * Math.PI) / nz(omega, "Nulla szögsebességnél nincs körmozgás.") },
    },
    feltetel: "Egyenletes körmozgás; ω mértékegysége 1/s (radián/s).",
    nem: "Ne keverd a frekvenciával: ω = 2πf, nem f.",
    hiba: "Fokban számolnak radián helyett.",
    pelda: { szoveg: "A Föld forgása: T = 86 400 s → ω = 2π/86 400 ≈ 7,27·10⁻⁵ 1/s.", adott: { T: 86400 }, keres: "omega" },
    minta: { omega: Math.PI / 2, T: 4 },
    kulcsszavak: "szögsebesség körfrekvencia periódusidő radián",
    kapcsolodo: ["frekvencia", "kerulet-v", "v-romega"], fgvt: true,
  });

  add({
    id: "kerulet-v", fejezet: CH3, nev: "Kerületi sebesség",
    tex: "v = \\dfrac{2\\pi r}{T}",
    jelentes: "Egy kör (2πr hosszúságú út) egy periódusidő alatt: a sebesség nagysága állandó, iránya érintőleges.",
    vars: { v: v("v", { min: 0, nev: "kerületi sebesség" }), r: v("r"), T: v("T") },
    solve: {
      v: { tex: "v = \\dfrac{2\\pi r}{T}", f: ({ r, T }) => (2 * Math.PI * r) / nz(T, "A periódusidő nem lehet nulla.") },
      r: { tex: "r = \\dfrac{vT}{2\\pi}", f: ({ v, T }) => (v * T) / (2 * Math.PI) },
      T: { tex: "T = \\dfrac{2\\pi r}{v}", f: ({ r, v }) => (2 * Math.PI * r) / nz(v, "A sebesség nem lehet nulla.") },
    },
    feltetel: "Egyenletes körmozgás.",
    nem: "—",
    hiba: "Átmérőt helyettesítenek sugár helyett.",
    pelda: { szoveg: "r = 0,3 m sugarú kerék, T = 0,1 s: v = 2π · 0,3 / 0,1 ≈ 18,8 m/s.", adott: { r: 0.3, T: 0.1 }, keres: "v" },
    minta: { v: Math.PI, r: 2, T: 4 },
    kulcsszavak: "kerületi sebesség körmozgás sugár periódusidő",
    kapcsolodo: ["v-romega", "acp-v"], fgvt: true,
  });

  add({
    id: "v-romega", fejezet: CH3, nev: "Kerületi sebesség és szögsebesség",
    tex: "v = r\\,\\omega",
    jelentes: "Egy forgó merev test minden pontjának ugyanaz a szögsebessége, de a kerületi sebesség a tengelytől mért távolsággal arányos.",
    vars: { v: v("v", { min: 0, nev: "kerületi sebesség" }), r: v("r"), omega: v("omega", { min: 0 }) },
    solve: {
      v: { tex: "v = r\\omega", f: ({ r, omega }) => r * omega },
      r: { tex: "r = \\dfrac{v}{\\omega}", f: ({ v, omega }) => v / nz(omega, "A szögsebesség nem lehet nulla.") },
      omega: { tex: "\\omega = \\dfrac{v}{r}", f: ({ v, r }) => v / nz(r, "A sugár nem lehet nulla.") },
    },
    feltetel: "ω radián/s-ban; körpályán (vagy forgó merev testen).",
    nem: "Fokban megadott szögsebességgel nem érvényes.",
    hiba: "ω-t fordulat/perc-ben helyettesítik be.",
    pelda: { szoveg: "r = 0,5 m, ω = 10 1/s: v = 5 m/s.", adott: { r: 0.5, omega: 10 }, keres: "v" },
    minta: { v: Math.PI, r: 2, omega: Math.PI / 2 },
    kulcsszavak: "kerületi sebesség szögsebesség sugár",
    kapcsolodo: ["kerulet-v", "acp-omega"], fgvt: true,
  });

  add({
    id: "acp-v", fejezet: CH3, nev: "Centripetális gyorsulás (sebességgel)",
    tex: "a_{\\mathrm{cp}} = \\dfrac{v^2}{r}",
    jelentes: "Egyenletes körmozgásnál a sebesség iránya folyamatosan változik: a gyorsulás a kör középpontja felé mutat.",
    vars: { acp: v("acp"), v: v("v", { min: 0, nev: "kerületi sebesség" }), r: v("r") },
    solve: {
      acp: { tex: "a_{\\mathrm{cp}} = \\dfrac{v^2}{r}", f: ({ v, r }) => (v * v) / nz(r, "A sugár nem lehet nulla.") },
      v: { tex: "v = \\sqrt{a_{\\mathrm{cp}}\\,r}", f: ({ acp, r }) => sqrtPos(acp * r, "A gyorsulás nem lehet negatív.") },
      r: { tex: "r = \\dfrac{v^2}{a_{\\mathrm{cp}}}", f: ({ v, acp }) => (v * v) / nz(acp, "A gyorsulás nem lehet nulla.") },
    },
    feltetel: "Körpályán mozgó testre (változó körmozgásnál is ez a sugárirányú összetevő).",
    nem: "Nem a test „kifelé repülő” gyorsulása – inerciarendszerből nézve befelé mutat.",
    hiba: "A „centrifugális erőt” valódi erőként rajzolják be inerciarendszerben.",
    pelda: { szoveg: "Kanyar r = 50 m, v = 15 m/s: a_cp = 225/50 = 4,5 m/s².", adott: { v: 15, r: 50 }, keres: "acp" },
    minta: { acp: (Math.PI * Math.PI) / 2, v: Math.PI, r: 2 },
    kulcsszavak: "centripetális gyorsulás körmozgás kanyar",
    kapcsolodo: ["acp-omega", "kerulet-v"], fgvt: true,
  });

  add({
    id: "acp-omega", fejezet: CH3, nev: "Centripetális gyorsulás (szögsebességgel)",
    tex: "a_{\\mathrm{cp}} = r\\,\\omega^2",
    jelentes: "Ugyanaz a centripetális gyorsulás, a v = rω behelyettesítésével.",
    vars: { acp: v("acp"), r: v("r"), omega: v("omega", { min: 0 }) },
    solve: {
      acp: { tex: "a_{\\mathrm{cp}} = r\\omega^2", f: ({ r, omega }) => r * omega * omega },
      r: { tex: "r = \\dfrac{a_{\\mathrm{cp}}}{\\omega^2}", f: ({ acp, omega }) => acp / nz(omega * omega, "A szögsebesség nem lehet nulla.") },
      omega: { tex: "\\omega = \\sqrt{\\dfrac{a_{\\mathrm{cp}}}{r}}", f: ({ acp, r }) => sqrtPos(acp / nz(r, "A sugár nem lehet nulla."), "A gyorsulás nem lehet negatív.") },
    },
    feltetel: "ω radián/s-ban.",
    nem: "—",
    hiba: "ω helyett ω²-et felejtenek el.",
    pelda: { szoveg: "Centrifuga: r = 0,1 m, ω = 300 1/s → a_cp = 0,1 · 90 000 = 9000 m/s² ≈ 917 g.", adott: { r: 0.1, omega: 300 }, keres: "acp" },
    minta: { acp: (Math.PI * Math.PI) / 2, r: 2, omega: Math.PI / 2 },
    kulcsszavak: "centripetális gyorsulás szögsebesség",
    kapcsolodo: ["acp-v", "v-romega"], fgvt: true,
  });

  add({
    id: "ivhossz", fejezet: CH3, nev: "Ívhossz és szögelfordulás",
    tex: "i = r\\,\\Delta\\varphi",
    jelentes: "A radiánban mért szög definíciója: az ívhossz és a sugár hányadosa.",
    vars: { i: { tex: "i", nev: "ívhossz (megtett út a körpályán)", dim: "hossz", min: 0 }, r: v("r"), phi: v("phi", { min: 0 }) },
    solve: {
      i: { tex: "i = r\\,\\Delta\\varphi", f: ({ r, phi }) => r * phi },
      r: { tex: "r = \\dfrac{i}{\\Delta\\varphi}", f: ({ i, phi }) => i / nz(phi, "A szögelfordulás nem lehet nulla.") },
      phi: { tex: "\\Delta\\varphi = \\dfrac{i}{r}", f: ({ i, r }) => i / nz(r, "A sugár nem lehet nulla.") },
    },
    feltetel: "Δφ radiánban.",
    nem: "Fokban mért szöggel nem érvényes.",
    hiba: "Fokot helyettesítenek radián helyett (180° = π rad).",
    pelda: { szoveg: "r = 2 m, Δφ = 90° = π/2: i = 2 · 1,571 ≈ 3,14 m.", adott: { r: 2, phi: Math.PI / 2 }, keres: "i" },
    minta: { i: 6, r: 2, phi: 3 },
    kulcsszavak: "ívhossz szögelfordulás radián szög",
    kapcsolodo: ["v-romega"], fgvt: true,
  });

  add({
    id: "szoggyorsulas", fejezet: CH3, nev: "Szöggyorsulás", szint: "emelt",
    tex: "\\beta = \\dfrac{\\Delta\\omega}{\\Delta t}",
    jelentes: "Egyenletesen változó körmozgásnál a szögsebesség egyenletesen változik; β állandó.",
    vars: { beta: v("beta"), dw: { tex: "\\Delta\\omega", nev: "szögsebesség-változás", dim: "szogseb" }, dt: { tex: "\\Delta t", nev: "eltelt idő", dim: "ido", min: 0, pos: true } },
    solve: {
      beta: { tex: "\\beta = \\dfrac{\\Delta\\omega}{\\Delta t}", f: ({ dw, dt }) => dw / nz(dt, "Az idő nem lehet nulla.") },
      dw: { tex: "\\Delta\\omega = \\beta\\,\\Delta t", f: ({ beta, dt }) => beta * dt },
      dt: { tex: "\\Delta t = \\dfrac{\\Delta\\omega}{\\beta}", f: ({ dw, beta }) => dw / nz(beta, "Nulla szöggyorsulásnál a szögsebesség nem változik.") },
    },
    feltetel: "Egyenletesen változó körmozgás (vagy forgás).",
    nem: "—",
    hiba: "A szöggyorsulást összekeverik a centripetális gyorsulással.",
    pelda: { szoveg: "Egy kerék 5 s alatt 0-ról 20 1/s szögsebességre gyorsul: β = 4 1/s².", adott: { dw: 20, dt: 5 }, keres: "beta" },
    minta: { beta: 0.5, dw: 2, dt: 4 },
    kulcsszavak: "szöggyorsulás egyenletesen változó körmozgás forgás",
    kapcsolodo: ["at-rbeta", "omega-t"], fgvt: true,
  });

  add({
    id: "at-rbeta", fejezet: CH3, nev: "Érintőirányú gyorsulás", szint: "emelt",
    tex: "a_{\\mathrm{t}} = r\\,\\beta",
    jelentes: "A kerületi sebesség nagyságának változási gyorsasága; érintő irányú.",
    vars: { at: v("at"), r: v("r"), beta: v("beta") },
    solve: {
      at: { tex: "a_{\\mathrm{t}} = r\\beta", f: ({ r, beta }) => r * beta },
      r: { tex: "r = \\dfrac{a_{\\mathrm{t}}}{\\beta}", f: ({ at, beta }) => at / nz(beta, "A szöggyorsulás nem lehet nulla.") },
      beta: { tex: "\\beta = \\dfrac{a_{\\mathrm{t}}}{r}", f: ({ at, r }) => at / nz(r, "A sugár nem lehet nulla.") },
    },
    feltetel: "β radián/s²-ben.",
    nem: "—",
    hiba: "Egyenletes körmozgásnál is érintőirányú gyorsulást számolnak – ott a_t = 0.",
    pelda: { szoveg: "r = 0,4 m, β = 5 1/s²: a_t = 2 m/s².", adott: { r: 0.4, beta: 5 }, keres: "at" },
    minta: { at: 1, r: 2, beta: 0.5 },
    kulcsszavak: "érintőirányú tangenciális gyorsulás szöggyorsulás",
    kapcsolodo: ["szoggyorsulas", "eredo-gyorsulas"], fgvt: true,
  });

  add({
    id: "omega-t", fejezet: CH3, nev: "Szögsebesség egyenletesen változó körmozgásnál", szint: "emelt",
    tex: "\\omega = \\omega_0 + \\beta\\,t",
    jelentes: "Az egyenes vonalú v = v₀ + a t megfelelője forgásra.",
    vars: { omega: v("omega"), omega0: v("omega0"), beta: v("beta"), t: v("t") },
    solve: {
      omega: { tex: "\\omega = \\omega_0 + \\beta t", f: ({ omega0, beta, t }) => omega0 + beta * t },
      omega0: { tex: "\\omega_0 = \\omega - \\beta t", f: ({ omega, beta, t }) => omega - beta * t },
      beta: { tex: "\\beta = \\dfrac{\\omega - \\omega_0}{t}", f: ({ omega, omega0, t }) => (omega - omega0) / nz(t, "Az idő nem lehet nulla.") },
      t: { tex: "t = \\dfrac{\\omega - \\omega_0}{\\beta}", f: ({ omega, omega0, beta }) => (omega - omega0) / nz(beta, "Nulla szöggyorsulásnál a szögsebesség nem változik.") },
    },
    feltetel: "Állandó szöggyorsulás.",
    nem: "—",
    hiba: "Lassuló forgásnál β pozitív előjellel.",
    pelda: { szoveg: "ω₀ = 2 1/s, β = 0,5 1/s², t = 6 s → ω = 5 1/s.", adott: { omega0: 2, beta: 0.5, t: 6 }, keres: "omega" },
    minta: { omega: 3, omega0: 1, beta: 0.5, t: 4 },
    kulcsszavak: "szögsebesség egyenletesen változó körmozgás",
    kapcsolodo: ["szoggyorsulas", "szogelfordulas"], fgvt: true,
  });

  add({
    id: "szogelfordulas", fejezet: CH3, nev: "Szögelfordulás egyenletesen változó körmozgásnál", szint: "emelt",
    tex: "\\Delta\\varphi = \\omega_0\\,t + \\dfrac{\\beta}{2}\\,t^2",
    jelentes: "Az egyenes vonalú s = v₀t + a t²/2 megfelelője; a fordulatok száma Δφ/2π.",
    vars: { phi: v("phi"), omega0: v("omega0"), beta: v("beta"), t: v("t") },
    solve: {
      phi: { tex: "\\Delta\\varphi = \\omega_0 t + \\dfrac{\\beta}{2}t^2", f: ({ omega0, beta, t }) => omega0 * t + 0.5 * beta * t * t },
      omega0: { tex: "\\omega_0 = \\dfrac{\\Delta\\varphi}{t} - \\dfrac{\\beta}{2}t", f: ({ phi, beta, t }) => phi / nz(t, "Az idő nem lehet nulla.") - 0.5 * beta * t },
      beta: { tex: "\\beta = \\dfrac{2(\\Delta\\varphi - \\omega_0 t)}{t^2}", f: ({ phi, omega0, t }) => (2 * (phi - omega0 * t)) / nz(t * t, "Az idő nem lehet nulla.") },
      t: {
        tex: "t = \\dfrac{-\\omega_0 \\pm \\sqrt{\\omega_0^2 + 2\\beta\\Delta\\varphi}}{\\beta}",
        f: ({ phi, omega0, beta }) => { const r = kin.timeForDistance(phi, omega0, beta); if (!r.length) fail("Nincs nemnegatív megoldás."); return r.length === 1 ? r[0] : r; },
        note: "Másodfokú egyenlet; csak a nemnegatív gyököket tartjuk meg.",
      },
    },
    feltetel: "Állandó szöggyorsulás; Δφ radiánban.",
    nem: "—",
    hiba: "A fordulatszámot (körök száma) radiánnak veszik: 1 fordulat = 2π rad.",
    pelda: { szoveg: "Nyugalomból β = 2 1/s²-tel 5 s alatt: Δφ = 25 rad ≈ 4 fordulat.", adott: { omega0: 0, beta: 2, t: 5 }, keres: "phi" },
    minta: { phi: 8, omega0: 1, beta: 0.5, t: 4 },
    kulcsszavak: "szögelfordulás fordulat egyenletesen változó körmozgás",
    kapcsolodo: ["omega-t", "ut-ido"], fgvt: true,
  });

  add({
    id: "eredo-gyorsulas", fejezet: CH3, nev: "Eredő gyorsulás változó körmozgásnál", szint: "emelt",
    tex: "a = \\sqrt{a_{\\mathrm{cp}}^2 + a_{\\mathrm{t}}^2}",
    jelentes: "A centripetális és az érintőirányú gyorsulás merőleges egymásra, ezért Pitagorasz-tétellel adódnak össze.",
    vars: { a: v("a", { min: 0, nev: "eredő gyorsulás nagysága" }), acp: v("acp"), at: v("at") },
    solve: {
      a: { tex: "a = \\sqrt{a_{\\mathrm{cp}}^2 + a_{\\mathrm{t}}^2}", f: ({ acp, at }) => Math.hypot(acp, at) },
      acp: { tex: "a_{\\mathrm{cp}} = \\sqrt{a^2 - a_{\\mathrm{t}}^2}", f: ({ a, at }) => sqrtPos(a * a - at * at, "Az eredő gyorsulás nem lehet kisebb egy összetevőjénél.") },
      at: { tex: "a_{\\mathrm{t}} = \\sqrt{a^2 - a_{\\mathrm{cp}}^2}", f: ({ a, acp }) => sqrtPos(a * a - acp * acp, "Az eredő gyorsulás nem lehet kisebb egy összetevőjénél.") },
    },
    feltetel: "A két összetevő merőleges (sugárirányú és érintőirányú).",
    nem: "Nem szabad a két gyorsulást egyszerűen összeadni.",
    hiba: "a = a_cp + a_t (algebrai összeadás) – hibás.",
    pelda: { szoveg: "a_cp = 3 m/s², a_t = 4 m/s² → a = 5 m/s².", adott: { acp: 3, at: 4 }, keres: "a" },
    minta: { a: 5, acp: 3, at: 4 },
    kulcsszavak: "eredő gyorsulás változó körmozgás pitagorasz",
    kapcsolodo: ["acp-v", "at-rbeta"], fgvt: false,
  });

  PO.formulas = (PO.formulas || []).concat(F);
  if (typeof module !== "undefined") module.exports = F;
})(typeof globalThis !== "undefined" ? globalThis : this);
