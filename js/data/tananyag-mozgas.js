/* PHYSICS OS — tananyag: 1. Mozgás és egyensúly (a kinematika a topics.js-ben) */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const R = String.raw;
  const L = PO.lesson;

  /* =============================== DINAMIKA =============================== */
  L({
    id: "dinamika", parent: "mozgas", nev: "Dinamika: Newton-törvények, erők", alcim: "Miért mozognak úgy a testek, ahogy mozognak?",
    elofeltetel: ["Kinematika", "vektorok felbontása"],
    kulcsszavak: "dinamika newton törvény tehetetlenség erő tömeg kölcsönhatás súrlódás lejtő rugóerő centripetális közegellenállás súly súlytalanság",
    attekintes: R`
<p class="lead">A kinematika leírja a mozgást, a dinamika megmagyarázza: a mozgásállapot változásának oka a <strong>kölcsönhatás</strong>, amelyet az <strong>erővel</strong> jellemzünk.</p>
<div class="prose"><p>Ebben a témakörben megtanulod:</p><ul>
<li>Newton három törvényét és az inerciarendszer fogalmát;</li>
<li>a fontos erőfajtákat: nehézségi erő, súly, nyomóerő, kötélerő, rugóerő, súrlódás, közegellenállás;</li>
<li>a dinamikai feladatmegoldás menetét (erőábra → komponensek → $\sum F = ma$);</li>
<li>a lejtőt, a csigákat, a körmozgás dinamikáját és a súlytalanságot.</li></ul></div>
<div class="callout"><div class="callout-t">Szemléletesen</div>Az erő nem a mozgást „tartja fenn”, hanem a sebességet <em>változtatja</em>. Egy jégkorongot meglökve az erőhatás megszűnte után is csúszik tovább – azért lassul, mert a súrlódás fékezi. Arisztotelész ezt még fordítva gondolta; Galilei és Newton fordította meg.</div>`,
    elmelet: R`<div class="prose">
<h3>Newton I. törvénye – a tehetetlenség törvénye</h3>
<p>Minden test megtartja nyugalmi állapotát vagy egyenes vonalú egyenletes mozgását, amíg egy másik test (mező) ennek megváltoztatására nem kényszeríti. Azokat a vonatkoztatási rendszereket, amelyekben ez igaz, <strong>inerciarendszernek</strong> nevezzük (jó közelítéssel a Földhöz rögzített rendszer). Egy gyorsuló busz nem inerciarendszer: benne a testek „ok nélkül” gyorsulni látszanak.</p>
<h3>Newton II. törvénye – a dinamika alaptörvénye</h3>
<p>$$\sum \vec F = m\,\vec a$$ A testre ható erők <em>vektori</em> eredője határozza meg a gyorsulást; a tömeg a tehetetlenség mértéke. 1 N az az erő, amely 1 kg tömegű testet 1 m/s² gyorsulással mozgat. Általánosabb alakja: $\sum\vec F = \Delta\vec I/\Delta t$ (lendületváltozás).</p>
<h3>Newton III. törvénye – hatás-ellenhatás</h3>
<p>Ha az A test erőt fejt ki a B testre, akkor B is erőt fejt ki A-ra: a két erő egyenlő nagyságú, ellentétes irányú, és <strong>két különböző testre hat</strong> – ezért nem „oltják ki” egymást. (A ló húzza a kocsit, a kocsi visszahúzza a lovat; a ló azért gyorsul, mert a talaj tolja előre.)</p>
<h3>Erőtörvények</h3>
<ul>
<li><strong>Nehézségi erő</strong>: $\vec F_g = m\vec g$ – a Föld vonzása (és a forgás kis hatása).</li>
<li><strong>Súly</strong>: az az erő, amellyel a test az alátámasztást nyomja vagy a felfüggesztést húzza. Nyugalomban $G = mg$; gyorsuló liftben $G = m(g + a)$ (felfelé gyorsuláskor). Szabadon eső testnek nincs súlya: <strong>súlytalanság</strong>.</li>
<li><strong>Nyomóerő (kényszererő)</strong>: a felület merőlegesen tol – akkora, amekkora a mozgásállapothoz kell.</li>
<li><strong>Rugóerő</strong>: $F = -D\,\Delta l$ (Hooke-törvény), a megnyúlással arányos, azzal ellentétes.</li>
<li><strong>Csúszási súrlódás</strong>: $F_s = \mu F_{ny}$, a relatív mozgással ellentétes. <strong>Tapadási súrlódás</strong>: $F_t \le \mu_0 F_{ny}$ – csak akkora, amekkora a nyugalomhoz kell! ($\mu_0 > \mu$ általában.)</li>
<li><strong>Közegellenállás</strong>: $F = \tfrac12 C\rho A v^2$ – nagy sebességnél a sebesség négyzetével nő; ezért van esésnek határsebessége.</li>
</ul>
<h3>A feladatmegoldás menete</h3>
<ol><li>Rajzold le a testet, és csak a <em>rá ható</em> erőket (nem a másik testre hatókat!).</li>
<li>Válassz koordináta-rendszert (lejtőn: a lejtővel párhuzamos és arra merőleges tengely).</li>
<li>Bontsd fel az erőket, írd fel tengelyenként $\sum F_x = ma_x$, $\sum F_y = ma_y$.</li>
<li>Összekapcsolt testeknél minden testre külön egyenlet; a kötélerő belső erő.</li></ol>
<h3>Lejtő</h3>
<p>A nehézségi erő lejtő irányú összetevője $mg\sin\alpha$, a merőleges $mg\cos\alpha$, ezért $F_{ny} = mg\cos\alpha$. Súrlódással lefelé csúszva $a = g(\sin\alpha - \mu\cos\alpha)$. A test akkor indul meg magától, ha $\tan\alpha > \mu_0$.</p>
<h3>A körmozgás dinamikája</h3>
<p>Egyenletes körmozgáshoz a középpont felé mutató eredő erő kell: $$F_{cp} = m\frac{v^2}{r} = m r\omega^2$$ Ez nem egy új erőfajta, hanem a meglévő erők (kötélerő, súrlódás, gravitáció, nyomóerő) eredője. Kanyarodó autónál a tapadási súrlódás, a Hold keringésénél a gravitáció adja. A „centrifugális erő” csak a forgó (nem inercia-)rendszerben jelenik meg tehetetlenségi erőként.</p>
</div>`,
    peldak: [
      { szint: "3 · Közép", cim: "Láda húzása súrlódással", feladat: R`<p>Egy 20 kg-os ládát vízszintes talajon 120 N erővel, a vízszinteshez képest 30°-os szögben felfelé húzunk. $\mu = 0{,}4$, $g = 10\ \mathrm{m/s^2}$. Mekkora a gyorsulás?</p>`,
        megoldas: R`<p>Függőlegesen nincs gyorsulás: $F_{ny} + F\sin30° = mg \Rightarrow F_{ny} = 200 - 60 = 140\ \mathrm N$. A húzás függőleges összetevője <em>csökkenti</em> a nyomóerőt!</p>
<p>Súrlódás: $F_s = 0{,}4 \cdot 140 = 56\ \mathrm N$. Vízszintesen: $F\cos30° - F_s = ma$: $$a = \frac{103{,}9 - 56}{20} \approx 2{,}4\ \mathrm{m/s^2}$$</p>` },
      { szint: "4 · Emelt", cim: "Atwood-gép (állócsigán átvetett fonal)", feladat: R`<p>Elhanyagolható tömegű állócsigán átvetett fonal végein 3 kg és 2 kg tömegű test lóg. Mekkora a gyorsulásuk és a fonalerő? ($g = 9{,}81\ \mathrm{m/s^2}$)</p>`,
        megoldas: R`<p>Mindkét testre külön egyenlet (a nehezebb lefelé, a könnyebb felfelé gyorsul, azonos nagyságú $a$-val):</p>
<p>$m_1 g - K = m_1 a$, $\quad K - m_2 g = m_2 a$. Összeadva: $$a = \frac{m_1 - m_2}{m_1 + m_2}\,g = \frac15 \cdot 9{,}81 \approx 1{,}96\ \mathrm{m/s^2}$$</p>
<p>$K = m_2(g + a) = 2\cdot 11{,}77 \approx 23{,}5\ \mathrm N$. A fonalerő a két súly (19,6 N és 29,4 N) <em>között</em> van – ez jó ellenőrzés.</p>` },
      { szint: "4 · Emelt", cim: "Kanyar a maximális sebességgel", feladat: R`<p>Vízszintes úton 50 m sugarú kanyar. A gumi és az aszfalt között $\mu_0 = 0{,}8$. Legfeljebb mekkora sebességgel vehető a kanyar? Mi változik esős úton ($\mu_0 = 0{,}4$)?</p>`,
        megoldas: R`<p>A centripetális erőt a tapadási súrlódás adja: $m\dfrac{v^2}{r} \le \mu_0 mg$, így $$v_{max} = \sqrt{\mu_0 g r} = \sqrt{0{,}8\cdot 9{,}81 \cdot 50} \approx 19{,}8\ \mathrm{m/s} \approx 71\ \mathrm{km/h}$$</p>
<p>A tömeg kiesett! Esős úton $\sqrt{0{,}4\cdot 9{,}81\cdot 50} \approx 14\ \mathrm{m/s} \approx 50\ \mathrm{km/h}$: a felére csökkent $\mu_0$ csak $\sqrt2$-ed részére csökkenti a sebességet.</p>` },
    ],
    hibak: [
      ["Erő és mozgás", "Egyenletes mozgáshoz NEM kell eredő erő. Ha a test egyenletesen mozog, az erők eredője nulla."],
      ["Hatás-ellenhatás", "A két erő különböző testekre hat, nem egyenlítik ki egymást. Az asztalon fekvő könyvre ható nehézségi erő és nyomóerő NEM hatás-ellenhatás pár (mindkettő a könyvre hat)."],
      ["Tapadási súrlódás", "$\\mu_0 F_{ny}$ csak a maximuma! Nyugvó testnél akkora, amekkora a nyugalomhoz kell."],
      ["Nyomóerő", "Nem mindig $mg$: lejtőn $mg\\cos\\alpha$, ferde húzásnál módosul, liftben is más."],
      ["Centripetális erő", "Nem kell külön berajzolni az erőábrába – a valódi erők eredője. „Centrifugális erőt” inerciarendszerben ne rajzolj!"],
      ["Súlytalanság", "Az űrállomáson is hat a gravitáció (kb. 90%-a a felszíninek) – a súlytalanság oka a szabadesés."],
    ],
    osszefoglalo: R`<div class="grid g2"><div class="panel"><div class="panel-title">Kulcsgondolatok</div><ul class="small">
<li>Erő = kölcsönhatás mértéke; a sebesség <em>változásának</em> oka.</li><li>$\sum\vec F = m\vec a$ vektoregyenlet – tengelyenként írd fel.</li>
<li>Hatás és ellenhatás két különböző testre hat.</li><li>Körmozgáshoz a középpont felé mutató eredő erő kell.</li></ul></div>
<div class="panel"><div class="panel-title">Képletek</div>
$$\sum F = ma \qquad F_s = \mu F_{ny} \qquad F = D\Delta l$$
$$a_{lejtő} = g(\sin\alpha - \mu\cos\alpha) \qquad F_{cp} = m\frac{v^2}{r}$$</div></div>`,
    erettsegi: [
      ["Feleletválasztós (I.)", "Hatás-ellenhatás felismerése, lift és súly, súlytalanság, tapadási súrlódás nagysága, erő és sebesség iránya körpályán."],
      ["Témakifejtés (II.)", "Newton törvényei; súrlódás és közegellenállás; a súly és a súlytalanság – definíciók, kísérletek, Galilei–Newton tudománytörténet."],
      ["Összetett feladatok (III.)", "Csigás, lejtős, összekapcsolt testek; kanyarodó jármű; kötélen pörgetett test függőleges körpályán (a legfelső pontban a kötélerő minimális)."],
      ["Szóbeli", "A dinamika alaptörvényének vizsgálata (gyorsulás mérése), súrlódási együttható mérése lejtőn."],
    ],
    feladatok: [
      { id: "din-01", szint: 1, tipus: "mc", pont: 2, cim: "Mérleg a liftben", szoveg: R`Egy ember fürdőszobamérlegen áll a liftben. A lift felfelé halad és <em>lassul</em>. Mit mutat a mérleg az álló lifthez képest?`,
        opciok: ["Többet", "Ugyanannyit", "Kevesebbet", "Nullát"], helyes: 2,
        tippek: ["Merre mutat a gyorsulás, ha felfelé haladva lassul?", "Lefelé gyorsulásnál $F_{ny} = m(g - a)$."],
        megoldas: R`Felfelé haladva lassul → a gyorsulás lefelé mutat. $mg - F_{ny} = ma$, így $F_{ny} = m(g - a) < mg$: a mérleg kevesebbet mutat.` },
      { id: "din-02", szint: 2, tipus: "num", pont: 2, cim: "Húzás súrlódással", szoveg: R`Egy 2,0 kg-os testet vízszintes talajon 10 N vízszintes erővel húzunk. A csúszási súrlódási együttható 0,20, $g = 10\ \mathrm{m/s^2}$. Mekkora a gyorsulás?`,
        valasz: 3, egyseg: "m/s²", tol: 0.01, tippek: ["$F_s = \\mu mg$", "$a = (F - F_s)/m$"],
        megoldas: R`$F_s = 0{,}2\cdot 2\cdot 10 = 4\ \mathrm N$, $\ a = \dfrac{10 - 4}{2} = 3\ \mathrm{m/s^2}$.` },
      { id: "din-03", szint: 4, tipus: "num", pont: 4, cim: "Atwood-gép", szoveg: R`Állócsigán átvetett fonal végein 3,0 kg és 2,0 kg tömegű test lóg. Mekkora a gyorsulásuk? ($g = 9{,}81\ \mathrm{m/s^2}$; a csiga és a fonal tömege elhanyagolható.)`,
        valasz: 1.962, egyseg: "m/s²", tol: 0.01, tippek: ["Írd fel mindkét testre külön a dinamika alapegyenletét.", "$a = \\dfrac{m_1 - m_2}{m_1 + m_2}g$"],
        megoldas: R`$a = \dfrac{3 - 2}{3 + 2}\cdot 9{,}81 \approx 1{,}96\ \mathrm{m/s^2}$.` },
    ],
  });

  /* =============================== LENDÜLET =============================== */
  L({
    id: "lendulet", parent: "mozgas", nev: "Lendület, ütközések", alcim: "A mozgás „mennyisége” és a megmaradási törvény",
    elofeltetel: ["Dinamika"],
    kulcsszavak: "lendület impulzus erőlökés megmaradás ütközés rugalmas rugalmatlan rakéta visszalökődés zárt rendszer",
    attekintes: R`
<p class="lead">A <strong>lendület</strong> ($\vec I = m\vec v$) a mozgásállapot jellemzője. Zárt rendszerben az összes lendület állandó – ez a fizika egyik legfontosabb megmaradási törvénye.</p>
<div class="prose"><ul><li>lendület, erőlökés, a lendülettétel;</li><li>a lendületmegmaradás feltétele és alkalmazásai (ütközés, szétlökődés, rakéta);</li><li>rugalmas és rugalmatlan ütközések, energiaviszonyok.</li></ul></div>
<div class="callout"><div class="callout-t">Szemléletesen</div>Egy lassú teherautót nehezebb megállítani, mint egy gyors teniszlabdát – a lendület a tömeget és a sebességet együtt veszi figyelembe. A légzsák nem a lendületváltozást csökkenti, hanem megnyújtja az időt, így kisebb az erő.</div>`,
    elmelet: R`<div class="prose">
<h3>Lendület és erőlökés</h3>
<p>$$\vec I = m\vec v \quad [\mathrm{kg\cdot m/s}]$$ A lendület vektor, iránya a sebességé. Newton II. törvénye lendülettel: $$\vec F\,\Delta t = \Delta\vec I$$ Az $\vec F\Delta t$ az <strong>erőlökés</strong>. Ugyanakkora lendületváltozás hosszabb idő alatt kisebb erővel jár: légzsák, gyűrődési zóna, térdhajlítás ugráskor, kesztyű.</p>
<h3>A lendületmegmaradás törvénye</h3>
<p>Ha egy rendszerre ható külső erők eredője nulla (<strong>zárt rendszer</strong>), akkor a rendszer összes lendülete állandó: $$\sum m_i\vec v_i = \text{állandó}$$ A belső erők (pl. az ütköző testek közötti erő) Newton III. törvénye miatt páronként kioltják egymás lendületváltozását. Ütközéskor a rövid idő alatt a külső erők (gravitáció, súrlódás) hatása gyakran elhanyagolható.</p>
<h3>Ütközések</h3>
<ul>
<li><strong>Tökéletesen rugalmas</strong>: a mozgási energia is megmarad. Egyenes ütközésnél azonos tömegek sebességet cserélnek.</li>
<li><strong>Rugalmatlan</strong>: a mozgási energia egy része hővé, deformációvá alakul.</li>
<li><strong>Tökéletesen rugalmatlan</strong>: a testek összetapadnak, közös sebességük $v' = \dfrac{m_1v_1 + m_2v_2}{m_1 + m_2}$. Itt a legnagyobb az energiaveszteség.</li>
</ul>
<p>A lendület <em>minden</em> ütközésben megmarad; az energia csak rugalmasban.</p>
<h3>Szétlökődés, rakéta</h3>
<p>Nyugvó rendszer szétlökődésekor az összes lendület nulla marad: $m_1v_1 = m_2v_2$ (ellentétes irányban). Így működik a puska visszarúgása, a rakéta (a kiáramló gáz hátra, a rakéta előre kap lendületet – légüres térben is!), a medúza, a tintahal.</p>
<h3>Ferde (kétdimenziós) ütközés</h3>
<p>A lendületmegmaradást komponensenként kell felírni: $x$ és $y$ irányban külön. (Emelt szinten főleg szöveges, vektorábrás feladatokban fordul elő.)</p>
</div>`,
    peldak: [
      { szint: "3 · Közép", cim: "Ugrás a csónakba", feladat: R`<p>Egy 60 kg-os ember 3 m/s vízszintes sebességgel beleugrik egy álló, 40 kg-os csónakba. Mekkora sebességgel indul el a csónak? Mennyi mozgási energia „vész el”?</p>`,
        megoldas: R`<p>Tökéletesen rugalmatlan: $60\cdot 3 + 40\cdot 0 = 100\cdot v' \Rightarrow v' = 1{,}8\ \mathrm{m/s}$.</p>
<p>$E_0 = \tfrac12\cdot 60\cdot 9 = 270\ \mathrm J$, $E_1 = \tfrac12 \cdot 100\cdot 1{,}8^2 = 162\ \mathrm J$. Hővé (deformációvá) alakult: $108\ \mathrm J$, az eredeti 40%-a.</p>` },
      { szint: "3 · Közép", cim: "Labda és fal – erőlökés", feladat: R`<p>Egy 150 g-os labda 20 m/s-mal merőlegesen falnak csapódik, és ugyanekkora sebességgel pattan vissza. Az ütközés 0,01 s-ig tart. Mekkora átlagos erőt fejt ki a fal a labdára?</p>`,
        megoldas: R`<p>Előjelekre figyelj! Pozitív irány a fal felé: $\Delta I = m(v_2 - v_1) = 0{,}15\,(-20 - 20) = -6\ \mathrm{kg\,m/s}$.</p>
<p>$F = \dfrac{\Delta I}{\Delta t} = \dfrac{-6}{0{,}01} = -600\ \mathrm N$, azaz 600 N a faltól elfelé. Ha a labda megállt volna (gyurma), csak 300 N lenne – a visszapattanás kétszeres lendületváltozás.</p>` },
      { szint: "4 · Emelt", cim: "Ballisztikus inga", feladat: R`<p>Egy 10 g-os lövedék beleáll egy fonalon függő 2,0 kg-os fahasábba, amely ennek hatására 20 cm-rel emelkedik meg. Mekkora volt a lövedék sebessége? ($g = 9{,}81\ \mathrm{m/s^2}$)</p>`,
        megoldas: R`<p>Két lépés, két különböző törvény! <strong>1. Ütközés</strong> (rövid, rugalmatlan): csak a lendület marad meg: $mv = (m + M)u$.</p>
<p><strong>2. Kilendülés</strong>: már nincs ütközés, az energia megmarad: $\tfrac12 (m+M)u^2 = (m+M)gh \Rightarrow u = \sqrt{2gh} \approx 1{,}98\ \mathrm{m/s}$.</p>
<p>$v = \dfrac{m + M}{m}u = \dfrac{2{,}01}{0{,}01}\cdot 1{,}98 \approx 398\ \mathrm{m/s}$. Hiba lenne az egészre energiamegmaradást felírni – az ütközésben az energia 99,5%-a hővé alakul!</p>` },
    ],
    hibak: [
      ["Előjel", "A lendület vektor: visszapattanáskor a sebesség előjelet vált, a lendületváltozás nagysága $m(v_1 + v_2)$."],
      ["Energia vs. lendület", "Ütközésben a lendület mindig, az energia csak rugalmas esetben marad meg. Rugalmatlan ütközésre ne írj energiamegmaradást!"],
      ["Zárt rendszer", "Megmaradás csak akkor, ha a külső erők eredője nulla (vagy az ütközés ideje alatt elhanyagolható)."],
      ["Mértékegység", "A lendület egysége kg·m/s = N·s – nem joule."],
    ],
    osszefoglalo: R`<div class="grid g2"><div class="panel"><div class="panel-title">Kulcsgondolatok</div><ul class="small">
<li>Zárt rendszer összes lendülete állandó.</li><li>Az erőlökés egyenlő a lendületváltozással.</li><li>Rugalmatlan ütközésben mozgási energia vész el; a lendület nem.</li></ul></div>
<div class="panel"><div class="panel-title">Képletek</div>$$I = mv \qquad F\Delta t = \Delta I$$$$m_1v_1 + m_2v_2 = m_1v_1' + m_2v_2'$$</div></div>`,
    erettsegi: [
      ["Feleletválasztós (I.)", "Mi marad meg ütközésben; visszalökődés; erőlökés grafikonja (F–t görbe alatti terület)."],
      ["Témakifejtés (II.)", "A lendületmegmaradás törvénye és alkalmazásai (rakéta, ütközések), kísérletek kiskocsikkal."],
      ["Összetett feladatok (III.)", "Ballisztikus inga, ütközés utáni csúszás súrlódással, robbanás két részre – gyakran energiával kombinálva."],
    ],
    feladatok: [
      { id: "len-01", szint: 1, tipus: "mc", pont: 2, cim: "Mikor marad meg a lendület?", szoveg: R`Melyik állítás igaz egy rendszer összes lendületére?`,
        opciok: ["Mindig állandó.", "Csak rugalmas ütközésben állandó.", "Állandó, ha a rendszerre ható külső erők eredője nulla.", "Állandó, ha a mozgási energia állandó."], helyes: 2,
        tippek: ["Mi változtathatja meg a rendszer lendületét?"], megoldas: R`A lendületet csak külső erő változtathatja meg; zárt rendszerben (külső erők eredője nulla) állandó – ütközés típusától függetlenül.` },
      { id: "len-02", szint: 2, tipus: "num", pont: 2, cim: "Beugrás a csónakba", szoveg: R`Egy 60 kg-os ember 3,0 m/s vízszintes sebességgel beugrik egy álló, 40 kg-os csónakba. Mekkora közös sebességgel mozognak tovább?`,
        valasz: 1.8, egyseg: "m/s", tol: 0.01, tippek: ["Tökéletesen rugalmatlan ütközés."], megoldas: R`$v' = \dfrac{60\cdot 3}{60 + 40} = 1{,}8\ \mathrm{m/s}$.` },
      { id: "len-03", szint: 3, tipus: "num", pont: 3, cim: "Visszapattanó labda", szoveg: R`Egy 0,15 kg-os labda 20 m/s-mal merőlegesen falnak ütközik, és 20 m/s-mal pattan vissza. Az ütközés 0,010 s-ig tart. Mekkora a falra ható átlagos erő nagysága?`,
        valasz: 600, egyseg: "N", tol: 0.01, tippek: ["A sebesség előjelet vált: $\\Delta v = 40\\ \\mathrm{m/s}$."], megoldas: R`$F = \dfrac{m\Delta v}{\Delta t} = \dfrac{0{,}15\cdot 40}{0{,}01} = 600\ \mathrm N$.` },
    ],
  });

  /* =============================== MEREV TEST =============================== */
  L({
    id: "merev-test", parent: "mozgas", nev: "Merev test: egyensúly, forgás", alcim: "Forgatónyomaték, egyensúly, tehetetlenségi nyomaték, perdület",
    elofeltetel: ["Dinamika", "körmozgás"],
    kulcsszavak: "merev test forgatónyomaték erőkar egyensúly emelő tömegközéppont súlypont tehetetlenségi nyomaték perdület forgási energia gördülés steiner",
    attekintes: R`
<p class="lead">A kiterjedt testek nemcsak haladni, hanem <strong>forogni</strong> is tudnak. A forgást a <strong>forgatónyomaték</strong> okozza – ahogyan a haladást az erő.</p>
<div class="prose"><ul><li>forgatónyomaték, erőkar, az egyensúly két feltétele;</li><li>emelők, tömegközéppont, stabilitás;</li><li>forgómozgás dinamikája: tehetetlenségi nyomaték, $M = \Theta\beta$;</li><li>forgási energia, gördülés, perdület és megmaradása.</li></ul></div>
<div class="callout"><div class="callout-t">Szemléletesen</div>Az ajtót a kilincsnél könnyű kinyitni, a zsanér mellett nehéz: ugyanaz az erő nagyobb karral nagyobb forgató hatást fejt ki. A műkorcsolyázó karjait behúzva gyorsabban pörög – a perdülete állandó.</div>`,
    elmelet: R`<div class="prose">
<h3>Forgatónyomaték</h3>
<p>$$M = F\cdot k$$ ahol $k$ az <strong>erőkar</strong>: a forgástengely és az erő hatásvonalának (merőleges) távolsága. Ferde erőnél $M = F\,r\sin\alpha$. Előjel: az óramutatóval ellentétes forgatás pozitív (megállapodás).</p>
<h3>A merev test egyensúlya</h3>
<p>Két feltétel együtt kell: $$\sum\vec F = 0 \qquad \text{és} \qquad \sum M = 0 \ \text{(bármely pontra)}$$ Ügyes trükk: a forgáspontot az ismeretlen erő támadáspontjába választva az kiesik az egyenletből.</p>
<h3>Emelők, tömegközéppont</h3>
<p>Egyoldalú és kétoldalú emelő: $F_1k_1 = F_2k_2$. Erőt nyerünk, utat vesztünk (munkát nem nyerünk – „aranyszabály”). A <strong>tömegközéppont</strong>: $x_{tkp} = \dfrac{\sum m_ix_i}{\sum m_i}$; homogén nehézségi erőtérben egybeesik a súlyponttal. Alátámasztott test akkor stabil, ha a súlypontján átmenő függőleges az alátámasztási felületen belül halad; minél lejjebb van a súlypont, annál stabilabb.</p>
<h3>Forgómozgás dinamikája</h3>
<p>$$M = \Theta\,\beta$$ A <strong>tehetetlenségi nyomaték</strong> $\Theta = \sum m_ir_i^2$ a forgással szembeni tehetetlenség mértéke – nemcsak a tömegtől, hanem annak elhelyezkedésétől is függ. Néhány érték: vékony gyűrű $mr^2$, tömör henger $\tfrac12mr^2$, tömör gömb $\tfrac25mr^2$, rúd a közepén át $\tfrac1{12}ml^2$. <strong>Steiner-tétel</strong>: párhuzamos, $d$ távolságú tengelyre $\Theta = \Theta_{tkp} + md^2$.</p>
<h3>Forgási energia, gördülés</h3>
<p>$$E_{forg} = \tfrac12\Theta\omega^2$$ Csúszás nélkül gördülő testnél $v = r\omega$, és a mozgási energia $\tfrac12mv^2 + \tfrac12\Theta\omega^2$. Lejtőn legurulva a tömör henger lassabban ér le, mint egy súrlódásmentesen lecsúszó test, mert az energia egy része forgásra fordítódik; a gyűrű még lassabban.</p>
<h3>Perdület (impulzusmomentum)</h3>
<p>$$N = \Theta\,\omega$$ Ha a testre ható külső forgatónyomatékok eredője nulla, a perdület állandó: $\Theta_1\omega_1 = \Theta_2\omega_2$. Példák: korcsolyázó piruettje, műugró, a helikopter farokrotorja, a bolygók gyorsabb mozgása napközelben (Kepler II.).</p>
</div>`,
    peldak: [
      { szint: "3 · Közép", cim: "Mérleghinta", feladat: R`<p>Egy 3,0 m hosszú, középen alátámasztott mérleghinta egyik végén 30 kg-os gyerek ül. Hova üljön a 45 kg-os testvére, hogy egyensúly legyen? Mekkora erővel nyomja a hinta az alátámasztást (a hinta tömege 20 kg, $g = 10\ \mathrm{m/s^2}$)?</p>`,
        megoldas: R`<p>Nyomatékok a tengelyre: $300\cdot 1{,}5 = 450\cdot k \Rightarrow k = 1{,}0\ \mathrm m$ a középponttól.</p>
<p>Erők egyensúlya: $F = 300 + 450 + 200 = 950\ \mathrm N$. (A hinta súlya a tengelyen hat, nincs nyomatéka.)</p>` },
      { szint: "4 · Emelt", cim: "Létra a falnak támasztva", feladat: R`<p>Egy 5 m hosszú, 20 kg-os létra súrlódásmentes falnak támaszkodik, a talajjal 60°-os szöget zár be. Mekkora erővel nyomja a fal a létrát, és legalább mekkora tapadási súrlódási együttható kell a talajon? ($g = 10\ \mathrm{m/s^2}$)</p>`,
        megoldas: R`<p>Erők: súly $G = 200\ \mathrm N$ a létra közepén; fal: vízszintes $F_f$; talaj: függőleges $F_{ny}$ és vízszintes $F_t$.</p>
<p>Függőlegesen: $F_{ny} = 200\ \mathrm N$. Vízszintesen: $F_t = F_f$.</p>
<p>Nyomaték a talppontra (két ismeretlen kiesik!): $F_f\cdot 5\sin60° = G\cdot 2{,}5\cos60°$ → $F_f = \dfrac{200\cdot 1{,}25}{4{,}33} \approx 57{,}7\ \mathrm N$.</p>
<p>$\mu_0 \ge \dfrac{F_t}{F_{ny}} = \dfrac{57{,}7}{200} \approx 0{,}29$.</p>` },
      { szint: "4 · Emelt", cim: "Guruló henger a lejtőn", feladat: R`<p>Tömör henger csúszás nélkül gurul le egy 1,0 m magas lejtőről. Mekkora sebességgel ér le? Hasonlítsd össze egy súrlódásmentesen lecsúszó testtel!</p>`,
        megoldas: R`<p>$mgh = \tfrac12 mv^2 + \tfrac12\cdot\tfrac12 mr^2\cdot\left(\tfrac vr\right)^2 = \tfrac34 mv^2$, így $$v = \sqrt{\tfrac43 gh} \approx 3{,}62\ \mathrm{m/s}$$</p>
<p>A csúszó test: $\sqrt{2gh} \approx 4{,}43\ \mathrm{m/s}$. A henger energiájának $\tfrac13$-a forgási energia. A tömeg és a sugár kiesett: minden tömör henger ugyanúgy gurul.</p>` },
    ],
    hibak: [
      ["Erőkar", "A kar a tengely és az erő <em>hatásvonalának</em> merőleges távolsága, nem a támadáspont távolsága (ferde erőnél $r\\sin\\alpha$)."],
      ["Két feltétel", "Egyensúlyhoz az erők eredője ÉS a nyomatékok összege is nulla kell. Az egyik nem elég."],
      ["Tehetetlenségi nyomaték", "Mindig adott tengelyre vonatkozik; a táblázati érték a tömegközépponton átmenő tengelyre szól (különben Steiner)."],
      ["Gördülés", "A forgási energiát nem szabad kihagyni: guruló testnél $E = \\tfrac12mv^2 + \\tfrac12\\Theta\\omega^2$."],
    ],
    osszefoglalo: R`<div class="grid g2"><div class="panel"><div class="panel-title">Kulcsgondolatok</div><ul class="small">
<li>Egyensúly: $\sum F = 0$ és $\sum M = 0$.</li><li>Forgásnál a tömeg szerepét $\Theta$, az erőét $M$, a gyorsulásét $\beta$ veszi át.</li><li>Külső nyomaték nélkül a perdület állandó.</li></ul></div>
<div class="panel"><div class="panel-title">Képletek</div>$$M = Fk \qquad M = \Theta\beta \qquad E = \tfrac12\Theta\omega^2$$$$N = \Theta\omega \qquad \Theta = \Theta_0 + md^2$$</div></div>`,
    erettsegi: [
      ["Feleletválasztós (I.)", "Emelők, egyensúly felismerése, stabilitás, perdületmegmaradás (korcsolyázó), melyik test gurul le hamarabb."],
      ["Témakifejtés (II.)", "Merev testek egyensúlya, egyszerű gépek; forgómozgás és perdületmegmaradás."],
      ["Összetett feladatok (III.)", "Létra, gerenda, alátámasztott rúd; csigára tekert fonal nehezékkel (emelt); guruló testek energiája."],
      ["Szóbeli", "Tömegmérés emelővel (ismert tömeg és erőkarok alapján)."],
    ],
    feladatok: [
      { id: "mer-01", szint: 1, tipus: "mc", pont: 2, cim: "Az egyensúly feltétele", szoveg: R`Mikor van egy merev test egyensúlyban (nyugalomban)?`,
        opciok: ["Ha a rá ható erők eredője nulla.", "Ha a rá ható forgatónyomatékok összege nulla.", "Ha az erők eredője és a forgatónyomatékok összege is nulla.", "Ha a súlypontja alá van támasztva."], helyes: 2,
        tippek: ["Erőpár: eredő nulla, mégis forgat."], megoldas: R`Mindkét feltétel kell: az erők eredője nulla (nem halad) és a nyomatékok összege nulla (nem fordul el). Egy erőpár eredője nulla, mégis forgásba hozza a testet.` },
      { id: "mer-02", szint: 2, tipus: "num", pont: 2, cim: "Mérleghinta", szoveg: R`Egy 3,0 m hosszú, középen alátámasztott mérleghinta egyik végén 30 kg-os gyerek ül. Milyen messze üljön a tengelytől a 45 kg-os gyerek, hogy egyensúly legyen?`,
        valasz: 1.0, egyseg: "m", tol: 0.01, tippek: ["$m_1k_1 = m_2k_2$", "Az első gyerek karja 1,5 m."], megoldas: R`$30\cdot 1{,}5 = 45\cdot k \Rightarrow k = 1{,}0\ \mathrm m$.` },
      { id: "mer-03", szint: 4, tipus: "num", pont: 4, cim: "Guruló henger", szoveg: R`Tömör henger csúszás nélkül gurul le egy 1,0 m magas lejtőről, nyugalomból. Mekkora a sebessége a lejtő alján? ($g = 9{,}81\ \mathrm{m/s^2}$)`,
        valasz: 3.617, egyseg: "m/s", tol: 0.01, tippek: ["$\\Theta = \\tfrac12mr^2$, $\\omega = v/r$", "$mgh = \\tfrac34mv^2$"], megoldas: R`$v = \sqrt{\tfrac43 gh} = \sqrt{13{,}08} \approx 3{,}62\ \mathrm{m/s}$.` },
    ],
  });

  /* =============================== GRAVITÁCIÓ =============================== */
  L({
    id: "gravitacio", parent: "mozgas", nev: "Gravitáció, bolygómozgás", alcim: "Az általános tömegvonzás és a Kepler-törvények",
    elofeltetel: ["Dinamika", "körmozgás"],
    kulcsszavak: "gravitáció tömegvonzás newton kepler törvények bolygó műhold kozmikus sebesség keringési idő geostacionárius súlytalanság gravitációs mező",
    attekintes: R`
<p class="lead">Ugyanaz az erő ejti le az almát és tartja pályán a Holdat – Newton felismerése egyesítette a földi és az égi mechanikát.</p>
<div class="prose"><ul><li>az általános tömegvonzás törvénye, a gravitációs állandó mérése (Cavendish);</li><li>a nehézségi gyorsulás változása magassággal, más égitesteken;</li><li>körpályán keringő műholdak sebessége, keringési ideje; kozmikus sebességek;</li><li>Kepler három törvénye; a gravitációs helyzeti energia.</li></ul></div>
<div class="callout"><div class="callout-t">Szemléletesen</div>A Nemzetközi Űrállomás nem „kint van a gravitációból” – folyamatosan esik a Föld felé, csak közben olyan gyorsan halad oldalra (7,7 km/s), hogy mindig „elvéti” a Földet. Ezért súlytalanok benne az űrhajósok.</div>`,
    elmelet: R`<div class="prose">
<h3>Az általános tömegvonzás törvénye</h3>
<p>$$F = \gamma\,\frac{m_1m_2}{r^2}, \qquad \gamma = 6{,}67\cdot 10^{-11}\ \mathrm{\frac{N\,m^2}{kg^2}}$$ Bármely két test vonzza egymást; gömbszimmetrikus testeknél $r$ a középpontok távolsága. Az állandót Cavendish mérte meg torziós ingával (1798) – ezzel „megmérte a Föld tömegét”.</p>
<h3>A nehézségi gyorsulás</h3>
<p>A felszínen $mg = \gamma\dfrac{Mm}{R^2}$, így $g = \gamma\dfrac{M}{R^2}$. A Föld középpontjától $r$ távolságra $g(r) = g_0\left(\dfrac Rr\right)^2$: két földsugárnyira (felszín felett $R$ magasan) negyedakkora. A Holdon $g \approx 1{,}6\ \mathrm{m/s^2}$.</p>
<h3>Körpályán keringő műhold</h3>
<p>A centripetális erőt a gravitáció adja: $\gamma\dfrac{Mm}{r^2} = m\dfrac{v^2}{r}$, ezért $$v = \sqrt{\gamma\frac Mr}, \qquad T = 2\pi\sqrt{\frac{r^3}{\gamma M}}$$ A műhold tömege kiesik. Minél magasabban kering, annál lassabban és annál hosszabb idő alatt. <strong>Első kozmikus sebesség</strong> (felszín közeli körpálya): 7,9 km/s. <strong>Második kozmikus sebesség</strong> (szökési): $\sqrt{2\gamma M/R} \approx 11{,}2$ km/s. <strong>Geostacionárius pálya</strong>: $T$ = 1 csillagnap, az Egyenlítő fölött ≈ 36 000 km magasan.</p>
<h3>Kepler törvényei</h3>
<ol><li>A bolygók ellipszispályán keringenek, amelynek egyik fókuszában a Nap áll.</li>
<li>A Napból a bolygóhoz húzott vezérsugár egyenlő idők alatt egyenlő területeket súrol (napközelben gyorsabb) – a perdületmegmaradás következménye.</li>
<li>$\dfrac{a^3}{T^2} = \text{állandó}$ ugyanazon központi test körül keringő égitestekre ($= \dfrac{\gamma M}{4\pi^2}$).</li></ol>
<h3>Gravitációs helyzeti energia</h3>
<p>Nagy távolságokra: $E = -\gamma\dfrac{Mm}{r}$ (a végtelenben nulla). A felszín közelében ebből adódik vissza az $mgh$. Szökési sebesség: $\tfrac12 mv^2 - \gamma\dfrac{Mm}{R} = 0$.</p>
<h3>Tudománytörténet</h3>
<p>Ptolemaiosz geocentrikus – Kopernikusz heliocentrikus világképe; Tycho Brahe pontos mérései; Kepler törvényei; Galilei távcsöves megfigyelései (Jupiter-holdak, Vénusz-fázisok); Newton egyesítő elmélete; Einstein általános relativitáselmélete.</p>
</div>`,
    peldak: [
      { szint: "3 · Közép", cim: "Gravitáció a Nemzetközi Űrállomáson", feladat: R`<p>Az ISS kb. 400 km magasan kering. Hányad része ott a nehézségi gyorsulás a felszíninek? ($R_F = 6370\ \mathrm{km}$)</p>`,
        megoldas: R`<p>$$\frac{g}{g_0} = \left(\frac{R}{R + h}\right)^2 = \left(\frac{6370}{6770}\right)^2 \approx 0{,}885$$ Kb. 88,5% – a gravitáció tehát erős; a súlytalanság oka a szabadesés.</p>` },
      { szint: "4 · Emelt", cim: "Geostacionárius pálya", feladat: R`<p>Milyen magasan kering a geostacionárius műhold? ($\gamma M_F = 3{,}986\cdot 10^{14}\ \mathrm{m^3/s^2}$, $T = 86\,164\ \mathrm s$, $R_F = 6370\ \mathrm{km}$)</p>`,
        megoldas: R`<p>$$r = \sqrt[3]{\frac{\gamma M T^2}{4\pi^2}} = \sqrt[3]{\frac{3{,}986\cdot 10^{14}\cdot 86\,164^2}{39{,}48}} \approx 4{,}22\cdot 10^7\ \mathrm m$$</p>
<p>A felszín felett $h = 42\,160 - 6370 \approx 35\,800\ \mathrm{km}$. Miért csillagnap és nem 24 óra? Mert a Föld a csillagokhoz képest 23 h 56 min alatt fordul meg egyszer.</p>` },
      { szint: "4 · Emelt", cim: "A Nap tömege a Föld pályájából", feladat: R`<p>A Föld 1 év alatt kering a Nap körül, közel körpályán, $1{,}5\cdot 10^{11}$ m sugáron. Mekkora a Nap tömege?</p>`,
        megoldas: R`<p>$\gamma\dfrac{Mm}{r^2} = m\dfrac{4\pi^2r}{T^2}$, így $$M = \frac{4\pi^2r^3}{\gamma T^2} = \frac{39{,}48\cdot 3{,}375\cdot 10^{33}}{6{,}67\cdot 10^{-11}\cdot (3{,}156\cdot 10^7)^2} \approx 2{,}0\cdot 10^{30}\ \mathrm{kg}$$</p>` },
    ],
    hibak: [
      ["Távolság", "$r$ a <em>középpontok</em> távolsága: felszín feletti magasságnál $R + h$!"],
      ["Négyzetes csökkenés", "Kétszeres távolságban negyed akkora erő, nem fele."],
      ["Súlytalanság", "Nem a gravitáció hiánya, hanem szabadesés."],
      ["Kepler III.", "Csak ugyanazon központi test körül keringőkre ugyanaz az állandó (a Hold és a Mars nem hasonlítható így össze)."],
    ],
    osszefoglalo: R`<div class="grid g2"><div class="panel"><div class="panel-title">Kulcsgondolatok</div><ul class="small">
<li>A gravitációs erő a távolság négyzetével fordítottan arányos.</li><li>Keringéskor a gravitáció a centripetális erő, a műhold tömege kiesik.</li><li>Kepler II. = perdületmegmaradás, Kepler III. = a gravitációs törvény következménye.</li></ul></div>
<div class="panel"><div class="panel-title">Képletek</div>$$F = \gamma\frac{m_1m_2}{r^2} \qquad g = \gamma\frac M{R^2}$$$$v = \sqrt{\gamma\frac Mr} \qquad \frac{r^3}{T^2} = \frac{\gamma M}{4\pi^2}$$</div></div>`,
    erettsegi: [
      ["Feleletválasztós (I.)", "Melyik műhold kering gyorsabban; g változása; súlytalanság; Kepler II. (napközel – naptávol sebessége)."],
      ["Témakifejtés (II.)", "A gravitáció és a bolygómozgás, a világkép fejlődése (Ptolemaiosz → Kopernikusz → Kepler → Newton), mesterséges holdak."],
      ["Összetett feladatok (III.)", "Műhold pályamagassága, egy bolygó tömege a holdja keringéséből, g egy másik égitesten; emelt szinten szökési sebesség energiával."],
    ],
    feladatok: [
      { id: "gra-01", szint: 1, tipus: "mc", pont: 2, cim: "Súlytalanság az űrállomáson", szoveg: R`Miért súlytalanok az űrhajósok a Föld körül keringő űrállomáson?`,
        opciok: ["Mert ott már nincs gravitáció.", "Mert az űrállomással együtt szabadon esnek.", "Mert a centrifugális erő pontosan kiegyenlíti a gravitációt.", "Mert az űrben nincs levegő."], helyes: 1,
        tippek: ["Kb. 400 km magasan a gravitáció a felszíni 88%-a."], megoldas: R`A gravitáció ott is erős; az űrállomás és a benne lévők közös gyorsulással esnek (keringés = folyamatos szabadesés), ezért nem nyomják egymást: nincs súly.` },
      { id: "gra-02", szint: 3, tipus: "num", pont: 3, cim: "g a magasban", szoveg: R`Mekkora a nehézségi gyorsulás a Föld felszíne felett egy földsugárnyi magasságban? (A felszínen $g = 9{,}81\ \mathrm{m/s^2}$.)`,
        valasz: 2.4525, egyseg: "m/s²", tol: 0.01, tippek: ["A középponttól mért távolság $2R$."], megoldas: R`$g = 9{,}81\cdot\left(\tfrac{R}{2R}\right)^2 = 9{,}81/4 \approx 2{,}45\ \mathrm{m/s^2}$.` },
      { id: "gra-03", szint: 5, tipus: "num", pont: 5, cim: "Geostacionárius pálya sugara", szoveg: R`Mekkora a geostacionárius pálya sugara (a Föld középpontjától mérve)? $\gamma M_F = 3{,}986\cdot 10^{14}\ \mathrm{m^3/s^2}$, $T = 86\,164\ \mathrm s$. Az eredményt km-ben add meg!`,
        valasz: 42164, egyseg: "km", tol: 0.01, tippek: ["$\\gamma Mm/r^2 = m\\,4\\pi^2r/T^2$", "$r = \\sqrt[3]{\\gamma MT^2/(4\\pi^2)}$"], megoldas: R`$r = \sqrt[3]{\dfrac{3{,}986\cdot 10^{14}\cdot 86\,164^2}{4\pi^2}} \approx 4{,}216\cdot 10^7\ \mathrm m \approx 42\,160\ \mathrm{km}$.` },
    ],
  });

  /* =============================== REZGÉSEK =============================== */
  L({
    id: "rezgesek", parent: "mozgas", nev: "Rezgések", alcim: "Harmonikus rezgőmozgás, inga, csillapítás, rezonancia",
    elofeltetel: ["Dinamika", "körmozgás", "szögfüggvények"],
    kulcsszavak: "rezgés harmonikus rezgőmozgás rugós rezgő inga periódusidő frekvencia amplitúdó fázis csillapítás rezonancia kényszerrezgés energia",
    attekintes: R`
<p class="lead">A rezgés egy egyensúlyi helyzet körüli ismétlődő mozgás. A legfontosabb típusa, a <strong>harmonikus rezgőmozgás</strong>, a hullámok, a hang és a váltakozó áram megértésének alapja.</p>
<div class="prose"><ul><li>a harmonikus rezgés kinematikája (kitérés, sebesség, gyorsulás) és kapcsolata a körmozgással;</li><li>dinamikai feltétele: a visszatérítő erő arányos a kitéréssel;</li><li>rugós rezgő és matematikai inga periódusideje;</li><li>energiaviszonyok, csillapítás, kényszerrezgés, rezonancia.</li></ul></div>
<div class="callout"><div class="callout-t">Szemléletesen</div>Egy egyenletesen körbeforgó pont árnyéka a falon pontosan harmonikus rezgést végez. Ezért jelenik meg a rezgések képleteiben a szögsebesség (körfrekvencia) és a szinusz.</div>`,
    elmelet: R`<div class="prose">
<h3>Jellemzők</h3>
<p><strong>Kitérés</strong> $x$: eltérés az egyensúlyi helyzettől; <strong>amplitúdó</strong> $A$: a legnagyobb kitérés; <strong>periódusidő</strong> $T$; <strong>frekvencia</strong> $f = 1/T$; <strong>körfrekvencia</strong> $\omega = 2\pi f$.</p>
<h3>A harmonikus rezgés kinematikája</h3>
<p>$$x = A\sin(\omega t + \varphi_0), \quad v = A\omega\cos(\omega t + \varphi_0), \quad a = -A\omega^2\sin(\omega t + \varphi_0) = -\omega^2 x$$ A legnagyobb sebesség ($A\omega$) az egyensúlyi helyzetben, a legnagyobb gyorsulás ($A\omega^2$) a szélső helyzetekben van. A sebesség negyed periódussal „siet” a kitéréshez képest; a gyorsulás ellentétes fázisú a kitéréssel.</p>
<h3>Dinamikai feltétel</h3>
<p>Harmonikus rezgés akkor jön létre, ha a visszatérítő erő arányos a kitéréssel és ellentétes irányú: $F = -Dx$. Ekkor $ma = -Dx$, azaz $\omega^2 = D/m$.</p>
<h3>Rugós rezgő és matematikai inga</h3>
<p>$$T_{rugó} = 2\pi\sqrt{\frac mD} \qquad\qquad T_{inga} = 2\pi\sqrt{\frac lg}$$ A periódusidő nem függ az amplitúdótól. Az inga lengésideje a tömegtől sem függ; a képlet csak kis kitérésre (kb. 10° alatt) pontos, mert ott $\sin\varphi \approx \varphi$. Függőleges rugón a periódusidő ugyanaz, mint vízszintesen – a nehézségi erő csak az egyensúlyi helyzetet tolja el.</p>
<h3>Energia</h3>
<p>Csillapítatlan rugós rezgőnél $$E = \tfrac12 Dx^2 + \tfrac12 mv^2 = \tfrac12 DA^2 = \tfrac12 m v_{max}^2 = \text{állandó}$$ A két energiafajta periodikusan alakul egymásba (kétszeres frekvenciával).</p>
<h3>Csillapítás, kényszerrezgés, rezonancia</h3>
<p>Súrlódás, közegellenállás miatt a rezgés <strong>csillapodik</strong>: az amplitúdó (exponenciálisan) csökken. Periodikus külső erővel <strong>kényszerrezgés</strong> tartható fenn, amelynek frekvenciája a gerjesztő frekvenciája. Ha ez közel esik a sajátfrekvenciához, az amplitúdó nagyon nagy lesz: <strong>rezonancia</strong> (hinta lökése, hangszerek rezonátora, rádióhangolás; káros: Tacoma-híd, gépalapok, katonák lépése hídon).</p>
</div>`,
    peldak: [
      { szint: "3 · Közép", cim: "Rugós rezgő adatai", feladat: R`<p>Egy 0,5 kg-os test 50 N/m rugóállandójú rugón 10 cm amplitúdóval rezeg. Mekkora a periódusidő, a legnagyobb sebesség, a legnagyobb gyorsulás és az energia?</p>`,
        megoldas: R`<p>$\omega = \sqrt{D/m} = \sqrt{100} = 10\ \tfrac1{\mathrm s}$, $T = 2\pi/\omega \approx 0{,}63\ \mathrm s$.</p>
<p>$v_{max} = A\omega = 1{,}0\ \mathrm{m/s}$, $a_{max} = A\omega^2 = 10\ \mathrm{m/s^2}$, $E = \tfrac12 DA^2 = 0{,}25\ \mathrm J$ (ellenőrzés: $\tfrac12 mv_{max}^2 = 0{,}25\ \mathrm J$ ✓).</p>` },
      { szint: "3 · Közép", cim: "Inga a Holdon", feladat: R`<p>Egy inga a Földön 2,0 s periódusidővel leng. Mekkora a lengésideje a Holdon ($g_H = 1{,}62\ \mathrm{m/s^2}$)?</p>`,
        megoldas: R`<p>$T \propto 1/\sqrt g$: $$T_H = 2{,}0\cdot\sqrt{\frac{9{,}81}{1{,}62}} \approx 4{,}9\ \mathrm s$$ A fonalhossz ($\approx 1$ m) nem is kellett.</p>` },
      { szint: "4 · Emelt", cim: "Hol van a test fél amplitúdónál?", feladat: R`<p>Egy harmonikus rezgést végző test az egyensúlyi helyzetből indul. Mennyi idő alatt jut el először a fél amplitúdóig, ha $T = 1{,}2$ s? Mekkora ott a sebessége a maximálishoz képest?</p>`,
        megoldas: R`<p>$x = A\sin\omega t = A/2 \Rightarrow \omega t = \pi/6$, így $t = T/12 = 0{,}1\ \mathrm s$ (és nem $T/8$!).</p>
<p>$v = A\omega\cos(\pi/6) = \tfrac{\sqrt3}{2}v_{max} \approx 0{,}87\,v_{max}$. Energiával: $\tfrac12mv^2 = \tfrac12D(A^2 - A^2/4)$ – ugyanez.</p>` },
    ],
    hibak: [
      ["Szögmód", "$\\sin(\\omega t)$ számolásakor a számológép legyen radián (RAD) módban!"],
      ["Inga", "A lengésidő nem függ a tömegtől; nagy kitérésnél a képlet már nem pontos."],
      ["Szélső helyzet", "A szélső helyzetben a sebesség nulla, de a gyorsulás maximális (nem nulla!)."],
      ["Periódus vs. lengés", "Egy teljes periódus oda-vissza mozgás; egy „lengés” néha csak a fele – olvasd el pontosan a feladatot."],
      ["Mérés", "A periódusidőt sok (pl. 10) lengés idejéből érdemes mérni – így a reakcióidő hibája tizedére csökken."],
    ],
    osszefoglalo: R`<div class="grid g2"><div class="panel"><div class="panel-title">Kulcsgondolatok</div><ul class="small">
<li>Harmonikus rezgés: $F = -Dx$, a körmozgás vetülete.</li><li>A periódusidő független az amplitúdótól.</li><li>Rezonancia: gerjesztés a sajátfrekvencián → nagy amplitúdó.</li></ul></div>
<div class="panel"><div class="panel-title">Képletek</div>$$x = A\sin\omega t \qquad v_{max} = A\omega \qquad a_{max} = A\omega^2$$$$T = 2\pi\sqrt{\frac mD} \qquad T = 2\pi\sqrt{\frac lg} \qquad E = \tfrac12DA^2$$</div></div>`,
    erettsegi: [
      ["Feleletválasztós (I.)", "x–t, v–t grafikonok fázisviszonyai; hol maximális a sebesség/gyorsulás; periódusidő változása tömeg-, hossz-, g-változáskor; rezonancia példái."],
      ["Témakifejtés (II.)", "Harmonikus rezgőmozgás, rezonancia; az inga és a nehézségi gyorsulás mérése (Galilei, Foucault)."],
      ["Összetett feladatok (III.)", "Rugós rezgő energiája, fázisok, függőleges rugón lógó test; rezgés + ütközés kombinációk."],
      ["Szóbeli", "Nehézségi gyorsulás mérése fonalingával; rugóállandó mérése statikusan és rezgésidőből."],
    ],
    feladatok: [
      { id: "rez-01", szint: 1, tipus: "mc", pont: 2, cim: "Négyszeres tömeg", szoveg: R`Egy rugós rezgőn a test tömegét négyszeresére növeljük. Hogyan változik a periódusidő?`,
        opciok: ["Negyedére csökken.", "Felére csökken.", "Kétszeresére nő.", "Négyszeresére nő."], helyes: 2,
        tippek: ["$T = 2\\pi\\sqrt{m/D}$"], megoldas: R`$T \propto \sqrt m$, így $\sqrt4 = 2$: kétszeresére nő.` },
      { id: "rez-02", szint: 2, tipus: "num", pont: 2, cim: "Inga lengésideje", szoveg: R`Mekkora egy 2,0 m hosszú fonalinga lengésideje (periódusideje)? ($g = 9{,}81\ \mathrm{m/s^2}$)`,
        valasz: 2.837, egyseg: "s", tol: 0.01, tippek: ["$T = 2\\pi\\sqrt{l/g}$"], megoldas: R`$T = 2\pi\sqrt{2{,}0/9{,}81} \approx 2{,}84\ \mathrm s$.` },
      { id: "rez-03", szint: 3, tipus: "num", pont: 3, cim: "Legnagyobb sebesség", szoveg: R`Egy 0,50 kg-os test 50 N/m rugóállandójú rugón 10 cm amplitúdóval rezeg. Mekkora a legnagyobb sebessége?`,
        valasz: 1.0, egyseg: "m/s", tol: 0.01, tippek: ["$\\omega = \\sqrt{D/m}$", "$v_{max} = A\\omega$"], megoldas: R`$\omega = \sqrt{50/0{,}5} = 10\ \tfrac1{\mathrm s}$, $v_{max} = 0{,}1\cdot 10 = 1{,}0\ \mathrm{m/s}$.` },
    ],
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
