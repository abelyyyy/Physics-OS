/* PHYSICS OS — tananyag: 5. Hullámok, kommunikáció, fény · 6. Atomfizika, magfizika */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const R = String.raw;
  const L = PO.lesson;
  const sum = (items, f) => R`<div class="grid g2"><div class="panel"><div class="panel-title">Kulcsgondolatok</div><ul class="small">${items.map((i) => "<li>" + i + "</li>").join("")}</ul></div><div class="panel"><div class="panel-title">Képletek</div>${f}</div></div>`;

  /* =============================== MECHANIKAI HULLÁMOK =============================== */
  L({
    id: "mech-hullamok", parent: "hullamok", nev: "Mechanikai hullámok", alcim: "Terjedés, visszaverődés, interferencia, állóhullám",
    elofeltetel: ["Rezgések"],
    kulcsszavak: "hullám transzverzális longitudinális hullámhossz terjedési sebesség visszaverődés törés elhajlás interferencia állóhullám csomópont duzzadóhely húr síp huygens",
    attekintes: R`<p class="lead">A hullám a rezgésállapot terjedése egy közegben: energia és információ halad, de anyag nem (a részecskék helyben rezegnek).</p>
<div class="callout"><div class="callout-t">Szemléletesen</div>A stadionban „hullámzó” nézők nem mennek körbe, csak felállnak és leülnek – mégis halad a hullám.</div>`,
    elmelet: R`<div class="prose">
<h3>Fajták, jellemzők</h3><p><strong>Transzverzális</strong> (a rezgés merőleges a terjedésre – kötél, fény), <strong>longitudinális</strong> (párhuzamos – hang). $$c = \lambda f = \frac\lambda T$$ A frekvenciát a forrás, a terjedési sebességet a közeg határozza meg; közeghatáron $f$ állandó, $\lambda$ változik.</p>
<h3>Hullámjelenségek</h3><ul><li><strong>Visszaverődés</strong>: beesési szög = visszaverődési szög; rögzített végről ellentétes fázisban (félhullámnyi ugrás), szabad végről azonos fázisban.</li>
<li><strong>Törés</strong>: $\dfrac{\sin\alpha}{\sin\beta} = \dfrac{c_1}{c_2}$.</li><li><strong>Elhajlás</strong>: akadály mögé is behatol – jelentős, ha a rés mérete a hullámhossz nagyságrendjébe esik (Huygens–Fresnel-elv).</li>
<li><strong>Interferencia</strong>: két koherens hullám találkozásakor erősítés, ahol az útkülönbség $k\lambda$, gyengítés, ahol $(2k+1)\lambda/2$.</li></ul>
<h3>Állóhullám</h3><p>Egymással szembe haladó azonos hullámok szuperpozíciója: csomópontok (nincs rezgés) és duzzadóhelyek váltakoznak, távolságuk $\lambda/2$. Két végén rögzített húron (és nyitott sípban): $L = n\dfrac\lambda2$, $f_n = n\dfrac{c}{2L}$. Egyik végén zárt sípban: $L = (2n-1)\dfrac\lambda4$. (Szóbeli mérés: hangsebesség állóhullámokkal – rezonanciacső.)</p></div>`,
    peldak: [{ szint: "3 · Közép", cim: "Gitárhúr", feladat: R`<p>Egy 65 cm-es gitárhúr alaphangja 220 Hz. Mekkora a hullám terjedési sebessége a húron? Mekkora az első felhang frekvenciája?</p>`,
      megoldas: R`<p>Alaphang: $\lambda = 2L = 1{,}3\ \mathrm m$, $c = \lambda f = 286\ \mathrm{m/s}$. Első felhang: $n = 2$, $440\ \mathrm{Hz}$ (egy oktávval magasabb).</p>` }],
    hibak: [["Közeghatár", "A frekvencia nem változik, a hullámhossz igen."], ["Állóhullám", "Szomszédos csomópontok távolsága $\\lambda/2$, nem $\\lambda$."], ["Zárt síp", "Csak páratlan felhangjai vannak; alaphangja fele a nyitottnak."]],
    osszefoglalo: sum(["A hullám energiát szállít, anyagot nem.", "Erősítés: útkülönbség $k\\lambda$.", "Húron: $L = n\\lambda/2$."], R`$$c = \lambda f \qquad f_n = n\frac{c}{2L} \qquad f_n = (2n-1)\frac{c}{4L}$$`),
    erettsegi: [["Feleletválasztós (I.)", "Mi változik közeghatáron, állóhullám képe, interferencia feltétele."], ["Témakifejtés (II.)", "Hullámjelenségek; állóhullámok és hangszerek."], ["Szóbeli", "A hang sebességének mérése állóhullámokkal."]],
    feladatok: [
      { id: "mhu-01", szint: 1, tipus: "mc", pont: 2, cim: "Közeghatár", szoveg: R`Hang lép át levegőből vízbe. Melyik mennyiség NEM változik?`, opciok: ["terjedési sebesség", "hullámhossz", "frekvencia", "mindhárom változik"], helyes: 2, tippek: ["Mit határoz meg a forrás?"], megoldas: R`A frekvenciát a forrás szabja meg; a sebesség (és így a hullámhossz) a közegtől függ.` },
      { id: "mhu-02", szint: 2, tipus: "num", pont: 2, cim: "Hullámhossz", szoveg: R`Mekkora a 680 Hz-es hang hullámhossza levegőben (340 m/s)?`, valasz: 0.5, egyseg: "m", tol: 0.01, tippek: ["$\\lambda = c/f$"], megoldas: R`$\lambda = 340/680 = 0{,}5\ \mathrm m$.` },
      { id: "mhu-03", szint: 3, tipus: "num", pont: 2, cim: "Húr alaphangja", szoveg: R`Egy 65 cm-es húron a hullám terjedési sebessége 286 m/s. Mekkora az alaphang frekvenciája?`, valasz: 220, egyseg: "Hz", tol: 0.01, tippek: ["$\\lambda = 2L$"], megoldas: R`$f = \dfrac{c}{2L} = \dfrac{286}{1{,}3} = 220\ \mathrm{Hz}$.` },
    ],
  });

  /* =============================== HANGTAN =============================== */
  L({
    id: "hang", parent: "hullamok", nev: "Hangtan", alcim: "A hang keletkezése, terjedése, jellemzői",
    elofeltetel: ["Mechanikai hullámok"],
    kulcsszavak: "hang hangsebesség hangmagasság hangerősség hangszín decibel intenzitás ultrahang infrahang doppler lebegés rezonancia hallás",
    attekintes: R`<p class="lead">A hang a levegő (vagy más közeg) longitudinális rezgése, 20 Hz és 20 kHz között halljuk. Légüres térben nem terjed.</p>`,
    elmelet: R`<div class="prose">
<h3>Jellemzők</h3><p><strong>Hangmagasság</strong> ↔ frekvencia (oktáv = kétszeres frekvencia). <strong>Hangerősség</strong> ↔ intenzitás ($I = P/A$, W/m²). <strong>Hangszín</strong> ↔ a felhangok összetétele. Infrahang < 20 Hz < hallható < 20 kHz < ultrahang (orvosi képalkotás, szonár, denevér).</p>
<h3>Terjedés</h3><p>Levegőben ≈ 340 m/s (a hőmérséklettel nő), vízben ≈ 1500 m/s, acélban ≈ 5000 m/s. Pontforrástól az intenzitás $I = \dfrac{P}{4\pi r^2}$.</p>
<h3>Decibel</h3><p>$$L = 10\lg\frac{I}{I_0}\ \mathrm{dB}, \quad I_0 = 10^{-12}\ \mathrm{W/m^2}$$ Tízszeres intenzitás: +10 dB; kétszeres: +3 dB. Halláskárosodás 85 dB feletti tartós zajtól.</p>
<h3>Doppler-effektus</h3><p>Mozgó forrás vagy megfigyelő esetén az észlelt frekvencia eltér: közeledéskor magasabb, távolodáskor mélyebb. Mozgó forrásnál $f' = f\dfrac{c}{c \mp v_f}$. Alkalmazás: sebességmérő radar, orvosi Doppler-ultrahang, csillagászat (vöröseltolódás).</p>
<h3>Lebegés</h3><p>Két közeli frekvenciájú hang összegződésekor a hangerő $|f_1 - f_2|$ frekvenciával ingadozik – hangszerhangolás.</p></div>`,
    peldak: [{ szint: "3 · Közép", cim: "Villámlás távolsága", feladat: R`<p>A villám fénye után 6 s múlva halljuk a dörgést. Milyen messze csapott le?</p>`,
      megoldas: R`<p>A fény gyakorlatilag azonnal ideér; $s = 340\cdot 6 \approx 2\ \mathrm{km}$. Ökölszabály: másodpercek osztva 3-mal = km.</p>` }],
    hibak: [["Decibel összeadás", "Két 60 dB-es forrás együtt 63 dB, nem 120 dB."], ["Doppler", "A forrás frekvenciája nem változik – csak az észlelt."]],
    osszefoglalo: sum(["Hangmagasság ~ frekvencia, hangerősség ~ intenzitás.", "+10 dB = tízszeres intenzitás."], R`$$I = \frac{P}{4\pi r^2} \qquad L = 10\lg\frac{I}{I_0} \qquad f' = f\frac{c}{c - v_f}$$`),
    erettsegi: [["Feleletválasztós (I.)", "Hangjellemzők és fizikai megfelelőik, Doppler, decibel."], ["Témakifejtés (II.)", "A hang keletkezése és terjedése, hangszerek, zajvédelem, ultrahang alkalmazásai."]],
    feladatok: [
      { id: "han-01", szint: 1, tipus: "mc", pont: 2, cim: "Hang a vákuumban", szoveg: R`Miért nem hallunk hangot az űrben?`, opciok: ["Mert túl hideg van.", "Mert a hang terjedéséhez közeg kell.", "Mert a hang fénysebességgel elszalad.", "Mert nincs gravitáció."], helyes: 1, tippek: ["Mi rezeg a hanghullámban?"], megoldas: R`A hang a közeg részecskéinek rezgése; vákuumban nincs mi rezegjen.` },
      { id: "han-02", szint: 3, tipus: "num", pont: 2, cim: "Decibel", szoveg: R`Egy hangforrás intenzitásszintje 60 dB. Hány dB lesz, ha az intenzitást százszorosára növeljük?`, valasz: 80, egyseg: "dB", tol: 0.01, tippek: ["Tízszeres intenzitás: +10 dB."], megoldas: R`$100 = 10^2$ → +20 dB → 80 dB.` },
      { id: "han-03", szint: 4, tipus: "num", pont: 3, cim: "Sziréna", szoveg: R`Egy 440 Hz-es sziréna 20 m/s-mal közeledik felénk. Mekkora frekvenciát hallunk? (Hangsebesség 340 m/s)`, valasz: 467.5, egyseg: "Hz", tol: 0.01, tippek: ["$f' = fc/(c - v)$"], megoldas: R`$f' = 440\cdot\dfrac{340}{320} = 467{,}5\ \mathrm{Hz}$.` },
    ],
  });

  /* =============================== EM SPEKTRUM =============================== */
  L({
    id: "em-spektrum", parent: "hullamok", nev: "Elektromágneses hullámok, kommunikáció", alcim: "A spektrum a rádiótól a gammasugárzásig",
    elofeltetel: ["Mechanikai hullámok", "Váltakozó áram"],
    kulcsszavak: "elektromágneses hullám spektrum rádió mikrohullám infravörös látható ultraibolya röntgen gamma maxwell hertz moduláció mobil gps radar wifi",
    attekintes: R`<p class="lead">Az elektromágneses hullám egymást keltő, változó elektromos és mágneses mező, amely vákuumban is terjed – fénysebességgel. A rádió, a fény és a röntgen ugyanannak a jelenségnek különböző hullámhosszú változatai.</p>`,
    elmelet: R`<div class="prose">
<h3>Keletkezés, terjedés</h3><p>Gyorsuló töltések (pl. antennában rezgő elektronok) sugározzák. Maxwell elméletileg megjósolta, Hertz kísérletileg kimutatta (1887). Transzverzális hullám; vákuumban $c = 3\cdot 10^8$ m/s, $c = \lambda f$.</p>
<h3>A spektrum (növekvő frekvencia)</h3><table class="data"><thead><tr><th>Tartomány</th><th>Hullámhossz</th><th>Alkalmazás</th></tr></thead><tbody>
<tr><td>Rádió</td><td>> 1 m</td><td>műsorszórás, rádiócsillagászat</td></tr><tr><td>Mikrohullám</td><td>1 mm – 1 m</td><td>mobil, wifi, radar, mikrohullámú sütő, GPS</td></tr>
<tr><td>Infravörös</td><td>780 nm – 1 mm</td><td>hőkamera, távirányító, hősugárzás</td></tr><tr><td>Látható</td><td>380 – 780 nm</td><td>látás (vörös → ibolya)</td></tr>
<tr><td>Ultraibolya</td><td>10 – 380 nm</td><td>sterilizálás, D-vitamin, leégés</td></tr><tr><td>Röntgen</td><td>0,01 – 10 nm</td><td>orvosi képalkotás, kristályszerkezet</td></tr><tr><td>Gamma</td><td>< 0,01 nm</td><td>radioaktív bomlás, sugárterápia</td></tr></tbody></table>
<p>Minél rövidebb a hullámhossz, annál nagyobb a fotonok energiája ($E = hf$), annál ionizálóbb és veszélyesebb.</p>
<h3>Kommunikáció</h3><p>Az információt a vivőhullám modulálásával visszük át (AM: amplitúdó, FM: frekvencia; ma digitális). Radar: a visszavert jel késéséből a távolság $s = ct/2$. GPS: több műhold jelének futási idejéből helymeghatározás (relativisztikus korrekcióval!).</p></div>`,
    peldak: [{ szint: "2 · Közép", cim: "Radar", feladat: R`<p>A radar jele 2,0 ms múlva érkezik vissza egy repülőgépről. Milyen messze van?</p>`, megoldas: R`<p>Oda-vissza út: $s = \dfrac{c\,t}{2} = \dfrac{3\cdot 10^8\cdot 0{,}002}{2} = 300\ \mathrm{km}$.</p>` }],
    hibak: [["Radar", "A futási idő oda-vissza útra vonatkozik: osztani kell 2-vel."], ["Sorrend", "Rádió < mikro < IR < látható < UV < röntgen < gamma (frekvencia szerint)."]],
    osszefoglalo: sum(["Minden EM hullám vákuumban c-vel terjed.", "Rövidebb hullámhossz → nagyobb fotonenergia."], R`$$c = \lambda f \qquad E = hf \qquad s = \frac{ct}{2}$$`),
    erettsegi: [["Feleletválasztós (I.)", "Spektrumtartományok sorrendje, alkalmazásai; mi terjed vákuumban."], ["Témakifejtés (II.)", "Az elektromágneses spektrum és alkalmazásai; információátvitel; Maxwell, Hertz."]],
    feladatok: [
      { id: "ems-01", szint: 1, tipus: "mc", pont: 2, cim: "Hullámhossz sorrend", szoveg: R`Melyik sorrend a növekvő hullámhossz szerinti?`, opciok: ["rádió, látható, röntgen", "röntgen, ultraibolya, infravörös", "infravörös, ultraibolya, látható", "gamma, rádió, mikrohullám"], helyes: 1, tippek: ["A röntgen a legrövidebbek közé tartozik."], megoldas: R`Röntgen (nm alatt) < UV (10–380 nm) < infravörös (780 nm felett).` },
      { id: "ems-02", szint: 2, tipus: "num", pont: 2, cim: "FM-adó", szoveg: R`Mekkora a 100 MHz-es rádióhullám hullámhossza? ($c = 3\cdot 10^8$ m/s)`, valasz: 3, egyseg: "m", tol: 0.01, tippek: ["$\\lambda = c/f$"], megoldas: R`$\lambda = 3\cdot 10^8/10^8 = 3\ \mathrm m$.` },
      { id: "ems-03", szint: 2, tipus: "num", pont: 2, cim: "Radarvisszhang", szoveg: R`A radarjel 2,0 ms alatt ér vissza. Milyen messze van a visszaverő tárgy? km-ben!`, valasz: 300, egyseg: "km", tol: 0.01, tippek: ["Oda-vissza út!"], megoldas: R`$s = ct/2 = 300\ \mathrm{km}$.` },
    ],
  });

  /* =============================== GEOMETRIAI OPTIKA =============================== */
  L({
    id: "geom-optika", parent: "hullamok", nev: "Geometriai optika", alcim: "Visszaverődés, fénytörés, tükrök, lencsék, optikai eszközök",
    elofeltetel: ["Mechanikai hullámok"],
    kulcsszavak: "fény visszaverődés törés snellius törésmutató teljes visszaverődés optikai szál prizma diszperzió tükör lencse leképezés fókusz nagyítás szem szemüveg dioptria fényképezőgép mikroszkóp távcső",
    attekintes: R`<p class="lead">Ha a hullámhossz sokkal kisebb az eszközöknél, a fény terjedése egyenes sugarakkal leírható. Ezzel értjük meg a tükröket, lencséket, a szemet és az optikai eszközöket.</p>`,
    elmelet: R`<div class="prose">
<h3>Visszaverődés, sík- és gömbtükör</h3><p>Beesési szög = visszaverődési szög (a beesési merőlegestől mérve). Síktükör: látszólagos, egyenes állású, azonos méretű kép, a tükör mögött ugyanolyan távol. Homorú tükör fókusztávolsága $f = R/2$; domború tükör szóró (visszapillantó tükör).</p>
<h3>Fénytörés</h3><p>$$n_1\sin\alpha = n_2\sin\beta, \qquad n = \frac cv$$ Sűrűbb közegbe a beesési merőlegeshez törik. <strong>Teljes visszaverődés</strong> sűrűbből ritkábba, a határszög felett: $\sin\alpha_h = n_2/n_1$ (optikai szál, prizmás távcső, gyémánt). <strong>Diszperzió</strong>: a törésmutató a színtől függ (ibolyára nagyobb) – prizma, szivárvány. (Szóbeli mérés: a víz törésmutatója lézerrel.)</p>
<h3>Lencsék, leképezés</h3><p>$$\frac1f = \frac1t + \frac1k, \qquad N = \frac KT = \frac kt, \qquad D = \frac1f$$ Nevezetes sugarak: optikai tengellyel párhuzamos → fókuszon át; középponton át → irányváltozás nélkül; fókuszon át → párhuzamos. Gyűjtőlencse képei: $t > 2f$ kicsinyített valódi (fényképezőgép), $f < t < 2f$ nagyított valódi (vetítő), $t < f$ látszólagos nagyított (nagyító). Szórólencse mindig látszólagos, kicsinyített képet ad. (Szóbeli mérés: fókusztávolság Bessel-módszerrel: $f = \dfrac{D^2 - d^2}{4D}$.)</p>
<h3>A szem és az optikai eszközök</h3><p>A szemlencse (alkalmazkodással) a retinára képez. Rövidlátás: a kép a retina előtt → szórólencse; távollátás: mögötte → gyűjtőlencse. Mikroszkóp: objektív (nagyított valódi kép) + okulár (nagyító). Csillagászati távcső: nagy fókuszú objektív + okulár.</p></div>`,
    peldak: [
      { szint: "3 · Közép", cim: "Kép a gyűjtőlencse mögött", feladat: R`<p>Egy 10 cm fókusztávolságú lencsétől 25 cm-re 4 cm-es tárgy van. Hol keletkezik a kép, mekkora, milyen?</p>`,
        megoldas: R`<p>$\dfrac1k = \dfrac1{10} - \dfrac1{25} \Rightarrow k = 16{,}7\ \mathrm{cm}$; $N = 16{,}7/25 = 0{,}67$; $K = 2{,}7\ \mathrm{cm}$. Valódi, fordított, kicsinyített. Próbáld ki a Lencse szimulációban!</p>` },
      { szint: "4 · Emelt", cim: "Látszólagos mélység", feladat: R`<p>Egy medence 2,0 m mély. Milyen mélynek látszik felülről, közel merőlegesen nézve? ($n = 1{,}33$)</p>`,
        megoldas: R`<p>Kis szögekre $\tan \approx \sin$, így a látszólagos mélység $h' = h/n = 2{,}0/1{,}33 \approx 1{,}5\ \mathrm m$ – a víz sekélyebbnek látszik, mint amilyen.</p>` },
    ],
    hibak: [["Szögek", "Mindig a beesési merőlegestől mérd!"], ["Előjelek", "Látszólagos képnél $k < 0$, szórólencsénél $f < 0$."], ["Dioptria", "$D = 1/f$, ahol $f$ méterben van."]],
    osszefoglalo: sum(["Sűrűbb közegben a fény lassabb, a merőlegeshez törik.", "Teljes visszaverődés csak sűrűbből ritkábba.", "$t$ és $f$ viszonya határozza meg a kép jellegét."], R`$$n_1\sin\alpha = n_2\sin\beta \qquad \sin\alpha_h = \frac{n_2}{n_1} \qquad \frac1f = \frac1t + \frac1k \qquad N = \frac kt$$`),
    erettsegi: [["Feleletválasztós (I.)", "Sugármenetek, kép jellege, teljes visszaverődés, szemhibák korrekciója."], ["Témakifejtés (II.)", "A fénytörés és alkalmazásai; optikai eszközök; a szem."], ["Összetett feladatok (III.)", "Lencse leképezése két helyzetben, prizma, optikai szál, kétlencsés rendszer."], ["Szóbeli", "A víz törésmutatójának meghatározása; domború lencse fókusztávolsága Bessel-módszerrel."]],
    feladatok: [
      { id: "geo-01", szint: 1, tipus: "mc", pont: 2, cim: "Szórólencse képe", szoveg: R`Milyen képet ad a szórólencse valódi tárgyról?`, opciok: ["Valódi, fordított, kicsinyített", "Látszólagos, egyenes állású, kicsinyített", "Látszólagos, egyenes állású, nagyított", "A tárgy helyzetétől függően bármilyet"], helyes: 1, tippek: ["Próbáld ki a Lencse szimulációban!"], megoldas: R`Szórólencse mindig látszólagos, egyenes állású, kicsinyített képet ad.` },
      { id: "geo-02", szint: 2, tipus: "num", pont: 2, cim: "Képtávolság", szoveg: R`Egy 10 cm fókusztávolságú gyűjtőlencsétől 25 cm-re van a tárgy. Milyen messze keletkezik a kép? cm-ben!`, valasz: 16.667, egyseg: "cm", tol: 0.01, tippek: ["$1/k = 1/f - 1/t$"], megoldas: R`$k = \dfrac{ft}{t - f} = \dfrac{250}{15} \approx 16{,}7\ \mathrm{cm}$.` },
      { id: "geo-03", szint: 3, tipus: "num", pont: 3, cim: "Törési szög", szoveg: R`Fény levegőből 45°-os beesési szöggel vízbe ($n = 1{,}33$) lép. Mekkora a törési szög? fokban!`, valasz: 32.12, egyseg: "°", tol: 0.01, tippek: ["$\\sin\\beta = \\sin\\alpha / n$"], megoldas: R`$\sin\beta = 0{,}7071/1{,}33 = 0{,}5317 \Rightarrow \beta \approx 32{,}1°$.` },
    ],
  });

  /* =============================== HULLÁMOPTIKA =============================== */
  L({
    id: "hullamoptika", parent: "hullamok", nev: "Hullámoptika", alcim: "Interferencia, elhajlás, polarizáció",
    elofeltetel: ["Mechanikai hullámok", "Geometriai optika"],
    kulcsszavak: "hullámoptika interferencia young kettős rés optikai rács elhajlás diffrakció vékonyréteg polarizáció koherens lézer",
    attekintes: R`<p class="lead">A fény hullámtermészete akkor látszik, amikor az eszközök mérete a hullámhossz közelébe esik: elhajlik, interferál, polarizálható.</p>`,
    elmelet: R`<div class="prose">
<h3>Interferencia</h3><p>Koherens (állandó fáziskülönbségű) fényforrások kellenek – a lézer ilyen. <strong>Young kettős rés</strong> (1801): a sötét és világos csíkok a fény hullámtermészetét bizonyították. Erősítés: útkülönbség $= k\lambda$. Vékonyréteg-interferencia: szappanbuborék, olajfolt színei, tükröződésmentesítő bevonat.</p>
<h3>Optikai rács</h3><p>$$d\sin\alpha_k = k\lambda$$ $d$ a rácsállandó (1 mm / vonalszám). Ernyőn: $\tan\alpha = x/L$. A rács a fehér fényt színeire bontja (spektroszkóp) – a vörös hajlik el jobban (a prizmánál fordítva!). CD/DVD felülete is rácsként viselkedik. (Szóbeli mérés: a lézer hullámhossza optikai ráccsal.)</p>
<h3>Elhajlás egy résen, felbontás</h3><p>Szűk résen vagy kis nyíláson a fény szétterül; ez korlátozza a távcsövek és a mikroszkóp felbontóképességét.</p>
<h3>Polarizáció</h3><p>Csak transzverzális hullám polarizálható – a fény polarizálhatósága bizonyítja, hogy transzverzális. Polárszűrő, LCD-kijelző, napszemüveg (a vízről visszavert fény részben polarizált), 3D-mozi.</p></div>`,
    peldak: [{ szint: "4 · Emelt", cim: "Lézer hullámhossza ráccsal", feladat: R`<p>300 vonal/mm-es rácstól 1,00 m-re lévő ernyőn az első rendű maximum 20 cm-re van a középsőtől. Mekkora a hullámhossz?</p>`,
      megoldas: R`<p>$d = 1/300\ \mathrm{mm} = 3{,}33\ \mathrm{\mu m}$. $\sin\alpha = \dfrac{0{,}2}{\sqrt{1 + 0{,}04}} = 0{,}1961$. $\lambda = d\sin\alpha \approx 654\ \mathrm{nm}$ (vörös lézer). Kis szögközelítéssel ($\sin \approx \tan = 0{,}2$) 667 nm jönne ki – 2% hiba.</p>` }],
    hibak: [["Rácsállandó", "300 vonal/mm → $d = 1/300$ mm, nem 300 mm."], ["Kis szög", "Nagy szögeknél $\\sin\\alpha \\neq \\tan\\alpha$."]],
    osszefoglalo: sum(["Interferencia és elhajlás → a fény hullám.", "Polarizáció → transzverzális hullám."], R`$$d\sin\alpha_k = k\lambda \qquad \tan\alpha = \frac xL$$`),
    erettsegi: [["Feleletválasztós (I.)", "Melyik jelenség bizonyítja a hullámtermészetet / a transzverzalitást; rácson melyik szín hajlik el jobban."], ["Témakifejtés (II.)", "A fény hullámtermészete (Young, Fresnel), a fény természetéről szóló vita."], ["Szóbeli", "A fény hullámhosszának meghatározása optikai ráccsal."]],
    feladatok: [
      { id: "hop-01", szint: 1, tipus: "mc", pont: 2, cim: "Transzverzális fény", szoveg: R`Melyik jelenség bizonyítja, hogy a fény transzverzális hullám?`, opciok: ["interferencia", "elhajlás", "polarizáció", "fénytörés"], helyes: 2, tippek: ["Melyik jelenség nincs longitudinális hullámnál?"], megoldas: R`Csak transzverzális hullám polarizálható; az interferencia és az elhajlás minden hullámra jellemző.` },
      { id: "hop-02", szint: 3, tipus: "num", pont: 3, cim: "Rács elhajlási szöge", szoveg: R`Egy 100 vonal/mm-es rácsra 600 nm-es lézerfény esik. Mekkora szögben látjuk az első rendű maximumot? fokban!`, valasz: 3.4398, egyseg: "°", tol: 0.01, tippek: ["$d = 10\\ \\mu\\mathrm m$", "$\\sin\\alpha = \\lambda/d$"], megoldas: R`$\sin\alpha = 600\cdot 10^{-9}/10^{-5} = 0{,}06 \Rightarrow \alpha \approx 3{,}44°$.` },
      { id: "hop-03", szint: 4, tipus: "num", pont: 4, cim: "Hullámhossz mérése", szoveg: R`300 vonal/mm-es rácstól 1,00 m-re lévő ernyőn az első rendű maximum 20,0 cm-re van a középsőtől. Mekkora a hullámhossz? nm-ben!`, valasz: 653.7, egyseg: "nm", tol: 0.01, tippek: ["$\\sin\\alpha = x/\\sqrt{x^2 + L^2}$"], megoldas: R`$\lambda = d\sin\alpha = 3{,}333\cdot 10^{-6}\cdot 0{,}1961 \approx 654\ \mathrm{nm}$.` },
    ],
  });

  /* =============================== ATOMMODELLEK =============================== */
  L({
    id: "atommodellek", parent: "atom", nev: "Atommodellek, színképek", alcim: "Thomsontól a kvantummechanikáig",
    elofeltetel: ["Elektrosztatika", "Hullámoptika"],
    kulcsszavak: "atommodell thomson rutherford szórás bohr energiaszint színkép vonalas emisszió abszorpció kvantumszám elektronhéj franck-hertz lézer",
    attekintes: R`<p class="lead">Az atom szerkezetét kísérletek sora tárta fel: az elektron felfedezése, Rutherford szórási kísérlete, majd a vonalas színképek magyarázata a Bohr-modellel és a kvantummechanikával.</p>`,
    elmelet: R`<div class="prose">
<h3>Thomson és Rutherford</h3><p>J. J. Thomson felfedezte az elektront (1897), és „mazsolás puding” modellt javasolt. Rutherford (1911) aranyfóliát bombázott α-részecskékkel: a legtöbb áthaladt, néhány nagy szögben visszapattant → az atom tömege és pozitív töltése egy pici <strong>atommagban</strong> összpontosul (≈ $10^{-15}$ m, az atom $10^{-10}$ m). Probléma: a keringő elektron sugározna és a magba zuhanna.</p>
<h3>Bohr-modell</h3><p>Posztulátumok: az elektron csak bizonyos (stacionárius) pályákon keringhet, ott nem sugároz; átmenetkor $hf = E_m - E_n$ energiájú fotont bocsát ki vagy nyel el. Hidrogénre $$E_n = -\frac{13{,}6\ \mathrm{eV}}{n^2}$$ Megmagyarázza a hidrogén vonalas színképét (Balmer-sorozat a láthatóban: átmenetek az $n = 2$ szintre).</p>
<h3>Színképek</h3><p><strong>Folytonos</strong>: izzó szilárd test, sűrű gáz. <strong>Vonalas emissziós</strong>: ritka gáz gerjesztve – minden elemnek saját „ujjlenyomata” (spektroszkópia, a hélium felfedezése a Napban). <strong>Abszorpciós</strong>: folytonos színképből a hideg gáz a saját vonalait nyeli el (a Nap Fraunhofer-vonalai).</p>
<h3>Kvantummechanikai atommodell</h3><p>Az elektron nem pályán kering, hanem „elektronfelhő” – megtalálási valószínűség. Négy kvantumszám, Pauli-elv → az elektronhéjak és a periódusos rendszer magyarázata. Lézer: indukált emisszió, koherens fény.</p></div>`,
    peldak: [{ szint: "4 · Emelt", cim: "Hα-vonal", feladat: R`<p>Mekkora a hidrogén 3 → 2 átmenetéhez tartozó foton hullámhossza?</p>`,
      megoldas: R`<p>$\Delta E = 13{,}6\left(\tfrac14 - \tfrac19\right) = 1{,}889\ \mathrm{eV}$. $\lambda = \dfrac{hc}{\Delta E} = \dfrac{1240\ \mathrm{eV\,nm}}{1{,}889\ \mathrm{eV}} \approx 656\ \mathrm{nm}$ – vörös.</p>` }],
    hibak: [["Energiakülönbség", "A foton energiája a két szint <em>különbsége</em>."], ["Előjel", "A kötött állapotok energiája negatív; az ionizációhoz $|E_n|$ kell."]],
    osszefoglalo: sum(["Rutherford: kicsi, nehéz, pozitív atommag.", "Bohr: kvantált energiaszintek, $hf = \\Delta E$.", "Vonalas színkép = az elem ujjlenyomata."], R`$$E_n = -\frac{13{,}6\ \mathrm{eV}}{n^2} \qquad hf = E_m - E_n$$`),
    erettsegi: [["Feleletválasztós (I.)", "Rutherford-kísérlet következtetései, színképtípusok, energiaszint-átmenetek."], ["Témakifejtés (II.)", "Az atommodellek fejlődése; színképelemzés és alkalmazásai."], ["Összetett feladatok (III.)", "Energiaszint-diagram alapján kibocsátott fotonok hullámhossza, ionizációs energia."]],
    feladatok: [
      { id: "atm-01", szint: 1, tipus: "mc", pont: 2, cim: "Rutherford-kísérlet", szoveg: R`Mi következett a Rutherford-féle szórási kísérletből?`, opciok: ["Az atom tömör, egyenletes töltéseloszlású gömb.", "Az atom pozitív töltése és tömege egy kicsi magban összpontosul.", "Az elektronok rögzített pályán keringenek.", "Az elektron hullámtermészetű."], helyes: 1, tippek: ["Miért pattant vissza néhány α-részecske?"], megoldas: R`A ritka, nagy szögű visszaszórás csak egy kicsi, nagy tömegű, pozitív maggal magyarázható.` },
      { id: "atm-02", szint: 2, tipus: "num", pont: 2, cim: "Ionizáció gerjesztett állapotból", szoveg: R`Mennyi energia kell egy $n = 2$ állapotú hidrogénatom ionizálásához? eV-ban!`, valasz: 3.4, egyseg: "eV", tol: 0.01, tippek: ["$E_2 = -13{,}6/4$"], megoldas: R`$E_2 = -3{,}4\ \mathrm{eV}$, így 3,4 eV kell a 0 szintig.` },
      { id: "atm-03", szint: 4, tipus: "num", pont: 3, cim: "Balmer-vonal", szoveg: R`Mekkora a hidrogén 3 → 2 átmenetekor kibocsátott foton hullámhossza? ($hc = 1240\ \mathrm{eV\,nm}$) nm-ben!`, valasz: 656.47, egyseg: "nm", tol: 0.01, tippek: ["$\\Delta E = 13{,}6(1/4 - 1/9)$ eV"], megoldas: R`$\Delta E = 1{,}889\ \mathrm{eV}$, $\lambda = 1240/1{,}889 \approx 656\ \mathrm{nm}$.` },
    ],
  });

  /* =============================== KVANTUM =============================== */
  L({
    id: "kvantum", parent: "atom", nev: "Foton, fotoeffektus, anyaghullám", alcim: "A fény részecske-, az anyag hullámtermészete",
    elofeltetel: ["Atommodellek", "Elektrosztatika"],
    kulcsszavak: "foton planck fotoeffektus einstein kilépési munka határfrekvencia zárófeszültség kettős természet de broglie anyaghullám elektronmikroszkóp határozatlanság compton",
    attekintes: R`<p class="lead">A fény energiája adagokban (fotonokban) érkezik – ezt bizonyítja a fotoeffektus. Fordítva: a részecskéknek (pl. elektronnak) hullámtulajdonságaik vannak. Ez a <strong>kettős természet</strong>.</p>`,
    elmelet: R`<div class="prose">
<h3>Foton</h3><p>Planck (1900, hőmérsékleti sugárzás) és Einstein (1905): $$E = hf = \frac{hc}\lambda, \qquad p = \frac h\lambda$$ $h = 6{,}63\cdot 10^{-34}$ J·s. Hasznos: $hc \approx 1240$ eV·nm.</p>
<h3>Fotoeffektus</h3><p>Fémből fény hatására elektronok lépnek ki. A hullámelmélettel megmagyarázhatatlan tapasztalatok: van <strong>határfrekvencia</strong> (alatta akármilyen erős fény sem vált ki elektront); a kilépő elektronok maximális energiája csak a frekvenciától függ, az intenzitástól nem; nincs késés. Einstein magyarázata: $$hf = W_{ki} + \tfrac12 mv_{max}^2$$ Egy foton egy elektronnak adja át az energiáját. Zárófeszültség: $eU_0 = \tfrac12mv_{max}^2$; az $U_0$–$f$ egyenes meredeksége $h/e$. Alkalmazás: fotocella, napelem (belső fotoeffektus), digitális kamera.</p>
<h3>Anyaghullámok</h3><p>De Broglie (1924): $$\lambda = \frac{h}{mv}$$ Kimutatták elektronelhajlással kristályon (Davisson–Germer). Elektronmikroszkóp: az elektronok kis hullámhossza nagy felbontást ad.</p>
<h3>Határozatlansági reláció</h3><p>Heisenberg: a hely és a lendület egyszerre nem határozható meg tetszőleges pontossággal ($\Delta x\,\Delta p \gtrsim h/4\pi$) – nincs „pálya”.</p></div>`,
    peldak: [{ szint: "4 · Emelt", cim: "Planck-állandó mérése", feladat: R`<p>Egy fotocellán 400 nm-es fénynél 0,80 V, 500 nm-esnél 0,18 V a zárófeszültség. Számítsd ki $h$-t és a kilépési munkát!</p>`,
      megoldas: R`<p>$f_1 = 7{,}5\cdot 10^{14}$ Hz, $f_2 = 6{,}0\cdot 10^{14}$ Hz. $h = \dfrac{e\Delta U}{\Delta f} = \dfrac{1{,}6\cdot 10^{-19}\cdot 0{,}62}{1{,}5\cdot 10^{14}} \approx 6{,}6\cdot 10^{-34}\ \mathrm{J\,s}$.</p><p>$W = hf_1 - eU_1 \approx 4{,}96\cdot 10^{-19} - 1{,}28\cdot 10^{-19} = 3{,}68\cdot 10^{-19}\ \mathrm J \approx 2{,}3\ \mathrm{eV}$.</p>` }],
    hibak: [["Intenzitás", "Erősebb fény több elektront ad, nem gyorsabbat."], ["eV ↔ J", "1 eV = 1,6·10⁻¹⁹ J."], ["nm", "1 nm = 10⁻⁹ m."]],
    osszefoglalo: sum(["A fény fotonokból áll: $E = hf$.", "Fotoeffektus: határfrekvencia, $E_m$ csak $f$-től függ.", "Részecskék hullámhossza: $h/(mv)$."], R`$$E = hf \qquad hf = W_{ki} + E_m \qquad eU_0 = E_m \qquad \lambda = \frac h{mv}$$`),
    erettsegi: [["Feleletválasztós (I.)", "Mit változtat az intenzitás és a frekvencia a fotoeffektusban; kettős természet."], ["Témakifejtés (II.)", "A fény kettős természete; a fotoeffektus és Einstein magyarázata; anyaghullámok."], ["Összetett feladatok (III.)", "Fotocella grafikonjai (U₀–f), h és W meghatározása, fotonok száma adott teljesítményből."]],
    feladatok: [
      { id: "kva-01", szint: 1, tipus: "mc", pont: 2, cim: "Erősebb fény", szoveg: R`Egy fotocellát erősebb, de azonos színű fénnyel világítunk meg. Mi változik?`, opciok: ["A kilépő elektronok maximális sebessége nő.", "A kilépő elektronok száma nő.", "A határfrekvencia csökken.", "A zárófeszültség nő."], helyes: 1, tippek: ["Az intenzitás a fotonok számát jelenti."], megoldas: R`Több foton → több kilépő elektron (nagyobb áram); az egyes elektronok energiája nem változik.` },
      { id: "kva-02", szint: 2, tipus: "num", pont: 2, cim: "Fotonenergia", szoveg: R`Mekkora egy 500 nm-es foton energiája eV-ban? ($hc = 1240\ \mathrm{eV\,nm}$)`, valasz: 2.48, egyseg: "eV", tol: 0.01, tippek: ["$E = hc/\\lambda$"], megoldas: R`$E = 1240/500 = 2{,}48\ \mathrm{eV}$.` },
      { id: "kva-03", szint: 3, tipus: "num", pont: 3, cim: "Elektron hullámhossza", szoveg: R`Mekkora a $10^6$ m/s sebességű elektron de Broglie-hullámhossza? ($h = 6{,}63\cdot 10^{-34}$, $m_e = 9{,}11\cdot 10^{-31}$ kg) nm-ben!`, valasz: 0.7278, egyseg: "nm", tol: 0.01, tippek: ["$\\lambda = h/(mv)$"], megoldas: R`$\lambda = \dfrac{6{,}63\cdot 10^{-34}}{9{,}11\cdot 10^{-31}\cdot 10^6} \approx 7{,}3\cdot 10^{-10}\ \mathrm m$.` },
    ],
  });

  /* =============================== ATOMMAG =============================== */
  L({
    id: "atommag", parent: "atom", nev: "Atommag, kötési energia", alcim: "Nukleonok, magerő, tömeghiány – és a relativitáselmélet elemei",
    elofeltetel: ["Atommodellek"],
    kulcsszavak: "atommag proton neutron nukleon izotóp tömegszám rendszám magerő tömeghiány kötési energia fajlagos e=mc2 relativitás idődilatáció müon",
    attekintes: R`<p class="lead">Az atommag protonokból és neutronokból áll, amelyeket az erős kölcsönhatás tart össze. A mag tömege kisebb alkotórészei összegénél – a különbség a kötési energia ($E = mc^2$).</p>`,
    elmelet: R`<div class="prose">
<h3>Felépítés</h3><p>Jelölés: $^{A}_{Z}\mathrm X$ – $Z$ rendszám (protonok), $A$ tömegszám (nukleonok), $N = A - Z$ neutronok. <strong>Izotópok</strong>: azonos $Z$, különböző $N$ (kémiailag azonosak). A mag sugara $\approx 1{,}2\cdot A^{1/3}$ fm; sűrűsége óriási ($\approx 2\cdot 10^{17}$ kg/m³).</p>
<h3>Magerő</h3><p>Az erős kölcsönhatás vonzó, töltésfüggetlen, nagyon rövid hatótávolságú (≈ 2 fm) – legyőzi a protonok taszítását. Nagy magokban több neutron kell a stabilitáshoz.</p>
<h3>Tömeghiány, kötési energia</h3><p>$$E_k = \Delta m\,c^2, \qquad 1\ \mathrm u \cdot c^2 = 931{,}5\ \mathrm{MeV}$$ Az egy nukleonra jutó kötési energia görbéje a vasnál (≈ 8,8 MeV) maximális: nehéz magok <strong>hasadásakor</strong> és könnyű magok <strong>egyesülésekor</strong> energia szabadul fel.</p>
<h3>A relativitáselmélet elemei</h3><p>Einstein posztulátumai: a fizika törvényei minden inerciarendszerben azonosak; a fény sebessége vákuumban minden inerciarendszerben $c$. Következmények: <strong>idődilatáció</strong> $\Delta t = \Delta t_0/\sqrt{1 - v^2/c^2}$ (a kozmikus müonok elérik a felszínt; GPS-korrekció), hosszkontrakció, $E = mc^2$, $c$ a határsebesség.</p></div>`,
    peldak: [{ szint: "4 · Emelt", cim: "A hélium kötési energiája", feladat: R`<p>$m_p = 1{,}00728$ u, $m_n = 1{,}00866$ u, a ⁴He mag tömege 4,00151 u. Mekkora a kötési energia és az egy nukleonra jutó kötési energia?</p>`,
      megoldas: R`<p>$\Delta m = 2\cdot 1{,}00728 + 2\cdot 1{,}00866 - 4{,}00151 = 0{,}03037\ \mathrm u$. $E_k = 0{,}03037\cdot 931{,}5 \approx 28{,}3\ \mathrm{MeV}$, nukleononként 7,07 MeV.</p>` }],
    hibak: [["Atom- vs. magtömeg", "Atomtömeg-táblázat használatakor az elektronok tömegét is figyelembe kell venni."], ["Tömeghiány iránya", "A mag tömege KISEBB, mint a nukleonok összege."]],
    osszefoglalo: sum(["Izotópok: azonos protonszám, más neutronszám.", "Kötési energia = tömeghiány × c².", "Vas körül a legstabilabbak a magok."], R`$$E = mc^2 \qquad E_k = \Delta m c^2 \qquad \Delta t = \frac{\Delta t_0}{\sqrt{1 - v^2/c^2}}$$`),
    erettsegi: [["Feleletválasztós (I.)", "Izotópok, a mag összetétele, fajlagos kötési energia görbéje, idődilatáció (müon)."], ["Témakifejtés (II.)", "Az atommag szerkezete és a magerők; a tömeg-energia egyenértékűség."], ["Összetett feladatok (III.)", "Tömeghiány, felszabaduló energia magreakcióban."]],
    feladatok: [
      { id: "mag2-01", szint: 1, tipus: "mc", pont: 2, cim: "Izotópok", szoveg: R`Miben különbözik a ¹²C és a ¹⁴C atommagja?`, opciok: ["A protonok számában", "A neutronok számában", "Az elektronok számában", "A rendszámban"], helyes: 1, tippek: ["Mindkettő szén: mi azonos?"], megoldas: R`Azonos a rendszám (6 proton); a ¹⁴C-ben 8, a ¹²C-ben 6 neutron van.` },
      { id: "mag2-02", szint: 2, tipus: "num", pont: 2, cim: "1 gramm energiája", szoveg: R`Mekkora energiának felel meg 1,0 g tömeg? ($c = 3\cdot 10^8$ m/s) TJ-ban (10¹² J)!`, valasz: 90, egyseg: "TJ", tol: 0.01, tippek: ["$E = mc^2$, m = 0,001 kg"], megoldas: R`$E = 0{,}001\cdot 9\cdot 10^{16} = 9\cdot 10^{13}\ \mathrm J = 90\ \mathrm{TJ}$.` },
      { id: "mag2-03", szint: 3, tipus: "num", pont: 2, cim: "Fajlagos kötési energia", szoveg: R`A ⁴He kötési energiája 28,3 MeV. Mekkora az egy nukleonra jutó kötési energia? MeV-ban!`, valasz: 7.075, egyseg: "MeV", tol: 0.01, tippek: ["Ossz a tömegszámmal."], megoldas: R`$28{,}3/4 \approx 7{,}08\ \mathrm{MeV}$.` },
    ],
  });

  /* =============================== RADIOAKTIVITÁS =============================== */
  L({
    id: "radioaktivitas", parent: "atom", nev: "Radioaktivitás, sugárvédelem", alcim: "Bomlások, felezési idő, dózis",
    elofeltetel: ["Atommag"],
    kulcsszavak: "radioaktivitás alfa béta gamma bomlás felezési idő bomlástörvény aktivitás becquerel dózis gray sievert sugárvédelem háttérsugárzás radon kormeghatározás c-14 geiger",
    attekintes: R`<p class="lead">Az instabil atommagok spontán bomlanak, közben sugárzást bocsátanak ki. Az egyes mag bomlása véletlen, de sok mag együtt pontos törvényt követ.</p>`,
    elmelet: R`<div class="prose">
<h3>Sugárzásfajták</h3><table class="data"><thead><tr><th></th><th>Mi ez?</th><th>Bomlás</th><th>Áthatolóképesség</th></tr></thead><tbody>
<tr><td>α</td><td>⁴He mag</td><td>$A - 4$, $Z - 2$</td><td>papír megállítja; legerősebben ionizál</td></tr><tr><td>β⁻</td><td>elektron</td><td>$A$ áll., $Z + 1$ (n → p)</td><td>néhány mm alumínium</td></tr><tr><td>β⁺</td><td>pozitron</td><td>$A$ áll., $Z - 1$</td><td>hasonló (PET)</td></tr><tr><td>γ</td><td>nagy energiájú foton</td><td>$A$, $Z$ nem változik</td><td>vastag ólom, beton</td></tr></tbody></table>
<p>Mágneses mezőben az α és β ellentétes irányba térül el, a γ nem. Felfedezés: Becquerel (1896), Curie-házaspár (polónium, rádium).</p>
<h3>Bomlástörvény</h3><p>$$N = N_0\cdot 2^{-t/T_{1/2}}, \qquad A = \lambda N, \qquad \lambda = \frac{\ln2}{T_{1/2}}$$ Aktivitás: bomlások száma másodpercenként (Bq). Kormeghatározás: C-14 ($T = 5730$ év), kőzeteknél U–Pb, K–Ar.</p>
<h3>Dózis, sugárvédelem</h3><p>Elnyelt dózis $D = E/m$ (Gy); egyenértékdózis $H = w_R D$ (Sv; α-ra $w = 20$). Természetes háttér ≈ 2–3 mSv/év (radon a legnagyobb rész). Védekezés: <strong>távolság</strong> (négyzetes csökkenés), <strong>idő</strong>, <strong>árnyékolás</strong>; az α-sugárzó belélegezve/lenyelve a legveszélyesebb. Alkalmazások: orvosi diagnosztika és terápia, sterilizálás, füstérzékelő, nyomjelzés.</p></div>`,
    peldak: [{ szint: "3 · Közép", cim: "Radiokarbon kormeghatározás", feladat: R`<p>Egy fa lelet C-14 aktivitása a mai élő fáénak 25%-a. Hány éves? ($T = 5730$ év)</p>`, megoldas: R`<p>25% = 1/4 = 2⁻², tehát 2 felezési idő: $\approx 11\,500$ év.</p>` }],
    hibak: [["Felezési idő", "Két felezési idő alatt NEM bomlik el minden – csak ¾-e."], ["Bomlási egyenlet", "A tömegszám és a rendszám összege mindkét oldalon egyezzen."], ["Áthatolóképesség vs. veszélyesség", "Az α a legkevésbé áthatoló, de testbe jutva a legveszélyesebb."]],
    osszefoglalo: sum(["α: He-mag, β: elektron, γ: foton.", "Felezési időnként a felére csökken.", "Távolság, idő, árnyékolás."], R`$$N = N_0 2^{-t/T} \qquad A = \lambda N \qquad \lambda = \frac{\ln2}{T} \qquad H = w_R D$$`),
    erettsegi: [["Feleletválasztós (I.)", "Bomlási egyenletek, áthatolóképesség, eltérülés mezőben, maradék magok aránya."], ["Témakifejtés (II.)", "A radioaktivitás felfedezése és alkalmazásai; sugárvédelem; Curie, Becquerel."], ["Összetett feladatok (III.)", "Aktivitás és magszám, kormeghatározás, bomlási sor, dózisszámítás."]],
    feladatok: [
      { id: "rad-01", szint: 1, tipus: "mc", pont: 2, cim: "Áthatolóképesség", szoveg: R`Melyik sugárzást nyeli el már egy papírlap is?`, opciok: ["alfa", "béta", "gamma", "mindhármat"], helyes: 0, tippek: ["Melyik részecske a legnagyobb tömegű és töltésű?"], megoldas: R`Az α-részecske nagy tömegű, kétszeres töltésű, erősen ionizál, ezért gyorsan leadja az energiáját.` },
      { id: "rad-02", szint: 2, tipus: "num", pont: 2, cim: "Három felezési idő", szoveg: R`A kezdeti magok hány százaléka marad meg 3 felezési idő után?`, valasz: 12.5, egyseg: "%", tol: 0.01, tippek: ["$(1/2)^3$"], megoldas: R`$1/8 = 12{,}5\%$.` },
      { id: "rad-03", szint: 3, tipus: "num", pont: 2, cim: "Jód-131", szoveg: R`A jód-131 felezési ideje 8 nap. Mennyi idő alatt csökken aktivitása tizenhatodára? napban!`, valasz: 32, egyseg: "nap", tol: 0.01, tippek: ["1/16 = 2⁻⁴"], megoldas: R`4 felezési idő: 32 nap.` },
    ],
  });

  /* =============================== MAGHASADÁS =============================== */
  L({
    id: "maghasadas", parent: "atom", nev: "Maghasadás, fúzió, atomerőmű", alcim: "Energia az atommagból",
    elofeltetel: ["Atommag", "Radioaktivitás"],
    kulcsszavak: "maghasadás láncreakció urán neutron moderátor szabályozórúd kritikus tömeg atomerőmű paks reaktor fúzió nap hidrogénbomba iter tokamak radioaktív hulladék",
    attekintes: R`<p class="lead">Az urán-235 lassú neutron befogásakor két közepes magra hasad, és 2–3 új neutront, valamint ≈ 200 MeV energiát ad. A láncreakció szabályozott formája az atomerőmű; a fúzió a Nap energiaforrása.</p>`,
    elmelet: R`<div class="prose">
<h3>Maghasadás</h3><p>Hahn és Strassmann (1938). Pl. $^{235}\mathrm U + n \to\ ^{141}\mathrm{Ba} + ^{92}\mathrm{Kr} + 3n + 200\ \mathrm{MeV}$. Az energia nagy része a hasadványok mozgási energiája → hő.</p>
<h3>Láncreakció</h3><p>A felszabaduló neutronok újabb hasadásokat okozhatnak. Szabályozott, ha átlagosan pontosan egy neutron okoz újabb hasadást (sokszorozási tényező $k = 1$). <strong>Kritikus tömeg</strong>: ennél kisebb tömegből túl sok neutron szökik meg.</p>
<h3>Atomerőmű</h3><p>Fűtőelemek (dúsított urán, 3–5% U-235), <strong>moderátor</strong> (víz, grafit – lelassítja a neutronokat, mert a lassú neutront nagyobb valószínűséggel nyeli el az U-235), <strong>szabályozórudak</strong> (bór, kadmium – elnyelik a neutronokat), hűtőközeg, hőcserélő → gőzturbina → generátor. Paks: nyomottvizes reaktorok. Előny: nincs CO₂-kibocsátás, kis üzemanyagigény; hátrány: nagy aktivitású hulladék, baleseti kockázat (Csernobil, Fukusima).</p>
<h3>Fúzió</h3><p>Könnyű magok egyesülése (a Napban: 4 proton → hélium). Nagyon magas hőmérséklet kell a Coulomb-taszítás legyőzéséhez. Földi kísérletek: tokamak, ITER; a hidrogénbomba ellenőrizetlen fúzió.</p></div>`,
    peldak: [{ szint: "4 · Emelt", cim: "Üzemanyagigény", feladat: R`<p>Mennyi U-235 hasad el naponta egy 1000 MW hőteljesítményű reaktorban? (200 MeV/hasadás, egy mag tömege $3{,}9\cdot 10^{-25}$ kg)</p>`,
      megoldas: R`<p>Hasadások: $\dfrac{10^9}{200\cdot 1{,}6\cdot 10^{-13}} \approx 3{,}1\cdot 10^{19}$ /s. Naponta: $3{,}1\cdot 10^{19}\cdot 86\,400\cdot 3{,}9\cdot 10^{-25} \approx 1{,}05\ \mathrm{kg}$. Egy széntüzelésű erőmű ugyanehhez kb. 10 000 tonna szenet égetne el.</p>` }],
    hibak: [["Moderátor vs. szabályozórúd", "A moderátor lassít, a szabályozórúd elnyel."], ["MeV → J", "1 MeV = 1,6·10⁻¹³ J."]],
    osszefoglalo: sum(["Hasadás és fúzió is a kötési energia növekedéséből nyer energiát.", "Szabályozott láncreakció: k = 1."], R`$$N = \frac{Pt}{E_1} \qquad E = \Delta m c^2$$`),
    erettsegi: [["Feleletválasztós (I.)", "A reaktor részeinek szerepe; láncreakció feltétele; fúzió a Napban."], ["Témakifejtés (II.)", "Az atomerőmű működése, előnyei és kockázatai; a maghasadás felfedezése (Szilárd Leó, Teller Ede, Wigner Jenő)."]],
    feladatok: [
      { id: "has-01", szint: 1, tipus: "mc", pont: 2, cim: "Moderátor", szoveg: R`Mi a moderátor szerepe az atomreaktorban?`, opciok: ["Elnyeli a neutronokat.", "Lelassítja a neutronokat.", "Hűti a fűtőelemeket.", "Elnyeli a gammasugárzást."], helyes: 1, tippek: ["Milyen neutronnal hasad jobban az U-235?"], megoldas: R`A moderátor lelassítja a gyors neutronokat, mert a lassú neutronokat az U-235 nagyobb valószínűséggel nyeli el. Az elnyelés a szabályozórúd feladata.` },
      { id: "has-02", szint: 3, tipus: "num", pont: 3, cim: "Hasadások száma", szoveg: R`Hány hasadás kell másodpercenként 1000 MW hőteljesítményhez, ha egy hasadás 200 MeV-ot ad? (Az eredményt $10^{19}$ egységben add meg!)`, valasz: 3.125, egyseg: "·10¹⁹ /s", tol: 0.01, tippek: ["200 MeV = 3,2·10⁻¹¹ J"], megoldas: R`$10^9/3{,}2\cdot 10^{-11} = 3{,}125\cdot 10^{19}$.` },
      { id: "has-03", szint: 4, tipus: "num", pont: 4, cim: "Napi uránfogyás", szoveg: R`Hány kg U-235 hasad el naponta egy 1000 MW hőteljesítményű reaktorban? (200 MeV/hasadás, 1 MeV = 1,6·10⁻¹³ J, egy mag tömege 3,9·10⁻²⁵ kg)`, valasz: 1.053, egyseg: "kg", tol: 0.02, tippek: ["Hasadások száma/s × 86 400 × egy mag tömege"], megoldas: R`$3{,}125\cdot 10^{19}\cdot 86\,400\cdot 3{,}9\cdot 10^{-25} \approx 1{,}05\ \mathrm{kg}$.` },
    ],
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
