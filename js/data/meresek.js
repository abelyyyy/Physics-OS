/* PHYSICS OS — a 20 emelt szintű szóbeli mérés (2026. tavaszi lista; az OH évente frissíti)
 * kiertekeles.tipus:
 *   "fit"  – mért táblázat → (X, Y) pontok → egyenes illesztés → eredmények (+ opcionális paraméterek)
 *   "avg"  – soronként számolt érték → átlag és legnagyobb eltérés
 *   "calc" – egyszeri adatokból számolás
 */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const R = String.raw;
  const g = 9.81, PI2 = 4 * Math.PI * Math.PI, d2r = Math.PI / 180;
  const n = (x, d = 3) => PO.util.fmt(x, d);

  PO.MERESEK = [
    { nr: 1, id: "sulymeres", cim: "Súlymérés", temakor: "merev-test",
      eszkozok: "centiméteres farúd, rugós erőmérő, akasztózsinóros ismeretlen súlyú kődarab, támasztó ékek, Bunsen-állvány",
      cel: "Egy olyan test súlyának meghatározása, amely nagyobb az erőmérő méréshatáránál – emelő (forgatónyomatékok egyensúlya) segítségével.",
      elmelet: R`<p>A farudat a súlypontjában (közepén) alátámasztjuk, így saját súlyának nincs nyomatéka. A kő a tengelytől $k_1$, az erőmérő $k_2$ távolságban hat; egyensúlyban $$G\,k_1 = F\,k_2 \quad\Rightarrow\quad F = G k_1\cdot\frac{1}{k_2}$$ Több $k_2$-nél mérve az $F$–$1/k_2$ grafikon origón átmenő egyenes, meredeksége $Gk_1$.</p>`,
      lepesek: ["Egyensúlyozd ki a rudat az ékre helyezve (súlypont).", "Akaszd a követ a tengelytől $k_1$ távolságra.", "Az erőmérővel függőlegesen tartsd vízszintesen a rudat különböző $k_2$ távolságokban, olvasd le $F$-et.", "Ábrázold $F$-et $1/k_2$ függvényében, illessz egyenest."],
      hibak: ["Az erőmérő nem függőleges (csak a merőleges összetevő számít).", "A rúd nem vízszintes leolvasáskor.", "Az erőmérő nullpontja elállítódott – fordított helyzetben nullázni kell!"],
      kiertekeles: { tipus: "fit", oszlopok: [["k2", "k₂", "m"], ["F", "F", "N"]], X: (r) => 1 / r.k2, Y: (r) => r.F, origo: true, xLabel: "1/k₂", xUnit: "1/m", yLabel: "F", yUnit: "N",
        param: [["k1", "k₁ (a kő karja)", "m", 0.1]], minta: [[0.2, 2.02], [0.3, 1.32], [0.4, 1.01], [0.5, 0.79]],
        eredmeny: (f, p) => [["Meredekség (G·k₁)", n(f.m), "N·m"], ["A kő súlya G", n(f.m / p.k1), "N"], ["A kő tömege", n(f.m / p.k1 / g), "kg"]] } },

    { nr: 2, id: "rugo", cim: "A rugóra függesztett test rezgésidejének vizsgálata", temakor: "rezgesek",
      eszkozok: "Bunsen-állvány, rugó, tömegsorozat, ismeretlen tömegű kődarab, stopper",
      cel: "A rezgésidő tömegfüggésének kimérése, a rugóállandó és egy ismeretlen tömeg meghatározása.",
      elmelet: R`<p>$$T = 2\pi\sqrt{\frac{m + m_0}{D}} \quad\Rightarrow\quad T^2 = \frac{4\pi^2}{D}\,m + \frac{4\pi^2}{D}m_0$$ A $T^2$–$m$ grafikon egyenes, meredeksége $4\pi^2/D$; a tengelymetszet a rugó saját tömegének hatását ($m_0 \approx m_{rugó}/3$) mutatja. Az ismeretlen tömeg a rezgésidejéből az egyenesről olvasható le.</p>`,
      lepesek: ["Akassz különböző tömegeket a rugóra, és mérd 10 rezgés idejét (kis amplitúdó, függőleges rezgés).", "Számold ki $T$-t és $T^2$-et.", "Ábrázold $T^2$-et $m$ függvényében, illessz egyenest.", "Mérd meg a kődarab rezgésidejét is, és határozd meg a tömegét."],
      hibak: ["Reakcióidő: 10 rezgést mérj, és a szélső helyzetnél indíts.", "Túl nagy amplitúdó vagy oldalirányú lengés.", "A rugó tömegét nem lehet mindig elhanyagolni (tengelymetszet)."],
      kiertekeles: { tipus: "fit", oszlopok: [["m", "m", "kg"], ["t10", "10 rezgés ideje", "s"]], X: (r) => r.m, Y: (r) => (r.t10 / 10) ** 2, xLabel: "m", xUnit: "kg", yLabel: "T²", yUnit: "s²",
        param: [["tx", "A kő 10 rezgésének ideje", "s", 5.9]], minta: [[0.05, 3.18], [0.1, 4.46], [0.15, 5.45], [0.2, 6.3], [0.25, 7.03]],
        eredmeny: (f, p) => [["Rugóállandó D = 4π²/meredekség", n(PI2 / f.m), "N/m"], ["Tengelymetszet → m₀", n(f.b / f.m), "kg"], ["A kő tömege", n(((p.tx / 10) ** 2 - f.b) / f.m), "kg"]] } },

    { nr: 3, id: "forgasi", cim: "Forgási energia mérése, tehetetlenségi nyomaték számítása", temakor: "merev-test",
      eszkozok: "kis emelkedésű lejtő, vékony falú cső, mérőszalag, stopper, mérleg",
      cel: "A lejtőn leguruló vékony falú cső forgási energiájának és tehetetlenségi nyomatékának meghatározása az energiamegmaradás alapján.",
      elmelet: R`<p>Nyugalomból egyenletesen gyorsulva: $v = \dfrac{2s}{t}$. Energiamegmaradás: $$mgh = \tfrac12mv^2 + \tfrac12\Theta\left(\frac vr\right)^2 \Rightarrow \Theta = mr^2\left(\frac{2gh}{v^2} - 1\right)$$ Vékony falú csőre elméletileg $\Theta = mr^2$, ekkor a forgási és a haladó mozgási energia egyenlő.</p>`,
      lepesek: ["Mérd meg a cső tömegét és sugarát, a lejtő hosszát és magasságát.", "Engedd el a csövet nyugalomból, mérd a leérés idejét (többször, átlagolj).", "Számold ki a végsebességet, az energiákat és Θ-t."],
      hibak: ["A cső csúszik (túl meredek lejtő).", "Gördülési ellenállás, a lejtő nem egyenletes.", "Az időmérés hibája négyzetesen hat ($v^2$)."],
      kiertekeles: { tipus: "calc", be: [["m", "a cső tömege", "kg", 0.15], ["r", "a cső sugara", "m", 0.02], ["s", "a lejtő hossza", "m", 1.0], ["h", "a lejtő magassága", "m", 0.05], ["t", "leérés ideje", "s", 2.86]],
        szamol: (v) => { const vv = (2 * v.s) / v.t, Th = v.m * v.r ** 2 * ((2 * g * v.h) / vv ** 2 - 1); return [["Végsebesség v", n(vv), "m/s"], ["Helyzeti energia", n(v.m * g * v.h), "J"], ["Haladó mozgási energia", n(0.5 * v.m * vv ** 2), "J"], ["Forgási energia", n(v.m * g * v.h - 0.5 * v.m * vv ** 2), "J"], ["Θ (mért)", n(Th), "kg·m²"], ["Θ / (m r²)", n(Th / (v.m * v.r ** 2)), "(elmélet: 1)"]]; } } },

    { nr: 4, id: "ballisztikus", cim: "Tapadókorongos játékpisztoly-lövedék sebességének mérése ballisztikus ingával", temakor: "lendulet",
      eszkozok: "játékpisztoly és lövedékek, Bunsen-állvány, bútorlap inga, zsinór, zsámoly, mérőszalag, jelölő hurkapálca, stopper, (mérleg)",
      cel: "A lövedék sebességének meghatározása a lendületmegmaradás és az energiamegmaradás együttes alkalmazásával.",
      elmelet: R`<p>1. Ütközés (rugalmatlan, rövid): $mv = (m + M)u$. 2. Kilendülés: $\tfrac12(m+M)u^2 = (m+M)gh$. A kilendülés magassága a vízszintes kitérésből: $h = L - \sqrt{L^2 - d^2}$. $$v = \frac{m + M}{m}\sqrt{2gh}$$</p>`,
      lepesek: ["Mérd meg a lövedék és az inga tömegét (vagy a lengésidőből az inga hosszát).", "Lőj az ingára, és jelöld a hurkapálcával a legnagyobb vízszintes kitérést.", "Ismételd többször, átlagolj."],
      hibak: ["Az ütközés nem tökéletesen rugalmatlan (a korong nem tapad meg).", "Az inga elfordul, nem csak leng.", "Kis kitérésnél nagy a relatív hiba."],
      kiertekeles: { tipus: "calc", be: [["m", "lövedék tömege", "kg", 0.012], ["M", "inga tömege", "kg", 0.2], ["L", "ingahossz", "m", 1.0], ["d", "vízszintes kitérés", "m", 0.15]],
        szamol: (v) => { const h = v.L - Math.sqrt(v.L ** 2 - v.d ** 2), u = Math.sqrt(2 * g * h), vv = ((v.m + v.M) / v.m) * u; return [["Emelkedés h", n(h * 100), "cm"], ["Közös sebesség u", n(u), "m/s"], ["Lövedék sebessége v", n(vv), "m/s"], ["Hővé alakult hányad", n((1 - v.m / (v.m + v.M)) * 100), "%"]]; } } },

    { nr: 5, id: "inga", cim: "A nehézségi gyorsulás meghatározása matematikai inga lengésidejével", temakor: "rezgesek",
      eszkozok: "öt különböző hosszúságú fonál, két azonos kampós ingatest, stopper, Bunsen-állvány, milliméterpapír",
      cel: "A lengésidő hosszfüggésének kimérése és $g$ meghatározása linearizálással.",
      elmelet: R`<p>Kis kitérésnél $T = 2\pi\sqrt{l/g}$, azaz $$T^2 = \frac{4\pi^2}{g}\,l$$ A $T^2$–$l$ grafikon origón átmenő egyenes, $g = 4\pi^2/\text{meredekség}$. Az ingahossz a felfüggesztési ponttól az ingatest <em>súlypontjáig</em> mért távolság.</p>`,
      lepesek: ["Mérj öt különböző ingahosszt.", "Mindegyiknél mérd 10 lengés idejét kis (≲ 10°) kitéréssel.", "Ábrázold $T^2$-et $l$ függvényében, illessz egyenest."],
      hibak: ["Nagy kitérés (a képlet csak kis szögre pontos).", "A hosszat nem a súlypontig mérték.", "Kúpinga-mozgás, csavarodó fonál."],
      kiertekeles: { tipus: "fit", oszlopok: [["l", "l", "m"], ["t10", "10 lengés ideje", "s"]], X: (r) => r.l, Y: (r) => (r.t10 / 10) ** 2, origo: true, xLabel: "l", xUnit: "m", yLabel: "T²", yUnit: "s²",
        minta: [[0.3, 11.02], [0.5, 14.16], [0.7, 16.81], [0.9, 19.0], [1.1, 21.07]],
        eredmeny: (f) => [["g = 4π²/meredekség", n(PI2 / f.m), "m/s²"], ["Eltérés 9,81-től", n((100 * (PI2 / f.m - 9.81)) / 9.81, 2), "%"]] } },

    { nr: 6, id: "tracker", cim: "Pattogó pingponglabda mozgásának vizsgálata Tracker videoelemzővel", temakor: "kinematika",
      eszkozok: "pingponglabda, hosszúságetalon, Tracker szoftver, webkamera",
      cel: "A pattogó labda hely–idő és sebesség–idő grafikonjának felvétele, a nehézségi gyorsulás és az ütközési energiaveszteség meghatározása.",
      elmelet: R`<p>Két pattanás között a labda függőleges hajítást végez: a $v_y$–$t$ grafikon egyenes, meredeksége $-g$. Az egymást követő emelkedési magasságok aránya az energiaveszteséget mutatja: $E_2/E_1 = h_2/h_1$; az ütközési szám $k = v'/v = \sqrt{h_2/h_1}$.</p>`,
      lepesek: ["Vedd fel a videót oldalról, az etalonnal egy síkban.", "Tracker: kalibráld a hosszúságot, jelöld a labdát képkockánként.", "Olvasd le a v–t grafikon meredekségét és a csúcsmagasságokat."],
      hibak: ["Perspektivikus torzítás (a labda nem az etalon síkjában).", "Alacsony képkockaszám a pattanásnál.", "Légellenállás a magasabb pattanásoknál."],
      kiertekeles: { tipus: "calc", be: [["h0", "ejtési magasság", "m", 1.0], ["h1", "1. visszapattanás magassága", "m", 0.8], ["h2", "2. visszapattanás magassága", "m", 0.64]],
        szamol: (v) => [["k₁ = √(h₁/h₀)", n(Math.sqrt(v.h1 / v.h0)), ""], ["k₂ = √(h₂/h₁)", n(Math.sqrt(v.h2 / v.h1)), ""], ["Energiaveszteség 1. pattanáskor", n(100 * (1 - v.h1 / v.h0)), "%"], ["Energiaveszteség 2. pattanáskor", n(100 * (1 - v.h2 / v.h1)), "%"], ["Becsapódási sebesség (1.)", n(Math.sqrt(2 * g * v.h0)), "m/s"]] } },

    { nr: 7, id: "hangsebesseg", cim: "A hang sebességének mérése állóhullámokkal", temakor: "mech-hullamok",
      eszkozok: "nagy mérőhenger vízzel, centiméteres műanyag csövek, hangvilla, mérőszalag, Bunsen-állvány",
      cel: "A hang terjedési sebességének meghatározása egyik végén zárt légoszlop rezonanciájával.",
      elmelet: R`<p>A vízbe merülő cső egyik végén zárt síp: rezonancia, ha $L = (2n - 1)\dfrac\lambda4$. Két egymást követő rezonanciahossz különbsége $\lambda/2$: $$c = \lambda f = 2f(L_2 - L_1)$$ Egyetlen rezonanciából végkorrekcióval: $c \approx 4f(L_1 + 0{,}3d)$.</p>`,
      lepesek: ["Tartsd a megütött hangvillát a cső fölé, és emeld a csövet a vízből.", "Jelöld meg, ahol a hang a leghangosabb (első, majd második rezonancia).", "Mérd meg a légoszlop hosszát és a cső átmérőjét."],
      hibak: ["A végkorrekció elhanyagolása (csak egy hosszból számolva).", "Pontatlan rezonanciahely – közelítsd mindkét irányból.", "A hangsebesség hőmérsékletfüggő ($\\approx 331 + 0{,}6\\,t$ m/s)."],
      kiertekeles: { tipus: "calc", be: [["f", "hangvilla frekvenciája", "Hz", 440], ["L1", "1. rezonanciahossz", "m", 0.181], ["L2", "2. rezonanciahossz", "m", 0.567], ["d", "a cső belső átmérője", "m", 0.04]],
        szamol: (v) => [["λ = 2(L₂ − L₁)", n(2 * (v.L2 - v.L1)), "m"], ["c = 2f(L₂ − L₁)", n(2 * v.f * (v.L2 - v.L1)), "m/s"], ["c ≈ 4f(L₁ + 0,3d)", n(4 * v.f * (v.L1 + 0.3 * v.d)), "m/s"]] } },

    { nr: 8, id: "suruseg", cim: "Szilárd test és folyadék sűrűségének meghatározása", temakor: "hidrosztatika",
      eszkozok: "mérőpoharak, víz, digitális mérleg, rugós erőmérő, kődarab, cérna, ragasztószalag, ismeretlen sűrűségű folyadék",
      cel: "A kő és egy ismeretlen folyadék sűrűségének meghatározása Arkhimédész törvényével.",
      elmelet: R`<p>A kő súlya levegőben $G$, vízbe merítve $G_v$, a folyadékba merítve $G_f$. A felhajtóerők $G - G_v = \rho_v Vg$ és $G - G_f = \rho_f V g$, így $$\rho_{kő} = \rho_v\frac{G}{G - G_v}, \qquad \rho_f = \rho_v\frac{G - G_f}{G - G_v}$$ A térfogatot nem is kell ismerni.</p>`,
      lepesek: ["Mérd meg a kő súlyát levegőben.", "Merítsd teljesen vízbe (ne érjen az edényhez), olvasd le az erőmérőt.", "Ismételd az ismeretlen folyadékkal."],
      hibak: ["A kő hozzáér az edény falához vagy aljához.", "Légbuborékok tapadnak a kőre.", "Az erőmérő kis felbontása – kis különbségeknél nagy relatív hiba."],
      kiertekeles: { tipus: "calc", be: [["G", "súly levegőben", "N", 3.0], ["Gv", "súly vízben", "N", 1.89], ["Gf", "súly a folyadékban", "N", 2.11]],
        szamol: (v) => [["Felhajtóerő vízben", n(v.G - v.Gv), "N"], ["A kő térfogata", n(((v.G - v.Gv) / (1000 * g)) * 1e6), "cm³"], ["A kő sűrűsége", n((1000 * v.G) / (v.G - v.Gv)), "kg/m³"], ["A folyadék sűrűsége", n((1000 * (v.G - v.Gf)) / (v.G - v.Gv)), "kg/m³"]] } },

    { nr: 9, id: "fajho", cim: "Szilárd anyag (alumínium) fajhőjének meghatározása", temakor: "kalorimetria",
      eszkozok: "ismert hőkapacitású kaloriméter, keverő, hőmérők, főzőpoharak, vízforraló, mérleg, alumíniumdarabok",
      cel: "Az alumínium fajhőjének meghatározása keveréses kaloriméteres méréssel.",
      elmelet: R`<p>A forró vízben felmelegített ($T_a$) alumíniumot a kaloriméter hideg ($T_v$) vizébe tesszük; a közös hőmérséklet $T_k$. Hőmérleg: $$c_a m_a (T_a - T_k) = (c_v m_v + C_k)(T_k - T_v)$$</p>`,
      lepesek: ["Mérd meg a víz és az alumínium tömegét.", "Melegítsd az alumíniumot forrásban lévő vízben, mérd a hőmérsékletét.", "Gyorsan tedd a kaloriméterbe, keverd, olvasd le a legmagasabb közös hőmérsékletet."],
      hibak: ["Hőveszteség az átrakás közben.", "Az alumíniumon maradt forró víz.", "A kaloriméter hőkapacitásának elhanyagolása."],
      kiertekeles: { tipus: "calc", be: [["Ck", "a kaloriméter hőkapacitása", "J/K", 80], ["mv", "víz tömege", "kg", 0.2], ["Tv", "víz kezdeti hőmérséklete", "°C", 20], ["ma", "alumínium tömege", "kg", 0.1], ["Ta", "alumínium kezdeti hőmérséklete", "°C", 95], ["Tk", "közös hőmérséklet", "°C", 26.7]],
        szamol: (v) => { const c = ((4180 * v.mv + v.Ck) * (v.Tk - v.Tv)) / (v.ma * (v.Ta - v.Tk)); return [["Felvett hő (víz + kaloriméter)", n((4180 * v.mv + v.Ck) * (v.Tk - v.Tv)), "J"], ["Az alumínium fajhője", n(c), "J/(kg·K)"], ["Eltérés a táblázati 900-tól", n((100 * (c - 900)) / 900, 2), "%"]]; } } },

    { nr: 10, id: "kristalyosodas", cim: "Kristályosodási hő mérése", temakor: "kalorimetria",
      eszkozok: "ismert hőkapacitású kaloriméter, keverő, hőmérő, ételhőmérő, stopper, ismert tömegű túlhűtött sóolvadék (melegítőpárna), víz",
      cel: "A melegítőpárnában lévő túlhűtött sóolvadék (nátrium-acetát) kristályosodási hőjének meghatározása.",
      elmelet: R`<p>A túlhűtött olvadék szobahőmérsékleten folyékony; a fémlapka átpattintásakor kristályosodik, és $L\,m_s$ hőt ad le, amely a vizet, a kalorimétert és magát a sót melegíti: $$L\,m_s = (c_v m_v + C_k + c_s m_s)(T_2 - T_1)$$ (A só fajhője becsült érték, ≈ 2–3 kJ/(kg·K).)</p>`,
      lepesek: ["Tedd a párnát a kaloriméter ismert tömegű vizébe, mérd a kezdeti hőmérsékletet.", "Indítsd el a kristályosodást, keverj, és kövesd a hőmérsékletet stopperrel.", "Olvasd le a legmagasabb hőmérsékletet."],
      hibak: ["Hőveszteség a hosszú mérés alatt (hőmérséklet–idő grafikonnal korrigálható).", "A párna műanyag burkának hőkapacitása.", "A só fajhőjének bizonytalansága."],
      kiertekeles: { tipus: "calc", be: [["ms", "a só tömege", "kg", 0.1], ["mv", "víz tömege", "kg", 0.3], ["Ck", "kaloriméter hőkapacitása", "J/K", 80], ["cs", "a só fajhője (becslés)", "J/(kg·K)", 2500], ["T1", "kezdeti hőmérséklet", "°C", 20], ["T2", "legmagasabb hőmérséklet", "°C", 36.7]],
        szamol: (v) => { const Q = (4180 * v.mv + v.Ck + v.cs * v.ms) * (v.T2 - v.T1); return [["Felszabadult hő", n(Q), "J"], ["Kristályosodási hő L", n(Q / v.ms / 1000), "kJ/kg"], ["Irodalmi érték (Na-acetát-trihidrát)", "≈ 264", "kJ/kg"]]; } } },

    { nr: 11, id: "ekvipotencialis", cim: "Ekvipotenciális vonalak kimérése elektromos térben", temakor: "elektrosztatika",
      eszkozok: "tápegység, feszültségmérő, elektródok, összekötő vezetékek, lapos potenciálkád, milliméterpapír",
      cel: "Két elektród közötti tér ekvipotenciális vonalainak kimérése, az erővonalkép megrajzolása, a térerősség becslése.",
      elmelet: R`<p>A vízzel töltött kádban az elektródok közötti áram mezeje modellezi az elektrosztatikus mezőt. A feszültségmérő egyik pontját az egyik elektródhoz, a másikat (szonda) a kádba téve megkeressük az azonos potenciálú pontokat. Az erővonalak merőlegesek az ekvipotenciális vonalakra; a térerősség ott nagy, ahol a vonalak sűrűn vannak: $$E \approx \frac{\Delta U}{\Delta d}$$</p>`,
      lepesek: ["Helyezd a milliméterpapírt a kád alá, állítsd be az elektródokat.", "Keress több pontot ugyanazzal a feszültséggel (pl. 1 V-onként).", "Kösd össze a pontokat, majd rajzold be a rájuk merőleges erővonalakat."],
      hibak: ["A víz rétegvastagsága nem egyenletes.", "Elektródpolarizáció (váltakozó feszültség jobb).", "A szonda nem függőleges."],
      kiertekeles: { tipus: "calc", be: [["U1", "egyik ekvipotenciális vonal", "V", 2], ["U2", "szomszédos vonal", "V", 3], ["dd", "a vonalak távolsága", "m", 0.012]],
        szamol: (v) => [["Térerősség becslése", n(Math.abs(v.U2 - v.U1) / v.dd), "V/m"]] } },

    { nr: 12, id: "dinamika", cim: "A dinamika alaptörvényének alkalmazása", temakor: "dinamika",
      eszkozok: "nehezített kiskocsi, csavaralátétek, fonál, csigás sín, mérőszalag, könnyű kampó, szivacs ütközőnek, milliméterpapír",
      cel: "A gyorsulás és a gyorsító erő arányosságának igazolása állandó össztömeg mellett; az össztömeg és a súrlódás meghatározása.",
      elmelet: R`<p>A kocsit a csigán átvetett fonálon lógó $m$ tömegű kampó gyorsítja. Az alátéteket a kocsiról a kampóra rakva az össztömeg $M_{össz}$ állandó marad, a húzóerő $mg$: $$a = \frac{mg - F_s}{M_{össz}}$$ A gyorsulást az $s$ út megtételéhez szükséges időből számoljuk: $a = 2s/t^2$. Az $a$–$mg$ grafikon meredeksége $1/M_{össz}$, tengelymetszete $-F_s/M_{össz}$.</p>`,
      lepesek: ["Mérd meg az utat, és nyugalomból indítva a megtételéhez szükséges időt.", "Rakd át az alátéteket egyenként a kocsiról a kampóra, ismételd.", "Ábrázold $a$-t $mg$ függvényében."],
      hibak: ["Súrlódás a sínen és a csigán (tengelymetszet).", "A csiga és a fonál tömege.", "Reakcióidő az időmérésben."],
      kiertekeles: { tipus: "fit", oszlopok: [["m", "kampó + alátétek tömege", "kg"], ["t", "idő az s úton", "s"]], X: (r) => r.m * g, Y: (r, p) => (2 * p.s) / r.t ** 2, xLabel: "mg", xUnit: "N", yLabel: "a", yUnit: "m/s²",
        param: [["s", "megtett út s", "m", 0.8]], minta: [[0.01, 3.2], [0.02, 2.131], [0.03, 1.708], [0.04, 1.466], [0.05, 1.304]],
        eredmeny: (f) => [["Össztömeg M = 1/meredekség", n(1 / f.m), "kg"], ["Súrlódási erő", n(-f.b / f.m), "N"], ["Illeszkedés (R²)", n(f.r2, 4), ""]] } },

    { nr: 13, id: "aramforras", cim: "Az áramforrás paramétereinek vizsgálata", temakor: "egyenaram",
      eszkozok: "4,5 V-os laposelem, feszültségmérő, árammérő, tolóellenállás, kapcsoló, krokodilcsipeszek, vezetékek",
      cel: "A laposelem elektromotoros erejének, belső ellenállásának és rövidzárási áramának meghatározása.",
      elmelet: R`<p>$$U_k = \varepsilon - R_b I$$ A kapocsfeszültség–áram grafikon csökkenő egyenes: tengelymetszete $\varepsilon$, meredeksége $-R_b$; az áramtengelyt a rövidzárási áramnál ($\varepsilon/R_b$) metszené.</p>`,
      lepesek: ["Kapcsold sorba az elemet, az árammérőt és a tolóellenállást; a feszültségmérőt az elem kapcsaira.", "Különböző ellenállásoknál olvasd le $I$-t és $U$-t (rövid ideig zárd a kört!).", "Ábrázold $U$-t $I$ függvényében."],
      hibak: ["Az elem melegszik, kimerül – csak rövid ideig folyjon áram.", "A műszerek belső ellenállása.", "Rövidzárat ne hozz létre!"],
      kiertekeles: { tipus: "fit", oszlopok: [["I", "I", "A"], ["U", "U", "V"]], X: (r) => r.I, Y: (r) => r.U, xLabel: "I", xUnit: "A", yLabel: "U_k", yUnit: "V",
        minta: [[0.2, 4.26], [0.4, 4.02], [0.6, 3.79], [0.8, 3.53], [1.0, 3.31]],
        eredmeny: (f) => [["Elektromotoros erő ε", n(f.b), "V"], ["Belső ellenállás R_b", n(-f.m), "Ω"], ["Rövidzárási áram", n(f.b / -f.m), "A"], ["Max. külső teljesítmény", n((f.b * f.b) / (4 * -f.m)), "W"]] } },

    { nr: 14, id: "wheatstone", cim: "Zseblámpaizzó ellenállásának mérése Wheatstone-híddal", temakor: "egyenaram",
      eszkozok: "izzó foglalatban, 10 Ω, 47 Ω és 100 Ω ellenállások, 1 m ellenálláshuzal, 1,5 V-os elem, Morse-kapcsoló, Deprez-műszer, krokodilcsipeszek, vezetékek",
      cel: "Az izzó (hideg) ellenállásának meghatározása csúszóhuzalos Wheatstone-híddal, három különböző ismert ellenállással.",
      elmelet: R`<p>Kiegyenlített hídnál a középső műszeren nem folyik áram: $$R_x = R_n\frac{l_1}{l_2}, \qquad l_2 = 100\ \mathrm{cm} - l_1$$ A legpontosabb az a mérés, ahol a kiegyenlítés a huzal közepéhez közel van ($R_n \approx R_x$).</p>`,
      lepesek: ["Állítsd össze a hidat, $R_n$ helyére tedd sorban a 10, 47, 100 Ω-ot.", "A csúszóérintkezővel keresd meg, hol mutat nullát a műszer (Morse-kapcsolóval csak rövid ideig).", "Számold ki $R_x$-et mindhárom esetben, átlagolj."],
      hibak: ["Az izzó melegszik → nő az ellenállása (csak rövid áramlökés!).", "A huzal nem homogén, az érintkezők ellenállása.", "A huzal szélén pontatlan a kiegyenlítés."],
      kiertekeles: { tipus: "avg", oszlopok: [["Rn", "R_n", "Ω"], ["l1", "l₁ (az izzó felőli szakasz)", "cm"]], ertek: (r) => (r.Rn * r.l1) / (100 - r.l1), ertekNev: "R_x", ertekEgyseg: "Ω",
        minta: [[10, 41.2], [47, 12.9], [100, 6.5]] } },

    { nr: 15, id: "termisztor", cim: "Félvezető (termisztor) ellenállásának hőmérsékletfüggése; termisztoros hőmérő", temakor: "egyenaram",
      eszkozok: "termisztor, ellenállásmérő, főzőpoharak, hideg és forró víz, vízforraló, folyadékos hőmérő, milliméterpapír",
      cel: "A termisztor ellenállás–hőmérséklet görbéjének felvétele, és ennek alapján egy ismeretlen hőmérséklet mérése.",
      elmelet: R`<p>A félvezető ellenállása melegítéskor csökken (több töltéshordozó). NTC termisztorra jó közelítés: $$R = R_\infty e^{B/T} \Rightarrow \ln R = \ln R_\infty + B\cdot\frac1T$$ Az $\ln R$–$1/T$ grafikon egyenes (T kelvinben!), meredeksége $B$. Ebből egy mért ellenálláshoz tartozó hőmérséklet: $T = \dfrac{B}{\ln R - \ln R_\infty}$.</p>`,
      lepesek: ["Merítsd a termisztort és a hőmérőt különböző hőmérsékletű vízbe.", "Várd meg a hőmérsékleti egyensúlyt, olvasd le $R$-t és $t$-t.", "Ábrázold $R$-t $t$ függvényében (kalibrációs görbe), majd linearizálj."],
      hibak: ["Nincs hőmérsékleti egyensúly a leolvasáskor.", "A víz rétegzett (keverj!).", "Az ohmmérő árama melegíti a termisztort."],
      kiertekeles: { tipus: "fit", oszlopok: [["t", "t", "°C"], ["R", "R", "Ω"]], X: (r) => 1 / (r.t + 273.15), Y: (r) => Math.log(r.R), xLabel: "1/T", xUnit: "1/K", yLabel: "ln R", yUnit: "",
        param: [["Rx", "Ismeretlen hőmérsékleten mért R", "Ω", 6000]], minta: [[20, 12536], [30, 8037], [40, 5303], [50, 3588], [60, 2487], [70, 1760]],
        eredmeny: (f, p) => [["B (meredekség)", n(f.m), "K"], ["Ellenállás 25 °C-on", n(Math.exp(f.b + f.m / 298.15)), "Ω"], ["Az ismeretlen hőmérséklet", n(f.m / (Math.log(p.Rx) - f.b) - 273.15), "°C"]] } },

    { nr: 16, id: "feluleti", cim: "Felületi feszültség mérése", temakor: "feluleti",
      eszkozok: "két ismert és ismeretlen belső átmérőjű kapilláris, kis és nagy mérőpohár, vonalzó, víz, két szemcseppentő, kis mérőhenger, mosogatószer, keverőlapát",
      cel: "A víz felületi feszültségének mérése ismert kapillárissal, majd egy ismeretlen kapilláris átmérőjének meghatározása; a mosogatószer hatásának vizsgálata.",
      elmelet: R`<p>A kapilláris emelkedés: $$h = \frac{2\alpha}{\rho g r} \Rightarrow \alpha = \frac{\rho g r h}{2}, \qquad d_x = \frac{4\alpha}{\rho g h_x}$$ Tökéletes nedvesítést feltételezünk (tiszta üveg).</p>`,
      lepesek: ["Állítsd függőlegesen a tiszta kapillárist a vízbe, mérd az emelkedés magasságát a vízfelszíntől.", "Számold ki α-t.", "Mérd az ismeretlen kapillárisban is, számold ki az átmérőjét.", "Ismételd mosogatószeres vízzel."],
      hibak: ["Szennyezett kapilláris (rossz nedvesítés).", "A meniszkusz alja/széle helyett máshonnan mérve.", "Ferde kapilláris."],
      kiertekeles: { tipus: "calc", be: [["d1", "ismert kapilláris belső átmérője", "mm", 1.0], ["h1", "emelkedés benne", "cm", 2.95], ["h2", "emelkedés az ismeretlenben", "cm", 5.9]],
        szamol: (v) => { const a = (1000 * g * (v.d1 / 2000) * (v.h1 / 100)) / 2; return [["Felületi feszültség α", n(a), "N/m"], ["Irodalmi érték (20 °C)", "0,0728", "N/m"], ["Az ismeretlen kapilláris átmérője", n(((4 * a) / (1000 * g * (v.h2 / 100))) * 1000), "mm"]]; } } },

    { nr: 17, id: "toresmutato", cim: "A víz törésmutatójának meghatározása", temakor: "geom-optika",
      eszkozok: "üvegkád, műanyag tálca, milliméterpapír, állványos lézer, víztartó edény, mérőszalag",
      cel: "A víz törésmutatójának meghatározása a beesési és törési szögek mérésével.",
      elmelet: R`<p>Snellius–Descartes: $\sin\alpha = n\sin\beta$ (levegőből vízbe). A $\sin\alpha$–$\sin\beta$ grafikon origón átmenő egyenes, meredeksége $n$. A szögeket a beesési merőlegestől mérjük.</p>`,
      lepesek: ["Rajzold fel a beesési merőlegest a milliméterpapírra.", "Különböző szögekben irányítsd a lézert a vízfelszínre, jelöld a sugármenetet.", "Mérd meg a szögeket (vagy a befogók hosszát), ábrázold a szinuszokat."],
      hibak: ["A lézersugár nem a merőleges talppontjában lép be.", "Parallaxishiba a leolvasásnál.", "Nagy szögeknél a visszavert fény zavar."],
      kiertekeles: { tipus: "fit", oszlopok: [["a", "beesési szög α", "°"], ["b", "törési szög β", "°"]], X: (r) => Math.sin(r.b * d2r), Y: (r) => Math.sin(r.a * d2r), origo: true, xLabel: "sin β", xUnit: "", yLabel: "sin α", yUnit: "",
        minta: [[10, 7.5], [20, 14.9], [30, 22.1], [40, 28.9], [50, 35.2], [60, 40.6]],
        eredmeny: (f) => [["Törésmutató n", n(f.m), ""], ["Irodalmi érték", "1,333", ""], ["Fény sebessége vízben", n(3e8 / f.m), "m/s"]] } },

    { nr: 18, id: "bessel", cim: "A domború lencse fókusztávolságának meghatározása Bessel-módszerrel", temakor: "geom-optika",
      eszkozok: "optikai pad, gyűjtőlencse, ernyő, tápegység, lámpa, mérőszalag",
      cel: "A gyűjtőlencse fókusztávolságának meghatározása a lencse két éles képet adó helyzetéből.",
      elmelet: R`<p>Rögzített $D > 4f$ tárgy–ernyő távolságnál a lencse két helyzetében kapunk éles képet (egyszer nagyított, egyszer kicsinyített); a két helyzet távolsága $d$. Mivel a két helyzetben $t$ és $k$ szerepet cserél: $$f = \frac{D^2 - d^2}{4D}$$ Előnye: nem kell a lencse (vastag lencsénél bizonytalan) középpontjától mérni.</p>`,
      lepesek: ["Állítsd be a tárgy–ernyő távolságot ($D$).", "Keresd meg a lencse két éles képet adó helyzetét, mérd a távolságukat ($d$).", "Ismételd több $D$-vel, átlagolj."],
      hibak: ["Az élesség megítélése szubjektív – közelítsd mindkét irányból.", "$D < 4f$ esetén nincs éles kép.", "Az optikai pad skálájának leolvasási hibája."],
      kiertekeles: { tipus: "avg", oszlopok: [["D", "tárgy–ernyő távolság D", "m"], ["d", "a két lencsehelyzet távolsága d", "m"]], ertek: (r) => (r.D ** 2 - r.d ** 2) / (4 * r.D), ertekNev: "f", ertekEgyseg: "m",
        minta: [[0.8, 0.4], [0.9, 0.52], [1.0, 0.632]] } },

    { nr: 19, id: "racs", cim: "A fényelhajlás jelensége optikai rácson, a fény hullámhosszának meghatározása", temakor: "hullamoptika",
      eszkozok: "fénymutató lézer, állvány, optikai pad, felfogó ernyő, ismert rácsállandójú optikai rács, mérőszalag",
      cel: "A lézerfény hullámhosszának meghatározása az elhajlási maximumok helyéből.",
      elmelet: R`<p>$$d\sin\alpha_k = k\lambda, \qquad \sin\alpha_k = \frac{x_k}{\sqrt{x_k^2 + L^2}}$$ ahol $x_k$ a $k$-adik maximum távolsága a középsőtől, $L$ a rács–ernyő távolság. A $\sin\alpha$–$k$ grafikon meredeksége $\lambda/d$.</p>`,
      lepesek: ["Állítsd a rácsot merőlegesen a lézersugárra, az ernyőt $L$ távolságra.", "Jelöld meg a maximumok helyét mindkét oldalon.", "Mérd a távolságokat a középső maximumtól."],
      hibak: ["A rács nem merőleges a sugárra.", "Kis szögközelítés nagy szögeknél ($\\sin \\neq \\tan$).", "A foltok közepének pontatlan jelölése."],
      kiertekeles: { tipus: "fit", oszlopok: [["k", "rend k", ""], ["x", "x_k (előjelesen)", "m"]], X: (r) => r.k, Y: (r, p) => r.x / Math.sqrt(r.x * r.x + p.L * p.L), origo: true, xLabel: "k", xUnit: "", yLabel: "sin α", yUnit: "",
        param: [["L", "rács–ernyő távolság L", "m", 1.0], ["N", "rácssűrűség", "vonal/mm", 300]], minta: [[-2, -0.425], [-1, -0.199], [1, 0.198], [2, 0.424]],
        eredmeny: (f, p) => [["Rácsállandó d", n(1e-3 / p.N), "m"], ["Hullámhossz λ", n((f.m * (1e-3 / p.N)) * 1e9), "nm"]] } },

    { nr: 20, id: "neodimium", cim: "Erőhatás távolságfüggésének kimérése neodímium mágnesek között", temakor: "magnesseg",
      eszkozok: "két henger alakú neodímium mágnes, zárt végű plexicső, fahasáb furattal, fémhengerek különböző tömegekkel, műanyag vonalzó, digitális mérleg",
      cel: "A két mágnes közötti taszítóerő távolságfüggésének kimérése, a hatványkitevő meghatározása.",
      elmelet: R`<p>A csőben a felső mágnest az alsó taszítja; a felső mágnesre tett terhek súlya (+ a mágnes súlya) egyensúlyt tart a mágneses erővel: $F = mg$. Hatványfüggvényt feltételezve $F = C\,r^{\,n}$: $$\ln F = \ln C + n\ln r$$ A $\ln F$–$\ln r$ grafikon meredeksége a kitevő. Két mágneses dipólus között (nagy távolságban) $n \approx -4$; közelebb a mágnesek mérete miatt eltérhet.</p>`,
      lepesek: ["Tedd a mágneseket taszító állásban a csőbe.", "Terheld a felső mágnest különböző tömegekkel, mérd a két mágnes távolságát (a középpontjaik között!).", "Ábrázold $\\ln F$-et $\\ln r$ függvényében."],
      hibak: ["A súrlódás a cső falán.", "A távolságot nem a mágnesek középpontja között mérték.", "A felső mágnes saját súlyát kihagyták."],
      kiertekeles: { tipus: "fit", oszlopok: [["r", "a mágnesek távolsága r", "m"], ["m", "össztömeg (teher + felső mágnes)", "g"]], X: (r) => Math.log(r.r), Y: (r) => Math.log((r.m / 1000) * g), xLabel: "ln r", xUnit: "", yLabel: "ln F", yUnit: "",
        minta: [[0.015, 316], [0.02, 100], [0.025, 41], [0.03, 19.8], [0.035, 10.7]],
        eredmeny: (f) => [["Hatványkitevő n", n(f.m), "(dipólus: −4)"], ["Erő 2 cm-en (illesztésből)", n(Math.exp(f.b) * Math.pow(0.02, f.m)), "N"]] } },
  ];

  /** Legkisebb négyzetes egyenes: y = m x + b (origo: b = 0) + R². */
  PO.linFit = function (pts, origo) {
    const N = pts.length;
    if (N < 2) return null;
    let m, b;
    if (origo) {
      const sxy = pts.reduce((s, [x, y]) => s + x * y, 0), sxx = pts.reduce((s, [x]) => s + x * x, 0);
      if (!sxx) return null; m = sxy / sxx; b = 0;
    } else {
      const mx = pts.reduce((s, p) => s + p[0], 0) / N, my = pts.reduce((s, p) => s + p[1], 0) / N;
      const sxx = pts.reduce((s, [x]) => s + (x - mx) ** 2, 0); if (!sxx) return null;
      m = pts.reduce((s, [x, y]) => s + (x - mx) * (y - my), 0) / sxx; b = my - m * mx;
    }
    const my = pts.reduce((s, p) => s + p[1], 0) / N;
    const ssr = pts.reduce((s, [x, y]) => s + (y - (m * x + b)) ** 2, 0), sst = pts.reduce((s, [, y]) => s + (y - my) ** 2, 0);
    return { m, b, r2: sst ? 1 - ssr / sst : 1, n: N };
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
