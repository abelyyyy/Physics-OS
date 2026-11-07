/* PHYSICS OS — tananyag: 2. Energia, munka, hő */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const R = String.raw;
  const L = PO.lesson;

  /* =============================== MUNKA, ENERGIA =============================== */
  L({
    id: "munka-energia", parent: "energia", nev: "Munka, energia, teljesítmény", alcim: "Az energiamegmaradás – a fizika leghasznosabb eszköze",
    elofeltetel: ["Dinamika"],
    kulcsszavak: "munka energia mozgási helyzeti rugalmas munkatétel energiamegmaradás mechanikai energia teljesítmény hatásfok konzervatív erő",
    attekintes: R`
<p class="lead">Az energia az a mennyiség, amely átalakulhat, de nem vész el. Számos feladat sokkal egyszerűbb energiával, mint erőkkel és gyorsulással – nem kell tudni a pálya alakját, csak a kezdő- és végállapotot.</p>
<div class="prose"><ul><li>a munka fogalma, előjele, grafikus jelentése;</li><li>mozgási, helyzeti és rugalmas energia; a munkatétel;</li><li>a mechanikai energia megmaradása és mikor nem érvényes;</li><li>teljesítmény, hatásfok.</li></ul></div>
<div class="callout"><div class="callout-t">Szemléletesen</div>A hullámvasút kocsija a legmagasabb pontról indulva bármilyen kanyargós pályán annyi sebességet szerez, amennyi magasságot veszített – súrlódás nélkül a pálya alakja nem számít.</div>`,
    elmelet: R`<div class="prose">
<h3>A munka</h3>
<p>$$W = F\,s\cos\alpha$$ ahol $\alpha$ az erő és az elmozdulás szöge. A munka skalár; lehet pozitív (az erő gyorsít), negatív (fékez, pl. súrlódás) vagy nulla (merőleges erő: centripetális erő, nyomóerő vízszintes úton). Változó erőnél a munka az $F$–$s$ grafikon alatti terület (pl. rugónál $\tfrac12 D\Delta l^2$).</p>
<h3>Energiafajták</h3>
<ul><li>Mozgási: $E_m = \tfrac12 mv^2$</li><li>Helyzeti (nehézségi erőtérben): $E_h = mgh$ – a nullszint szabadon választható, csak a változása számít.</li><li>Rugalmas: $E_r = \tfrac12 D\Delta l^2$</li></ul>
<h3>A munkatétel</h3>
<p>$$W_{össz} = \Delta E_m$$ A testre ható <em>összes</em> erő munkájának összege egyenlő a mozgási energia változásával. Fékút: $-\mu mg\,s = 0 - \tfrac12mv_0^2 \Rightarrow s = \dfrac{v_0^2}{2\mu g}$.</p>
<h3>A mechanikai energia megmaradása</h3>
<p>Ha csak <strong>konzervatív erők</strong> (gravitáció, rugóerő) végeznek munkát, $$E_m + E_h + E_r = \text{állandó}$$ Konzervatív erő munkája nem függ az úttól, csak a kezdő- és végponttól. A súrlódás nem konzervatív: munkája a mechanikai energiát belső energiává (hővé) alakítja – az <em>összes</em> energia ekkor is megmarad.</p>
<h3>Teljesítmény, hatásfok</h3>
<p>$$P = \frac{W}{t} = F\,v \qquad \eta = \frac{W_{hasznos}}{W_{befektetett}} = \frac{P_h}{P_b}$$ 1 W = 1 J/s; 1 kWh = 3,6 MJ. A $P = Fv$ alakból: állandó teljesítményű motor nagy sebességnél kisebb húzóerőt ad (ezért kell a sebességváltó).</p>
</div>`,
    peldak: [
      { szint: "3 · Közép", cim: "Hullámvasút", feladat: R`<p>Egy hullámvasút kocsija 25 m magas pontról nyugalomból indul. Mekkora a sebessége a 10 m magas hurok tetején, ha a súrlódás elhanyagolható? ($g = 9{,}81\ \mathrm{m/s^2}$)</p>`,
        megoldas: R`<p>$mg h_1 = mgh_2 + \tfrac12mv^2 \Rightarrow v = \sqrt{2g(h_1 - h_2)} = \sqrt{2\cdot 9{,}81\cdot 15} \approx 17{,}2\ \mathrm{m/s}$.</p><p>A tömeg és a pálya alakja nem számít.</p>` },
      { szint: "3 · Közép", cim: "Fékút és a sebesség négyzete", feladat: R`<p>Egy autó 50 km/h-ról 15 m úton áll meg. Mekkora a fékút 100 km/h-ról ugyanazon az úton?</p>`,
        megoldas: R`<p>Munkatétel: $F_s\,s = \tfrac12mv^2$, így $s \propto v^2$. Kétszeres sebességnél négyszeres fékút: <strong>60 m</strong>.</p>` },
      { szint: "4 · Emelt", cim: "Rugós kilövő súrlódással", feladat: R`<p>Egy 200 N/m-es rugót 10 cm-rel összenyomunk, és vele egy 50 g-os hasábot lövünk ki vízszintes asztalon. A test 4,0 m-t csúszik megállásig. Mekkora a súrlódási együttható? ($g = 9{,}81$)</p>`,
        megoldas: R`<p>A rugó energiája: $\tfrac12\cdot 200\cdot 0{,}01 = 1\ \mathrm J$. Ez mind hővé alakul: $\mu mg\,s = 1\ \mathrm J$.</p><p>$$\mu = \frac{1}{0{,}05\cdot 9{,}81\cdot 4{,}0} \approx 0{,}51$$ A rugó energiája teljes egészében a súrlódási munkára fordítódott. <em>Mindig ellenőrizd az eredmény realitását</em> – a $\mu$ jellemzően 0,1 és 1 közé esik.</p>` },
    ],
    hibak: [
      ["Merőleges erő", "A centripetális erő és a vízszintes úton ható nyomóerő nem végez munkát."],
      ["Súrlódás", "Súrlódásnál a mechanikai energia NEM marad meg – a különbség a súrlódási munka."],
      ["Helyzeti energia nullszintje", "Tetszőleges, de egy feladaton belül végig ugyanaz legyen."],
      ["Teljesítmény", "kW és kWh: az első teljesítmény, a második energia."],
    ],
    osszefoglalo: R`<div class="grid g2"><div class="panel"><div class="panel-title">Kulcsgondolatok</div><ul class="small">
<li>Munka = erő × az erő irányú elmozdulás.</li><li>Munkatétel: összes munka = mozgási energia változása.</li><li>Csak konzervatív erőknél marad meg a mechanikai energia.</li></ul></div>
<div class="panel"><div class="panel-title">Képletek</div>$$W = Fs\cos\alpha \quad E_m = \tfrac12mv^2 \quad E_h = mgh$$$$E_r = \tfrac12D\Delta l^2 \quad P = \frac Wt = Fv \quad \eta = \frac{P_h}{P_b}$$</div></div>`,
    erettsegi: [
      ["Feleletválasztós (I.)", "Mikor nulla a munka; energiaátalakulások (inga, hullámvasút); teljesítmény összehasonlítása."],
      ["Témakifejtés (II.)", "Munka és energia, a mechanikai energia megmaradása; energiaátalakulások a mindennapokban."],
      ["Összetett feladatok (III.)", "Lejtő + súrlódás energiával; rugós kilövés; függőleges körpálya (a hurok tetején $mg \\le mv^2/r$); emelőgép teljesítménye, hatásfoka."],
    ],
    feladatok: [
      { id: "mun-01", szint: 1, tipus: "mc", pont: 2, cim: "Munka körpályán", szoveg: R`Egy fonálon vízszintes körpályán egyenletesen forgatott testre ható kötélerő munkája egy teljes kör alatt:`,
        opciok: ["pozitív", "negatív", "nulla", "a sebességtől függ"], helyes: 2, tippek: ["Milyen szöget zár be az erő az elmozdulással?"],
        megoldas: R`A kötélerő a középpont felé mutat, az elmozdulás érintő irányú: $\cos 90° = 0$, a munka nulla – a mozgási energia nem is változik.` },
      { id: "mun-02", szint: 2, tipus: "num", pont: 2, cim: "Becsapódási sebesség", szoveg: R`Egy test 20 m magasról esik le nyugalomból. Mekkora sebességgel csapódik be? ($g = 9{,}81\ \mathrm{m/s^2}$, közegellenállás nincs)`,
        valasz: 19.81, egyseg: "m/s", tol: 0.01, tippek: ["$mgh = \\tfrac12mv^2$"], megoldas: R`$v = \sqrt{2gh} = \sqrt{392{,}4} \approx 19{,}8\ \mathrm{m/s}$.` },
      { id: "mun-03", szint: 3, tipus: "num", pont: 3, cim: "Autó átlagteljesítménye", szoveg: R`Egy 1200 kg-os autó 8,0 s alatt gyorsul fel álló helyzetből 20 m/s-ra vízszintes úton. Mekkora az átlagos hasznos teljesítménye kW-ban (veszteségek nélkül)?`,
        valasz: 30, egyseg: "kW", tol: 0.01, tippek: ["$P = \\Delta E/t$"], megoldas: R`$\Delta E = \tfrac12\cdot 1200\cdot 400 = 240\ \mathrm{kJ}$, $P = 240/8 = 30\ \mathrm{kW}$.` },
    ],
  });

  /* =============================== HŐTÁGULÁS, GÁZOK =============================== */
  L({
    id: "hotagulas-gazok", parent: "energia", nev: "Hőtágulás, gáztörvények", alcim: "Hőmérséklet, hőtágulás, ideális gáz, kinetikus gázmodell",
    elofeltetel: ["Alapok: mértékegységek"],
    kulcsszavak: "hőmérséklet kelvin hőtágulás lineáris térfogati gáztörvény boyle-mariotte gay-lussac állapotegyenlet ideális gáz kinetikus gázmodell avogadro mól",
    attekintes: R`
<p class="lead">A hőmérséklet a részecskék rendezetlen mozgásának mértéke. Melegítéskor az anyagok általában kitágulnak; a gázok viselkedését néhány egyszerű törvény írja le.</p>
<div class="prose"><ul><li>Celsius- és Kelvin-skála, abszolút nulla fok;</li><li>szilárd testek és folyadékok hőtágulása, a víz rendellenes viselkedése;</li><li>a gáztörvények és az egyesített állapotegyenlet;</li><li>a kinetikus gázmodell: a nyomás és a hőmérséklet részecskeszintű magyarázata.</li></ul></div>
<div class="callout"><div class="callout-t">Szemléletesen</div>A gáz nyomása a falnak ütköző részecskék lendületváltozásából ered. Melegítve gyorsabban mozognak: többször és nagyobb lendülettel ütköznek – nő a nyomás (ha a térfogat állandó).</div>`,
    elmelet: R`<div class="prose">
<h3>Hőmérséklet</h3>
<p>$T\,[\mathrm K] = t\,[°\mathrm C] + 273{,}15$. A hőmérséklet-<em>különbség</em> kelvinben és °C-ban ugyanaz. A gáztörvényekben <strong>mindig kelvinnel</strong> kell számolni! Abszolút nulla fok: 0 K, ennél hidegebb nem létezik.</p>
<h3>Hőtágulás</h3>
<p>Lineáris: $\Delta l = \alpha\,l_0\,\Delta T$; térfogati: $\Delta V = \beta\,V_0\,\Delta T$, szilárd testekre $\beta \approx 3\alpha$. Alkalmazások és problémák: hidak dilatációs hézaga, sínek, bimetál (termosztát), távvezetékek belógása nyáron. A <strong>víz</strong> 0 és 4 °C között melegítve összehúzódik, 4 °C-on a legnagyobb a sűrűsége – ezért fagynak be a tavak felülről, és ezért él túl a halállomány.</p>
<h3>Gáztörvények (állandó anyagmennyiség)</h3>
<ul><li><strong>Izoterm</strong> (Boyle–Mariotte): $pV = $ áll.</li><li><strong>Izobár</strong> (Gay-Lussac I.): $V/T = $ áll.</li><li><strong>Izochor</strong> (Gay-Lussac II.): $p/T = $ áll.</li></ul>
<p>Egyesítve: $$\frac{p_1V_1}{T_1} = \frac{p_2V_2}{T_2}$$</p>
<h3>Az ideális gáz állapotegyenlete</h3>
<p>$$pV = nRT = NkT$$ $R = 8{,}31\ \mathrm{J/(mol\,K)}$, $k = 1{,}38\cdot 10^{-23}\ \mathrm{J/K}$, $N = nN_A$. Normálállapotban 1 mol gáz térfogata ≈ 22,4 dm³ (0 °C, 101 kPa). Ideális gáz: a részecskék pontszerűek, csak ütközéskor hatnak kölcsön – kis nyomáson, magas hőmérsékleten jó közelítés.</p>
<h3>Kinetikus gázmodell</h3>
<p>Egy részecske átlagos (haladó) mozgási energiája $$\bar\varepsilon = \tfrac32 kT$$ A hőmérséklet tehát a részecskék átlagos mozgási energiájának mértéke. A nyomás: $p = \tfrac23\dfrac NV\bar\varepsilon$.</p>
</div>`,
    peldak: [
      { szint: "3 · Közép", cim: "Gumiabroncs nyáron", feladat: R`<p>Egy abroncsban 20 °C-on 2,0 bar a nyomás. Mekkora lesz 40 °C-on, ha a térfogat nem változik?</p>`,
        megoldas: R`<p>Izochor: $\dfrac{p_1}{T_1} = \dfrac{p_2}{T_2} \Rightarrow p_2 = 2{,}0\cdot\dfrac{313{,}15}{293{,}15} \approx 2{,}14\ \mathrm{bar}$.</p><p>Gyakori hiba: °C-kal számolva $2{,}0 \cdot 40/20 = 4$ bar jönne ki – ez teljesen rossz!</p>` },
      { szint: "3 · Közép", cim: "Sín hőtágulása", feladat: R`<p>Egy 25 m-es acélsín ($\alpha = 1{,}2\cdot 10^{-5}\ 1/\mathrm K$) hőmérséklete −20 °C és +40 °C között változik. Mekkora hézag kell a sínek között?</p>`,
        megoldas: R`<p>$\Delta l = 1{,}2\cdot 10^{-5}\cdot 25\cdot 60 = 0{,}018\ \mathrm m = 18\ \mathrm{mm}$.</p>` },
      { szint: "4 · Emelt", cim: "Buborék a tó fenekéről", feladat: R`<p>Egy 10 m mély tó fenekén (8 °C) 1,0 cm³-es buborék keletkezik, és a felszínre (20 °C) emelkedik. Mekkora lesz a térfogata? ($p_0 = 100\ \mathrm{kPa}$, $\rho = 1000\ \mathrm{kg/m^3}$, $g = 9{,}81$)</p>`,
        megoldas: R`<p>Alul: $p_1 = p_0 + \rho gh = 100 + 98{,}1 = 198{,}1\ \mathrm{kPa}$.</p><p>$$V_2 = V_1\frac{p_1}{p_2}\frac{T_2}{T_1} = 1{,}0\cdot\frac{198{,}1}{100}\cdot\frac{293}{281} \approx 2{,}07\ \mathrm{cm^3}$$</p>` },
    ],
    hibak: [
      ["Kelvin", "Gáztörvényekben és $pV = nRT$-ben CSAK kelvinben szabad számolni (hőmérséklet-különbségnél mindegy)."],
      ["Mértékegységek", "dm³ → m³ (10⁻³), bar → Pa (10⁵), kPa → Pa."],
      ["Feltételek", "A gáztörvények állandó anyagmennyiségre igazak – szivárgó vagy pumpált gáznál $n$ változik."],
      ["Víz", "4 °C alatt a víz hűléskor tágul – a lineáris hőtágulási képlet itt nem alkalmazható."],
    ],
    osszefoglalo: R`<div class="grid g2"><div class="panel"><div class="panel-title">Kulcsgondolatok</div><ul class="small">
<li>T [K] = t [°C] + 273.</li><li>$pV/T$ állandó (zárt gáz).</li><li>A hőmérséklet a részecskék átlagos mozgási energiájával arányos.</li></ul></div>
<div class="panel"><div class="panel-title">Képletek</div>$$\Delta l = \alpha l_0\Delta T \qquad \Delta V = \beta V_0\Delta T$$$$pV = nRT \qquad \frac{p_1V_1}{T_1} = \frac{p_2V_2}{T_2} \qquad \bar\varepsilon = \tfrac32kT$$</div></div>`,
    erettsegi: [
      ["Feleletválasztós (I.)", "Állapotváltozás felismerése grafikonról (p–V, V–T, p–T); hőtágulás jelenségei; a víz anomáliája."],
      ["Témakifejtés (II.)", "Gáztörvények és a kinetikus gázmodell; hőtágulás a természetben és a technikában."],
      ["Összetett feladatok (III.)", "Dugattyús henger, gázpalack melegítése, buborék emelkedése, két tartály összenyitása."],
      ["Szóbeli", "Boyle–Mariotte-törvény vizsgálata; hőtágulás mérése."],
    ],
    feladatok: [
      { id: "gaz-01", szint: 1, tipus: "mc", pont: 2, cim: "Izoterm összenyomás", szoveg: R`Egy zárt gáz térfogatát állandó hőmérsékleten felére csökkentjük. Hogyan változik a nyomása?`,
        opciok: ["Felére csökken.", "Nem változik.", "Kétszeresére nő.", "Négyszeresére nő."], helyes: 2, tippek: ["$pV = $ áll."], megoldas: R`Boyle–Mariotte: $pV$ állandó, a térfogat fele → a nyomás kétszeres.` },
      { id: "gaz-02", szint: 3, tipus: "num", pont: 3, cim: "Abroncsnyomás melegben", szoveg: R`Egy zárt tartályban 20 °C-on 2,0 bar a gáz nyomása. Mekkora lesz 40 °C-on (a térfogat nem változik)? Barban add meg!`,
        valasz: 2.1365, egyseg: "bar", tol: 0.005, tippek: ["Váltsd kelvinre a hőmérsékleteket!"], megoldas: R`$p_2 = 2{,}0\cdot\dfrac{313{,}15}{293{,}15} \approx 2{,}14\ \mathrm{bar}$.` },
      { id: "gaz-03", szint: 2, tipus: "num", pont: 2, cim: "Acélsín tágulása", szoveg: R`Mennyivel nyúlik meg egy 100 m hosszú acélsín ($\alpha = 1{,}2\cdot 10^{-5}\ 1/\mathrm K$), ha hőmérséklete 40 °C-kal nő? Centiméterben add meg!`,
        valasz: 4.8, egyseg: "cm", tol: 0.01, tippek: ["$\\Delta l = \\alpha l_0\\Delta T$"], megoldas: R`$\Delta l = 1{,}2\cdot 10^{-5}\cdot 100\cdot 40 = 0{,}048\ \mathrm m = 4{,}8\ \mathrm{cm}$.` },
    ],
  });

  /* =============================== TERMODINAMIKA =============================== */
  L({
    id: "termodinamika", parent: "energia", nev: "Termodinamika főtételei, körfolyamatok", alcim: "Belső energia, hő, munka – és miért nem lehet 100%-os hőerőgép",
    elofeltetel: ["Hőtágulás, gáztörvények", "Munka, energia"],
    kulcsszavak: "termodinamika főtétel belső energia hő munka izoterm izobár izochor adiabatikus körfolyamat hőerőgép hatásfok carnot hűtőgép hőszivattyú entrópia",
    attekintes: R`
<p class="lead">A termodinamika az energia hő és munka formájában történő átadását vizsgálja. Az I. főtétel az energiamegmaradás; a II. főtétel megmondja, mely folyamatok mehetnek végbe maguktól.</p>
<div class="prose"><ul><li>belső energia, hő, munka – a különbségük;</li><li>az I. főtétel alkalmazása a négy nevezetes állapotváltozásra;</li><li>körfolyamatok, hőerőgépek, hűtőgép, hőszivattyú;</li><li>a II. főtétel és a Carnot-hatásfok.</li></ul></div>
<div class="callout"><div class="callout-t">Szemléletesen</div>A biciklipumpa felmelegszik, ha gyorsan pumpálsz: a gázon végzett munka a belső energiát növeli (közel adiabatikus összenyomás). A szódáspalack kinyitásakor kicsapódó pára: a táguló gáz lehűl.</div>`,
    elmelet: R`<div class="prose">
<h3>Belső energia</h3>
<p>A részecskék mozgási és kölcsönhatási energiájának összege. Ideális gázban csak a mozgási: $$E_b = \tfrac f2 nRT$$ ahol $f$ a szabadsági fokok száma (egyatomos: 3, kétatomos: 5). A belső energia <em>állapotjelző</em> – csak a hőmérséklettől függ (ideális gáznál), az úttól nem.</p>
<h3>Az I. főtétel</h3>
<p>$$\Delta E_b = Q + W$$ $Q$: a gáz által <em>felvett</em> hő; $W$: a gázon <em>végzett</em> munka. Táguláskor a gáz végez munkát, ekkor $W < 0$. (Egyes tankönyvek a gáz munkájával írják: $Q = \Delta E_b + W_{gáz}$ – ugyanaz más előjellel. A vizsgán bármelyik jó, ha következetes vagy.) Állandó nyomáson a gáz munkája $p\Delta V$; általában a p–V görbe alatti terület.</p>
<h3>A négy nevezetes folyamat</h3>
<table class="data"><thead><tr><th>Folyamat</th><th>Állandó</th><th>Munka</th><th>Belső energia</th><th>Hő</th></tr></thead><tbody>
<tr><td>Izochor</td><td>$V$</td><td>$W = 0$</td><td>$\Delta E = \tfrac f2nR\Delta T$</td><td>$Q = \Delta E$</td></tr>
<tr><td>Izobár</td><td>$p$</td><td>$W = -p\Delta V$</td><td>$\Delta E = \tfrac f2 p\Delta V$</td><td>$Q = \tfrac{f+2}{2}p\Delta V$</td></tr>
<tr><td>Izoterm</td><td>$T$</td><td>$W = -Q$</td><td>$\Delta E = 0$</td><td>$Q = -W$</td></tr>
<tr><td>Adiabatikus</td><td>– ($Q = 0$)</td><td>$W = \Delta E$</td><td>összenyomáskor nő</td><td>$Q = 0$</td></tr></tbody></table>
<h3>Körfolyamatok, hőerőgépek</h3>
<p>Körfolyamatban a gáz visszatér a kezdőállapotba: $\Delta E_b = 0$, a végzett munka a p–V diagramon bezárt terület. A hőerőgép a felvett $Q_{fel}$ hő egy részét munkává alakítja, a többit ($Q_{le}$) leadja a hidegebb környezetnek: $$\eta = \frac{W}{Q_{fel}} = 1 - \frac{Q_{le}}{Q_{fel}}$$</p>
<h3>A II. főtétel</h3>
<p>A hő magától csak a melegebb testről a hidegebbre megy át; nem lehet olyan periodikusan működő gépet készíteni, amely egy hőtartályból felvett hőt teljes egészében munkává alakít (másodfajú örökmozgó nincs). A legnagyobb elérhető hatásfok (Carnot): $$\eta_{max} = 1 - \frac{T_h}{T_m}$$ A hűtőgép és a hőszivattyú munka befektetésével visz hőt a hidegebb helyről a melegebbre. A folyamatok irányát az <strong>entrópia</strong> növekedése jellemzi (rendezetlenség).</p>
</div>`,
    peldak: [
      { szint: "3 · Közép", cim: "Izobár melegítés", feladat: R`<p>2 mol egyatomos ideális gázt állandó, 100 kPa nyomáson 300 K-ről 400 K-re melegítünk. Mennyi hőt vett fel, mennyi munkát végzett és mennyivel nőtt a belső energiája?</p>`,
        megoldas: R`<p>$\Delta E_b = \tfrac32 nR\Delta T = 1{,}5\cdot 2\cdot 8{,}31\cdot 100 \approx 2493\ \mathrm J$.</p>
<p>A gáz munkája: $p\Delta V = nR\Delta T \approx 1662\ \mathrm J$ (a gázon végzett munka $W = -1662\ \mathrm J$).</p><p>$Q = \Delta E_b - W = 2493 + 1662 = 4155\ \mathrm J$ – a hő 60%-a belső energia, 40%-a munka lett.</p>` },
      { szint: "3 · Közép", cim: "Hőerőmű hatásfoka", feladat: R`<p>Egy hőerőmű gőze 550 °C-os, a hűtővíz 30 °C-os. Legfeljebb mekkora a hatásfok? A valós 40%-os erőmű 1000 MW villamos teljesítményénél mennyi hőt ad le a hűtővíznek?</p>`,
        megoldas: R`<p>$\eta_{max} = 1 - \dfrac{303}{823} \approx 63\%$.</p><p>Valós: $P_{fel} = 1000/0{,}4 = 2500\ \mathrm{MW}$, leadott: $1500\ \mathrm{MW}$ – több hő megy a folyóba, mint amennyi áram lesz!</p>` },
      { szint: "4 · Emelt", cim: "Körfolyamat munkája a p–V diagramról", feladat: R`<p>Egy gáz téglalap alakú körfolyamatot végez: $p_1 = 100\ \mathrm{kPa}$, $p_2 = 300\ \mathrm{kPa}$, $V_1 = 2\ \mathrm{dm^3}$, $V_2 = 5\ \mathrm{dm^3}$; óramutató járásával egyező irányban. Mennyi a gáz munkája ciklusonként?</p>`,
        megoldas: R`<p>A bezárt terület: $(300 - 100)\cdot 10^3 \cdot (5 - 2)\cdot 10^{-3} = 600\ \mathrm J$. Óramutató irányú körüljárásnál a gáz végez pozitív munkát (hőerőgép); ellentétes irányban a gázon végeznek munkát (hűtőgép).</p>` },
    ],
    hibak: [
      ["Előjel-konvenció", "Döntsd el az elején, hogy $W$ a gázon vagy a gáz által végzett munka – és tartsd végig."],
      ["Hő ≠ hőmérséklet", "Izoterm folyamatban a gáz hőt vesz fel, mégsem melegszik. Adiabatikus összenyomásnál melegszik, pedig nem kap hőt."],
      ["Carnot", "Csak kelvinnel! A Carnot-hatásfok elméleti felső határ."],
      ["Belső energia", "Körfolyamatban $\\Delta E_b = 0$; ideális gáznál $E_b$ csak $T$-től függ."],
    ],
    osszefoglalo: R`<div class="grid g2"><div class="panel"><div class="panel-title">Kulcsgondolatok</div><ul class="small">
<li>I. főtétel: energiamegmaradás hővel és munkával.</li><li>A p–V görbe alatti terület a munka.</li><li>II. főtétel: hő nem alakítható teljesen munkává; $\eta < 1 - T_h/T_m$.</li></ul></div>
<div class="panel"><div class="panel-title">Képletek</div>$$\Delta E_b = Q + W \qquad E_b = \tfrac f2nRT \qquad W_{gáz} = p\Delta V$$$$\eta = \frac{W}{Q_{fel}} \qquad \eta_{max} = 1 - \frac{T_h}{T_m}$$</div></div>`,
    erettsegi: [
      ["Feleletválasztós (I.)", "Melyik folyamatban nő a belső energia hőfelvétel nélkül; p–V diagram értelmezése; a hőerőgép energiamérlege."],
      ["Témakifejtés (II.)", "A termodinamika főtételei; hőerőgépek (gőzgép, belső égésű motor), hűtőgép, hőszivattyú; örökmozgók."],
      ["Összetett feladatok (III.)", "Körfolyamat szakaszonkénti hő- és munkamérlege, hatásfoka; dugattyús henger több lépésben."],
    ],
    feladatok: [
      { id: "ter-01", szint: 1, tipus: "mc", pont: 2, cim: "Adiabatikus összenyomás", szoveg: R`Egy gázt hőszigetelt hengerben gyorsan összenyomunk. Mi történik a hőmérsékletével?`,
        opciok: ["Csökken.", "Nem változik, mert nem kap hőt.", "Nő.", "Előbb nő, majd csökken."], helyes: 2, tippek: ["$Q = 0$, tehát $\\Delta E = W$."],
        megoldas: R`Adiabatikus: $Q = 0$, a gázon végzett pozitív munka teljes egészében a belső energiát növeli → nő a hőmérséklet (biciklipumpa, dízelmotor).` },
      { id: "ter-02", szint: 2, tipus: "num", pont: 2, cim: "Carnot-hatásfok", szoveg: R`Legfeljebb mekkora lehet egy 600 K és 300 K hőmérsékletű hőtartályok között működő hőerőgép hatásfoka? Százalékban add meg!`,
        valasz: 50, egyseg: "%", tol: 0.01, tippek: ["$\\eta = 1 - T_h/T_m$"], megoldas: R`$\eta = 1 - 300/600 = 0{,}5 = 50\%$.` },
      { id: "ter-03", szint: 3, tipus: "num", pont: 2, cim: "Hőerőgép hatásfoka", szoveg: R`Egy hőerőgép ciklusonként 2,0 kJ hőt vesz fel és 1,4 kJ hőt ad le. Mekkora a hatásfoka? Százalékban add meg!`,
        valasz: 30, egyseg: "%", tol: 0.01, tippek: ["$W = Q_{fel} - Q_{le}$"], megoldas: R`$W = 0{,}6\ \mathrm{kJ}$, $\eta = 0{,}6/2{,}0 = 30\%$.` },
    ],
  });

  /* =============================== KALORIMETRIA =============================== */
  L({
    id: "kalorimetria", parent: "energia", nev: "Fajhő, halmazállapot-változások", alcim: "Melegítés, olvadás, forrás, keverés",
    elofeltetel: ["Hőtágulás, gáztörvények"],
    kulcsszavak: "fajhő hőkapacitás kalorimetria keverés olvadás fagyás forrás párolgás lecsapódás olvadáshő forráshő halmazállapot-változás hőmérséklet-idő grafikon",
    attekintes: R`
<p class="lead">Mennyi hő kell egy anyag melegítéséhez, megolvasztásához, elforralásához? És milyen közös hőmérséklet alakul ki, ha két testet összekeverünk?</p>
<div class="prose"><ul><li>fajhő, hőkapacitás, a víz kiugró fajhője;</li><li>halmazállapot-változások és a látens hők;</li><li>a melegítési (hőmérséklet–idő) görbe értelmezése;</li><li>kaloriméteres keverési feladatok.</li></ul></div>
<div class="callout"><div class="callout-t">Szemléletesen</div>Olvadás közben a jég-víz keverék hőmérséklete 0 °C marad, bármennyire melegítjük – a hő a molekulák közötti kötések felbontására megy el, nem a mozgásuk gyorsítására.</div>`,
    elmelet: R`<div class="prose">
<h3>Fajhő és hőkapacitás</h3>
<p>$$Q = c\,m\,\Delta T \qquad C = cm$$ A fajhő ($c$) megmutatja, mennyi hő kell 1 kg anyag 1 K-nel történő melegítéséhez. Víz: 4200 J/(kg·K) – nagyon nagy, ezért mérsékli a tengerpart klímáját, és ezért jó hűtőfolyadék. Fémek: néhány száz J/(kg·K).</p>
<h3>Halmazállapot-változások</h3>
<p>$$Q = L\,m$$ Olvadás/fagyás ($L_o$; jégre 334 kJ/kg), forrás/lecsapódás ($L_f$; vízre 2256 kJ/kg). Halmazállapot-változás közben (tiszta anyagnál, állandó nyomáson) a hőmérséklet nem változik. A forráspont a nyomástól függ: kuktában magasabb (≈ 120 °C), hegyen alacsonyabb. A párolgás minden hőmérsékleten zajlik, és hűt (izzadás).</p>
<h3>Melegítési görbe</h3>
<p>Egyenletes hőközlésnél a hőmérséklet–idő grafikonon a ferde szakaszok meredeksége a fajhővel fordítottan arányos, a vízszintes szakaszok hossza a látens hővel arányos. A gőz forrásához szükséges hő sokkal hosszabb szakasz, mint a jég olvadása (2256 ≫ 334).</p>
<h3>Kaloriméteres keverés</h3>
<p>Hőszigetelt rendszerben a leadott hő = a felvett hő: $$\sum Q_{le} = \sum Q_{fel}$$ Mindig kelvin-különbségekkel (pozitív mennyiségekkel) írd fel; ha halmazállapot-változás is lehet, először ellenőrizd, hogy elég-e a hő a teljes olvadáshoz!</p>
</div>`,
    peldak: [
      { szint: "2 · Közép", cim: "Vízforralás", feladat: R`<p>Mennyi hő kell 2 kg 20 °C-os víz felforralásához (100 °C-ig)? Mennyi ideig tart egy 2 kW-os vízforralóval, ha a hatásfoka 90%?</p>`,
        megoldas: R`<p>$Q = 4200\cdot 2\cdot 80 = 672\ \mathrm{kJ}$; $t = \dfrac{Q}{\eta P} = \dfrac{672\,000}{1800} \approx 373\ \mathrm s \approx 6{,}2$ perc.</p>` },
      { szint: "3 · Közép", cim: "Keverés", feladat: R`<p>0,2 kg 80 °C-os vizet 0,3 kg 20 °C-os vízhez öntünk. Mekkora lesz a közös hőmérséklet (veszteség nélkül)?</p>`,
        megoldas: R`<p>$c\cdot 0{,}2\,(80 - T) = c\cdot 0{,}3\,(T - 20) \Rightarrow T = \dfrac{0{,}2\cdot 80 + 0{,}3\cdot 20}{0{,}5} = 44\ °\mathrm C$ – súlyozott átlag.</p>` },
      { szint: "4 · Emelt", cim: "Elolvad-e az összes jég?", feladat: R`<p>0,5 kg 30 °C-os vízbe 0,2 kg 0 °C-os jeget teszünk. Mi lesz a végállapot? ($c_v = 4200$, $L_o = 334\ \mathrm{kJ/kg}$)</p>`,
        megoldas: R`<p>Ellenőrzés: a víz 0 °C-ig hűlve legfeljebb $4200\cdot 0{,}5\cdot 30 = 63\ \mathrm{kJ}$-t ad le. A teljes olvadáshoz $334\cdot 0{,}2 = 66{,}8\ \mathrm{kJ}$ kellene – <strong>nem elég!</strong></p>
<p>Végállapot: 0 °C-os keverék; elolvad $63/334 \approx 0{,}189\ \mathrm{kg}$ jég, marad kb. 11 g jég. (Ha vakon felírod a keverési egyenletet, negatív °C jön ki – ez jelzi a hibát.)</p>` },
    ],
    hibak: [
      ["Ellenőrzés", "Jég + víz keverésekor először nézd meg, elég-e a hő a teljes olvadáshoz."],
      ["Mértékegység", "A fajhő J/(kg·K), a látens hő J/kg – kJ-t válts J-ra!"],
      ["Grafikon", "Vízszintes szakasz a T–t grafikonon: halmazállapot-változás, nem „hőközlés nélkül”."],
      ["Hőmérséklet-különbség", "$\\Delta T$ kelvinben és °C-ban ugyanaz – itt nem kell átváltani."],
    ],
    osszefoglalo: R`<div class="grid g2"><div class="panel"><div class="panel-title">Kulcsgondolatok</div><ul class="small">
<li>Melegítés: $Q = cm\Delta T$; halmazállapot-változás: $Q = Lm$, közben $T$ állandó.</li><li>Keverés: leadott hő = felvett hő.</li><li>A víz fajhője és forráshője kiugróan nagy.</li></ul></div>
<div class="panel"><div class="panel-title">Képletek</div>$$Q = cm\Delta T \qquad Q = L_om \qquad Q = L_fm$$$$c_1m_1(T_1 - T) = c_2m_2(T - T_2)$$</div></div>`,
    erettsegi: [
      ["Feleletválasztós (I.)", "Melegítési görbe értelmezése; miért hűt a párolgás; forráspont és nyomás."],
      ["Témakifejtés (II.)", "Halmazállapot-változások és jelentőségük (időjárás, főzés, hűtés)."],
      ["Összetett feladatok (III.)", "Kaloriméteres keverés jéggel, elektromos melegítés hatásfokkal, grafikonról leolvasott fajhő."],
      ["Szóbeli", "Fajhő vagy olvadáshő mérése keverési kaloriméterrel."],
    ],
    feladatok: [
      { id: "kal-01", szint: 1, tipus: "mc", pont: 2, cim: "Olvadó jég", szoveg: R`Jég-víz keveréket egyenletesen melegítünk, amíg van benne jég. Mi történik a hőmérsékletével?`,
        opciok: ["Egyenletesen nő.", "0 °C marad.", "Csökken.", "Gyorsuló ütemben nő."], helyes: 1, tippek: ["Hová lesz a közölt hő?"], megoldas: R`Amíg van jég, a közölt hő az olvadásra fordítódik; a hőmérséklet 0 °C marad.` },
      { id: "kal-02", szint: 2, tipus: "num", pont: 2, cim: "Vízmelegítés", szoveg: R`Mennyi hő szükséges 2,0 kg víz 20 °C-ról 100 °C-ra melegítéséhez? ($c = 4200\ \mathrm{J/(kg\,K)}$) kJ-ban add meg!`,
        valasz: 672, egyseg: "kJ", tol: 0.01, tippek: ["$Q = cm\\Delta T$"], megoldas: R`$Q = 4200\cdot 2\cdot 80 = 672\,000\ \mathrm J = 672\ \mathrm{kJ}$.` },
      { id: "kal-03", szint: 3, tipus: "num", pont: 3, cim: "Keverési hőmérséklet", szoveg: R`0,20 kg 80 °C-os vizet 0,30 kg 20 °C-os vízzel keverünk (veszteség nincs). Mekkora a közös hőmérséklet °C-ban?`,
        valasz: 44, egyseg: "°C", tol: 0.01, tippek: ["Leadott hő = felvett hő."], megoldas: R`$T = \dfrac{0{,}2\cdot 80 + 0{,}3\cdot 20}{0{,}5} = 44\ °\mathrm C$.` },
    ],
  });

  /* =============================== ENERGIAGAZDÁLKODÁS =============================== */
  L({
    id: "energiagazdalkodas", parent: "energia", nev: "Energiagazdálkodás", alcim: "Energiaforrások, erőművek, környezeti hatások",
    elofeltetel: ["Munka, energia", "Termodinamika"], szint: "Közép + Emelt (főleg szöveges)",
    kulcsszavak: "energiagazdálkodás energiaforrás megújuló fosszilis atomerőmű hőerőmű napelem szélerőmű vízerőmű hőszivattyú hatásfok üvegházhatás energiatakarékosság kwh",
    attekintes: R`
<p class="lead">A társadalom energiaigényét különböző forrásokból fedezzük – mindegyiknek más a hatásfoka, a környezeti hatása és a megbízhatósága. Ez a témakör inkább szöveges, de egyszerű számolásokat is tartalmaz.</p>
<div class="prose"><ul><li>megújuló és nem megújuló energiaforrások;</li><li>az erőművek működése és hatásfoka;</li><li>energiatárolás, a villamosenergia-rendszer;</li><li>környezeti hatások, energiatakarékosság, egyszerű fogyasztásszámítás.</li></ul></div>`,
    elmelet: R`<div class="prose">
<h3>Energiaforrások</h3>
<ul><li><strong>Nem megújuló</strong>: szén, kőolaj, földgáz (fosszilis – a Nap évmilliókkal ezelőtti energiája, elégetésük CO₂-t termel), urán (atomenergia – nem bocsát ki CO₂-t, de radioaktív hulladék keletkezik).</li>
<li><strong>Megújuló</strong>: napenergia (napelem, napkollektor), szél, víz, geotermikus, biomassza, árapály. Szinte mind a Napból ered (a geotermikus és az árapály kivétel).</li></ul>
<h3>Erőművek</h3>
<p>A hőerőművek (szén, gáz, atom) hőből gőzt, abból turbinával mozgási, generátorral elektromos energiát állítanak elő. Hatásfokukat a II. főtétel korlátozza (≈ 33–45%; kombinált ciklusú gázerőmű ≈ 60%). A leadott hő kapcsolt termeléssel (távfűtés) hasznosítható. A vízerőmű hatásfoka 80–90%. A napelem 15–23%-os, a szél- és naperőművek termelése időjárásfüggő – ezért kell energiatárolás (szivattyús tározó, akkumulátor) és szabályozható erőmű.</p>
<h3>Egyszerű számolások</h3>
<p>$$W = P\,t \quad [\mathrm{kWh}] \qquad 1\ \mathrm{kWh} = 3{,}6\ \mathrm{MJ}$$ Napelem teljesítménye: $P = \eta\cdot I\cdot A$, ahol $I$ a napsugárzás intenzitása (derült időben ≈ 1000 W/m²). Vízerőmű: $P = \eta\,\rho\,g\,h\,\dfrac{\Delta V}{\Delta t}$. Szélerőmű teljesítménye a szélsebesség köbével arányos.</p>
<h3>Hőszivattyú</h3>
<p>Munka befektetésével a hidegebb környezetből (levegő, talaj) hőt szivattyúz a lakásba; 1 kWh villamos energiával 3–5 kWh hőt ad (jósági tényező). Nem sérti a főtételeket, mert a környezet hőjét is felhasználja.</p>
<h3>Környezeti hatások</h3>
<p>Üvegházhatás és klímaváltozás (CO₂, metán), savas eső, légszennyezés, radioaktív hulladék, a táj átalakítása (gátak, szélparkok). Energiatakarékosság: hőszigetelés, LED-világítás, hatékony készülékek.</p>
</div>`,
    peldak: [
      { szint: "2 · Közép", cim: "Napelem a háztetőn", feladat: R`<p>Egy 1,6 m²-es, 20%-os hatásfokú napelemtábla mekkora teljesítményt ad 1000 W/m² napsugárzásnál? Hány ilyen tábla kell egy 4 kW-os rendszerhez?</p>`,
        megoldas: R`<p>$P = 0{,}2\cdot 1000\cdot 1{,}6 = 320\ \mathrm W$; $4000/320 = 12{,}5$, tehát 13 tábla.</p>` },
      { szint: "3 · Közép", cim: "Vízerőmű", feladat: R`<p>Egy vízerőműben másodpercenként 200 m³ víz esik 15 m-t, a hatásfok 85%. Mekkora az elektromos teljesítmény?</p>`,
        megoldas: R`<p>$P = 0{,}85\cdot 1000\cdot 9{,}81\cdot 15\cdot 200 \approx 25\ \mathrm{MW}$.</p>` },
    ],
    hibak: [["kW és kWh", "A kW teljesítmény, a kWh energia (munka). A villanyszámla kWh-t mér."], ["Napelem", "Az 1000 W/m² csúcsérték; az átlagos hazai éves besugárzás ennek töredéke."]],
    erettsegi: [
      ["Feleletválasztós (I.)", "Melyik forrás megújuló; erőművek energiaátalakítási láncai; hatásfokok nagyságrendje."],
      ["Témakifejtés (II.)", "Energiaforrások és környezeti hatásaik; az atomerőmű és a hőerőmű összehasonlítása; megújuló energiák."],
      ["Összetett feladatok (III.)", "Napelem-, víz- vagy szélerőmű teljesítménye, fogyasztás és költség; gyakran szöveges elemzés adatsorral."],
    ],
    feladatok: [
      { id: "eng-01", szint: 1, tipus: "mc", pont: 2, cim: "Megújuló forrás", szoveg: R`Melyik NEM megújuló energiaforrás?`,
        opciok: ["Szélenergia", "Geotermikus energia", "Földgáz", "Biomassza"], helyes: 2, tippek: ["Melyik készlete fogy el emberi időléptékben?"], megoldas: R`A földgáz fosszilis energiahordozó: évmilliók alatt keletkezett, készlete véges.` },
      { id: "eng-02", szint: 2, tipus: "num", pont: 2, cim: "Vízforraló fogyasztása", szoveg: R`Mennyi elektromos energiát fogyaszt egy 2,0 kW-os vízforraló 5,0 perc alatt? kWh-ban add meg!`,
        valasz: 0.16667, egyseg: "kWh", tol: 0.01, tippek: ["5 perc = 1/12 óra."], megoldas: R`$W = 2{,}0\ \mathrm{kW}\cdot \tfrac{5}{60}\ \mathrm h \approx 0{,}167\ \mathrm{kWh}$.` },
      { id: "eng-03", szint: 2, tipus: "num", pont: 2, cim: "Napelemtábla", szoveg: R`Mekkora teljesítményt ad egy 1,6 m²-es, 20%-os hatásfokú napelem 1000 W/m² intenzitású napsütésben?`,
        valasz: 320, egyseg: "W", tol: 0.01, tippek: ["$P = \\eta IA$"], megoldas: R`$P = 0{,}2\cdot 1000\cdot 1{,}6 = 320\ \mathrm W$.` },
    ],
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
