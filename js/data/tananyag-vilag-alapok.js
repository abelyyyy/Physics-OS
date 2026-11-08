/* PHYSICS OS — tananyag: 7. Világegyetem · 0. Alapok */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const R = String.raw;
  const L = PO.lesson;
  const sum = (items, f) => R`<div class="grid g2"><div class="panel"><div class="panel-title">Kulcsgondolatok</div><ul class="small">${items.map((i) => "<li>" + i + "</li>").join("")}</ul></div><div class="panel"><div class="panel-title">Képletek</div>${f}</div></div>`;

  /* =============================== NAPRENDSZER =============================== */
  L({
    id: "naprendszer", parent: "vilagegyetem", nev: "Naprendszer, Föld–Hold", alcim: "Bolygók, holdfázisok, fogyatkozások, évszakok",
    elofeltetel: ["Gravitáció"],
    kulcsszavak: "naprendszer bolygó kőzetbolygó gázóriás hold holdfázis fogyatkozás napfogyatkozás holdfogyatkozás évszak tengelyferdeség árapály üstökös kisbolygó csillagászati egység",
    attekintes: R`<p class="lead">A Naprendszer a Napból, nyolc bolygóból, holdakból, kisbolygókból és üstökösökből áll. A Föld–Hold rendszer mozgásai magyarázzák a holdfázisokat, a fogyatkozásokat, az árapályt és az évszakokat.</p>`,
    elmelet: R`<div class="prose">
<h3>A Naprendszer felépítése</h3><p>Belső kőzetbolygók (Merkúr, Vénusz, Föld, Mars), kisbolygóöv, külső gázóriások (Jupiter, Szaturnusz) és jégóriások (Uránusz, Neptunusz), Kuiper-öv, Oort-felhő. 1 CSE (csillagászati egység) = a Föld–Nap távolság ≈ $1{,}5\cdot 10^{11}$ m; a napfény ≈ 8,3 perc alatt ér ide. A bolygók mozgását Kepler törvényei írják le.</p>
<h3>Holdfázisok</h3><p>A Hold mindig félig meg van világítva; a fázis attól függ, a megvilágított félből mennyit látunk. Újhold: a Hold a Föld és a Nap között; telihold: a Föld van középen. Szinodikus hónap ≈ 29,5 nap. A Hold kötött tengelyforgású – mindig ugyanazt az oldalát látjuk.</p>
<h3>Fogyatkozások</h3><p>Napfogyatkozás: újholdkor, a Hold árnyéka a Földre esik. Holdfogyatkozás: teliholdkor, a Hold a Föld árnyékába kerül (vörösesen látszik – a földi légkör megtöri a vörös fényt). Nem minden hónapban van, mert a Hold pályasíkja ≈ 5°-kal hajlik az ekliptikához.</p>
<h3>Évszakok, árapály</h3><p>Az évszakokat a Föld tengelyferdesége (23,5°) okozza – nem a Nap-távolság változása (napközelben, januárban van tél az északi féltekén!). Árapály: a Hold (és a Nap) gravitációs vonzásának különbsége a Föld két oldalán – naponta két dagály.</p></div>`,
    peldak: [{ szint: "3 · Közép", cim: "Mars keringési ideje", feladat: R`<p>A Mars átlagos naptávolsága 1,52 CSE. Mennyi a keringési ideje?</p>`, megoldas: R`<p>Kepler III. (CSE-ben és években): $T^2 = a^3$, $T = 1{,}52^{1{,}5} \approx 1{,}87$ év.</p>` }],
    hibak: [["Évszakok", "Nem a Nap-távolság, hanem a tengelyferdeség okozza."], ["Holdfázis", "Nem a Föld árnyéka okozza (az a holdfogyatkozás)."]],
    osszefoglalo: sum(["Holdfázis: a megvilágított fél látható része.", "Évszakok: tengelyferdeség."], R`$$\frac{a^3}{T^2} = \text{áll.} \qquad 1\ \mathrm{CSE} = 1{,}5\cdot 10^{11}\ \mathrm m$$`),
    erettsegi: [["Feleletválasztós (I.)", "Holdfázisok, fogyatkozások feltétele, évszakok oka, bolygók jellemzői."], ["Témakifejtés (II.)", "A Naprendszer; a Föld és a Hold mozgásai; űrkutatás."]],
    feladatok: [
      { id: "nap-01", szint: 1, tipus: "mc", pont: 2, cim: "Évszakok oka", szoveg: R`Mi okozza a földi évszakokat?`, opciok: ["A Föld–Nap távolság változása.", "A Föld forgástengelyének ferdesége.", "A Hold vonzása.", "A Nap aktivitásának változása."], helyes: 1, tippek: ["Januárban van a Föld a legközelebb a Naphoz."], megoldas: R`A 23,5°-os tengelyferdeség miatt változik a napsugarak beesési szöge és a nappalok hossza.` },
      { id: "nap-02", szint: 2, tipus: "num", pont: 2, cim: "A napfény útja", szoveg: R`Mennyi idő alatt ér a Földre a napfény? (1,5·10¹¹ m, c = 3·10⁸ m/s) s-ban!`, valasz: 500, egyseg: "s", tol: 0.01, tippek: ["$t = s/c$"], megoldas: R`$t = 500\ \mathrm s \approx 8{,}3$ perc.` },
      { id: "nap-03", szint: 3, tipus: "num", pont: 3, cim: "Mars éve", szoveg: R`A Mars pályájának fél nagytengelye 1,52 CSE. Hány földi év a keringési ideje?`, valasz: 1.874, egyseg: "év", tol: 0.01, tippek: ["$T^2 = a^3$ CSE-ben és években"], megoldas: R`$T = 1{,}52^{3/2} \approx 1{,}87$ év.` },
    ],
  });

  /* =============================== CSILLAGOK =============================== */
  L({
    id: "csillagok", parent: "vilagegyetem", nev: "Csillagok, csillagfejlődés", alcim: "Hogyan sugároznak, hogyan születnek és halnak meg a csillagok",
    elofeltetel: ["Atommag", "Hőtan"],
    kulcsszavak: "csillag nap fúzió luminozitás hőmérséklet szín wien stefan-boltzmann hertzsprung-russell fősorozat vörös óriás fehér törpe szupernóva neutroncsillag fekete lyuk parallaxis fényév",
    attekintes: R`<p class="lead">A csillagok forró gázgömbök, amelyek magjában hidrogén alakul héliummá. Színükből a hőmérsékletük, fényességükből és távolságukból a teljesítményük következik; tömegük dönti el sorsukat.</p>`,
    elmelet: R`<div class="prose">
<h3>A csillagok sugárzása</h3><p>Közelítőleg feketetest-sugárzók. <strong>Wien</strong>: $\lambda_{max}T = 2{,}9\cdot 10^{-3}$ m·K – a vörös csillag hideg (~3000 K), a kék forró (> 10 000 K). <strong>Stefan–Boltzmann</strong>: $P = \sigma A T^4$. A színképvonalakból az összetétel, a Doppler-eltolódásból a radiális sebesség határozható meg.</p>
<h3>Távolságok</h3><p>Fényév ≈ $9{,}46\cdot 10^{15}$ m; parszek ≈ 3,26 fényév. Közeli csillagok távolsága parallaxissal mérhető.</p>
<h3>Hertzsprung–Russell-diagram</h3><p>Luminozitás a felszíni hőmérséklet függvényében: fősorozat (hidrogént égető csillagok, köztük a Nap), vörös óriások, fehér törpék.</p>
<h3>Csillagfejlődés</h3><p>Gáz- és porfelhő gravitációs összehúzódása → protocsillag → fúzió beindul → fősorozat (a Nap ≈ 10 milliárd évig). Kis tömegű csillag: vörös óriás → planetáris köd → fehér törpe. Nagy tömegű: szuperóriás → szupernóva-robbanás → neutroncsillag vagy fekete lyuk. A vasnál nehezebb elemek szupernóvákban és neutroncsillag-ütközésekben keletkeznek – „csillagporból vagyunk”.</p>
<h3>A Nap</h3><p>Felszíne ≈ 5800 K, magja ≈ 15 millió K. Energiaforrása a proton–proton ciklus (4 ¹H → ⁴He); másodpercenként ≈ 4 millió tonna tömeg alakul energiává ($P \approx 3{,}8\cdot 10^{26}$ W).</p></div>`,
    peldak: [{ szint: "4 · Emelt", cim: "A Nap tömegvesztése", feladat: R`<p>A Nap teljesítménye $3{,}8\cdot 10^{26}$ W. Mennyi tömeget veszít másodpercenként?</p>`, megoldas: R`<p>$\Delta m = \dfrac{P}{c^2} = \dfrac{3{,}8\cdot 10^{26}}{9\cdot 10^{16}} \approx 4{,}2\cdot 10^9\ \mathrm{kg}$ – 4,2 millió tonna másodpercenként, ami a Nap tömegéhez képest elhanyagolható.</p>` }],
    hibak: [["Szín és hőmérséklet", "A vörös csillag hidegebb, a kék melegebb (fordítva, mint a csapon)."], ["Kelvin", "Wien- és Stefan–Boltzmann-törvényben kelvin kell."]],
    osszefoglalo: sum(["A csillag színe ↔ felszíni hőmérséklet.", "A tömeg dönti el a csillag sorsát."], R`$$\lambda_{max}T = b \qquad P = \sigma AT^4 \qquad \Delta m = \frac P{c^2}$$`),
    erettsegi: [["Feleletválasztós (I.)", "Csillagok színe és hőmérséklete, fejlődési állapotok sorrendje, a Nap energiaforrása."], ["Témakifejtés (II.)", "A csillagok fejlődése; a Nap mint csillag."]],
    feladatok: [
      { id: "csi-01", szint: 1, tipus: "mc", pont: 2, cim: "Csillag színe", szoveg: R`Melyik csillag felszíne a legforróbb?`, opciok: ["vörös", "narancssárga", "sárga", "kékesfehér"], helyes: 3, tippek: ["Wien-törvény: magasabb T → rövidebb λ."], megoldas: R`Minél forróbb, annál rövidebb hullámhosszon sugároz a legerősebben: a kékesfehér a legforróbb.` },
      { id: "csi-02", szint: 2, tipus: "num", pont: 2, cim: "Wien-törvény", szoveg: R`Melyik hullámhosszon sugároz legerősebben az 5800 K felszíni hőmérsékletű Nap? ($b = 2{,}9\cdot 10^{-3}$ m·K) nm-ben!`, valasz: 500, egyseg: "nm", tol: 0.01, tippek: ["$\\lambda = b/T$"], megoldas: R`$\lambda = 2{,}9\cdot 10^{-3}/5800 = 5\cdot 10^{-7}\ \mathrm m = 500\ \mathrm{nm}$.` },
      { id: "csi-03", szint: 3, tipus: "num", pont: 2, cim: "Kétszeres hőmérséklet", szoveg: R`Hányszorosára nő egy csillag kisugárzott teljesítménye, ha sugara nem változik, de felszíni hőmérséklete kétszeresére nő?`, valasz: 16, egyseg: "×", tol: 0.01, tippek: ["$P \\propto T^4$"], megoldas: R`$2^4 = 16$.` },
    ],
  });

  /* =============================== KOZMOLÓGIA =============================== */
  L({
    id: "kozmologia", parent: "vilagegyetem", nev: "Galaxisok, táguló Univerzum", alcim: "Tejútrendszer, Hubble-törvény, ősrobbanás",
    elofeltetel: ["Csillagok", "Doppler-effektus"],
    kulcsszavak: "galaxis tejútrendszer hubble törvény vöröseltolódás táguló univerzum ősrobbanás kozmikus háttérsugárzás sötét anyag sötét energia világegyetem kora",
    attekintes: R`<p class="lead">Galaxisok milliárdjai távolodnak egymástól, annál gyorsabban, minél messzebb vannak: az Univerzum tágul. Visszafelé követve egy forró, sűrű kezdeti állapothoz jutunk – az ősrobbanáshoz.</p>`,
    elmelet: R`<div class="prose">
<h3>Galaxisok</h3><p>A Tejútrendszer ≈ 100 000 fényév átmérőjű spirálgalaxis, 100–400 milliárd csillaggal; a Nap a centrumtól ≈ 26 000 fényévre. Galaxistípusok: spirál, elliptikus, szabálytalan. Legközelebbi nagy szomszéd: Androméda (2,5 millió fényév).</p>
<h3>Hubble-törvény</h3><p>$$v = H_0\,d, \qquad H_0 \approx 70\ \mathrm{\frac{km/s}{Mpc}}$$ A távolodási sebességet a színképvonalak vöröseltolódásából mérjük. Nem a galaxisok „repülnek szét” egy középpontból – maga a tér tágul, minden pontból nézve ugyanígy.</p>
<h3>Az ősrobbanás bizonyítékai</h3><ul><li>a táguló Univerzum (Hubble, 1929);</li><li>a kozmikus mikrohullámú háttérsugárzás (≈ 2,7 K, Penzias és Wilson, 1965) – a forró korai Univerzum lehűlt fénye;</li><li>a könnyű elemek (H, He) gyakorisága.</li></ul><p>Az Univerzum kora ≈ 13,8 milliárd év ($1/H_0$ jó becslés). A gravitációs hatásokból következő <strong>sötét anyag</strong> és a gyorsuló tágulást okozó <strong>sötét energia</strong> természete ma is nyitott kérdés.</p></div>`,
    peldak: [{ szint: "3 · Közép", cim: "Az Univerzum kora", feladat: R`<p>Becsüld meg az Univerzum korát $H_0 = 70$ km/s/Mpc alapján! (1 Mpc = $3{,}09\cdot 10^{19}$ km)</p>`,
      megoldas: R`<p>$t \approx \dfrac1{H_0} = \dfrac{3{,}09\cdot 10^{19}\ \mathrm{km}}{70\ \mathrm{km/s}} \approx 4{,}4\cdot 10^{17}\ \mathrm s \approx 14$ milliárd év.</p>` }],
    hibak: [["A tágulás középpontja", "Nincs középpont: minden galaxisból nézve a többi távolodik."], ["Mértékegység", "km/s/Mpc → 1/s átváltáshoz a Mpc-t km-re kell váltani."]],
    osszefoglalo: sum(["Vöröseltolódás → távolodás → tágulás.", "Háttérsugárzás: az ősrobbanás „visszhangja”."], R`$$v = H_0 d \qquad t \approx \frac1{H_0}$$`),
    erettsegi: [["Feleletválasztós (I.)", "A Hubble-törvény értelmezése, az ősrobbanás bizonyítékai, a Tejútrendszer szerkezete."], ["Témakifejtés (II.)", "A világegyetem kialakulása és fejlődése; a kozmológia megfigyelési alapjai."]],
    feladatok: [
      { id: "koz-01", szint: 1, tipus: "mc", pont: 2, cim: "Vöröseltolódás", szoveg: R`Mit jelent, hogy a távoli galaxisok színképvonalai a vörös felé tolódnak?`, opciok: ["A galaxisok hidegebbek.", "A galaxisok távolodnak tőlünk.", "A galaxisok közelednek.", "A galaxisok vörös csillagokból állnak."], helyes: 1, tippek: ["Doppler-effektus"], megoldas: R`Távolodó forrás fényének hullámhossza megnő (Doppler) – a tér tágulása miatt.` },
      { id: "koz-02", szint: 2, tipus: "num", pont: 2, cim: "Távolodási sebesség", szoveg: R`Mekkora sebességgel távolodik egy 100 Mpc távolságú galaxis? ($H_0 = 70$ km/s/Mpc) km/s-ban!`, valasz: 7000, egyseg: "km/s", tol: 0.01, tippek: ["$v = H_0 d$"], megoldas: R`$v = 70\cdot 100 = 7000\ \mathrm{km/s}$.` },
      { id: "koz-03", szint: 4, tipus: "num", pont: 3, cim: "Hubble-idő", szoveg: R`Becsüld meg az Univerzum korát $1/H_0$ alapján, ha $H_0 = 70$ km/s/Mpc! (1 Mpc = $3{,}086\cdot 10^{19}$ km, 1 év = $3{,}156\cdot 10^7$ s) milliárd évben!`, valasz: 13.97, egyseg: "milliárd év", tol: 0.01, tippek: ["Váltsd a Mpc-t km-re, így $H_0$ 1/s-ban adódik."], megoldas: R`$1/H_0 = 3{,}086\cdot 10^{19}/70 \approx 4{,}41\cdot 10^{17}\ \mathrm s \approx 14{,}0$ milliárd év.` },
    ],
  });

  /* =============================== ALAPOK =============================== */
  L({
    id: "si", parent: "alapok", nev: "SI-mértékegységek, prefixumok, átváltás", alcim: "A számolás biztos alapja", szint: "Alapozás",
    kulcsszavak: "si mértékegység alapmennyiség prefixum kilo mega mikro nano átváltás normálalak dimenzióanalízis",
    attekintes: R`<p class="lead">A legtöbb pontot nem a fizika, hanem az átváltás buktatja el. Számolás előtt minden mennyiséget SI-be váltunk, és a végén ellenőrizzük az eredmény mértékegységét.</p>`,
    elmelet: R`<div class="prose">
<h3>Az SI hét alapmennyisége</h3><p>hossz (m), tömeg (kg), idő (s), áramerősség (A), hőmérséklet (K), anyagmennyiség (mol), fényerősség (cd). Minden más ezekből származik: pl. N = kg·m/s², J = N·m, W = J/s, Pa = N/m², V = W/A.</p>
<h3>Prefixumok</h3><table class="data"><tbody><tr><td>G giga $10^9$</td><td>M mega $10^6$</td><td>k kilo $10^3$</td><td>c centi $10^{-2}$</td></tr><tr><td>m milli $10^{-3}$</td><td>μ mikro $10^{-6}$</td><td>n nano $10^{-9}$</td><td>p piko $10^{-12}$</td></tr></tbody></table>
<h3>Hatványozott egységek</h3><p>1 cm² = $10^{-4}$ m², 1 mm² = $10^{-6}$ m², 1 cm³ = $10^{-6}$ m³, 1 dm³ = 1 l = $10^{-3}$ m³. A prefixum is hatványozódik!</p>
<h3>Gyakori átváltások</h3><p>km/h ÷ 3,6 = m/s; 1 g/cm³ = 1000 kg/m³; 1 kWh = 3,6 MJ; 1 eV = $1{,}6\cdot 10^{-19}$ J; 1 bar = $10^5$ Pa; °C + 273 = K. Az Adatok menü átváltója mindegyiket tudja.</p>
<h3>Dimenzióanalízis</h3><p>Egy képlet két oldalának mértékegysége meg kell egyezzen – ezzel sok hiba kiszűrhető. Pl. $\sqrt{2gh}$: $\sqrt{\mathrm{m/s^2\cdot m}} = \mathrm{m/s}$ ✓.</p></div>`,
    hibak: [["Négyzetes egység", "1 cm² ≠ 0,01 m², hanem 0,0001 m²."], ["Tömeg", "Az SI-alapegység a kg, nem a g."]],
    feladatok: [
      { id: "si-01", szint: 1, tipus: "mc", pont: 1, cim: "Mikro", szoveg: R`Mennyit jelent a μ (mikro) prefixum?`, opciok: ["$10^{-3}$", "$10^{-6}$", "$10^{-9}$", "$10^{6}$"], helyes: 1, tippek: [], megoldas: R`μ = $10^{-6}$.` },
      { id: "si-02", szint: 1, tipus: "num", pont: 1, cim: "km/h", szoveg: R`Hány m/s a 72 km/h?`, valasz: 20, egyseg: "m/s", tol: 0.01, tippek: ["÷ 3,6"], megoldas: R`$72/3{,}6 = 20\ \mathrm{m/s}$.` },
      { id: "si-03", szint: 2, tipus: "num", pont: 1, cim: "Sűrűség", szoveg: R`Az alumínium sűrűsége 2,7 g/cm³. Hány kg/m³ ez?`, valasz: 2700, egyseg: "kg/m³", tol: 0.01, tippek: ["1 g/cm³ = 1000 kg/m³"], megoldas: R`2700 kg/m³.` },
    ],
  });

  L({
    id: "vektorok", parent: "alapok", nev: "Vektorok, szögfüggvények", alcim: "Felbontás, összegzés, szögfüggvények", szint: "Alapozás",
    kulcsszavak: "vektor skalár komponens felbontás eredő összeadás szinusz koszinusz tangens pitagorasz koszinusztétel",
    attekintes: R`<p class="lead">Az erő, a sebesség, a gyorsulás vektor: nagysága és iránya is van. A legtöbb feladat úgy oldható meg, hogy a vektorokat egymásra merőleges összetevőkre bontjuk.</p>`,
    elmelet: R`<div class="prose">
<h3>Felbontás</h3><p>Egy $F$ nagyságú, a vízszintessel $\alpha$ szöget bezáró vektor összetevői: $F_x = F\cos\alpha$, $F_y = F\sin\alpha$. Vissza: $F = \sqrt{F_x^2 + F_y^2}$, $\tan\alpha = F_y/F_x$.</p>
<h3>Összegzés</h3><p>Komponensenként: $\vec R = (\sum F_x, \sum F_y)$. Két vektor esetén koszinusztétellel: $R^2 = F_1^2 + F_2^2 + 2F_1F_2\cos\varphi$, ahol $\varphi$ a két vektor által <b>közös kezdőpontból mérve</b> bezárt szög (0° = azonos irány, az eredő a legnagyobb; 180° = ellentétes irány; 90° = Pitagorasz).</p>
<p><b>Miért plusz, és mikor mínusz?</b> A háromszög-szerkesztésnél a második vektort az első <i>végéhez</i> toljuk. Ekkor a háromszög belső szöge $\gamma = 180° - \varphi$, és a hagyományos koszinusztétel $R^2 = F_1^2 + F_2^2 - 2F_1F_2\cos\gamma$. Mivel $\cos(180° - \varphi) = -\cos\varphi$, a két alak ugyanaz: a mínusz a háromszög belső szögéhez tartozik, a plusz a vektorok szögéhez. Feladatban mindig az a kérdés, melyik szöget adták meg.</p>
<h3>Hasznos értékek</h3><table class="data"><thead><tr><th></th><th>0°</th><th>30°</th><th>45°</th><th>60°</th><th>90°</th></tr></thead><tbody><tr><td>sin</td><td>0</td><td>0,5</td><td>0,707</td><td>0,866</td><td>1</td></tr><tr><td>cos</td><td>1</td><td>0,866</td><td>0,707</td><td>0,5</td><td>0</td></tr></tbody></table>
<p>Kis szögekre (radiánban): $\sin x \approx \tan x \approx x$. Számológép: fok (DEG) vagy radián (RAD) mód!</p></div>`,
    hibak: [["Szögmód", "Fokban adott szögnél DEG mód; $\\omega t$ számolásnál RAD."], ["Merőleges vektorok", "Eredő: Pitagorasz – nem egyszerű összeg."]],
    feladatok: [
      { id: "vek-01", szint: 1, tipus: "mc", pont: 1, cim: "Merőleges erők", szoveg: R`Egy testre 3 N és 4 N nagyságú, egymásra merőleges erő hat. Mekkora az eredő?`, opciok: ["1 N", "5 N", "7 N", "12 N"], helyes: 1, tippek: ["Pitagorasz"], megoldas: R`$\sqrt{9 + 16} = 5\ \mathrm N$.` },
      { id: "vek-02", szint: 2, tipus: "num", pont: 1, cim: "Vízszintes összetevő", szoveg: R`Mekkora a vízszintessel 30°-ot bezáró 10 N-os erő vízszintes összetevője?`, valasz: 8.66, egyseg: "N", tol: 0.01, tippek: ["$F\\cos\\alpha$"], megoldas: R`$10\cos30° \approx 8{,}66\ \mathrm N$.` },
      { id: "vek-03", szint: 3, tipus: "num", pont: 2, cim: "Két erő eredője", szoveg: R`Mekkora a 6 N és 8 N nagyságú, egymással 60°-os szöget bezáró erők eredője?`, valasz: 12.166, egyseg: "N", tol: 0.01, tippek: ["$R^2 = F_1^2 + F_2^2 + 2F_1F_2\\cos\\varphi$ (φ: a vektorok szöge)"], megoldas: R`$R = \sqrt{36 + 64 + 48} \approx 12{,}2\ \mathrm N$.` },
    ],
  });

  L({
    id: "meresi-hiba", parent: "alapok", nev: "Mérési hiba, értékes jegyek", alcim: "Mennyire bízhatunk egy mérésben?", szint: "Alapozás (szóbelin fontos!)",
    kulcsszavak: "mérési hiba abszolút relatív szisztematikus véletlen átlag szórás értékes jegy kerekítés hibaterjedés",
    attekintes: R`<p class="lead">Minden mérésnek van hibája. A szóbeli mérési feladatnál pontot ér, ha meg tudod becsülni a hibát, és meg tudod mondani, mi okozza.</p>`,
    elmelet: R`<div class="prose">
<h3>Hibafajták</h3><p><strong>Véletlen hiba</strong>: ismételt méréskor szóródnak az eredmények – több mérés átlagával csökkenthető. <strong>Szisztematikus hiba</strong>: mindig ugyanabba az irányba torzít (rosszul nullázott műszer, elhanyagolt súrlódás, reakcióidő) – átlagolással nem csökken.</p>
<h3>Abszolút és relatív hiba</h3><p>Eredmény: $x = \bar x \pm \Delta x$. Relatív hiba: $\dfrac{\Delta x}{\bar x}$ (%). Becslés: a skála legkisebb osztásának fele, vagy a mérések szórása (max. eltérés az átlagtól).</p>
<h3>Hibaterjedés (egyszerű szabályok)</h3><ul><li>Összeg, különbség: az abszolút hibák összeadódnak.</li><li>Szorzat, hányados: a relatív hibák összeadódnak.</li><li>Hatvány: $x^n$ relatív hibája $n$-szeres.</li></ul><p>Példa: inga $g = 4\pi^2 l/T^2$: $\dfrac{\Delta g}{g} = \dfrac{\Delta l}{l} + 2\dfrac{\Delta T}{T}$ – az időmérés hibája kétszeresen számít, ezért mérünk 10 lengést.</p>
<h3>Értékes jegyek</h3><p>Az eredményt annyi értékes jegyre adjuk meg, amennyire az adatok pontosak (általában a legkevésbé pontos adat szerint). 0,0250: 3 értékes jegy (a vezető nullák nem számítanak, a záró nulla igen).</p></div>`,
    hibak: [["Túl sok jegy", "A 9,81234567 m/s² nem pontosabb mérés, csak rossz kerekítés."], ["Szisztematikus hiba", "Átlagolással nem tűnik el."]],
    feladatok: [
      { id: "mh-01", szint: 1, tipus: "mc", pont: 1, cim: "Értékes jegyek", szoveg: R`Hány értékes jegyet tartalmaz a 0,0250?`, opciok: ["2", "3", "4", "5"], helyes: 1, tippek: ["A vezető nullák nem számítanak."], megoldas: R`2, 5, 0 – három értékes jegy.` },
      { id: "mh-02", szint: 2, tipus: "num", pont: 1, cim: "Relatív hiba", szoveg: R`Egy hosszúság mérési eredménye 2,0 m ± 0,1 m. Mekkora a relatív hiba? %-ban!`, valasz: 5, egyseg: "%", tol: 0.01, tippek: ["$\\Delta x / x$"], megoldas: R`$0{,}1/2{,}0 = 5\%$.` },
      { id: "mh-03", szint: 3, tipus: "num", pont: 2, cim: "Tíz lengés", szoveg: R`10 lengés idejét 20,0 s ± 0,2 s-nak mérjük. Mekkora egy lengés idejének abszolút hibája? s-ban!`, valasz: 0.02, egyseg: "s", tol: 0.01, tippek: ["Osztáskor az abszolút hiba is osztódik."], megoldas: R`$T = 2{,}00 \pm 0{,}02\ \mathrm s$ – tízszer pontosabb, mint egy lengés mérése.` },
    ],
  });

  L({
    id: "grafikonok", parent: "alapok", nev: "Grafikonok, meredekség, terület, linearizálás", alcim: "Hogyan olvass ki fizikát egy grafikonból", szint: "Alapozás (írásbelin és szóbelin is)",
    kulcsszavak: "grafikon meredekség terület linearizálás egyenes illesztés tengelymetszet arányosság fordított arányosság négyzetes",
    attekintes: R`<p class="lead">A fizikai grafikonok két legfontosabb jellemzője a <strong>meredekség</strong> és a <strong>görbe alatti terület</strong>. Mérési adatokból a keresett mennyiséget leggyakrabban egy egyenes meredekségéből kapjuk.</p>`,
    elmelet: R`<div class="prose">
<h3>Meredekség és terület</h3><table class="data"><thead><tr><th>Grafikon</th><th>Meredekség</th><th>Terület</th></tr></thead><tbody>
<tr><td>x–t</td><td>sebesség</td><td>–</td></tr><tr><td>v–t</td><td>gyorsulás</td><td>elmozdulás</td></tr><tr><td>a–t</td><td>–</td><td>sebességváltozás</td></tr><tr><td>F–s</td><td>(rugónál: D)</td><td>munka</td></tr><tr><td>F–t</td><td>–</td><td>lendületváltozás</td></tr><tr><td>p–V</td><td>–</td><td>munka</td></tr><tr><td>U–I</td><td>ellenállás (ill. −R_b)</td><td>–</td></tr><tr><td>P–t</td><td>–</td><td>energia</td></tr></tbody></table>
<p>A meredekséget mindig a grafikon két, egymástól távoli pontjából számold, mértékegységgel.</p>
<h3>Linearizálás</h3><p>Ha két mennyiség nem lineárisan függ össze, alkalmas változókat ábrázolva egyenest kapunk:</p><ul>
<li>Inga: $T^2 = \dfrac{4\pi^2}{g}\,l$ → $T^2$–$l$ egyenes, meredeksége $4\pi^2/g$.</li><li>Rugó: $T^2 = \dfrac{4\pi^2}{D}m$.</li><li>Szabadesés: $h = \tfrac g2 t^2$ → $h$–$t^2$.</li><li>Hatványfüggvény $y = ax^n$: $\lg y$–$\lg x$ egyenes, meredeksége $n$.</li><li>Exponenciális (bomlás): $\ln N$–$t$ egyenes, meredeksége $-\lambda$.</li></ul>
<p>A Mérések menü adatfeldolgozója ezeket automatikusan elvégzi és egyenest illeszt.</p></div>`,
    hibak: [["Meredekség", "Két mért pont helyett az illesztett egyenes két távoli pontjából számolj."], ["Egység", "A meredekségnek is van mértékegysége."]],
    feladatok: [
      { id: "gra2-01", szint: 1, tipus: "mc", pont: 1, cim: "v–t terület", szoveg: R`Mit ad meg a v–t grafikon alatti terület?`, opciok: ["a gyorsulást", "az elmozdulást", "az átlagsebességet", "az időt"], helyes: 1, tippek: ["$s = v\\cdot t$ egyenletes mozgásnál"], megoldas: R`Az elmozdulást.` },
      { id: "gra2-02", szint: 2, tipus: "num", pont: 1, cim: "Meredekség", szoveg: R`Egy egyenes átmegy az (1; 3) és az (5; 11) pontokon. Mekkora a meredeksége?`, valasz: 2, egyseg: "", tol: 0.01, tippek: ["$\\Delta y/\\Delta x$"], megoldas: R`$(11 - 3)/(5 - 1) = 2$.` },
      { id: "gra2-03", szint: 3, tipus: "num", pont: 2, cim: "Inga linearizálva", szoveg: R`Egy ingás mérésben a $T^2$–$l$ egyenes meredeksége 4,03 s²/m. Mekkora a nehézségi gyorsulás?`, valasz: 9.796, egyseg: "m/s²", tol: 0.01, tippek: ["meredekség = $4\\pi^2/g$"], megoldas: R`$g = 4\pi^2/4{,}03 \approx 9{,}80\ \mathrm{m/s^2}$.` },
    ],
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
