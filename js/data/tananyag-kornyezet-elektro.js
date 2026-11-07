/* PHYSICS OS — tananyag: 3. Víz, levegő, környezet · 4. Elektromosság */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const R = String.raw;
  const L = PO.lesson;
  const sum = (items, f) => R`<div class="grid g2"><div class="panel"><div class="panel-title">Kulcsgondolatok</div><ul class="small">${items.map((i) => "<li>" + i + "</li>").join("")}</ul></div><div class="panel"><div class="panel-title">Képletek</div>${f}</div></div>`;

  /* =============================== HIDROSZTATIKA =============================== */
  L({
    id: "hidrosztatika", parent: "kornyezet", nev: "Nyomás, hidrosztatika, felhajtóerő", alcim: "Nyugvó folyadékok és gázok",
    elofeltetel: ["Dinamika"],
    kulcsszavak: "nyomás hidrosztatikai nyomás pascal törvény hidraulika felhajtóerő arkhimédész úszás lebegés sűrűség közlekedőedények légnyomás",
    attekintes: R`<p class="lead">A folyadékok és gázok minden irányban nyomást fejtenek ki. A mélységgel növekvő nyomásból ered a felhajtóerő – ezért úszik a hajó és száll a léggömb.</p>
<div class="prose"><ul><li>a nyomás fogalma, Pascal törvénye, hidraulikus gépek;</li><li>a hidrosztatikai nyomás és a közlekedőedények;</li><li>Arkhimédész törvénye: úszás, lebegés, merülés;</li><li>a légnyomás és mérése (Torricelli).</li></ul></div>
<div class="callout"><div class="callout-t">Szemléletesen</div>A felhajtóerő nem „varázslat”: a test alsó lapját mélyebben, tehát nagyobb nyomás éri, mint a felsőt. A két nyomóerő különbsége a felhajtóerő – és ez pontosan a kiszorított víz súlya.</div>`,
    elmelet: R`<div class="prose">
<h3>Nyomás, Pascal törvénye</h3><p>$p = F/A$, mértékegysége a pascal (1 Pa = 1 N/m²); 1 bar = $10^5$ Pa. Zárt folyadékban a külső nyomás változatlanul, minden irányban terjed (<strong>Pascal</strong>). Hidraulikus emelő, fék: $F_1/A_1 = F_2/A_2$ – erőt nyerünk, utat vesztünk.</p>
<h3>Hidrosztatikai nyomás</h3><p>$$p = p_0 + \rho g h$$ Csak a mélységtől és a folyadék sűrűségétől függ, az edény alakjától nem (<strong>hidrosztatikai paradoxon</strong>). Ezért azonos szinten áll a víz a közlekedőedényekben (vízszint, kannák, zsilip, vízmérték). Két, nem keveredő folyadék U-csőben: $\rho_1h_1 = \rho_2h_2$ – sűrűségmérés.</p>
<h3>Arkhimédész törvénye</h3><p>$$F_f = \rho_{folyadék}\,V_{bemerült}\,g$$ A folyadékba (gázba) merülő testre a kiszorított közeg súlyával egyenlő felhajtóerő hat. <strong>Úszik</strong>, ha $\rho_{test} < \rho_{f}$ (ekkor csak részben merül be, $F_f = mg$), <strong>lebeg</strong>, ha egyenlőek, <strong>elmerül</strong>, ha nagyobb. Alkalmazás: hajó, tengeralattjáró (ballaszttartály), léggömb, areométer, a sűrűségmérés (szóbeli mérés: a test súlya levegőben és vízbe merítve).</p>
<h3>Légnyomás</h3><p>A levegő súlyából ered; tengerszinten ≈ 101 kPa (Torricelli 760 mm-es higanyoszlopa, magdeburgi féltekék). A magassággal csökken – nem lineárisan, mert a levegő összenyomható.</p></div>`,
    peldak: [
      { szint: "3 · Közép", cim: "Sűrűségmérés rugós erőmérővel", feladat: R`<p>Egy kő súlya levegőben 3,0 N, vízbe merítve 1,9 N. Mekkora a sűrűsége? Egy ismeretlen folyadékba merítve 2,1 N-t mutat az erőmérő. Mekkora a folyadék sűrűsége?</p>`,
        megoldas: R`<p>Vízben a felhajtóerő $1{,}1\ \mathrm N = \rho_v V g$, így $V = \dfrac{1{,}1}{1000\cdot 9{,}81}$. A kő sűrűsége: $\rho = \dfrac{G}{Vg} = \rho_v\dfrac{G}{G - G_v} = 1000\cdot\dfrac{3{,}0}{1{,}1} \approx 2700\ \mathrm{kg/m^3}$.</p><p>Folyadékban: $F_f' = 0{,}9\ \mathrm N$, $\rho_f = \rho_v\dfrac{0{,}9}{1{,}1} \approx 820\ \mathrm{kg/m^3}$ – a térfogat ki sem kellett. Ez a szóbeli sűrűségmérés elve.</p>` },
      { szint: "4 · Emelt", cim: "Jéghegy", feladat: R`<p>A jég sűrűsége 917 kg/m³, a tengervízé 1025 kg/m³. A jéghegy térfogatának hányad része van a víz felett?</p>`,
        megoldas: R`<p>Úszás: $\rho_j V g = \rho_v V_b g \Rightarrow \dfrac{V_b}{V} = \dfrac{917}{1025} \approx 0{,}895$. A víz felett kb. <strong>10,5%</strong> látszik – „a jéghegy csúcsa”.</p>` },
    ],
    hibak: [["Mértékegység", "cm² → m²: ×10⁻⁴; cm³ → m³: ×10⁻⁶."], ["Felhajtóerő", "A <em>folyadék</em> sűrűségével és a <em>bemerülő</em> térfogattal számolj."], ["Teljes nyomás", "Ha a teljes nyomást kérdezik, a légnyomást is add hozzá."], ["Paradoxon", "Az edény alja által érzett nyomóerő $pA$, nem a folyadék súlya (szűkülő edénynél eltér)."]],
    osszefoglalo: sum(["A nyomás minden irányban hat; a mélységgel lineárisan nő.", "Felhajtóerő = a kiszorított közeg súlya.", "Úszásnál $F_f = mg$."], R`$$p = \frac FA \qquad p = \rho gh \qquad F_f = \rho_f V g$$`),
    erettsegi: [["Feleletválasztós (I.)", "Hidrosztatikai paradoxon, úszó test bemerülése más folyadékban, közlekedőedények."], ["Témakifejtés (II.)", "Arkhimédész törvénye és alkalmazásai; a légnyomás felfedezése."], ["Összetett feladatok (III.)", "U-cső két folyadékkal, úszó hasáb, léggömb emelőereje."], ["Szóbeli", "Szilárd test és folyadék sűrűségének meghatározása."]],
    feladatok: [
      { id: "hid-01", szint: 1, tipus: "mc", pont: 2, cim: "Hidrosztatikai paradoxon", szoveg: R`Három különböző alakú, de azonos alapterületű edénybe ugyanolyan magasan töltünk vizet. Hol a legnagyobb a nyomás az edény alján?`, opciok: ["A legszélesebb edényben.", "A legkeskenyebb edényben.", "Mindhárom edényben ugyanakkora.", "Amelyikben a legtöbb víz van."], helyes: 2, tippek: ["$p = \\rho g h$ – mitől függ?"], megoldas: R`A hidrosztatikai nyomás csak a mélységtől és a sűrűségtől függ: mindhárom alján ugyanakkora.` },
      { id: "hid-02", szint: 2, tipus: "num", pont: 2, cim: "Nyomás a mélyben", szoveg: R`Mekkora a víz okozta (hidrosztatikai) nyomás 5,0 m mélyen? ($g = 9{,}81$) kPa-ban!`, valasz: 49.05, egyseg: "kPa", tol: 0.01, tippek: ["$p = \\rho gh$"], megoldas: R`$p = 1000\cdot 9{,}81\cdot 5 = 49\,050\ \mathrm{Pa} \approx 49\ \mathrm{kPa}$.` },
      { id: "hid-03", szint: 2, tipus: "num", pont: 2, cim: "Felhajtóerő", szoveg: R`Mekkora felhajtóerő hat egy teljesen vízbe merülő, 2,0 dm³ térfogatú testre? ($g = 9{,}81$)`, valasz: 19.62, egyseg: "N", tol: 0.01, tippek: ["2 dm³ = 0,002 m³"], megoldas: R`$F_f = 1000\cdot 0{,}002\cdot 9{,}81 \approx 19{,}6\ \mathrm N$.` },
    ],
  });

  /* =============================== ÁRAMLÁSOK =============================== */
  L({
    id: "aramlasok", parent: "kornyezet", nev: "Áramlások, Bernoulli-törvény", alcim: "Mozgó folyadékok és gázok",
    elofeltetel: ["Hidrosztatika", "Munka, energia"],
    kulcsszavak: "áramlás folytonossági egyenlet bernoulli törvény szárny felhajtóerő porlasztó torricelli kiömlés közegellenállás lamináris turbulens",
    attekintes: R`<p class="lead">Az áramló közegekben ahol szűkebb a cső, ott gyorsabb az áramlás, és ahol gyorsabb, ott kisebb a nyomás. Ez magyarázza a repülőgép szárnyát és a porlasztót.</p>
<div class="callout"><div class="callout-t">Szemléletesen</div>Fújj két egymás mellett lógó papírlap közé – nem eltávolodnak, hanem összecsapódnak: a gyors légáramban kisebb a nyomás.</div>`,
    elmelet: R`<div class="prose">
<h3>Folytonossági egyenlet</h3><p>Összenyomhatatlan közegben a térfogatáram állandó: $$A_1v_1 = A_2v_2$$ A slag végét összeszorítva messzebbre spriccel a víz.</p>
<h3>Bernoulli-törvény</h3><p>Súrlódásmentes áramlásban, egy áramvonal mentén: $$p + \tfrac12\rho v^2 + \rho g h = \text{állandó}$$ Ez az energiamegmaradás térfogategységre felírva. Vízszintes csőben: ahol nagyobb a sebesség, kisebb a nyomás. Alkalmazások: szárny (dinamikus felhajtóerő), porlasztó, vízlégszivattyú, viharban a háztető felszakadása, Venturi-cső, a kéményhuzat.</p>
<h3>Kiömlés (Torricelli)</h3><p>A $h$ mélységben lévő kis nyíláson kiömlő folyadék sebessége $v = \sqrt{2gh}$ – mintha $h$ magasból esett volna.</p>
<h3>Közegellenállás</h3><p>$F = \tfrac12 C\rho A v^2$; az alaktényező ($C$) áramvonalas testnél kicsi. Kis sebességnél lamináris, nagynál turbulens (örvényes) áramlás.</p></div>`,
    peldak: [{ szint: "3 · Közép", cim: "Kerti locsolócső", feladat: R`<p>A 2 cm belső átmérőjű csőben a víz 1,5 m/s-mal áramlik. A végére 5 mm átmérőjű szórófejet teszünk. Mekkora sebességgel lép ki a víz? Mekkora a nyomáskülönbség a cső és a szórófej között?</p>`,
      megoldas: R`<p>$v_2 = v_1\left(\dfrac{d_1}{d_2}\right)^2 = 1{,}5\cdot 16 = 24\ \mathrm{m/s}$ (az átmérő négyzete számít!).</p><p>Bernoulli: $\Delta p = \tfrac12\rho(v_2^2 - v_1^2) = 500\,(576 - 2{,}25) \approx 2{,}87\cdot 10^5\ \mathrm{Pa} \approx 2{,}9\ \mathrm{bar}$.</p>` }],
    hibak: [["Átmérő vs. keresztmetszet", "Feleakkora átmérő → negyedakkora keresztmetszet → négyszeres sebesség."], ["Bernoulli iránya", "A gyorsabb helyen kisebb a nyomás – nem nagyobb."], ["Feltétel", "Összenyomhatatlan, súrlódásmentes, stacionárius áramlásra igaz."]],
    osszefoglalo: sum(["Szűkületben gyorsabb az áramlás.", "Gyorsabb áramlás → kisebb nyomás."], R`$$A_1v_1 = A_2v_2 \qquad p + \tfrac12\rho v^2 + \rho gh = \text{áll.} \qquad v = \sqrt{2gh}$$`),
    erettsegi: [["Feleletválasztós (I.)", "Hol nagyobb a nyomás egy szűkülő csőben; papírlapos, labdás kísérletek magyarázata."], ["Témakifejtés (II.)", "Áramlások, a repülés fizikája, közegellenállás."], ["Összetett feladatok (III.)", "Folytonosság + Bernoulli; kiömlés edényből, a sugár röppályája (vízszintes hajítás)."]],
    feladatok: [
      { id: "ara-01", szint: 1, tipus: "mc", pont: 2, cim: "Szűkület", szoveg: R`Vízszintes csőben folyik a víz, a cső egy helyen elszűkül. Mit mondhatunk a szűkületről?`, opciok: ["Ott lassabb az áramlás és nagyobb a nyomás.", "Ott gyorsabb az áramlás és kisebb a nyomás.", "Ott gyorsabb az áramlás és nagyobb a nyomás.", "A sebesség és a nyomás ugyanaz."], helyes: 1, tippek: ["Folytonossági egyenlet, majd Bernoulli."], megoldas: R`$Av$ állandó → gyorsabb; Bernoulli szerint a gyorsabb helyen kisebb a nyomás.` },
      { id: "ara-02", szint: 2, tipus: "num", pont: 2, cim: "Szűkülő cső", szoveg: R`Egy cső keresztmetszete 4,0 cm²-ről 1,0 cm²-re szűkül. A széles részen 0,50 m/s az áramlási sebesség. Mekkora a szűk részen?`, valasz: 2, egyseg: "m/s", tol: 0.01, tippek: ["$A_1v_1 = A_2v_2$"], megoldas: R`$v_2 = 0{,}5\cdot 4 = 2{,}0\ \mathrm{m/s}$.` },
      { id: "ara-03", szint: 3, tipus: "num", pont: 2, cim: "Kiömlés", szoveg: R`Egy hordó oldalán, a vízszint alatt 80 cm-rel kis lyuk van. Mekkora sebességgel spriccel ki a víz? ($g = 9{,}81$)`, valasz: 3.962, egyseg: "m/s", tol: 0.01, tippek: ["$v = \\sqrt{2gh}$"], megoldas: R`$v = \sqrt{2\cdot 9{,}81\cdot 0{,}8} \approx 3{,}96\ \mathrm{m/s}$.` },
    ],
  });

  /* =============================== FELÜLETI FESZÜLTSÉG =============================== */
  L({
    id: "feluleti", parent: "kornyezet", nev: "Felületi feszültség, kapillaritás", alcim: "A folyadékfelszín „hártyája”",
    elofeltetel: ["Dinamika", "Hidrosztatika"],
    kulcsszavak: "felületi feszültség kapillaritás hajszálcsövesség nedvesítés kohézió adhézió mosószer buborék molnár",
    attekintes: R`<p class="lead">A folyadék felszínén lévő molekulákat a belsők befelé húzzák – a felszín összehúzódni igyekszik, mint egy kifeszített hártya. Ezért gömb alakú a csepp, ezért jár a molnárpoloska a vízen.</p>`,
    elmelet: R`<div class="prose">
<h3>Felületi feszültség</h3><p>$$\alpha = \frac{F}{l} = \frac{\Delta E}{\Delta A}$$ A felszín határvonalának egységnyi hosszára ható erő (N/m), vagy a felület növeléséhez szükséges munka egységnyi felületre. Víz: 0,073 N/m; mosószer és melegítés csökkenti. Drótkeretre feszített hártyánál <strong>két</strong> felület van: $F = 2\alpha l$.</p>
<h3>Kohézió és adhézió, nedvesítés</h3><p>Ha a folyadék és a fal molekulái közti vonzás (adhézió) erősebb a folyadékon belülinél (kohézió), a folyadék nedvesíti a falat (víz–üveg, homorú felszín); ellenkező esetben nem nedvesíti (higany–üveg, domború felszín).</p>
<h3>Kapillaritás</h3><p>Vékony csőben a nedvesítő folyadék felemelkedik: $$h = \frac{2\alpha}{\rho g r}$$ A felszín mentén ható erő ($2\pi r\alpha$) tartja meg a felemelt oszlop súlyát. Példák: a növények vízszállítása, papírtörlő, talajnedvesség, tégla falának vizesedése. Szóbeli mérés: felületi feszültség mérése kapillárisokkal.</p></div>`,
    peldak: [{ szint: "3 · Közép", cim: "Kapilláris emelkedés", feladat: R`<p>Milyen magasra emelkedik a víz egy 0,5 mm belső átmérőjű üvegcsőben? Mi történik mosószeres víznél ($\alpha = 0{,}03\ \mathrm{N/m}$)?</p>`,
      megoldas: R`<p>Sugár: $r = 0{,}25\ \mathrm{mm}$! $h = \dfrac{2\cdot 0{,}073}{1000\cdot 9{,}81\cdot 0{,}00025} \approx 5{,}95\ \mathrm{cm}$. Mosószerrel: $\approx 2{,}4\ \mathrm{cm}$.</p>` }],
    hibak: [["Sugár vs. átmérő", "A képletben a cső sugara szerepel."], ["Kettős hártya", "Drótkereten és buboréknál két felület van: $2\\alpha l$."]],
    osszefoglalo: sum(["A felszín összehúzódni igyekszik.", "Vékonyabb csőben magasabbra emelkedik a nedvesítő folyadék."], R`$$\alpha = \frac Fl \qquad h = \frac{2\alpha}{\rho g r}$$`),
    erettsegi: [["Feleletválasztós (I.)", "Nedvesítés, a folyadékfelszín alakja, mosószer hatása."], ["Szóbeli", "Felületi feszültség mérése kapillárisokkal."]],
    feladatok: [
      { id: "fel-01", szint: 1, tipus: "mc", pont: 2, cim: "Mosószer", szoveg: R`Mit tesz a mosószer a víz felületi feszültségével?`, opciok: ["Növeli.", "Csökkenti.", "Nem változtatja.", "Előjelet vált."], helyes: 1, tippek: ["Miért úszik el a molnárpoloska, ha mosószert cseppentünk a vízbe?"], megoldas: R`A mosószer csökkenti a felületi feszültséget (ezért nedvesít jobban és ezért süllyed el a vízen járó rovar).` },
      { id: "fel-02", szint: 3, tipus: "num", pont: 3, cim: "Hajszálcső", szoveg: R`Milyen magasra emelkedik a víz ($\alpha = 0{,}073\ \mathrm{N/m}$) egy 0,25 mm sugarú üvegcsőben? ($g = 9{,}81$) cm-ben!`, valasz: 5.953, egyseg: "cm", tol: 0.01, tippek: ["$h = 2\\alpha/(\\rho g r)$"], megoldas: R`$h = \dfrac{0{,}146}{1000\cdot 9{,}81\cdot 0{,}00025} \approx 0{,}0595\ \mathrm m$.` },
      { id: "fel-03", szint: 3, tipus: "num", pont: 2, cim: "Szappanhártya", szoveg: R`Egy 5,0 cm hosszú drót a szappanhártyás keret mozgatható oldala. Mekkora erő kell a megtartásához, ha $\alpha = 0{,}040\ \mathrm{N/m}$? mN-ban!`, valasz: 4, egyseg: "mN", tol: 0.01, tippek: ["A hártyának két felülete van."], megoldas: R`$F = 2\alpha l = 2\cdot 0{,}04\cdot 0{,}05 = 0{,}004\ \mathrm N = 4\ \mathrm{mN}$.` },
    ],
  });

  /* =============================== LÉGKÖR =============================== */
  L({
    id: "legkor", parent: "kornyezet", nev: "Légkör, időjárás, üvegházhatás", alcim: "A légkör fizikája és a klíma", szint: "Közép + Emelt (főleg szöveges)",
    elofeltetel: ["Hidrosztatika", "Hőtan"],
    kulcsszavak: "légkör légnyomás páratartalom harmatpont felhő csapadék szél frontok üvegházhatás klímaváltozás ózon sugárzás albedó",
    attekintes: R`<p class="lead">A légkör fizikai folyamatai – nyomáskülönbség, hőmérséklet-különbség, párolgás és lecsapódás – irányítják az időjárást. Az üvegházhatás teszi lakhatóvá a Földet, erősödése okozza a klímaváltozást.</p>`,
    elmelet: R`<div class="prose">
<h3>A légkör szerkezete, légnyomás</h3><p>Troposzféra (az időjárás színtere, kb. 10–12 km, a hőmérséklet felfelé ≈ 6,5 °C/km-rel csökken), sztratoszféra (ózonréteg – elnyeli az UV-t). A légnyomás a magassággal közel exponenciálisan csökken (≈ 5,5 km-enként feleződik).</p>
<h3>Páratartalom</h3><p><strong>Abszolút páratartalom</strong>: g/m³. <strong>Relatív páratartalom</strong> = tényleges / az adott hőmérsékleten maximális (telítési) páratartalom. Hűléskor a relatív páratartalom nő; a <strong>harmatpont</strong>on eléri a 100%-ot, a pára kicsapódik: harmat, köd, felhő. A felszálló levegő tágul és lehűl (adiabatikusan) – így keletkeznek a felhők.</p>
<h3>Szél, frontok</h3><p>A szél a nyomáskülönbség kiegyenlítődése (magasabbról alacsonyabb nyomás felé); a Föld forgása eltéríti (Coriolis-hatás). Tengeri és parti szél: a szárazföld és a víz eltérő fajhője miatt. Hidegfront: zivatar, gyors lehűlés; melegfront: tartós csapadék.</p>
<h3>Üvegházhatás</h3><p>A Nap rövidhullámú sugárzását a légkör nagyrészt átengedi; a felmelegedett felszín hosszúhullámú (infravörös) sugárzását viszont az üvegházgázok (H₂O, CO₂, CH₄) elnyelik és részben visszasugározzák. Nélküle a Föld átlaghőmérséklete ≈ −18 °C lenne +15 °C helyett. A fosszilis tüzelőanyagokból származó CO₂ erősíti a hatást → globális felmelegedés.</p></div>`,
    peldak: [{ szint: "2 · Közép", cim: "Relatív páratartalom", feladat: R`<p>20 °C-on a levegő 10 g/m³ vízgőzt tartalmaz, a telítési érték 17,3 g/m³. Mekkora a relatív páratartalom? Mi történik, ha a levegő 11 °C-ra hűl (telítési érték ≈ 10 g/m³)?</p>`,
      megoldas: R`<p>$\varphi = 10/17{,}3 \approx 58\%$. 11 °C-on eléri a 100%-ot: ez a harmatpont, a pára kicsapódik.</p>` }],
    hibak: [["Üvegházhatás vs. ózonlyuk", "Két különböző jelenség: az ózonlyuk az UV-elnyelés csökkenése, az üvegházhatás az infravörös visszatartása."], ["Relatív páratartalom", "Ugyanannyi pára mellett hidegebb levegőben nagyobb a relatív páratartalom."]],
    erettsegi: [["Feleletválasztós (I.)", "Harmatpont, felhőképződés, üvegházgázok, tengeri szél iránya nappal."], ["Témakifejtés (II.)", "Az üvegházhatás és a klímaváltozás fizikája; a légkör és az időjárás."]],
    feladatok: [
      { id: "leg-01", szint: 1, tipus: "mc", pont: 2, cim: "Üvegházhatás", szoveg: R`Melyik sugárzást nyelik el az üvegházgázok?`, opciok: ["A Nap ultraibolya sugárzását.", "A Föld felszínének infravörös sugárzását.", "A látható fényt.", "A kozmikus sugárzást."], helyes: 1, tippek: ["Milyen hullámhosszon sugároz egy kb. 15 °C-os test?"], megoldas: R`A felszín hőmérsékleti sugárzása infravörös; ezt nyelik el és sugározzák részben vissza az üvegházgázok.` },
      { id: "leg-02", szint: 2, tipus: "num", pont: 2, cim: "Páratartalom", szoveg: R`20 °C-on a levegő 10 g/m³ vízgőzt tartalmaz, a telítési érték 17,3 g/m³. Mekkora a relatív páratartalom? %-ban!`, valasz: 57.8, egyseg: "%", tol: 0.01, tippek: ["tényleges / telítési"], megoldas: R`$10/17{,}3 \approx 57{,}8\%$.` },
      { id: "leg-03", szint: 3, tipus: "num", pont: 2, cim: "Nyomás a toronyház tetején", szoveg: R`Mennyivel kisebb a légnyomás egy 100 m magas ház tetején, mint az alján? (A levegő sűrűsége állandónak vehető: 1,2 kg/m³; $g = 9{,}81$) Pa-ban!`, valasz: 1177.2, egyseg: "Pa", tol: 0.01, tippek: ["Kis magasságkülönbségre $\\Delta p = \\rho g h$."], megoldas: R`$\Delta p = 1{,}2\cdot 9{,}81\cdot 100 \approx 1180\ \mathrm{Pa}$ (≈ 1,2%-a a légnyomásnak).` },
    ],
  });

  /* =============================== ELEKTROSZTATIKA =============================== */
  L({
    id: "elektrosztatika", parent: "elektromossag", nev: "Elektrosztatika, kondenzátor", alcim: "Nyugvó töltések, elektromos mező, feszültség, kapacitás",
    elofeltetel: ["Dinamika", "Munka, energia"],
    kulcsszavak: "töltés coulomb elektromos mező térerősség erővonal feszültség potenciál ekvipotenciális vezető szigetelő megosztás faraday-kalitka csúcshatás kondenzátor kapacitás dielektrikum",
    attekintes: R`<p class="lead">Az elektromos töltések mezőt keltenek maguk körül, amely más töltésekre erőt fejt ki. A mező energiát tárol – a kondenzátorban ez hasznosítható.</p>
<div class="callout"><div class="callout-t">Szemléletesen</div>A feszültség olyan, mint a magasságkülönbség a gravitációs mezőben: megmutatja, mennyi munkát végez a mező az egységnyi töltésen, miközben az egyik pontból a másikba jut.</div>`,
    elmelet: R`<div class="prose">
<h3>Töltés, Coulomb-törvény</h3><p>Kétféle töltés van; az azonos nemű taszítja, a különnemű vonzza egymást. A töltés megmarad, és kvantált (elemi töltés $e = 1{,}6\cdot 10^{-19}$ C). $$F = k\frac{Q_1Q_2}{r^2}, \quad k = 9\cdot 10^9\ \mathrm{\frac{Nm^2}{C^2}}$$</p>
<h3>Elektromos mező</h3><p>Térerősség: $\vec E = \vec F/q$ (N/C = V/m). Ponttöltésé $E = kQ/r^2$; több töltésé vektorösszeg (szuperpozíció). Erővonalak: pozitívból indulnak, negatívban végződnek, sűrűségük a térerősséggel arányos. Homogén mező: két párhuzamos, ellentétes töltésű lemez között.</p>
<h3>Feszültség, potenciál</h3><p>$U_{AB} = W_{AB}/q$ – a mező munkája egységnyi töltésen, független az úttól (konzervatív mező). Homogén mezőben $U = Ed$. Az ekvipotenciális felületek merőlegesek az erővonalakra; mentük nincs munkavégzés. (Szóbeli mérés: ekvipotenciális vonalak kimérése.)</p>
<h3>Vezetők az elektromos mezőben</h3><p>Egyensúlyban a vezető belsejében a térerősség nulla, a töltések a felületen helyezkednek el, a csúcsokon sűrűsödnek (csúcshatás, villámhárító). <strong>Faraday-kalitka</strong>: a zárt fémburok belsejét árnyékolja (autó villámláskor, mikrohullámú sütő ajtaja). <strong>Megosztás (influencia)</strong>: a közeli töltés átrendezi a vezető töltéseit.</p>
<h3>Kondenzátor</h3><p>$$C = \frac QU, \qquad C = \varepsilon_0\varepsilon_r\frac Ad, \qquad E = \tfrac12 CU^2$$ Szigetelő (dielektrikum) betétele $\varepsilon_r$-szeresére növeli a kapacitást. Párhuzamos kapcsolásnál a kapacitások összeadódnak, sorosnál a reciprokok. Alkalmazás: vaku, defibrillátor, érintőképernyő, mikrofon, telefon gyorsulásmérője.</p></div>`,
    peldak: [
      { szint: "3 · Közép", cim: "Elektron gyorsítása", feladat: R`<p>Nyugvó elektront 1000 V feszültség gyorsít. Mekkora lesz a sebessége? ($m_e = 9{,}11\cdot 10^{-31}$ kg)</p>`,
        megoldas: R`<p>$eU = \tfrac12 mv^2 \Rightarrow v = \sqrt{\dfrac{2eU}{m}} = \sqrt{\dfrac{2\cdot 1{,}6\cdot 10^{-19}\cdot 1000}{9{,}11\cdot 10^{-31}}} \approx 1{,}9\cdot 10^7\ \mathrm{m/s}$ – a fénysebesség 6%-a.</p>` },
      { szint: "4 · Emelt", cim: "Kondenzátor lemezeinek széthúzása", feladat: R`<p>Egy feltöltött síkkondenzátort leválasztunk a telepről, majd a lemezek távolságát kétszeresére növeljük. Hogyan változik a kapacitás, a töltés, a feszültség és az energia? És ha a telep rajta marad?</p>`,
        megoldas: R`<p><strong>Leválasztva</strong> a töltés állandó: $C$ fele, $U = Q/C$ kétszeres, $E = Q^2/(2C)$ kétszeres – a széthúzás munkája tárolódott.</p><p><strong>Telepen</strong> a feszültség állandó: $C$ fele, $Q$ fele, $E = \tfrac12CU^2$ fele.</p>` },
    ],
    hibak: [["Előtagok", "μC = 10⁻⁶ C, nC = 10⁻⁹ C, pF = 10⁻¹² F."], ["Szuperpozíció", "A térerősségek vektorosan adódnak össze."], ["Leválasztott kondenzátor", "Leválasztva $Q$, telepen hagyva $U$ állandó."]],
    osszefoglalo: sum(["Az elektromos mező konzervatív: a munka független az úttól.", "Vezető belsejében $E = 0$.", "Kondenzátor: $Q = CU$, energiája $\\tfrac12CU^2$."], R`$$F = k\frac{Q_1Q_2}{r^2} \quad E = \frac Fq \quad U = Ed \quad W = qU$$$$C = \varepsilon_0\varepsilon_r\frac Ad \quad E = \tfrac12CU^2$$`),
    erettsegi: [["Feleletválasztós (I.)", "Erővonalképek, töltés megoszlása vezetőn, kondenzátor változásai, elektron mozgása mezőben."], ["Témakifejtés (II.)", "Elektrosztatikai alapjelenségek, kondenzátor és alkalmazásai, Faraday-kalitka."], ["Összetett feladatok (III.)", "Töltött részecske eltérülése lemezek között (vízszintes hajítás analógia), kondenzátor-kapcsolások."], ["Szóbeli", "Ekvipotenciális vonalak kimérése elektromos térben."]],
    feladatok: [
      { id: "esz-01", szint: 1, tipus: "mc", pont: 2, cim: "Autó villámláskor", szoveg: R`Miért van biztonságban az autóban ülő ember villámcsapáskor?`, opciok: ["A gumik szigetelnek.", "A fémkarosszéria Faraday-kalitkaként árnyékol.", "Az autóban kisebb a légnyomás.", "A villám nem csap mozgó tárgyba."], helyes: 1, tippek: ["Hol helyezkednek el a töltések egy vezetőn?"], megoldas: R`A töltés a vezető fémburok külső felületén halad; a zárt fémburok belsejében a térerősség (közel) nulla. A gumi kevés centimétere a több km-es villámot nem állítaná meg.` },
      { id: "esz-02", szint: 2, tipus: "num", pont: 2, cim: "Coulomb-erő", szoveg: R`Mekkora erővel hat egymásra két, 10 cm-re lévő, 2,0 μC és 3,0 μC töltés? ($k = 8{,}99\cdot 10^9$)`, valasz: 5.394, egyseg: "N", tol: 0.01, tippek: ["$F = kQ_1Q_2/r^2$"], megoldas: R`$F = 8{,}99\cdot 10^9\cdot\dfrac{6\cdot 10^{-12}}{0{,}01} \approx 5{,}4\ \mathrm N$.` },
      { id: "esz-03", szint: 2, tipus: "num", pont: 2, cim: "Kondenzátor energiája", szoveg: R`Mennyi energiát tárol egy 10 V-ra feltöltött 2200 μF-os kondenzátor?`, valasz: 0.11, egyseg: "J", tol: 0.01, tippek: ["$E = \\tfrac12CU^2$"], megoldas: R`$E = 0{,}5\cdot 2{,}2\cdot 10^{-3}\cdot 100 = 0{,}11\ \mathrm J$.` },
    ],
  });

  /* =============================== EGYENÁRAM =============================== */
  L({
    id: "egyenaram", parent: "elektromossag", nev: "Egyenáram, hálózatok, félvezetők", alcim: "Áram, ellenállás, kapcsolások, áramforrások",
    elofeltetel: ["Elektrosztatika"],
    kulcsszavak: "áramerősség ohm törvény ellenállás fajlagos soros párhuzamos kirchhoff teljesítmény joule áramforrás belső ellenállás kapocsfeszültség félvezető dióda termisztor wheatstone",
    attekintes: R`<p class="lead">Az elektromos áram a töltések rendezett mozgása. Az áramkörök viselkedését néhány egyszerű törvény (Ohm, Kirchhoff) írja le; a belső ellenállás miatt a valódi áramforrás nem ideális.</p>`,
    elmelet: R`<div class="prose">
<h3>Áram, Ohm törvénye</h3><p>$I = Q/t$ (A). Fémes vezetőben állandó hőmérsékleten $U = RI$. A vezeték ellenállása $R = \rho\dfrac lA$. Fémek ellenállása melegítéskor nő (az izzó I–U grafikonja ezért nem egyenes), a félvezetőké (termisztor) csökken.</p>
<h3>Kapcsolások, Kirchhoff-törvények</h3><p><strong>Csomóponti törvény</strong>: a befolyó áramok összege egyenlő a kifolyókéval (töltésmegmaradás). <strong>Huroktörvény</strong>: zárt hurokban a feszültségek előjeles összege nulla (energiamegmaradás). Soros: $R_s = R_1 + R_2$, az áram közös, a feszültség az ellenállások arányában oszlik meg. Párhuzamos: $1/R_p = 1/R_1 + 1/R_2$, a feszültség közös. Wheatstone-híd: kiegyenlítve $R_x/R_n = l_1/l_2$.</p>
<h3>Műszerek</h3><p>Az árammérőt sorosan kötjük (kis belső ellenállás), a feszültségmérőt párhuzamosan (nagy belső ellenállás). Méréshatár-kiterjesztés: söntellenállás, előtét-ellenállás.</p>
<h3>Teljesítmény, munka</h3><p>$P = UI = I^2R = U^2/R$, $W = UIt$. A Joule-hő miatt szállítanak nagy feszültségen. Biztosíték, túlterhelés.</p>
<h3>Áramforrások</h3><p>Elektromotoros erő ($\varepsilon$), belső ellenállás ($R_b$): $U_k = \varepsilon - IR_b$, $I = \dfrac{\varepsilon}{R_k + R_b}$. A külső teljesítmény $R_k = R_b$ esetén maximális. (Szóbeli mérés: az áramforrás paramétereinek vizsgálata; Wheatstone-híd; termisztor.)</p>
<h3>Félvezetők</h3><p>A tiszta félvezető (Si, Ge) vezetése melegítésre és megvilágításra nő. Szennyezéssel n- és p-típusú anyag készíthető; a p–n átmenet a <strong>dióda</strong>, amely csak egy irányban vezet (egyenirányítás). LED, napelem, tranzisztor – a modern elektronika alapjai.</p></div>`,
    peldak: [
      { szint: "3 · Közép", cim: "Vegyes kapcsolás", feladat: R`<p>12 V-os ideális telepre sorosan kötünk egy 4 Ω-os ellenállást és két párhuzamosan kapcsolt 12 Ω-os ellenállást. Mekkora az áram és az egyes ellenállásokon eső feszültség?</p>`,
        megoldas: R`<p>Párhuzamos rész: $6\ \Omega$; eredő: $10\ \Omega$. $I = 1{,}2\ \mathrm A$. A 4 Ω-on 4,8 V, a párhuzamos részen 7,2 V (mindkét 12 Ω-on, 0,6–0,6 A).</p>` },
      { szint: "4 · Emelt", cim: "Elem paraméterei két mérésből", feladat: R`<p>Egy elem kapocsfeszültsége 0,5 A-nél 4,2 V, 1,5 A-nél 3,6 V. Mekkora az elektromotoros ereje és belső ellenállása?</p>`,
        megoldas: R`<p>$4{,}2 = \varepsilon - 0{,}5R_b$, $3{,}6 = \varepsilon - 1{,}5R_b$. Kivonva: $R_b = 0{,}6\ \Omega$, $\varepsilon = 4{,}5\ \mathrm V$. Rövidzárási áram: $7{,}5\ \mathrm A$. (Ezt mérjük a szóbelin több ponttal, egyenes illesztésével – lásd a Mérések menüt.)</p>` },
    ],
    hibak: [["Műszerek", "Árammérő sorba, feszültségmérő párhuzamosan!"], ["Párhuzamos eredő", "Mindig kisebb a legkisebb ellenállásnál."], ["Ohm-törvény", "Izzóra, diódára nem érvényes (nem lineáris)."], ["Belső ellenállás", "Terheléskor a kapocsfeszültség kisebb az elektromotoros erőnél."]],
    osszefoglalo: sum(["Csomóponti és huroktörvény = töltés- és energiamegmaradás.", "Soros: közös áram; párhuzamos: közös feszültség.", "$U_k = \\varepsilon - IR_b$."], R`$$U = RI \quad R = \rho\frac lA \quad P = UI \quad I = \frac{\varepsilon}{R_k + R_b}$$`),
    erettsegi: [["Feleletválasztós (I.)", "Izzók fényereje kapcsolásokban, műszerek bekötése, mi változik egy ellenállás kiiktatásakor."], ["Témakifejtés (II.)", "Ohm törvénye, Kirchhoff-törvények; félvezetők és alkalmazásaik."], ["Összetett feladatok (III.)", "Hálózatok, áramforrás belső ellenállással, fogyasztók teljesítménye, melegítés elektromosan."], ["Szóbeli", "Áramforrás paraméterei; izzó ellenállása Wheatstone-híddal; termisztor hőmérsékletfüggése."]],
    feladatok: [
      { id: "ega-01", szint: 1, tipus: "mc", pont: 2, cim: "Párhuzamos izzók", szoveg: R`Egy ideális telepre kapcsolt izzóval párhuzamosan bekötünk egy második, azonos izzót. Mi történik az első izzó fényerejével?`, opciok: ["Csökken.", "Nem változik.", "Nő.", "Kialszik."], helyes: 1, tippek: ["Ideális telepnél mi marad állandó az izzón?"], megoldas: R`Ideális telepnél az izzóra jutó feszültség változatlan, így az árama és teljesítménye sem változik. (Valós telepnél a belső ellenállás miatt kissé csökkenne.)` },
      { id: "ega-02", szint: 2, tipus: "num", pont: 2, cim: "Teljes áramkör", szoveg: R`Egy 12 V elektromotoros erejű, 2,0 Ω belső ellenállású telepre 10 Ω-os fogyasztót kötünk. Mekkora az áram?`, valasz: 1, egyseg: "A", tol: 0.01, tippek: ["$I = \\varepsilon/(R_k + R_b)$"], megoldas: R`$I = 12/12 = 1{,}0\ \mathrm A$.` },
      { id: "ega-03", szint: 2, tipus: "num", pont: 2, cim: "Rézhuzal", szoveg: R`Mekkora a 100 m hosszú, 1,5 mm² keresztmetszetű rézhuzal ellenállása? ($\rho = 1{,}7\cdot 10^{-8}\ \Omega\,\mathrm m$)`, valasz: 1.1333, egyseg: "Ω", tol: 0.01, tippek: ["1,5 mm² = 1,5·10⁻⁶ m²"], megoldas: R`$R = 1{,}7\cdot 10^{-8}\cdot\dfrac{100}{1{,}5\cdot 10^{-6}} \approx 1{,}13\ \Omega$.` },
    ],
  });

  /* =============================== MÁGNESSÉG =============================== */
  L({
    id: "magnesseg", parent: "elektromossag", nev: "Mágneses mező, Lorentz-erő", alcim: "Áramok mágneses mezeje és a mező erőhatásai",
    elofeltetel: ["Egyenáram", "körmozgás dinamikája"],
    kulcsszavak: "mágnes mágneses mező indukció indukcióvonal fluxus oersted áramjárta vezető tekercs elektromágnes lorentz erő elektromotor tömegspektrométer földmágnesség ferromágneses",
    attekintes: R`<p class="lead">Mágneses mezőt a mágnesek és az elektromos áramok keltenek (Ørsted, 1820). A mágneses mező mozgó töltésekre és áramokra erőt fejt ki – ezen alapul az elektromotor és a tömegspektrométer.</p>`,
    elmelet: R`<div class="prose">
<h3>Mágneses mező, indukció</h3><p>A mágneses indukció ($B$, tesla) a mező erősségét jellemző vektor; iránya az iránytű északi pólusának iránya. Indukcióvonalak: zárt görbék (nincs mágneses „töltés”). A Föld mágneses déli pólusa a földrajzi Északi-sark közelében van.</p>
<h3>Áramok mágneses mezeje</h3><p>Egyenes vezető: koncentrikus körök, $B = \dfrac{\mu_0 I}{2\pi r}$ (jobbkéz-szabály). Hosszú tekercs belsejében homogén: $B = \mu_0\mu_r\dfrac{NI}{l}$. Vasmaggal (ferromágneses anyag) sokszorosára nő: elektromágnes (daru, relé, csengő, hangszóró).</p>
<h3>Erőhatások</h3><p>Áramjárta vezetőre: $F = BIl\sin\alpha$, iránya merőleges $B$-re és a vezetőre is (jobbkéz-/balkéz-szabály). Két párhuzamos vezető: az egyirányú áramok vonzzák egymást. Áramjárta keretre forgatónyomaték hat – <strong>elektromotor</strong>, Deprez-műszer.</p>
<h3>Lorentz-erő</h3><p>$$F = qvB\sin\alpha$$ A sebességre merőleges, ezért munkát nem végez – csak irányt változtat. Merőleges belépésnél körpálya: $$r = \frac{mv}{qB}, \qquad T = \frac{2\pi m}{qB}$$ (a keringési idő nem függ a sebességtől – ciklotron). Alkalmazások: tömegspektrométer (izotópok szétválasztása), sarki fény, katódsugárcső, részecskegyorsítók.</p></div>`,
    peldak: [{ szint: "4 · Emelt", cim: "Tömegspektrométer", feladat: R`<p>Egyszeresen ionizált ²⁰Ne és ²²Ne ionokat 1000 V gyorsít, majd 0,2 T-s mezőben félkört tesznek meg. Milyen messze csapódnak be egymástól? ($u = 1{,}66\cdot 10^{-27}$ kg)</p>`,
      megoldas: R`<p>$eU = \tfrac12mv^2$ és $r = \dfrac{mv}{eB}$ → $r = \dfrac1B\sqrt{\dfrac{2mU}{e}}$.</p><p>$r_{20} = 5\sqrt{\dfrac{2\cdot 3{,}32\cdot 10^{-26}\cdot 1000}{1{,}6\cdot 10^{-19}}} \approx 0{,}1019\ \mathrm m$; $r_{22} \approx 0{,}1068\ \mathrm m$.</p><p>A becsapódási pontok a belépéstől $2r$ távolságra vannak: a különbség $2(0{,}1068 - 0{,}1019) \approx 1{,}0\ \mathrm{cm}$.</p>` }],
    hibak: [["Lorentz-erő munkája", "Nulla – a mozgási energia nem változik."], ["Negatív töltés", "Elektronra az erő iránya fordított."], ["Becsapódás", "Félkör után a belépési ponttól $2r$-re csapódik be."]],
    osszefoglalo: sum(["Mágneses mezőt áramok (és mágnesek) keltenek.", "A Lorentz-erő merőleges a sebességre → körpálya."], R`$$F = BIl \qquad F = qvB \qquad r = \frac{mv}{qB} \qquad B = \frac{\mu_0 I}{2\pi r}$$`),
    erettsegi: [["Feleletválasztós (I.)", "Erő iránya (jobbkéz-szabály), részecskék pályája, vezetők kölcsönhatása."], ["Témakifejtés (II.)", "A mágneses mező és hatásai; elektromotor; részecskék mágneses mezőben, sarki fény."], ["Összetett feladatok (III.)", "Tömegspektrométer, gyorsítás + körpálya, vezető mágneses mezőben egyensúlyban."], ["Szóbeli", "Erőhatás távolságfüggésének kimérése neodímium mágnesek között."]],
    feladatok: [
      { id: "mag-01", szint: 1, tipus: "mc", pont: 2, cim: "A Lorentz-erő munkája", szoveg: R`Homogén mágneses mezőben körpályán mozgó protonra ható Lorentz-erő munkája egy félkörön:`, opciok: ["pozitív", "negatív", "nulla", "a sebességtől függ"], helyes: 2, tippek: ["Milyen szöget zár be az erő a sebességgel?"], megoldas: R`Az erő mindig merőleges a sebességre, ezért nem végez munkát; a proton sebességének nagysága állandó.` },
      { id: "mag-02", szint: 3, tipus: "num", pont: 3, cim: "Proton körpályája", szoveg: R`Proton ($m = 1{,}67\cdot 10^{-27}$ kg) $10^6$ m/s sebességgel merőlegesen lép be egy 0,10 T-s homogén mágneses mezőbe. Mekkora a pályasugár? cm-ben!`, valasz: 10.4375, egyseg: "cm", tol: 0.01, tippek: ["$r = mv/(qB)$"], megoldas: R`$r = \dfrac{1{,}67\cdot 10^{-27}\cdot 10^6}{1{,}6\cdot 10^{-19}\cdot 0{,}1} \approx 0{,}104\ \mathrm m$.` },
      { id: "mag-03", szint: 2, tipus: "num", pont: 2, cim: "Vezetőre ható erő", szoveg: R`Mekkora erő hat egy 0,20 T-s mezőben a mezőre merőleges, 30 cm-es szakaszon 5,0 A-rel átjárt vezetőre?`, valasz: 0.3, egyseg: "N", tol: 0.01, tippek: ["$F = BIl$"], megoldas: R`$F = 0{,}2\cdot 5\cdot 0{,}3 = 0{,}3\ \mathrm N$.` },
    ],
  });

  /* =============================== INDUKCIÓ =============================== */
  L({
    id: "indukcio", parent: "elektromossag", nev: "Elektromágneses indukció", alcim: "Változó mágneses mező → feszültség",
    elofeltetel: ["Mágneses mező"],
    kulcsszavak: "indukció faraday lenz fluxusváltozás mozgási indukció nyugalmi indukció örvényáram önindukció induktivitás generátor tekercs energia",
    attekintes: R`<p class="lead">Faraday felfedezése (1831): a mágneses fluxus változása feszültséget kelt. Ezen működik a generátor, a transzformátor, az indukciós főzőlap és a vezeték nélküli töltő – az elektromos energia szinte teljes egészét így állítjuk elő.</p>`,
    elmelet: R`<div class="prose">
<h3>Mágneses fluxus</h3><p>$\Phi = BA\cos\alpha$ (Wb). Változhat $B$, $A$ vagy a szög.</p>
<h3>Faraday-féle indukciótörvény</h3><p>$$U_i = -N\frac{\Delta\Phi}{\Delta t}$$ <strong>Mozgási indukció</strong>: mágneses mezőben mozgó vezetőben $U_i = Blv$ (a töltésekre ható Lorentz-erő okozza). <strong>Nyugalmi indukció</strong>: változó mágneses mező örvényes elektromos mezőt kelt.</p>
<h3>Lenz törvénye</h3><p>Az indukált áram iránya olyan, hogy mágneses hatásával akadályozza az őt létrehozó változást (a negatív előjel). Ez az energiamegmaradás következménye. Példák: a gyűrűbe tolt mágnes taszítja a gyűrűt (Thomson-gyűrű), a rézcsőben lassan esik a mágnes, örvényáramú fék.</p>
<h3>Örvényáramok</h3><p>Tömör fémben a változó mező örvényáramokat indukál: hasznosak (indukciós főzőlap, fém detektor, fék), károsak (transzformátor vasmagjának melegedése – ezért lemezelt).</p>
<h3>Önindukció</h3><p>A tekercs saját áramának változása is feszültséget indukál: $U_i = -L\dfrac{\Delta I}{\Delta t}$. Bekapcsoláskor késleltetett áramfelfutás, kikapcsoláskor nagy feszültség (szikra; fénycső gyújtása). A tekercs energiája $\tfrac12 LI^2$.</p></div>`,
    peldak: [{ szint: "4 · Emelt", cim: "Sínen mozgó rúd", feladat: R`<p>Két, 40 cm távolságú vízszintes sínen egy rúd 5 m/s-mal mozog függőleges, 0,5 T-s mezőben. A síneket 2 Ω-os ellenállás zárja le. Mekkora az áram, a rudat fékező erő és a fejlődő hőteljesítmény? Mekkora erővel kell húzni a rudat?</p>`,
      megoldas: R`<p>$U_i = Blv = 0{,}5\cdot 0{,}4\cdot 5 = 1\ \mathrm V$, $I = 0{,}5\ \mathrm A$. Fékező erő (Lenz): $F = BIl = 0{,}1\ \mathrm N$. Hőteljesítmény: $I^2R = 0{,}5\ \mathrm W$ = a húzóerő teljesítménye $Fv = 0{,}1\cdot 5 = 0{,}5\ \mathrm W$ ✓ – az energia megmarad. Egyenletes mozgáshoz 0,1 N húzóerő kell.</p>` }],
    hibak: [["Csak a változás számít", "Állandó, akármilyen nagy fluxus nem indukál feszültséget."], ["Lenz", "Az indukált áram a változást akadályozza, nem a mezőt."], ["Menetszám", "N menetes tekercsben N-szeres feszültség."]],
    osszefoglalo: sum(["Fluxusváltozás → indukált feszültség.", "Lenz: az indukált áram akadályozza a változást (energiamegmaradás)."], R`$$U_i = N\frac{\Delta\Phi}{\Delta t} \qquad U_i = Blv \qquad U_i = L\frac{\Delta I}{\Delta t} \qquad E = \tfrac12LI^2$$`),
    erettsegi: [["Feleletválasztós (I.)", "Mikor indukálódik áram; az indukált áram iránya; mágnes esése csőben."], ["Témakifejtés (II.)", "Az elektromágneses indukció és alkalmazásai; Faraday munkássága."], ["Összetett feladatok (III.)", "Mozgó rúd sínen, forgó keret, változó mezőben lévő tekercs feszültsége grafikonról."]],
    feladatok: [
      { id: "ind-01", szint: 1, tipus: "mc", pont: 2, cim: "Mágnes és gyűrű", szoveg: R`Egy felfüggesztett, zárt alumíniumgyűrűhöz rúdmágnest közelítünk. Mi történik?`, opciok: ["A gyűrű a mágnes felé mozdul.", "A gyűrű eltávolodik a mágnestől.", "Semmi, mert az alumínium nem mágneses.", "A gyűrű elfordul."], helyes: 1, tippek: ["Lenz törvénye: mit akadályoz az indukált áram?"], megoldas: R`A gyűrűben indukált áram mágneses hatása akadályozza a közeledést: a gyűrű taszítást érez, eltávolodik.` },
      { id: "ind-02", szint: 2, tipus: "num", pont: 2, cim: "Tekercs feszültsége", szoveg: R`Egy 200 menetes tekercs fluxusa 0,10 s alatt egyenletesen 4,0 mWb-tal változik. Mekkora az indukált feszültség?`, valasz: 8, egyseg: "V", tol: 0.01, tippek: ["$U_i = N\\Delta\\Phi/\\Delta t$"], megoldas: R`$U_i = 200\cdot\dfrac{0{,}004}{0{,}1} = 8\ \mathrm V$.` },
      { id: "ind-03", szint: 2, tipus: "num", pont: 2, cim: "Mozgó rúd", szoveg: R`Egy 20 cm hosszú rúd 3,0 m/s-mal mozog egy rá és sebességére merőleges, 0,50 T-s mezőben. Mekkora feszültség indukálódik benne?`, valasz: 0.3, egyseg: "V", tol: 0.01, tippek: ["$U = Blv$"], megoldas: R`$U = 0{,}5\cdot 0{,}2\cdot 3 = 0{,}3\ \mathrm V$.` },
    ],
  });

  /* =============================== VÁLTAKOZÓ ÁRAM =============================== */
  L({
    id: "valtakozo", parent: "elektromossag", nev: "Váltakozó áram, transzformátor", alcim: "Generátor, effektív érték, transzformátor, rezgőkör",
    elofeltetel: ["Elektromágneses indukció", "Rezgések"],
    kulcsszavak: "váltakozó áram generátor effektív érték csúcsérték transzformátor energiaszállítás induktív kapacitív ellenállás fáziseltolódás rezgőkör thomson háromfázisú",
    attekintes: R`<p class="lead">A hálózati áram szinuszosan váltakozik (50 Hz). Váltakozó áramot könnyű előállítani (generátor) és könnyű átalakítani (transzformátor) – ezért ezt használjuk.</p>`,
    elmelet: R`<div class="prose">
<h3>Generátor</h3><p>Mágneses mezőben egyenletesen forgatott keretben $U = U_{max}\sin\omega t$, ahol $U_{max} = NBA\omega$.</p>
<h3>Effektív érték</h3><p>Az az egyenfeszültség (-áram), amely ohmos ellenálláson ugyanannyi hőt fejleszt: $$U_{eff} = \frac{U_{max}}{\sqrt2}, \qquad I_{eff} = \frac{I_{max}}{\sqrt2}$$ A hálózati 230 V effektív érték (csúcs ≈ 325 V). Ohmos fogyasztón $P = U_{eff}I_{eff}$.</p>
<h3>Transzformátor</h3><p>Közös vasmagon két tekercs; a primer áram váltakozó fluxusa a szekunderben feszültséget indukál: $$\frac{U_1}{U_2} = \frac{N_1}{N_2}, \qquad U_1I_1 \approx U_2I_2$$ Egyenárammal nem működik. Energiaszállítás: nagy feszültségen kis áram → kicsi $I^2R$ veszteség; a fogyasztó előtt letranszformálják.</p>
<h3>Tekercs és kondenzátor váltakozó áramban (emelt)</h3><p>Induktív ellenállás $X_L = \omega L$ (az áram 90°-ot késik), kapacitív $X_C = 1/(\omega C)$ (az áram 90°-ot siet). Ezek nem fogyasztanak átlagosan teljesítményt.</p>
<h3>Elektromágneses rezgőkör</h3><p>Feltöltött kondenzátor és tekercs körében az energia az elektromos és mágneses mező között ingázik: $$T = 2\pi\sqrt{LC}$$ (Thomson-képlet) – a rugós rezgő elektromos megfelelője ($L \leftrightarrow m$, $1/C \leftrightarrow D$). Rádióhangolás, elektromágneses hullámok keltése.</p></div>`,
    peldak: [{ szint: "3 · Közép", cim: "Távvezeték vesztesége", feladat: R`<p>100 kW teljesítményt 5 Ω ellenállású vezetéken szállítunk. Mekkora a veszteség 1 kV-on, illetve 100 kV-on?</p>`,
      megoldas: R`<p>1 kV-on $I = 100\ \mathrm A$, $P_v = I^2R = 50\ \mathrm{kW}$ – a fele elveszne! 100 kV-on $I = 1\ \mathrm A$, $P_v = 5\ \mathrm W$. Százszoros feszültség → tízezred akkora veszteség.</p>` }],
    hibak: [["Effektív érték", "A teljesítményt effektív értékekkel számold; a hálózati 230 V már effektív."], ["Transzformátor árama", "Az áramok a menetszámokkal fordítottan arányosak."], ["ω és f", "$\\omega = 2\\pi f$; 50 Hz-re $\\omega \\approx 314\\ 1/\\mathrm s$."]],
    osszefoglalo: sum(["A váltakozó áramot a transzformátor könnyen átalakítja.", "Nagy feszültségű szállítás → kis veszteség."], R`$$U_{eff} = \frac{U_{max}}{\sqrt2} \qquad \frac{U_1}{U_2} = \frac{N_1}{N_2} \qquad T = 2\pi\sqrt{LC}$$`),
    erettsegi: [["Feleletválasztós (I.)", "Effektív érték, transzformátor áttétele, miért nagy feszültségen szállítunk."], ["Témakifejtés (II.)", "Váltakozó áram előállítása és szállítása, transzformátor; az elektromos hálózat."], ["Összetett feladatok (III.)", "Transzformátor és távvezeték veszteség; generátor feszültsége; rezgőkör (emelt)."]],
    feladatok: [
      { id: "vak-01", szint: 1, tipus: "mc", pont: 2, cim: "Transzformátor egyenárammal", szoveg: R`Mi történik, ha egy transzformátor primer tekercsére egyenfeszültséget kapcsolunk?`, opciok: ["A szekunder feszültség a menetszámok arányában jelenik meg.", "Állandósult állapotban a szekunderen nincs feszültség.", "A szekunder feszültség váltakozó lesz.", "A transzformátor egyenirányít."], helyes: 1, tippek: ["Mi indukál feszültséget?"], megoldas: R`Állandó áram állandó fluxust kelt, annak nincs változása → nincs indukált feszültség (csak a be- és kikapcsolás pillanatában).` },
      { id: "vak-02", szint: 2, tipus: "num", pont: 2, cim: "Effektív érték", szoveg: R`Egy szinuszos feszültség csúcsértéke 325 V. Mekkora az effektív értéke?`, valasz: 229.81, egyseg: "V", tol: 0.01, tippek: ["Ossz √2-vel."], megoldas: R`$325/\sqrt2 \approx 230\ \mathrm V$.` },
      { id: "vak-03", szint: 2, tipus: "num", pont: 2, cim: "Transzformátor", szoveg: R`Egy transzformátor primer tekercse 1150, szekundere 60 menetes. Mekkora a szekunder feszültség, ha a primer 230 V?`, valasz: 12, egyseg: "V", tol: 0.01, tippek: ["$U_2 = U_1 N_2/N_1$"], megoldas: R`$U_2 = 230\cdot 60/1150 = 12\ \mathrm V$.` },
    ],
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
