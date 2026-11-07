/* PHYSICS OS — tananyag-szerkezet (a 7 hivatalos témakör + alapozó) és a kidolgozott témakörök szövege.
 * status: "ready" = kidolgozva, "dev" = fejlesztés alatt (nem kattintható).
 * A szövegben $…$ soron belüli, $$…$$ kiemelt képlet (KaTeX). */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const R = String.raw;

  PO.topics = [
    { id: "alapok", nr: 0, nev: "Alapok", alcim: "Mérés, mértékegységek, matematikai eszközök",
      sub: [["si", "SI-mértékegységek, prefixumok, átváltás"], ["vektorok", "Vektorok, szögfüggvények"], ["meresi-hiba", "Mérési hiba, értékes jegyek"], ["grafikonok", "Grafikonok, meredekség, terület, linearizálás"]] },
    { id: "mozgas", nr: 1, nev: "Mozgás és egyensúly", alcim: "Kinematika, dinamika, lendület, merev test, gravitáció, rezgések",
      sub: [["kinematika", "Kinematika"], ["dinamika", "Dinamika: Newton-törvények, erők"], ["lendulet", "Lendület, ütközések"], ["merev-test", "Merev test: egyensúly, forgás"], ["gravitacio", "Gravitáció, bolygómozgás"], ["rezgesek", "Rezgések"]] },
    { id: "energia", nr: 2, nev: "Energia, munka, hő", alcim: "Munka, energia, hőtan, termodinamika, energiagazdálkodás",
      sub: [["munka-energia", "Munka, energia, teljesítmény"], ["hotagulas-gazok", "Hőtágulás, gáztörvények"], ["termodinamika", "Termodinamika főtételei, körfolyamatok"], ["kalorimetria", "Fajhő, halmazállapot-változások"], ["energiagazdalkodas", "Energiagazdálkodás"]] },
    { id: "kornyezet", nr: 3, nev: "Víz, levegő, környezet", alcim: "Hidrosztatika, áramlások, felületi feszültség, légkör",
      sub: [["hidrosztatika", "Nyomás, hidrosztatika, felhajtóerő"], ["aramlasok", "Áramlások, Bernoulli-törvény"], ["feluleti", "Felületi feszültség, kapillaritás"], ["legkor", "Légkör, időjárás, üvegházhatás"]] },
    { id: "elektromossag", nr: 4, nev: "Elektromosság", alcim: "Elektrosztatika, egyenáram, mágnesség, indukció, váltakozó áram",
      sub: [["elektrosztatika", "Elektrosztatika, kondenzátor"], ["egyenaram", "Egyenáram, hálózatok, félvezetők"], ["magnesseg", "Mágneses mező, Lorentz-erő"], ["indukcio", "Elektromágneses indukció"], ["valtakozo", "Váltakozó áram, transzformátor"]] },
    { id: "hullamok", nr: 5, nev: "Hullámok, kommunikáció, fény", alcim: "Mechanikai hullámok, hang, elektromágneses spektrum, optika",
      sub: [["mech-hullamok", "Mechanikai hullámok"], ["hang", "Hangtan"], ["em-spektrum", "Elektromágneses hullámok, kommunikáció"], ["geom-optika", "Geometriai optika"], ["hullamoptika", "Hullámoptika"]] },
    { id: "atom", nr: 6, nev: "Atomfizika, magfizika", alcim: "Atommodellek, fotoeffektus, radioaktivitás, maghasadás, fúzió",
      sub: [["atommodellek", "Atommodellek, színképek"], ["kvantum", "Foton, fotoeffektus, anyaghullám"], ["atommag", "Atommag, kötési energia"], ["radioaktivitas", "Radioaktivitás, sugárvédelem"], ["maghasadas", "Maghasadás, fúzió, atomerőmű"]] },
    { id: "vilagegyetem", nr: 7, nev: "Világegyetem megismerése", alcim: "Naprendszer, csillagok, galaxisok, kozmológia",
      sub: [["naprendszer", "Naprendszer, Föld–Hold"], ["csillagok", "Csillagok, csillagfejlődés"], ["kozmologia", "Galaxisok, táguló Univerzum"]] },
  ];

  /* ------------------------------------------------------------------ */
  /* KINEMATIKA — teljes kidolgozás                                      */
  /* ------------------------------------------------------------------ */
  const kinematika = {
    id: "kinematika", parent: "mozgas", nev: "Kinematika", alcim: "A mozgások leírása – okok nélkül",
    szint: "Közép + Emelt", status: "ready",
    elofeltetel: ["Alapok: mértékegységek, vektorok, grafikonok"],
    kulcsszavak: "kinematika mozgás sebesség gyorsulás út elmozdulás hajítás szabadesés körmozgás grafikon vonatkoztatási rendszer relatív",
    sections: [
      { id: "attekintes", cim: "Áttekintés", html: R`
<p class="lead">A kinematika a mozgások <strong>leírásával</strong> foglalkozik: hol van a test, milyen gyorsan és merre halad, hogyan változik a sebessége. Azt, hogy <em>miért</em> mozog így, a dinamika vizsgálja.</p>
<div class="prose"><p>Ebben a témakörben megtanulod:</p>
<ul>
<li>a hely, az elmozdulás és az út közötti különbséget;</li>
<li>az átlag- és a pillanatnyi sebesség, valamint a gyorsulás fogalmát;</li>
<li>az egyenletes és az egyenletesen változó mozgás képleteit és grafikonjait (meredekség, terület);</li>
<li>a szabadesést és a hajításokat a <strong>mozgások függetlenségének</strong> elvével;</li>
<li>a relatív mozgást (sebességek összeadása);</li>
<li>az egyenletes és – emelt szinten – az egyenletesen változó körmozgást.</li>
</ul>
<p class="muted small">Az <span class="tag">emelt</span> jelölésű részek csak emelt szinten kellenek. Előfeltétel: SI-mértékegységek, vektorok felbontása, szögfüggvények, egyszerű grafikonok.</p></div>` },

      { id: "intuicio", cim: "Szemléletes magyarázat", html: R`
<div class="prose">
<p><strong>Ki mozog?</strong> A vonaton ülő utas a vonathoz képest áll, a peronhoz képest 30 m/s-mal halad. A mozgás mindig valamihez <em>viszonyítva</em> értelmes – ez a <strong>vonatkoztatási rendszer</strong>.</p>
<p><strong>Út vagy elmozdulás?</strong> Ha a futópályán lefutsz egy 400 m-es kört, az utad 400 m, de az elmozdulásod nulla, hiszen oda értél vissza, ahonnan indultál. Az út a pálya hossza, az elmozdulás a kezdő- és végpontot összekötő nyíl.</p>
<p><strong>Mit mutat a sebességmérő?</strong> A pillanatnyi sebesség nagyságát. Ha egy 120 km-es utat 2 óra alatt teszel meg, az átlagsebességed 60 km/h – de közben álltál a piros lámpánál és mentél 90-nel is.</p>
<p><strong>Gyorsulás = a sebesség változásának üteme.</strong> Egy autó, amely 4 s alatt 0-ról 20 m/s-ra gyorsul, minden másodpercben 5 m/s-mal gyorsabb lesz: $a = 5\ \mathrm{m/s^2}$. Fékezéskor a gyorsulás a sebességgel ellentétes irányú. Kanyarodáskor akkor is van gyorsulás, ha a sebességmérő állandó értéket mutat, mert a sebesség <em>iránya</em> változik.</p>
<p><strong>A hajítás titka:</strong> ha egy asztalról egyszerre leejtesz és vízszintesen ellöksz egy-egy golyót, <em>egyszerre</em> érnek földet. A vízszintes mozgás nem befolyásolja a függőlegest. Ezért bontható minden hajítás egy egyenletes vízszintes és egy szabadesésszerű függőleges mozgásra.</p>
</div>` },

      { id: "elmelet", cim: "Elmélet", html: R`
<div class="prose">
<h3>1. Vonatkoztatási rendszer, hely, elmozdulás, út</h3>
<p>A mozgás leírásához választunk egy <strong>vonatkoztatási testet</strong>, hozzá egy koordináta-rendszert és egy órát – ez a vonatkoztatási rendszer. A test helyét a <strong>helyvektor</strong> ($\vec r$) adja meg: az origóból a testhez mutató vektor.</p>
<ul>
<li><strong>Elmozdulás:</strong> $\Delta\vec r = \vec r_2 - \vec r_1$ – a kezdőpontból a végpontba mutató vektor.</li>
<li><strong>Pálya:</strong> az a vonal, amelyen a test mozog; <strong>út</strong> ($s$): a pálya mentén megtett hossz, skalár, sosem negatív.</li>
<li>Mindig $s \ge |\Delta\vec r|$; egyenlőség csak akkor, ha a test egyenes mentén, irányváltás nélkül halad.</li>
</ul>
<p>A test akkor tekinthető <strong>pontszerűnek</strong>, ha mérete a vizsgált mozgáshoz képest elhanyagolható (pl. a Föld a Nap körüli keringésben). Ez <em>modell</em>, nem a test tulajdonsága.</p>

<h3>2. Sebesség</h3>
<p><strong>Átlagsebesség</strong> (a középiskolai szóhasználatban az átlagos sebességnagyság): $v_\text{átl} = \dfrac{s_\text{össz}}{t_\text{össz}}$. Vektoriális alakja: $\vec v_\text{átl} = \dfrac{\Delta\vec r}{\Delta t}$.</p>
<p><strong>Pillanatnyi sebesség:</strong> nagyon rövid $\Delta t$ időtartamhoz tartozó átlagsebesség. Vektor, iránya mindig a pálya érintője. A hely–idő grafikonon az <em>érintő meredeksége</em>.</p>
<p>Mértékegysége: $\mathrm{m/s}$; $1\ \mathrm{m/s} = 3{,}6\ \mathrm{km/h}$.</p>

<h3>3. Gyorsulás</h3>
<p>$$\vec a = \frac{\Delta\vec v}{\Delta t}, \qquad [a] = \mathrm{\frac{m}{s^2}}$$</p>
<p>A gyorsulás a sebesség változási gyorsasága. Egyenes vonalú mozgásnál előjeles mennyiségként kezeljük: kiválasztunk egy pozitív irányt; ha a gyorsulás ellentétes a sebességgel, a test lassul. Görbe vonalú pályán a sebesség iránya is változik, így ott egyenletes sebességnagyságnál is van gyorsulás.</p>

<h3>4. Egyenes vonalú egyenletes mozgás</h3>
<p>A test egyenes pályán egyenlő időközök alatt egyenlő utakat tesz meg: $v$ állandó, $a = 0$.</p>
<p>$$x(t) = x_0 + v\,t, \qquad s = v\,t$$</p>
<ul>
<li>hely–idő grafikon: egyenes, <strong>meredeksége a sebesség</strong>;</li>
<li>sebesség–idő grafikon: vízszintes egyenes, <strong>alatta a terület az elmozdulás</strong>.</li>
</ul>

<h3>5. Egyenletesen változó mozgás</h3>
<p>Egyenes pályán, állandó gyorsulással:</p>
<p>$$v = v_0 + a\,t, \qquad s = v_0 t + \frac{a}{2}t^2, \qquad s = \frac{v_0 + v}{2}\,t, \qquad v^2 = v_0^2 + 2as$$</p>
<ul>
<li>sebesség–idő grafikon: egyenes, <strong>meredeksége a gyorsulás</strong>, tengelymetszete $v_0$;</li>
<li>a v–t grafikon alatti (trapéz) terület az elmozdulás – innen adódik az $s = \frac{v_0+v}{2}t$ képlet;</li>
<li>hely–idő grafikon: parabolaív; $a > 0$-nál felfelé, $a < 0$-nál lefelé nyíló;</li>
<li>nyugalomból indulva az egymást követő egyenlő időközök alatt megtett utak aránya $1 : 3 : 5 : 7 : \dots$ (Galilei).</li>
</ul>
<div class="callout"><div class="callout-t">Visszaforduló mozgás</div>Ha $v_0$ és $a$ ellentétes előjelű, a test $t = -v_0/a$ időpontban megáll és visszafordul. Ekkor az $s$ képlet az <strong>elmozdulást</strong> adja; a megtett utat a két szakasz összegeként kell számolni.</div>

<h3>6. Szabadesés</h3>
<p>Ha egy testre csak a nehézségi erő hat (légellenállás nincs), nyugalomból indítva egyenletesen gyorsuló mozgást végez $g \approx 9{,}81\ \mathrm{m/s^2}$ gyorsulással – <strong>tömegétől függetlenül</strong>. Ezt Galilei ismerte fel; vákuumcsőben a toll és a pénzérme egyszerre esik.</p>
<p>$$h = \frac{g}{2}t^2, \qquad v = g\,t, \qquad v = \sqrt{2gh}$$</p>
<p class="small muted">$g$ értéke a földrajzi helytől függ (sarkokon ≈ 9,83, egyenlítőn ≈ 9,78 m/s²); feladatokban gyakran 10 m/s²-tel számolunk – mindig azt használd, amit a feladat ad.</p>

<h3>7. A mozgások függetlensége, hajítások</h3>
<p>Ha egy test egyszerre több mozgásban vesz részt, ezek egymástól függetlenül zajlanak, és a test helye (sebessége) az egyes mozgások helyének (sebességének) <strong>vektoriális összege</strong>. Ez a <strong>szuperpozíció elve</strong>.</p>
<p><strong>Függőleges hajítás</strong> ($v_0$ felfelé): $v = v_0 - g t$, $h = v_0 t - \frac{g}{2}t^2$. A tetőponton $v = 0$, de $a = g$ (lefelé)! Emelkedési idő $t_\text{em} = v_0/g$, magasság $h_\text{max} = v_0^2/(2g)$; közegellenállás nélkül ugyanakkora sebességgel ér vissza.</p>
<p><strong>Vízszintes hajítás</strong> ($v_0$ vízszintes, $h$ magasról): vízszintesen egyenletes ($x = v_0 t$), függőlegesen szabadesés ($y = \frac g2 t^2$ lefelé). Az esési idő $t = \sqrt{2h/g}$ – nem függ $v_0$-tól.</p>
<p><strong>Ferde hajítás</strong> ($v_0$ az $\alpha$ szögben a vízszinteshez képest) <span class="tag">emelt</span>:</p>
<p>$$x = v_0\cos\alpha\cdot t, \qquad y = v_0\sin\alpha\cdot t - \frac g2 t^2$$</p>
<p>$$v_x = v_0\cos\alpha = \text{áll.}, \qquad v_y = v_0\sin\alpha - g\,t$$</p>
<p>A pálya parabola. Talajszintről indítva és oda érkezve: $t_\text{rep} = \frac{2v_0\sin\alpha}{g}$, $d = \frac{v_0^2\sin 2\alpha}{g}$, $h_\text{max} = \frac{v_0^2\sin^2\alpha}{2g}$. Adott $v_0$-nál a távolság $45°$-nál a legnagyobb, és a komplementer szögek ($\alpha$ és $90° - \alpha$) ugyanakkora távolságot adnak. Magasból indított hajításnál a legjobb szög 45°-nál kisebb.</p>
<p class="small muted">A valóságban a légellenállás miatt a pálya nem parabola: rövidebb, és a leszálló ága meredekebb.</p>

<h3>8. Relatív mozgás</h3>
<p>Ha a B test az A-hoz képest $\vec v_{BA}$, az A pedig a talajhoz képest $\vec v_{A}$ sebességgel mozog, akkor B sebessége a talajhoz képest:</p>
<p>$$\vec v_{B} = \vec v_{BA} + \vec v_{A}$$</p>
<p>Egy egyenes mentén ez előjeles összeadás (pl. a vonatban előre sétáló utas: 30 + 1,5 = 31,5 m/s). Merőleges sebességeknél Pitagorasz-tétel: a folyón merőlegesen evező csónak sodródik, a sebességének nagysága $\sqrt{v_\text{csónak}^2 + v_\text{víz}^2}$, az átkelési idő viszont csak a folyóra merőleges összetevőtől függ.</p>

<h3>9. Egyenletes körmozgás</h3>
<p>A test körpályán egyenlő időközök alatt egyenlő íveket fut be. A sebesség <strong>nagysága</strong> állandó, <strong>iránya</strong> folyamatosan változik – ezért a mozgás gyorsuló.</p>
<ul>
<li><strong>Periódusidő</strong> $T$: egy kör ideje; <strong>frekvencia (fordulatszám)</strong> $f = 1/T$, egysége $1/\mathrm{s}$.</li>
<li><strong>Szögelfordulás</strong> radiánban: $\Delta\varphi = i/r$ (ívhossz/sugár), $360° = 2\pi$.</li>
<li><strong>Szögsebesség:</strong> $\omega = \dfrac{\Delta\varphi}{\Delta t} = \dfrac{2\pi}{T} = 2\pi f$.</li>
<li><strong>Kerületi sebesség:</strong> $v = \dfrac{2\pi r}{T} = r\,\omega$, iránya érintőleges.</li>
<li><strong>Centripetális gyorsulás:</strong> $a_\text{cp} = \dfrac{v^2}{r} = r\,\omega^2$, a kör középpontja felé mutat.</li>
</ul>

<h3>10. Egyenletesen változó körmozgás <span class="tag">emelt</span></h3>
<p>A szögsebesség egyenletesen változik: $\beta = \dfrac{\Delta\omega}{\Delta t}$ állandó (szöggyorsulás, $1/\mathrm{s^2}$). Az egyenes vonalú mozgás képletei „lefordíthatók”:</p>
<table class="data"><thead><tr><th>Egyenes vonalú</th><th>Körmozgás (forgás)</th><th>Kapcsolat</th></tr></thead><tbody>
<tr><td>$s$</td><td>$\Delta\varphi$</td><td>$i = r\Delta\varphi$</td></tr>
<tr><td>$v = v_0 + at$</td><td>$\omega = \omega_0 + \beta t$</td><td>$v = r\omega$</td></tr>
<tr><td>$s = v_0 t + \frac a2 t^2$</td><td>$\Delta\varphi = \omega_0 t + \frac\beta2 t^2$</td><td>$a_\text{t} = r\beta$</td></tr>
</tbody></table>
<p>A gyorsulásnak két összetevője van: az érintőirányú $a_\text{t} = r\beta$ (a sebesség nagyságát változtatja) és a centripetális $a_\text{cp} = r\omega^2$ (az irányát). Ezek merőlegesek, így az eredő: $a = \sqrt{a_\text{cp}^2 + a_\text{t}^2}$.</p>
</div>` },

      { id: "kepletek", cim: "Képletek", special: "formulas" },
      { id: "interaktiv", cim: "Interaktív vizsgálat", special: "sims" },

      { id: "peldak", cim: "Kidolgozott példák", html: R`
<div class="grid">
<div class="panel"><div class="task-head"><span class="tag">2 · Közép</span><strong>Átlagsebesség – a klasszikus csapda</strong></div>
<p>Egy autó az út első felét 60 km/h, a második felét 40 km/h sebességgel teszi meg. Mekkora az átlagsebessége?</p>
<details class="solution"><summary>Megoldás</summary><div class="prose">
<p>Legyen a teljes út $2s$. Az idők: $t_1 = \dfrac{s}{60}$, $t_2 = \dfrac{s}{40}$ (órában, ha $s$ km-ben van).</p>
<p>$$v_\text{átl} = \frac{2s}{\frac{s}{60} + \frac{s}{40}} = \frac{2}{\frac{1}{60} + \frac{1}{40}} = \frac{2\cdot 60\cdot 40}{40 + 60} = 48\ \mathrm{km/h}$$</p>
<p><strong>Nem 50 km/h</strong>, mert a lassabb szakaszon több időt tölt az autó. (Ez a két sebesség harmonikus közepe.)</p></div></details></div>

<div class="panel"><div class="task-head"><span class="tag">3 · Közép</span><strong>Megállási út reakcióidővel</strong></div>
<p>Egy autó 72 km/h-val halad. A vezető 1,0 s reakcióidő után fékez, a lassulás 5 m/s². Mekkora úton áll meg az autó?</p>
<details class="solution"><summary>Megoldás</summary><div class="prose">
<p>$v_0 = 72\ \mathrm{km/h} = 20\ \mathrm{m/s}$.</p>
<p>1. Reakcióidő alatt egyenletes mozgás: $s_1 = v_0 t_r = 20 \cdot 1{,}0 = 20\ \mathrm m$.</p>
<p>2. Fékezés ($a = -5\ \mathrm{m/s^2}$, $v = 0$), időtlen összefüggéssel: $$s_2 = \frac{v^2 - v_0^2}{2a} = \frac{0 - 400}{2\cdot(-5)} = 40\ \mathrm m$$</p>
<p>Összesen: $s = 60\ \mathrm m$. Megfigyelés: kétszeres sebességnél a fékút <em>négyszeres</em>, a reakcióút csak kétszeres.</p></div></details></div>

<div class="panel"><div class="task-head"><span class="tag">4 · Emelt</span><strong>Milyen mély a kút?</strong></div>
<p>Követ ejtünk egy kútba, és a csobbanást az elengedés után 2,5 s-mal halljuk. Milyen mély a kút? ($g = 9{,}81\ \mathrm{m/s^2}$, a hang sebessége $c = 340\ \mathrm{m/s}$)</p>
<details class="solution"><summary>Megoldás</summary><div class="prose">
<p>A teljes idő két részből áll: a kő esési ideje $t_1$ és a hang felérkezési ideje $t_2$. Mindkét úton $h$ a távolság:</p>
<p>$$h = \frac g2 t_1^2, \qquad h = c\,t_2, \qquad t_1 + t_2 = 2{,}5\ \mathrm s$$</p>
<p>Behelyettesítve: $\dfrac{g}{2c}t_1^2 + t_1 - 2{,}5 = 0$, azaz $0{,}014426\,t_1^2 + t_1 - 2{,}5 = 0$.</p>
<p>A pozitív gyök: $t_1 \approx 2{,}416\ \mathrm s$, így $h = 4{,}905 \cdot 2{,}416^2 \approx 28{,}6\ \mathrm m$.</p>
<p>Ellenőrzés: a hang ideje $28{,}6/340 \approx 0{,}084\ \mathrm s$; összesen $2{,}5\ \mathrm s$. ✓ Ha a hangot elhanyagolnánk, 30,7 m-t kapnánk – 7% hiba.</p></div></details></div>

<div class="panel"><div class="task-head"><span class="tag">4 · Emelt</span><strong>Ferde hajítás magasból</strong></div>
<p>Egy 10 m magas teraszról 15 m/s sebességgel, a vízszinteshez képest 30°-os szögben felfelé dobunk egy labdát. Mennyi idő múlva és milyen messze ér földet? Mekkora és milyen irányú a sebessége becsapódáskor? ($g = 9{,}81\ \mathrm{m/s^2}$)</p>
<details class="solution"><summary>Megoldás</summary><div class="prose">
<p>Felbontás: $v_{0x} = 15\cos 30° \approx 12{,}99\ \mathrm{m/s}$, $v_{0y} = 15\sin 30° = 7{,}5\ \mathrm{m/s}$.</p>
<p>Függőlegesen (felfelé pozitív, a talajtól mérve): $y(t) = 10 + 7{,}5\,t - 4{,}905\,t^2 = 0$.</p>
<p>$$t = \frac{7{,}5 + \sqrt{7{,}5^2 + 2\cdot 9{,}81\cdot 10}}{9{,}81} \approx 2{,}38\ \mathrm s$$</p>
<p>Távolság: $d = v_{0x} t \approx 12{,}99 \cdot 2{,}384 \approx 31{,}0\ \mathrm m$.</p>
<p>Becsapódáskor: $v_y = 7{,}5 - 9{,}81\cdot 2{,}384 \approx -15{,}9\ \mathrm{m/s}$, így $v = \sqrt{12{,}99^2 + 15{,}89^2} \approx 20{,}5\ \mathrm{m/s}$, a vízszinteshez képest $\arctan\frac{15{,}89}{12{,}99} \approx 50{,}7°$-ban lefelé.</p>
<p>Ellenőrzés energiával: $v = \sqrt{v_0^2 + 2gh_0} = \sqrt{225 + 196{,}2} \approx 20{,}5\ \mathrm{m/s}$ ✓. Próbáld ki a <em>Hajítások</em> szimulációban!</p></div></details></div>

<div class="panel"><div class="task-head"><span class="tag">5 · Emelt</span><strong>Lemezjátszó: egyenletes és lassuló forgás</strong></div>
<p>Egy lemez $33\tfrac13$ fordulat/perc fordulatszámmal forog. a) Mekkora a széle ($r = 15\ \mathrm{cm}$) kerületi sebessége és centripetális gyorsulása? b) Kikapcsolás után 10 s alatt egyenletesen lassulva áll meg. Mekkora a szöggyorsulás, és hány fordulatot tesz meg közben?</p>
<details class="solution"><summary>Megoldás</summary><div class="prose">
<p>a) $f = \dfrac{33{,}33}{60\ \mathrm s} \approx 0{,}556\ \tfrac1{\mathrm s}$, $T = 1{,}8\ \mathrm s$, $\omega = 2\pi f \approx 3{,}49\ \tfrac1{\mathrm s}$.</p>
<p>$v = r\omega = 0{,}15\cdot 3{,}49 \approx 0{,}524\ \mathrm{m/s}$, $\ a_\text{cp} = r\omega^2 = 0{,}15\cdot 3{,}49^2 \approx 1{,}83\ \mathrm{m/s^2}$.</p>
<p>b) $\beta = \dfrac{0 - 3{,}49}{10} \approx -0{,}349\ \tfrac1{\mathrm{s^2}}$.</p>
<p>$\Delta\varphi = \dfrac{\omega_0 + \omega}{2}\,t = \dfrac{3{,}49 + 0}{2}\cdot 10 \approx 17{,}5\ \mathrm{rad}$, ez $\dfrac{17{,}5}{2\pi} \approx 2{,}78$ fordulat.</p></div></details></div>
</div>` },

      { id: "hibak", cim: "Gyakori hibák", html: R`
<div class="grid g2">
<div class="callout warn"><div class="callout-t">Átlagsebesség</div>Nem a sebességek átlaga! Mindig: összes út / összes idő.</div>
<div class="callout warn"><div class="callout-t">Mértékegységek</div>km/h → m/s: osztás 3,6-tal. Számolás előtt mindent SI-be váltani.</div>
<div class="callout warn"><div class="callout-t">Előjelek</div>Fékezésnél $a$ negatív (ha a mozgás iránya pozitív). Feldobásnál a $g$ a felfelé választott irányhoz képest negatív.</div>
<div class="callout warn"><div class="callout-t">A tetőponton</div>A sebesség (függőleges összetevője) nulla, a gyorsulás NEM: végig $g$, lefelé.</div>
<div class="callout warn"><div class="callout-t">Elmozdulás ≠ út</div>Visszaforduló mozgásnál az $s = v_0t + \frac a2 t^2$ elmozdulást ad, nem utat.</div>
<div class="callout warn"><div class="callout-t">Vízszintes hajítás</div>Az esési idő nem függ a vízszintes sebességtől: a gyorsabban ellökött golyó ugyanannyi idő alatt ér le.</div>
<div class="callout warn"><div class="callout-t">Ferde hajítás</div>$\sin 2\alpha \neq 2\sin\alpha$. A számológép legyen fok (DEG) módban!</div>
<div class="callout warn"><div class="callout-t">Körmozgás</div>Egyenletes körmozgásnál is van gyorsulás. A „centrifugális erő” nem valódi erő az inerciarendszerben. Szögsebességnél radiánnal számolj!</div>
<div class="callout warn"><div class="callout-t">Grafikonok</div>A v–t grafikon <em>alatti terület</em> az elmozdulás, a <em>meredeksége</em> a gyorsulás. Az x–t grafikon meredeksége a sebesség – ne keverd a kettőt!</div>
<div class="callout warn"><div class="callout-t">Fordulatszám</div>A „fordulat/perc” nem SI: osztás 60-nal → $1/\mathrm s$. A szögsebességhez még $2\pi$-vel szorozni kell.</div>
</div>` },

      { id: "feladatok", cim: "Önellenőrző feladatok", special: "tasks" },

      { id: "osszefoglalo", cim: "Összefoglaló", html: R`
<div class="grid g2">
<div class="panel"><div class="panel-title">Fogalmak</div><div class="prose small"><ul>
<li><strong>Vonatkoztatási rendszer:</strong> test + koordináta-rendszer + óra.</li>
<li><strong>Elmozdulás</strong> (vektor) ≠ <strong>út</strong> (skalár, ≥ 0).</li>
<li><strong>Pillanatnyi sebesség:</strong> érintőirányú vektor; x–t grafikon meredeksége.</li>
<li><strong>Gyorsulás:</strong> $\Delta\vec v/\Delta t$; v–t grafikon meredeksége.</li>
<li><strong>Mozgások függetlensége:</strong> a hajítás = egyenletes vízszintes + szabadesés függőlegesen.</li>
<li><strong>Egyenletes körmozgás:</strong> állandó sebességnagyság, középpont felé mutató gyorsulás.</li>
</ul></div></div>
<div class="panel"><div class="panel-title">A legfontosabb képletek</div>
$$v = v_0 + at \qquad s = v_0t + \tfrac a2t^2$$
$$v^2 = v_0^2 + 2as \qquad h = \tfrac g2 t^2$$
$$d = \frac{v_0^2\sin2\alpha}{g} \qquad \omega = \frac{2\pi}{T}$$
$$v = r\omega \qquad a_\text{cp} = \frac{v^2}{r} = r\omega^2$$
</div></div>` },

      { id: "erettsegi", cim: "Érettségi kapcsolódás", html: R`
<table class="data"><thead><tr><th>Vizsgarész</th><th>Mi várható ebből a témából</th></tr></thead><tbody>
<tr><td>Feleletválasztós (I.)</td><td>Grafikonelemzés (x–t, v–t: melyik szakaszon gyorsul, mekkora az út), a tetőpont gyorsulása, ejtett és hajított test esési ideje, körmozgás irányai.</td></tr>
<tr><td>Témakifejtés (II.)</td><td>Pl. „Galilei és a szabadesés vizsgálata”, „Hajítások és a mozgások függetlensége”, „A körmozgás leírása”. Fogalmak pontos definíciója + képletek + kísérlet + tudománytörténet.</td></tr>
<tr><td>Összetett feladatok (III.)</td><td>Fékút reakcióidővel, utolérési feladatok, hajítás magasból, kút mélysége hanggal, egyenletesen változó körmozgás – gyakran dinamikával vagy energiával kombinálva.</td></tr>
<tr><td>Szóbeli – mérés (A)</td><td>Nehézségi gyorsulás mérése ingával · mozgás videoelemzése (x–t, v–t grafikon felvétele) · a dinamika alaptörvénye (gyorsulás mérése $s = \frac a2 t^2$ alapján).</td></tr>
<tr><td>Szóbeli – tétel (B)</td><td>Egyenes vonalú mozgások; hajítások; egyenletes és egyenletesen változó körmozgás – definíciók, grafikonok, kísérletek, Galilei szerepe.</td></tr>
</tbody></table>
<p class="small muted" style="margin-top:8px">A szóbeli mérések pontos listáját az Oktatási Hivatal évente közzéteszi – mindig az aktuálisat nézd meg.</p>` },
    ],
  };

  PO.topicPages = Object.assign(PO.topicPages || {}, { kinematika });

  /* ------------------------------------------------------------------ */
  /* Egységes tananyagoldal-építő a többi alfejezethez                    */
  /* ------------------------------------------------------------------ */
  const esc = (s) => s;
  /**
   * PO.lesson({ id, parent, nev, alcim, szint, elofeltetel, kulcsszavak,
   *   attekintes: HTML, elmelet: HTML,
   *   peldak: [{ szint: "3 · Közép", cim, feladat: HTML, megoldas: HTML }],
   *   hibak: [[cím, szöveg]], osszefoglalo: HTML (képletek $$…$$), erettsegi: [[rész, szöveg]],
   *   feladatok: [feladatbank-elemek] })
   */
  PO.lesson = function (L) {
    const sections = [
      { id: "attekintes", cim: "Áttekintés", html: L.attekintes },
      { id: "elmelet", cim: "Elmélet", html: L.elmelet },
      { id: "kepletek", cim: "Képletek", special: "formulas" },
      { id: "interaktiv", cim: "Interaktív vizsgálat", special: "sims" },
    ];
    if (L.peldak && L.peldak.length) sections.push({ id: "peldak", cim: "Kidolgozott példák", html: '<div class="grid">' + L.peldak.map((P) =>
      `<div class="panel"><div class="task-head"><span class="tag">${P.szint}</span><strong>${P.cim}</strong></div>${P.feladat}<details class="solution"><summary>Megoldás</summary><div class="prose">${P.megoldas}</div></details></div>`).join("") + "</div>" });
    if (L.hibak && L.hibak.length) sections.push({ id: "hibak", cim: "Gyakori hibák", html: '<div class="grid g2">' + L.hibak.map(([c, t]) => `<div class="callout warn"><div class="callout-t">${c}</div>${t}</div>`).join("") + "</div>" });
    sections.push({ id: "feladatok", cim: "Önellenőrző feladatok", special: "tasks" });
    if (L.osszefoglalo) sections.push({ id: "osszefoglalo", cim: "Összefoglaló", html: L.osszefoglalo });
    if (L.erettsegi) sections.push({ id: "erettsegi", cim: "Érettségi kapcsolódás", html: '<table class="data"><thead><tr><th>Vizsgarész</th><th>Mi várható ebből a témából</th></tr></thead><tbody>' + L.erettsegi.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join("") + "</tbody></table>" });
    PO.topicPages[L.id] = { id: L.id, parent: L.parent, nev: L.nev, alcim: L.alcim, szint: L.szint || "Közép + Emelt", status: "ready", elofeltetel: L.elofeltetel || [], kulcsszavak: L.kulcsszavak || "", sections };
    if (L.feladatok) PO.tasks = (PO.tasks || []).concat(L.feladatok.map((t) => Object.assign({ temakor: L.id }, t)));
  };
  void esc;
})(typeof globalThis !== "undefined" ? globalThis : this);
