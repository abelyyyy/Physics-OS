/* PHYSICS OS — fizikai állandók, anyagjellemzők, égitestadatok.
 * Állandók: CODATA 2018 ajánlott értékek (a „pontos” jelölésűek definíció szerint pontosak).
 * Anyagjellemzők: szokásos tankönyvi értékek (kb. 20 °C, 1 atm). A vizsgán MINDIG a függvénytáblázat
 * vagy a feladat által megadott értékkel számolj – ezek néhány ezreléknyit eltérhetnek. */
(function (root) {
  const PO = (root.PO = root.PO || {});

  // Számoláshoz használt értékek (SI)
  PO.K = {
    c: 299792458, gamma: 6.6743e-11, g: 9.81, h: 6.62607015e-34, e: 1.602176634e-19,
    me: 9.1093837015e-31, mp: 1.67262192369e-27, mn: 1.67492749804e-27, u: 1.6605390666e-27,
    NA: 6.02214076e23, R: 8.314462618, kB: 1.380649e-23, eps0: 8.8541878128e-12, mu0: 1.25663706212e-6,
    k: 8.9875517923e9, sigma: 5.670374419e-8, b: 2.897771955e-3, I0: 1e-12,
  };

  PO.CONSTANTS = [
    { jel: "c", nev: "Fénysebesség vákuumban", ertek: "299 792 458", egyseg: "m/s", kerek: "3,00 · 10⁸ m/s", pontos: true, alk: "Elektromágneses hullámok, $E = mc^2$, $c = \\lambda f$", kepletek: ["hullam-c-em", "foton-lambda", "tomeg-energia"] },
    { jel: "\\gamma", nev: "Gravitációs állandó", ertek: "6,674 30 · 10⁻¹¹", egyseg: "N·m²/kg²", kerek: "6,67 · 10⁻¹¹", alk: "Newton gravitációs törvénye, műholdak, bolygók", kepletek: ["gravitacios-ero", "g-felszin", "kering-seb", "kepler3"] },
    { jel: "g", nev: "Nehézségi gyorsulás (normál érték)", ertek: "9,806 65", egyseg: "m/s²", kerek: "9,81 m/s² (feladatokban gyakran 10)", pontos: true, alk: "Szabadesés, súly, hidrosztatika, inga", kepletek: ["suly", "hidrosztatikai", "inga-T"] },
    { jel: "h", nev: "Planck-állandó", ertek: "6,626 070 15 · 10⁻³⁴", egyseg: "J·s", kerek: "6,63 · 10⁻³⁴ J·s", pontos: true, alk: "Foton energiája, fényelektromos jelenség, de Broglie", kepletek: ["foton-E", "einstein-foto", "de-broglie"] },
    { jel: "e", nev: "Elemi töltés", ertek: "1,602 176 634 · 10⁻¹⁹", egyseg: "C", kerek: "1,60 · 10⁻¹⁹ C", pontos: true, alk: "Elektron, proton töltése; 1 eV = 1,602 · 10⁻¹⁹ J", kepletek: ["lorentz", "e-munka"] },
    { jel: "m_e", nev: "Elektron tömege", ertek: "9,109 383 7015 · 10⁻³¹", egyseg: "kg", kerek: "9,11 · 10⁻³¹ kg", alk: "Fotoelektronok, katódsugár, de Broglie", kepletek: ["de-broglie", "kor-magneses"] },
    { jel: "m_p", nev: "Proton tömege", ertek: "1,672 621 923 69 · 10⁻²⁷", egyseg: "kg", kerek: "1,673 · 10⁻²⁷ kg", alk: "Tömeghiány, tömegspektrométer", kepletek: ["tomeghiany", "kor-magneses"] },
    { jel: "m_n", nev: "Neutron tömege", ertek: "1,674 927 498 04 · 10⁻²⁷", egyseg: "kg", kerek: "1,675 · 10⁻²⁷ kg", alk: "Tömeghiány, kötési energia", kepletek: ["tomeghiany"] },
    { jel: "u", nev: "Atomi tömegegység", ertek: "1,660 539 066 60 · 10⁻²⁷", egyseg: "kg", kerek: "1,66 · 10⁻²⁷ kg ≙ 931,5 MeV", alk: "Atom- és magtömegek", kepletek: ["tomeghiany"] },
    { jel: "N_A", nev: "Avogadro-állandó", ertek: "6,022 140 76 · 10²³", egyseg: "1/mol", kerek: "6,02 · 10²³ 1/mol", pontos: true, alk: "Részecskeszám és anyagmennyiség", kepletek: ["reszecskeszam"] },
    { jel: "R", nev: "Egyetemes gázállandó", ertek: "8,314 462 618", egyseg: "J/(mol·K)", kerek: "8,31 J/(mol·K)", pontos: true, alk: "Állapotegyenlet, belső energia", kepletek: ["allapotegyenlet", "belso-energia"] },
    { jel: "k", nev: "Boltzmann-állandó", ertek: "1,380 649 · 10⁻²³", egyseg: "J/K", kerek: "1,38 · 10⁻²³ J/K", pontos: true, alk: "Részecske átlagos energiája, $pV = NkT$", kepletek: ["kinetikus-E", "allapot-N"] },
    { jel: "\\varepsilon_0", nev: "Vákuum permittivitása", ertek: "8,854 187 8128 · 10⁻¹²", egyseg: "C²/(N·m²)", kerek: "8,85 · 10⁻¹² C²/(N·m²)", alk: "Síkkondenzátor kapacitása", kepletek: ["sikkondenzator"] },
    { jel: "k", nev: "Coulomb-állandó $1/(4\\pi\\varepsilon_0)$", ertek: "8,987 551 8 · 10⁹", egyseg: "N·m²/C²", kerek: "9 · 10⁹ N·m²/C²", alk: "Coulomb-törvény, ponttöltés tere", kepletek: ["coulomb", "ponttoltes-E"] },
    { jel: "\\mu_0", nev: "Vákuum permeabilitása", ertek: "1,256 637 062 12 · 10⁻⁶", egyseg: "V·s/(A·m)", kerek: "4π · 10⁻⁷ ≈ 1,26 · 10⁻⁶", alk: "Egyenes vezető és tekercs mágneses tere", kepletek: ["egyenes-vezeto-B", "tekercs-B"] },
    { jel: "\\sigma", nev: "Stefan–Boltzmann-állandó", ertek: "5,670 374 419 · 10⁻⁸", egyseg: "W/(m²·K⁴)", kerek: "5,67 · 10⁻⁸", alk: "Hősugárzás, csillagok luminozitása", kepletek: ["stefan-boltzmann"] },
    { jel: "b", nev: "Wien-állandó", ertek: "2,897 771 955 · 10⁻³", egyseg: "m·K", kerek: "2,90 · 10⁻³ m·K", alk: "Hőmérsékleti sugárzás csúcsa, csillagok hőmérséklete", kepletek: ["wien"] },
    { jel: "I_0", nev: "Hallásküszöb (vonatkoztatási intenzitás)", ertek: "10⁻¹²", egyseg: "W/m²", kerek: "10⁻¹² W/m²", pontos: true, alk: "Decibelskála", kepletek: ["decibel"] },
  ];

  PO.UNIT_FACTS = [
    ["1 eV", "1,602 · 10⁻¹⁹ J"], ["1 kWh", "3,6 · 10⁶ J"], ["1 atm", "101 325 Pa"], ["1 bar", "10⁵ Pa"],
    ["1 Hgmm", "133,3 Pa"], ["1 CSE (csillagászati egység)", "1,496 · 10¹¹ m"], ["1 fényév", "9,461 · 10¹⁵ m"],
    ["1 parszek", "3,086 · 10¹⁶ m ≈ 3,26 fényév"], ["1 u", "931,5 MeV/c²"], ["0 °C", "273,15 K"], ["1 mAh", "3,6 C"],
  ];

  // Anyagjellemzők – oszlopok: név + értékek
  PO.MATERIALS = [
    { id: "suruseg", cim: "Sűrűség", oszlop: ["Anyag", "ρ (kg/m³)"], sorok: [
      ["Levegő (0 °C, 1 atm)", "1,29"], ["Levegő (20 °C, 1 atm)", "1,20"], ["Hélium (0 °C)", "0,18"], ["Fa (fenyő)", "≈ 500"], ["Etanol", "789"], ["Étolaj", "≈ 920"],
      ["Jég", "917"], ["Víz (4 °C)", "1000"], ["Tengervíz", "≈ 1025"], ["Üveg", "≈ 2500"], ["Alumínium", "2700"], ["Vas, acél", "7860"],
      ["Réz", "8960"], ["Ezüst", "10 500"], ["Ólom", "11 340"], ["Higany", "13 546"], ["Arany", "19 300"]] },
    { id: "fajho", cim: "Fajhő", oszlop: ["Anyag", "c (J/(kg·K))"], sorok: [
      ["Víz", "4180"], ["Jég", "2100"], ["Vízgőz", "≈ 2000"], ["Etanol", "2440"], ["Levegő (állandó nyomáson)", "1005"], ["Alumínium", "900"],
      ["Üveg", "840"], ["Vas", "450"], ["Réz", "385"], ["Ezüst", "235"], ["Higany", "140"], ["Ólom", "130"], ["Arany", "129"]] },
    { id: "halmazallapot", cim: "Olvadás és forrás (1 atm)", oszlop: ["Anyag", "Olvadáspont (°C)", "Olvadáshő (kJ/kg)", "Forráspont (°C)", "Forráshő (kJ/kg)"], sorok: [
      ["Víz", "0", "334", "100", "2256"], ["Etanol", "−114", "108", "78", "846"], ["Higany", "−39", "11,4", "357", "295"], ["Nitrogén", "−210", "25,7", "−196", "199"],
      ["Ólom", "327", "23", "1749", "866"], ["Ón", "232", "59", "2602", "2490"], ["Alumínium", "660", "397", "2470", "10 900"], ["Réz", "1085", "205", "2562", "4730"],
      ["Arany", "1064", "64", "2856", "1645"], ["Vas", "1538", "247", "2862", "6090"]] },
    { id: "ellenallas", cim: "Fajlagos ellenállás (20 °C)", oszlop: ["Anyag", "ρ (Ω·m)", "α (1/K)"], sorok: [
      ["Ezüst", "1,59 · 10⁻⁸", "3,8 · 10⁻³"], ["Réz", "1,68 · 10⁻⁸", "3,9 · 10⁻³"], ["Arany", "2,44 · 10⁻⁸", "3,4 · 10⁻³"], ["Alumínium", "2,65 · 10⁻⁸", "3,9 · 10⁻³"],
      ["Volfrám", "5,6 · 10⁻⁸", "4,5 · 10⁻³"], ["Vas", "9,7 · 10⁻⁸", "5,0 · 10⁻³"], ["Konstantán", "4,9 · 10⁻⁷", "≈ 0"], ["Króm-nikkel", "1,1 · 10⁻⁶", "≈ 4 · 10⁻⁴"],
      ["Grafit", "≈ 10⁻⁵", "negatív"], ["Desztillált víz", "≈ 10⁵", "—"], ["Üveg", "10¹⁰–10¹⁴", "—"]] },
    { id: "hotagulas", cim: "Hőtágulási együttható (20 °C körül)", oszlop: ["Anyag", "Lineáris α (1/K)", "Térfogati β (1/K)"], sorok: [
      ["Invar", "1,2 · 10⁻⁶", "—"], ["Üveg (Pyrex)", "3,3 · 10⁻⁶", "—"], ["Üveg (közönséges)", "9 · 10⁻⁶", "—"], ["Vas, acél, beton", "1,2 · 10⁻⁵", "—"],
      ["Réz", "1,7 · 10⁻⁵", "—"], ["Alumínium", "2,3 · 10⁻⁵", "—"], ["Víz (20 °C)", "—", "2,1 · 10⁻⁴"], ["Higany", "—", "1,8 · 10⁻⁴"], ["Glicerin", "—", "5,0 · 10⁻⁴"], ["Etanol", "—", "1,1 · 10⁻³"],
      ["Ideális gáz (0 °C)", "—", "1/273 ≈ 3,66 · 10⁻³"]] },
    { id: "optika", cim: "Törésmutató (sárga fény, 589 nm)", oszlop: ["Anyag", "n"], sorok: [
      ["Vákuum", "1 (pontosan)"], ["Levegő", "1,0003"], ["Jég", "1,31"], ["Víz", "1,333"], ["Etanol", "1,36"], ["Plexi", "1,49"], ["Koronaüveg", "1,52"], ["Flintüveg", "1,62"], ["Gyémánt", "2,42"]] },
    { id: "hang", cim: "Hangsebesség", oszlop: ["Közeg", "c (m/s)"], sorok: [
      ["Levegő (0 °C)", "331"], ["Levegő (20 °C)", "343"], ["Hélium (0 °C)", "≈ 970"], ["Víz (20 °C)", "≈ 1480"], ["Tengervíz", "≈ 1530"], ["Jég", "≈ 3200"], ["Réz", "≈ 4700"],
      ["Acél", "≈ 5900"], ["Alumínium", "≈ 6400"]] },
    { id: "kilepesi", cim: "Kilépési munka (fényelektromos jelenség)", oszlop: ["Fém", "W (eV)", "Határhullámhossz (nm)"], sorok: [
      ["Cézium", "2,1", "≈ 590"], ["Kálium", "2,3", "≈ 540"], ["Nátrium", "2,3", "≈ 540"], ["Lítium", "2,9", "≈ 430"], ["Alumínium", "4,1", "≈ 300"], ["Cink", "4,3", "≈ 290"],
      ["Ezüst", "4,3", "≈ 290"], ["Réz", "4,7", "≈ 265"], ["Platina", "5,6", "≈ 220"]] },
  ];

  PO.BODIES = {
    fold: [["Tömeg", "5,97 · 10²⁴ kg"], ["Átlagos sugár", "6371 km (feladatokban gyakran 6370 vagy 6380 km)"], ["Nehézségi gyorsulás", "9,81 m/s²"], ["Tengely körüli forgás (sziderikus nap)", "23 h 56 min 4 s"],
      ["Keringési idő", "365,26 nap"], ["Közepes Nap-távolság", "1 CSE = 1,496 · 10⁸ km"], ["Keringési sebesség", "≈ 29,8 km/s"], ["Első kozmikus sebesség", "7,9 km/s"], ["Szökési sebesség", "11,2 km/s"],
      ["Geostacionárius pálya sugara", "≈ 42 200 km (≈ 35 800 km a felszín felett)"]],
    hold: [["Tömeg", "7,35 · 10²² kg (≈ 1/81 földtömeg)"], ["Sugár", "1737 km"], ["Nehézségi gyorsulás", "1,62 m/s²"], ["Közepes Föld-távolság", "384 400 km"],
      ["Keringési idő (sziderikus)", "27,3 nap"], ["Holdfázisok periódusa (szinodikus)", "29,5 nap"]],
    nap: [["Tömeg", "1,99 · 10³⁰ kg"], ["Sugár", "6,96 · 10⁵ km"], ["Felszíni hőmérséklet", "≈ 5800 K"], ["Luminozitás (teljesítmény)", "3,83 · 10²⁶ W"], ["Napállandó (Föld pályáján)", "≈ 1360 W/m²"],
      ["Életkor", "≈ 4,6 milliárd év"]],
    bolygok: { oszlop: ["Bolygó", "Pályasugár (CSE)", "Keringési idő (év)", "Tömeg (földtömeg)", "Sugár (km)", "g (m/s²)"], sorok: [
      ["Merkúr", "0,387", "0,241", "0,055", "2440", "3,7"], ["Vénusz", "0,723", "0,615", "0,815", "6052", "8,9"], ["Föld", "1,000", "1,000", "1,000", "6371", "9,81"],
      ["Mars", "1,524", "1,881", "0,107", "3390", "3,7"], ["Jupiter", "5,20", "11,86", "317,8", "69 911", "24,8"], ["Szaturnusz", "9,54", "29,46", "95,2", "58 232", "10,4"],
      ["Uránusz", "19,19", "84,0", "14,5", "25 362", "8,9"], ["Neptunusz", "30,07", "164,8", "17,1", "24 622", "11,2"]] },
    egyeb: [["Hubble-állandó", "≈ 70 km/s/Mpc (a mérések 67–73 között szórnak)"], ["A Világegyetem kora", "≈ 13,8 milliárd év"], ["A kozmikus háttérsugárzás hőmérséklete", "2,725 K"],
      ["A Tejútrendszer átmérője", "≈ 100 000 fényév"], ["Legközelebbi csillag (Proxima Centauri)", "4,24 fényév"]],
  };
  if (typeof module !== "undefined") module.exports = PO.K;
})(typeof globalThis !== "undefined" ? globalThis : this);
