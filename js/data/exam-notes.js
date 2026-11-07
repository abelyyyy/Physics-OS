/* PHYSICS OS — saját magyarázatok és témakör-címkék a hivatalos feladatsorokhoz.
 * A helyes válasz mindig a hivatalos javítási útmutatóból jön (exams.js); itt csak az indoklás van,
 * amelyet minden esetben a hivatalos kulccsal egyeztettünk. */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const M = "Mechanika", H = "Hőtan", E = "Elektromágnesség", O = "Hullámok, optika", Q = "Modern fizika", G = "Gravitáció, csillagászat";

  PO.examNotes = {
    "2024maj": {
      I: {
        1: [M, "Vízszintes hajításnál $E_m = \\tfrac12 m(v_0^2 + g^2t^2)$. A mozgási energia akkor duplázódik, ha a függőleges sebesség eléri $v_0$-t: $gt = v_0$, azaz $t = v_0/g$."],
        2: [O, "Nyitott síp alaphangja: $\\lambda = 2L$. A fele olyan hosszú zárt sípé: $\\lambda = 4\\cdot\\tfrac L2 = 2L$ – a két hullámhossz egyenlő."],
        3: [M, "$y_0$-ig csak a laprugó deformálódik (egyenes szakasz). Utána a csavarrugó is felfekszik, a két rugó együtt tart, így a rendszer merevebb: a grafikon $y_0$-nál megtörik és meredekebben folytatódik."],
        4: [E, "Kisüléskor a lemezek közti elektromos tér változik, a változó elektromos tér pedig mágneses teret kelt (Maxwell)."],
        5: [M, "A hidrosztatikai nyomás a folyadék súlyából ered. Súlytalanságban nincs nyomáskülönbség a test alsó és felső része között, így felhajtóerő sincs. (A gravitációs tér létezik – az űrállomás szabadon esik.)"],
        6: [M, "$x = vt + A\\sin\\omega t$. Ha $A\\omega < v$, a test mindig előre halad (A görbe); ha $A\\omega > v$, időnként visszafelé is mozog (B görbe). A C görbe amplitúdója nő, ez nem harmonikus rezgés."],
        7: [H, "A gumiban a levegő abszolút nyomása nem változik ($V$, $T$, anyagmennyiség állandó). A túlnyomás = belső − külső nyomás; fent a külső légnyomás kisebb, tehát a túlnyomás nő."],
        8: [E, "A térerősség vektor. A B elrendezésben a két egyenlő nagyságú, ellentétes irányú térerősség kioltja egymást; az A-ban merőlegesek, eredőjük $\\sqrt2\\,E$."],
        9: [O, "A lézernyaláb közel párhuzamos; a gyűjtőlencse a párhuzamos nyalábot a fókuszsíkban kis, fényes foltba gyűjti."],
        10: [Q, "Időtágulás: a Földről nézve a közel fénysebességű müon „órája” lassabban jár, így a földi rendszerben mért élettartama sokszorosára nő."],
        11: [M, "Egy kézzel a rúd végénél: a kéz a rúd végét lefelé nyomja, kicsit beljebb nagy erővel felfelé emeli. Így a forgatónyomatékok és az erők eredője is nulla lehet – ez a C ábra."],
        12: [Q, "Az urán-235 csupasz gömbjének kritikus tömege néhányszor tíz kilogramm (kb. 50 kg) nagyságrendű."],
        13: [G, "Az $R/2$ sugarú gömb térfogata (homogén gömbnél a tömege is) az egész $1/8$ része. A maradék tömeg $7/8$; a felszínen $g = \\gamma M/R^2$, tehát $7/8$-ára csökken."],
        14: [E, "A–B között: $R$ és $2R$ párhuzamosan: $\\tfrac23 R$. C–D között mindkét ág $R + \\tfrac R2 = 1{,}5R$, párhuzamosan $0{,}75R$ – ez a nagyobb."],
        15: [M, "Lendülettétel: $\\Delta p = F t = mg\\,t$, tehát $p = mgt$."],
      },
      III: { 1: M, 2: G, 3: E, 4: H },
    },

    "2025maj": {
      I: {
        1: [M, "A rendszer lendülete nulla marad: $m_1 v_1 = m_2 v_2$. Ugyanannyi ideig mozognak, ezért a nagyobb tömegű diák mozdul el kevésbé – függetlenül attól, ki húz erősebben."],
        2: [M, "Kétszeres sebességnél a mozgási energia négyszeres. Állandó fékezőerőnél $F s = E_m$, így a behatolás mélysége is négyszeres: 4 cm."],
        3: [E, "Váltakozó áramú körben a kondenzátor árama akkor nulla, amikor a feszültsége maximális – ekkor maximális az energiája."],
        4: [M, "Ideális csigán a kötélerő mindenütt $G$, így a falra (A) $G$ hat. A csigát tartó B pontra a két kötélág erejének eredője hat, ez a 45°-os szög miatt nagyobb $G$-nél."],
        5: [H, "Azonos hőmérsékleten az átlagos mozgási energia egyenlő, a sebesség nem (a hélium könnyebb, gyorsabb). Azonos tömegből héliumból jóval több atom van, így a parciális nyomások sem egyenlők. Egyik állítás sem igaz."],
        6: [E, "A kapcsoló zárásakor a tekercs árama, és vele a fluxus nő. A drótkörben indukált áram Lenz törvénye szerint gátolja a fluxus növekedését; a tekercselés irányából ez a→b irányú. Áram csak a változás ideje alatt folyik: áramlökés."],
        7: [M, "A $t_A$ után a sebesség állandó: a közegellenállás kiegyenlíti a nehézségi erőt. A $t_B$-nél hirtelen csökken a sebesség – ekkor nyílik az ernyő; $t_C$ után újra egyenletes a süllyedés."],
        8: [Q, "Kilépési munka: $W = 1{,}4 - 0{,}3 = 1{,}1$ eV. A 2,1 eV-os fotonoknál: $2{,}1 - 1{,}1 = 1{,}0$ eV."],
        9: [O, "A domború (gyűjtő) lencse megfordítva is gyűjtőlencse, a fókusztávolsága nem változik – a szemüveg továbbra is olvasószemüvegként használható."],
        10: [M, "Egyenletes körmozgásnál a gyorsulás nagysága mindenütt $a = r\\omega^2$, csak az iránya változik."],
        11: [G, "Ha a Földről telehold látszik, a Hold a Nappal átellenben van; a Holdról nézve a Föld éjszakai oldala fordul felénk: „újföld”."],
        12: [M, "A szivattyú a vizet a külső légnyomás segítségével emeli: legfeljebb $p_0 = \\rho g h$ magasra. A magasban kisebb a légnyomás, ezért kisebb mélységből tud szívni."],
        13: [E, "Azonos tömeg és anyag mellett az ötször hosszabb huzal keresztmetszete ötöde. $R = \\rho L/A$, így az ellenállás $5\\cdot 5 = 25$-szörös."],
        14: [O, "A hullámok szuperpozíciója csak a találkozás idejére érvényes: a két jel egymáson áthaladva alakját megtartva halad tovább (B ábra)."],
        15: [Q, "Pozitív béta-bomlásnál egy proton neutronná alakul: a tömegszám nem változik, a rendszám eggyel csökken: $(A, Z-1)$."],
      },
      III: { 1: E, 2: Q, 3: H, 4: E },
    },

    "2025okt": {
      I: {
        1: [M, "A függőleges 5 N lefelé nyom: $N = 20 + 5 = 25$ N, a tapadási súrlódás legfeljebb $0{,}3\\cdot 25 = 7{,}5$ N. A vízszintes erők eredője $12 - 5 = 7$ N, ez kisebb: a hasáb nem mozdul."],
        2: [M, "A pohárban a folyadék felszíne a falnál lefelé hajlik, tehát a folyadék nem nedvesíti az üveget. Ilyenkor a kapillárisokban a szint lejjebb van, és annál lejjebb, minél szűkebb a cső (kapilláris depresszió)."],
        3: [E, "$F = BIL = 0{,}2\\cdot 50\\cdot 1 = 10$ N, iránya merőleges a vezetőre és a mágneses mezőre is, tehát az ábra síkjára merőleges."],
        4: [M, "A kiskocsi sebessége az ütközés előtt $v = \\sqrt{2gh}$. Tökéletesen rugalmatlan ütközés után $v' = \\frac{0{,}1}{0{,}4}v = \\frac v4$, a magasság $h' \\propto v'^2$: $h/16$."],
        5: [O, "A síkpárhuzamos lemezből minden szín a beeséssel párhuzamosan lép ki, de a különböző törésmutató miatt eltérő mértékben eltolódva: különböző pontokban, párhuzamosan."],
        6: [M, "Miután a cserép elvált a tetőtől, csak a nehézségi erő hat rá: gyorsulása éppen $g$."],
        7: [M, "Levegőben a nagyobb térfogatú műanyag golyóra nagyobb felhajtóerő hat. Vákuumban ez megszűnik, így a műanyag golyó oldala lesz nehezebb, és lejjebb kerül."],
        8: [H, "Állandó térfogaton és nyomáson $nT$ állandó: $n_2 = 4\\cdot\\frac{300}{400} = 3$ mol, tehát 1 mol gáz távozik."],
        9: [E, "A felső golyóra: $kq^2/h_2^2 = mg$. A középsőre a felső golyó is nyom: $kq^2/h_1^2 = 2mg$. Ezért $h_1 < h_2$."],
        10: [O, "Az ultrahang mechanikai (hang)hullám, nem elektromágneses sugárzás – egyik tartományban sincs benne."],
        11: [Q, "Az aktivitás az egységnyi idő alatti bomlások száma; a két izotóp bomlásai összeadódnak: $A = A_1 + A_2$."],
        12: [G, "Új vénusznál a távolság $1 - \\tfrac23 = \\tfrac13$, televénusznál $1 + \\tfrac23 = \\tfrac53$ (Nap–Föld egységben). A látszó átmérő a távolsággal fordítottan arányos: ötszörös."],
        13: [E, "$\\rho = RA/L$. Az ellenállás egyenlő, de a félkör huzal hosszabb és vastagabb is – a két hatás ellentétes, a pontos méretek nélkül nem dönthető el."],
        14: [G, "A hidrogén elfogyása után a mag összehúzódik és felmelegszik, majd beindul a héliumfúzió (vörös óriás szakasz). Napszerű csillag nem robban szupernóvaként és nem lesz fekete lyuk."],
        15: [M, "$|a| = g$ kétféleképpen lehet: a felső fordulópontban, ha ott a rugó nyújtatlan, vagy az alsóban, ha a megnyúlás az egyensúlyi kétszerese."],
      },
      III: { 1: M, 2: E, 3: Q, 4: O },
    },

    "2026maj": {
      I: {
        1: [M, "Állandó eredő erőnél állandó a gyorsulás, a hely–idő grafikon parabola. Az I. nyugalomból gyorsuló, a II. a sebességgel ellentétes erő miatt lassuló, majd visszaforduló mozgás – mindkettő lehetséges."],
        2: [E, "Azonos tömeg és anyag: a háromszor hosszabb szál keresztmetszete harmad, ellenállása kilencszeres. Azonos feszültségen $P = U^2/R$, így a rövidebb teljesítménye nagyobb."],
        3: [O, "A Doppler-effektus a forrás és a megfigyelő relatív mozgásából ered – mindkét esetben megfigyelhető (a pontos frekvencia a két esetben kicsit eltér)."],
        4: [M, "Rugalmas ütközésnél a céltárgy lendülete $\\frac{2M}{m+M}\\,mv$, ez akkor nagyobb $mv$-nél, ha $M > m$: a könnyebb test visszapattan, így a céltárgy több lendületet kap."],
        5: [M, "Az olaj is felhajtóerőt ad, így a sűrűségmérő emelkedik az edényhez képest; viszont most az olajban lévő része is „folyadékban” van, ezért a kilógó hossza csökken."],
        6: [E, "A hurok területe és vele a kifelé mutató fluxus csökken. Az indukált áram ezt pótolni igyekszik (kifelé mutató mezőt kelt), ezért az óramutatóval ellentétes irányú."],
        7: [M, "Az alátámasztásra: $m_1\\frac{L_1}{2} = m_2\\frac{L_2}{2}$, azaz $\\rho_1 L_1^2 = \\rho_2 L_2^2$. $L_1 = 2L_2$ esetén $\\rho_1:\\rho_2 = 1:4$."],
        8: [H, "Izobár összenyomásnál a nyomás végig $p_0$: $W = 0{,}5\\,p_0V$. Izotermnél a nyomás nő: $W = p_0V\\ln 2 \\approx 0{,}69\\,p_0V$ – ez a nagyobb."],
        9: [G, "A bolygó a csillagtól távolodik (a távoli pálya vége felé halad), ezért a potenciális energiája nő, a sebessége csökken. A területi sebesség és a teljes mechanikai energia állandó."],
        10: [Q, "A γ-sugárzás töltetlen, nem térül el. Az α (pozitív) és a β⁻ (negatív) ellentétes irányba térül el."],
        11: [M, "Azonos keringési időnél $a_\\text{cp} = 4\\pi^2 r/T^2$ arányos a sugárral. A tapadás biztosítja: $\\mu \\ge a_\\text{cp}/g$, tehát a nagyobb sugarú piros autónál kell nagyobb együttható."],
        12: [E, "A Coulomb-erő taszító is lehet, és a Nap és a Jupiter gyakorlatilag semleges. Közös viszont, hogy mindkét erő a távolság négyzetével fordítottan arányos."],
        13: [M, "A munkatétel szerint a mozgási energiát minden erő munkája változtatja – a belső erőké is (pl. robbanásnál, rugó szétlökésénél)."],
        14: [O, "Állóhullámban egy hurkon belül minden pont azonos fázisban mozog: A és B sebessége azonos irányú. Haladó hullámnál a völgy két oldalán lévő pontok ellentétesen mozognak: C és D sebessége ellentétes."],
        15: [G, "Azonos körüljárásnál a forgásból adódó sebesség a Napnak háttal lévő oldalon (éjfélkor) esik egy irányba a keringési sebességgel, ott a legnagyobb az eredő."],
      },
      III: { 1: M, 2: Q, 3: E, 4: H },
    },

    "2026okt": {
      I: {
        1: [M, "A strandlabdánál jelentős a közegellenállás. Felfelé a nehézségi erővel egy irányba hat (nagyobb lassulás), lefelé ellentétesen (kisebb gyorsulás), ráadásul kisebb sebességgel ér vissza: a visszaesés tart tovább."],
        2: [E, "$1{,}5\\ \\Omega = 1\\ \\Omega + (1\\ \\Omega \\parallel 1\\ \\Omega)$: legalább három ellenállás kell."],
        3: [Q, "A neutronok aránya az uránban $143/235 \\approx 0{,}61$, a szénben $6/12 = 0{,}5$. Közel azonos nukleontömeg mellett az urán tartalmaz több neutront."],
        4: [M, "A kötélerő mindig merőleges a sebességre (körpálya), ezért nem végez munkát. A hintát csak a nehézségi erő lassítja."],
        5: [H, "A kezdő- és végállapot hőmérséklete azonos ($5p_0V_0 = p_0\\cdot 5V_0$), így $\\Delta U = 0$ és $Q = W_\\text{gáz}$. A munka a görbe alatti terület, ez az 1. folyamatnál a legnagyobb."],
        6: [M, "A szűkületben a folytonossági egyenlet szerint nő a sebesség, Bernoulli törvénye szerint pedig csökken a nyomás."],
        7: [M, "A felső pontban a rugó nyújtatlan: $a = g$ lefelé. Középen egyensúlyi helyzet: $a = 0$. Az alsó pont szimmetrikus a felsővel: $a = g$ felfelé ($-g$)."],
        8: [Q, "6 vonal 4 energiaszint összes lehetséges átmenetéből adódik. A színképben 2 kis frekvenciájú és 4 nagy, egymáshoz közeli vonal van: ez két szoros szintpárnak felel meg, nagy réssel elválasztva – az A ábra."],
        9: [E, "Elektromágneses hullámot gyorsuló töltés sugároz. A rezgő és az egyenletesen körmozgó (centripetálisan gyorsuló) részecske is gyorsul."],
        10: [M, "Az esési idő $\\sqrt{2h/g}$: 1 s, illetve $\\sqrt2$ s. A távolság: $10\\cdot 1 = 10$ m, illetve $5\\cdot 1{,}41 \\approx 7{,}1$ m – az első kő repül messzebb."],
        11: [M, "Mindkét esetben a szükséges erő lineárisan nő 0-tól $mg$-ig egy $h/2$ hosszú úton, így a munka mindkétszer $mgh/4$ – azonos."],
        12: [E, "Párhuzamos vezetők között $F \\propto I_1I_2/d$. A kétszeres áramok négyszereznek, a kétszeres távolság felez: az erő kétszeres, $2\\cdot 10^{-10}$ N."],
        13: [E, "Ideális tekercsen nem fejlődik hő, de az induktív ellenállása csökkenti az áramot, így az ohmikus ellenálláson is kevesebb hő szabadul fel. Tekercs nélkül nagyobb az áram és a hő."],
        14: [G, "A gömbszimmetrikus test gravitációs tere kívül csak a tömegtől függ. Azonos tömegű fekete lyuk körül a Hold pályája nem változna."],
        15: [G, "A tágulás minden megfigyelőre nézve ugyanúgy jelentkezik: a 3C 295 felől nézve a Tejútrendszer távolodik, fénye vöröseltolódást mutat."],
      },
      III: { 1: E, 2: Q, 3: H, 4: M },
    },
  };
  PO.EXAM_TOPICS = [M, H, E, O, Q, G];
})(typeof globalThis !== "undefined" ? globalThis : this);
