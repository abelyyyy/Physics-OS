/* PHYSICS OS — feladatbank: KINEMATIKA
 * tipus: "num" (számszerű, tűréssel ellenőrzött) | "mc" (feleletválasztós)
 * szint: 1 alapfogalmak · 2 egyszerű behelyettesítés · 3 középszint · 4 emelt számítás · 5 komplex emelt
 * valasz: a megadott egységben (egyseg); tol: megengedett relatív eltérés */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const R = String.raw;
  const T = [
    { id: "kin-01", szint: 1, tipus: "mc", pont: 2, cim: "A tetőpont gyorsulása",
      szoveg: R`Egy labdát függőlegesen feldobunk. Mekkora és milyen irányú a gyorsulása a pálya legfelső pontjában? (Légellenállás nincs.)`,
      opciok: ["Nulla, mert a labda ott megáll.", "$g$, felfelé.", "$g$, lefelé.", "Kisebb, mint $g$, mert a sebesség nulla."], helyes: 2,
      tippek: ["Mi hat a labdára a tetőponton?", "A gyorsulás a sebesség változását írja le – a tetőpont után a sebesség lefelé mutat és nő."],
      megoldas: R`A labdára végig csak a nehézségi erő hat, így a gyorsulás végig $g$, lefelé. A tetőponton a <em>sebesség</em> nulla, de éppen változik (felfelé mutatóból lefelé mutatóba) – ezért a gyorsulás nem nulla.` },

    { id: "kin-02", szint: 2, tipus: "num", pont: 2, cim: "Átváltás",
      szoveg: R`Egy autó sebessége 54 km/h. Mennyi ez m/s-ban?`,
      valasz: 15, egyseg: "m/s", tol: 0.01,
      tippek: ["1 km = 1000 m, 1 h = 3600 s.", "km/h-ból m/s-ba: osztás 3,6-tal."],
      megoldas: R`$54\ \mathrm{km/h} = \dfrac{54\,000\ \mathrm m}{3600\ \mathrm s} = \dfrac{54}{3{,}6}\ \mathrm{m/s} = 15\ \mathrm{m/s}$.` },

    { id: "kin-03", szint: 2, tipus: "num", pont: 2, cim: "Gyorsulás",
      szoveg: R`Egy sportautó álló helyzetből 9,0 s alatt gyorsul fel 97,2 km/h-ra. Mekkora az átlagos gyorsulása?`,
      valasz: 3, egyseg: "m/s²", tol: 0.02,
      tippek: ["Először váltsd át a sebességet m/s-ba.", "$a = \\Delta v / \\Delta t$"],
      megoldas: R`$v = 97{,}2 / 3{,}6 = 27\ \mathrm{m/s}$, $\ a = \dfrac{\Delta v}{\Delta t} = \dfrac{27 - 0}{9{,}0} = 3{,}0\ \mathrm{m/s^2}$.` },

    { id: "kin-04", szint: 3, tipus: "num", pont: 3, cim: "Átlagsebesség két szakaszon",
      szoveg: R`Egy futó 3,0 km-t 4,0 m/s, majd további 3,0 km-t 6,0 m/s sebességgel tesz meg. Mekkora a teljes útra vett átlagsebessége?`,
      valasz: 4.8, egyseg: "m/s", tol: 0.01,
      tippek: ["Számold ki a két szakasz idejét külön.", "Összes út / összes idő – nem a két sebesség átlaga!"],
      megoldas: R`$t_1 = 3000/4 = 750\ \mathrm s$, $t_2 = 3000/6 = 500\ \mathrm s$. $\ v_\text{átl} = \dfrac{6000}{1250} = 4{,}8\ \mathrm{m/s}$ (és nem 5,0 m/s).` },

    { id: "kin-05", szint: 3, tipus: "num", pont: 3, cim: "Féktávolság",
      szoveg: R`Egy autó 25 m/s sebességről 5,0 m/s² nagyságú lassulással fékez megállásig. Mekkora a féktávolság?`,
      valasz: 62.5, egyseg: "m", tol: 0.01,
      tippek: ["Az időt nem ismerjük és nem is kérdezik – melyik összefüggés nem tartalmazza?", "$v^2 = v_0^2 + 2as$, ahol $v = 0$ és $a = -5\\ \\mathrm{m/s^2}$."],
      megoldas: R`$s = \dfrac{v^2 - v_0^2}{2a} = \dfrac{0 - 625}{2\cdot(-5)} = 62{,}5\ \mathrm m$.` },

    { id: "kin-06", szint: 3, tipus: "num", pont: 2, cim: "Szabadesés ideje",
      szoveg: R`Mennyi idő alatt esik le egy kő 45 m magasról? ($g = 10\ \mathrm{m/s^2}$, légellenállás nincs.)`,
      valasz: 3, egyseg: "s", tol: 0.01,
      tippek: ["Nyugalomból induló egyenletesen gyorsuló mozgás.", "$h = \\frac g2 t^2 \\Rightarrow t = \\sqrt{2h/g}$"],
      megoldas: R`$t = \sqrt{\dfrac{2h}{g}} = \sqrt{\dfrac{90}{10}} = 3\ \mathrm s$.` },

    { id: "kin-07", szint: 3, tipus: "num", pont: 3, cim: "Grafikonelemzés: v–t",
      szoveg: R`Egy kerékpáros sebesség–idő grafikonja látható. Mekkora utat tesz meg a 10 s alatt?`,
      grafikon: { xLabel: "t", xUnit: "s", yLabel: "v", yUnit: "m/s", points: [[0, 0], [4, 8], [10, 8]] },
      valasz: 64, egyseg: "m", tol: 0.01,
      tippek: ["A v–t grafikon alatti terület az elmozdulás.", "Bontsd egy háromszögre (0–4 s) és egy téglalapra (4–10 s)."],
      megoldas: R`Háromszög: $\frac12\cdot 4\cdot 8 = 16\ \mathrm m$; téglalap: $6\cdot 8 = 48\ \mathrm m$. Összesen $64\ \mathrm m$. (Az első 4 s-ban a gyorsulás $8/4 = 2\ \mathrm{m/s^2}$.)` },

    { id: "kin-08", szint: 4, tipus: "mc", pont: 2, cim: "Ejtés és vízszintes hajítás",
      szoveg: R`Azonos magasságból egyszerre elengedünk egy golyót, és egy másikat vízszintesen ellökünk. Melyik ér előbb földet? (Légellenállás nincs.)`,
      opciok: ["Az elengedett golyó.", "A vízszintesen ellökött golyó.", "Egyszerre érnek földet.", "Attól függ, melyiknek nagyobb a tömege."], helyes: 2,
      tippek: ["Bontsd a mozgást vízszintes és függőleges összetevőre.", "Függőlegesen mindkettő nyugalomból indul, gyorsulásuk $g$."],
      megoldas: R`A mozgások függetlensége miatt a függőleges mozgás mindkét golyónál ugyanaz: nyugalomból induló szabadesés. Az esési idő $t = \sqrt{2h/g}$ mindkettőnél, tehát egyszerre érnek le – a vízszintesen ellökött csak messzebb.` },

    { id: "kin-09", szint: 4, tipus: "num", pont: 4, cim: "Vízszintes hajítás asztalról",
      szoveg: R`Egy golyó egy 0,80 m magas asztal széléről gurul le, és az asztal lábától vízszintesen 1,20 m-re ér a padlóra. Mekkora sebességgel hagyta el az asztalt? ($g = 9{,}81\ \mathrm{m/s^2}$)`,
      valasz: 2.971, egyseg: "m/s", tol: 0.015,
      tippek: ["Először a függőleges mozgásból számold ki az esési időt.", "$t = \\sqrt{2h/g}$, majd $v_0 = d/t$."],
      megoldas: R`$t = \sqrt{\dfrac{2\cdot 0{,}80}{9{,}81}} \approx 0{,}404\ \mathrm s$, $\ v_0 = \dfrac{d}{t} = \dfrac{1{,}20}{0{,}404} \approx 2{,}97\ \mathrm{m/s}$.` },

    { id: "kin-10", szint: 4, tipus: "num", pont: 4, cim: "Ferde hajítás távolsága",
      szoveg: R`Egy labdát vízszintes talajról 25 m/s sebességgel, 60°-os szögben rúgnak el. Milyen messze ér földet? ($g = 9{,}81\ \mathrm{m/s^2}$, légellenállás nincs.) Melyik másik szögnél érne ugyanide?`,
      valasz: 55.17, egyseg: "m", tol: 0.015,
      tippek: ["Azonos szintre érkezik: használhatod a $d = v_0^2\\sin 2\\alpha / g$ képletet.", "$\\sin 120° = \\sin 60° \\approx 0{,}866$"],
      megoldas: R`$d = \dfrac{25^2\cdot\sin 120°}{9{,}81} = \dfrac{625\cdot 0{,}866}{9{,}81} \approx 55{,}2\ \mathrm m$. Ugyanekkora távolságot ad a komplementer szög: $30°$.` },

    { id: "kin-11", szint: 5, tipus: "num", pont: 5, cim: "Kétszer ugyanott",
      szoveg: R`Egy követ 20 m/s sebességgel függőlegesen feldobunk. Mennyi idő múlva van <strong>először</strong> 15 m magasan? ($g = 10\ \mathrm{m/s^2}$)`,
      valasz: 1, egyseg: "s", tol: 0.01,
      tippek: ["Írd fel a helyet az idő függvényében: $h(t) = v_0t - \\frac g2t^2$.", "A $15 = 20t - 5t^2$ másodfokú egyenletnek két gyöke van – mit jelentenek?"],
      megoldas: R`$15 = 20t - 5t^2 \Rightarrow t^2 - 4t + 3 = 0 \Rightarrow t_1 = 1\ \mathrm s,\ t_2 = 3\ \mathrm s$. Felfelé menet 1 s-nál, lefelé jövet 3 s-nál van 15 m magasan; először tehát $1\ \mathrm s$ múlva.` },

    { id: "kin-12", szint: 5, tipus: "num", pont: 5, cim: "Kanyar sebességhatára",
      szoveg: R`Egy autó 50 m sugarú kanyarban halad. A gumik tapadása legfeljebb 4,0 m/s² centripetális gyorsulást tesz lehetővé. Legfeljebb mekkora sebességgel (km/h-ban) veheti be a kanyart?`,
      valasz: 50.91, egyseg: "km/h", tol: 0.015,
      tippek: ["$a_\\text{cp} = v^2/r$", "$v = \\sqrt{a_\\text{cp}\\,r}$, majd szorozd 3,6-tal."],
      megoldas: R`$v_\text{max} = \sqrt{a_\text{cp}\,r} = \sqrt{4{,}0\cdot 50} \approx 14{,}1\ \mathrm{m/s} \approx 50{,}9\ \mathrm{km/h}$.` },
  ];
  T.forEach((t) => (t.temakor = "kinematika"));
  PO.tasks = (PO.tasks || []).concat(T);
  if (typeof module !== "undefined") module.exports = T;
})(typeof globalThis !== "undefined" ? globalThis : this);
