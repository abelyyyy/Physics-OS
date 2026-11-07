/* PHYSICS OS — képletek: 5. Hullámok, kommunikáció, fény */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const { v, mono, gen, fail } = PO.fb;
  const K = PO.K, R = Math.PI / 180;
  const nz = (x, m) => (Math.abs(x) < 1e-300 ? fail(m) : x);
  const asinS = (x, m) => (Math.abs(x) > 1 + 1e-12 ? fail(m) : Math.asin(Math.max(-1, Math.min(1, x))));
  const VH = (o) => Object.assign({ tex: "c", nev: "hullámterjedési sebesség", dim: "sebesseg", min: 0, pos: true }, o || {});
  const NN = (o) => Object.assign({ tex: "n", nev: "sorszám (n = 1, 2, 3 …)", dim: "egyseg", min: 1, pos: true }, o || {});
  const IDX = (tex, nev) => ({ tex, nev, dim: "egyseg", min: 1, pos: true });
  const LEN = (tex, nev) => ({ tex, nev, dim: "hossz" });

  /* ---------------- Mechanikai hullámok ---------------- */
  const MH = "Mechanikai hullámok";
  PO.addFormulas("mech-hullamok", [
    mono({ id: "hullam-c", fejezet: MH, nev: "Hullámterjedés alapegyenlete", tex: "c = \\lambda\\,f", out: "vh", terms: { lambda: 1, f: 1 },
      vars: { vh: VH(), lambda: v("lambda"), f: v("f") }, minta: { lambda: 0.5, f: 680 },
      jelentes: "Egy periódusidő alatt a hullám egy hullámhossznyit halad: $c = \\lambda / T = \\lambda f$. A frekvenciát a forrás, a terjedési sebességet a közeg határozza meg.",
      feltetel: "Periodikus hullám.", hiba: "Közeghatáron a frekvenciát változtatják – a frekvencia marad, a hullámhossz változik.",
      pelda: { szoveg: "680 Hz-es hang levegőben (340 m/s): λ = 0,5 m." }, kulcsszavak: "hullám terjedési sebesség hullámhossz frekvencia", kapcsolodo: ["hullam-c-em", "hur-sajat"] }),
    mono({ id: "hur-sajat", fejezet: MH, nev: "Húr és nyitott síp sajátfrekvenciái", tex: "f_n = n\\,\\dfrac{c}{2L}", out: "f", c: 0.5, ctex: "\\tfrac12", cinv: "2", terms: { nn: 1, vh: 1, l: -1 },
      rtex: { nn: "n = \\dfrac{2Lf_n}{c}", vh: "c = \\dfrac{2Lf_n}{n}", l: "L = \\dfrac{n\\,c}{2f_n}" },
      vars: { f: v("f", { tex: "f_n", nev: "az n-edik sajátfrekvencia" }), nn: NN(), vh: VH({ nev: "hullámsebesség a húron / a levegőben" }), l: v("l", { tex: "L", nev: "a húr (síp) hossza" }) },
      minta: { nn: 1, vh: 340, l: 0.5 },
      jelentes: "Két végén rögzített húron (és két végén nyitott sípban) állóhullám jön létre, ha a hossz a félhullámhossz egész számú többszöröse: $L = n\\lambda/2$. n = 1 az alaphang, a többi felhang.",
      feltetel: "Állóhullám, mindkét vég azonos típusú (csomópont–csomópont vagy duzzadóhely–duzzadóhely).", nem: "Egyik végén zárt sípra: lásd a zárt síp képletét.",
      hiba: "A húr hosszát egy hullámhossznak veszik az alaphangnál (valójában λ/2).", pelda: { szoveg: "50 cm-es nyitott síp alaphangja: 340 Hz." },
      kulcsszavak: "húr síp állóhullám sajátfrekvencia alaphang felhang", kapcsolodo: ["zart-sip", "hullam-c"] }),
    gen({ id: "zart-sip", fejezet: MH, nev: "Egyik végén zárt síp sajátfrekvenciái", tex: "f_n = (2n-1)\\,\\dfrac{c}{4L}",
      vars: { f: v("f", { tex: "f_n", nev: "sajátfrekvencia" }), nn: NN(), vh: VH({ nev: "hangsebesség" }), l: v("l", { tex: "L", nev: "a síp (levegőoszlop) hossza" }) },
      solve: {
        f: { tex: "f_n = (2n-1)\\dfrac{c}{4L}", f: ({ nn, vh, l }) => ((2 * nn - 1) * vh) / (4 * l) },
        l: { tex: "L = (2n-1)\\dfrac{c}{4f_n}", f: ({ f, nn, vh }) => ((2 * nn - 1) * vh) / (4 * f) },
        vh: { tex: "c = \\dfrac{4Lf_n}{2n-1}", f: ({ f, nn, l }) => (4 * l * f) / (2 * nn - 1) },
      },
      minta: { f: 340, nn: 1, vh: 340, l: 0.25 }, pelda: { szoveg: "25 cm-es zárt síp alaphangja 340 Hz; csak páratlan felhangjai vannak. Hangsebesség-mérés rezonanciacsővel (szóbeli mérés).", adott: { nn: 1, vh: 340, l: 0.25 }, keres: "f" },
      jelentes: "A zárt végen csomópont, a nyitott végen duzzadóhely van, ezért $L = (2n-1)\\lambda/4$: az alaphang hullámhossza a cső négyszerese.",
      feltetel: "Állóhullám; a nyitott végen a végkorrekciót elhanyagoljuk.", hiba: "A nyitott síp képletét használják (fele akkora alaphangot kapnának helyett kétszereset).",
      kulcsszavak: "zárt síp rezonancia cső hangsebesség mérés negyed hullámhossz", kapcsolodo: ["hur-sajat"] }),
  ]);

  /* ---------------- Hangtan ---------------- */
  const HT = "Hangtan";
  PO.addFormulas("hang", [
    mono({ id: "intenzitas", fejezet: HT, nev: "Pontforrás intenzitása", tex: "I = \\dfrac{P}{4\\pi r^2}", out: "I", c: 1 / (4 * Math.PI), ctex: "\\dfrac{1}{4\\pi}", cinv: "4\\pi", terms: { P: 1, r: -2 },
      rtex: { P: "P = 4\\pi r^2 I", r: "r = \\sqrt{\\dfrac{P}{4\\pi I}}" },
      vars: { I: { tex: "I", nev: "intenzitás", dim: "intenzitas", min: 0, pos: true }, P: v("P", { nev: "a forrás teljesítménye", min: 0, pos: true }), r: v("r", { nev: "távolság a forrástól" }) }, minta: { P: 1, r: 2 },
      jelentes: "Az egységnyi felületen időegység alatt átáramló energia. Gömbhullámnál a teljesítmény $4\\pi r^2$ felületen oszlik el: kétszeres távolságban negyedakkora intenzitás.",
      feltetel: "Pontszerű, minden irányban egyenletesen sugárzó forrás, elnyelés nélkül.", hiba: "Fordított arányosságot várnak a távolsággal (négyzetes!).",
      pelda: { szoveg: "1 W-os hangforrástól 2 m-re: I ≈ 0,02 W/m²." }, kulcsszavak: "intenzitás hangerősség távolság négyzetes gömbhullám", kapcsolodo: ["decibel"] }),
    gen({ id: "decibel", fejezet: HT, nev: "Hangintenzitás-szint (decibel)", tex: "L = 10\\,\\lg\\dfrac{I}{I_0}\\ \\text{dB}",
      vars: { L: { tex: "L", nev: "hangintenzitás-szint", dim: "hangszint" }, I: { tex: "I", nev: "intenzitás", dim: "intenzitas", min: 0, pos: true } },
      solve: {
        L: { tex: "L = 10\\lg\\dfrac{I}{I_0}", f: ({ I }) => 10 * Math.log10(I / K.I0) },
        I: { tex: "I = I_0\\cdot 10^{L/10}", f: ({ L }) => K.I0 * Math.pow(10, L / 10) },
      },
      minta: { L: 60, I: 1e-6 }, pelda: { szoveg: "I = 10⁻⁶ W/m² → 60 dB (beszélgetés). Tízszeres intenzitás: +10 dB; kétszeres: ≈ +3 dB.", adott: { I: 1e-6 }, keres: "L" },
      jelentes: "Fülünk logaritmikusan érzékel; a hallásküszöb $I_0 = 10^{-12}$ W/m² (0 dB), a fájdalomküszöb ≈ 1 W/m² (120 dB).",
      feltetel: "I₀ = 10⁻¹² W/m² vonatkoztatási szinttel.", hiba: "Két azonos forrás együtt nem kétszeres decibel, hanem +3 dB.",
      kulcsszavak: "decibel hangszint hangintenzitás hallásküszöb logaritmus zaj", kapcsolodo: ["intenzitas"] }),
    gen({ id: "doppler", fejezet: HT, nev: "Doppler-effektus (mozgó forrás)", tex: "f' = f\\,\\dfrac{c}{c - v_f}",
      vars: { fv: v("f", { tex: "f'", nev: "az észlelt frekvencia" }), f: v("f", { nev: "a forrás frekvenciája" }), vh: VH({ nev: "hangsebesség" }), vf: v("v", { tex: "v_f", nev: "a forrás sebessége (közeledéskor +, távolodáskor −)" }) },
      solve: {
        fv: { tex: "f' = f\\dfrac{c}{c - v_f}", f: ({ f, vh, vf }) => (f * vh) / nz(vh - vf, "Hangsebességgel mozgó forrásnál a képlet nem érvényes (hangrobbanás).") },
        f: { tex: "f = f'\\dfrac{c - v_f}{c}", f: ({ fv, vh, vf }) => (fv * (vh - vf)) / vh },
        vf: { tex: "v_f = c\\left(1 - \\dfrac{f}{f'}\\right)", f: ({ fv, f, vh }) => vh * (1 - f / fv) },
      },
      minta: { fv: (440 * 340) / 320, f: 440, vh: 340, vf: 20 }, pelda: { szoveg: "440 Hz-es sziréna 20 m/s-mal közeledik: ≈ 467,5 Hz-et hallunk; távolodáskor (v_f = −20) ≈ 415,6 Hz.", adott: { f: 440, vh: 340, vf: 20 }, keres: "fv" },
      jelentes: "Közeledő forrás hangját magasabbnak, távolodóét mélyebbnek halljuk, mert a hullámfrontok összesűrűsödnek, ill. széthúzódnak. Fénynél ugyanígy: vöröseltolódás (táguló Univerzum), sebességmérő radar.",
      feltetel: "Nyugvó megfigyelő és közeg, a forrás sebessége kisebb a hangsebességnél.", nem: "Mozgó megfigyelőnél más a képlet: $f' = f(c + v_m)/c$.",
      hiba: "Az előjelet fordítva választják.", kulcsszavak: "doppler effektus frekvencia mozgó forrás vöröseltolódás radar", kapcsolodo: ["hubble"] }),
    gen({ id: "lebeges", fejezet: HT, nev: "Lebegés", tex: "f_{leb} = |f_1 - f_2|",
      vars: { fl: v("f", { tex: "f_{leb}", nev: "lebegési frekvencia", min: 0, pos: false }), f1: v("f", { tex: "f_1" }), f2: v("f", { tex: "f_2" }) },
      solve: { fl: { tex: "f_{leb} = |f_1 - f_2|", f: ({ f1, f2 }) => Math.abs(f1 - f2) } },
      minta: { fl: 4, f1: 440, f2: 444 }, pelda: { szoveg: "440 Hz és 444 Hz: másodpercenként 4 lebegés – így hangolnak hangszert.", adott: { f1: 440, f2: 444 }, keres: "fl" },
      jelentes: "Két közeli frekvenciájú hang szuperpozíciójakor a hangerő periodikusan ingadozik.", feltetel: "Közel azonos frekvenciák és amplitúdók.", hiba: "—",
      kulcsszavak: "lebegés interferencia hangolás", kapcsolodo: [] }),
  ]);

  /* ---------------- Elektromágneses hullámok ---------------- */
  const EM = "Elektromágneses hullámok";
  PO.addFormulas("em-spektrum", [
    mono({ id: "hullam-c-em", fejezet: EM, nev: "Elektromágneses hullám hullámhossza", tex: "c = \\lambda\\,f", out: "lambda", c: K.c, ctex: "c", terms: { f: -1 },
      rtex: { lambda: "\\lambda = \\dfrac{c}{f}", f: "f = \\dfrac{c}{\\lambda}" },
      vars: { lambda: v("lambda"), f: v("f") }, minta: { f: 100e6 },
      jelentes: "Vákuumban minden elektromágneses hullám c ≈ 3 · 10⁸ m/s-mal terjed. Spektrum a hullámhossz szerint: rádió – mikrohullám – infravörös – látható (380–780 nm) – UV – röntgen – gamma.",
      feltetel: "Vákuum (levegő); közegben $v = c/n$.", hiba: "MHz-et nem váltanak Hz-re.", pelda: { szoveg: "100 MHz-es FM-adó: λ = 3 m. Mikrohullámú sütő (2,45 GHz): 12 cm." },
      kulcsszavak: "elektromágneses hullám spektrum rádió fény hullámhossz fénysebesség", kapcsolodo: ["hullam-c", "foton-E", "toresmutato"] }),
  ]);

  /* ---------------- Geometriai optika ---------------- */
  const GO = "Geometriai optika";
  PO.addFormulas("geom-optika", [
    gen({ id: "snellius", fejezet: GO, nev: "Snellius–Descartes-törvény (fénytörés)", tex: "n_1 \\sin\\alpha = n_2 \\sin\\beta",
      vars: { n1: IDX("n_1", "az első közeg törésmutatója"), alpha: v("alpha", { nev: "beesési szög (a beesési merőlegestől)", min: 0, max: Math.PI / 2 }), n2: IDX("n_2", "a második közeg törésmutatója"), beta: v("alpha", { tex: "\\beta", nev: "törési szög", min: 0, max: Math.PI / 2 }) },
      solve: {
        beta: { tex: "\\beta = \\arcsin\\dfrac{n_1\\sin\\alpha}{n_2}", f: ({ n1, alpha, n2 }) => asinS((n1 * Math.sin(alpha)) / n2, "sin β > 1: teljes visszaverődés, nincs megtört sugár.") },
        alpha: { tex: "\\alpha = \\arcsin\\dfrac{n_2\\sin\\beta}{n_1}", f: ({ n1, n2, beta }) => asinS((n2 * Math.sin(beta)) / n1, "Ilyen törési szög nem jöhet létre.") },
        n2: { tex: "n_2 = n_1\\dfrac{\\sin\\alpha}{\\sin\\beta}", f: ({ n1, alpha, beta }) => (n1 * Math.sin(alpha)) / nz(Math.sin(beta), "β nem lehet 0.") },
        n1: { tex: "n_1 = n_2\\dfrac{\\sin\\beta}{\\sin\\alpha}", f: ({ n2, alpha, beta }) => (n2 * Math.sin(beta)) / nz(Math.sin(alpha), "α nem lehet 0.") },
      },
      minta: { n1: 1, alpha: 40 * R, n2: 1.5, beta: Math.asin(Math.sin(40 * R) / 1.5) },
      pelda: { szoveg: "Levegőből üvegbe (n = 1,5) 40°-ban: β ≈ 25,4°. Optikailag sűrűbb közegben a sugár a beesési merőlegeshez törik.", adott: { n1: 1, alpha: 40 * R, n2: 1.5 }, keres: "beta" },
      jelentes: "Közeghatáron a fény iránya megváltozik, mert más a terjedési sebessége: $\\sin\\alpha / \\sin\\beta = c_1 / c_2 = n_2 / n_1$. A szögeket mindig a beesési merőlegestől mérjük!",
      feltetel: "Homogén, átlátszó közegek.", hiba: "A szöget a határfelülettől mérik.", kulcsszavak: "snellius descartes fénytörés törésmutató beesési szög törési szög", kapcsolodo: ["toresmutato", "hatarszog"] }),
    mono({ id: "toresmutato", fejezet: GO, nev: "Abszolút törésmutató", tex: "n = \\dfrac{c}{v}", out: "n", c: K.c, ctex: "c", terms: { v: -1 },
      rtex: { v: "v = \\dfrac{c}{n}" },
      vars: { n: IDX("n", "törésmutató"), v: v("v", { nev: "a fény sebessége a közegben", min: 0, pos: true }) }, minta: { v: 2e8 },
      jelentes: "Hányszor lassabban halad a fény a közegben, mint vákuumban. Víz 1,33, üveg ≈ 1,5, gyémánt 2,42. A frekvencia nem változik, a hullámhossz $\\lambda_0/n$.",
      feltetel: "Adott hullámhosszon (a törésmutató a színtől függ: diszperzió, prizma).", hiba: "—",
      pelda: { szoveg: "Üvegben 2 · 10⁸ m/s → n = 1,5." }, kulcsszavak: "törésmutató fénysebesség közeg diszperzió", kapcsolodo: ["snellius"] }),
    gen({ id: "hatarszog", fejezet: GO, nev: "Teljes visszaverődés határszöge", tex: "\\sin\\alpha_h = \\dfrac{n_2}{n_1}",
      vars: { ah: v("alpha", { tex: "\\alpha_h", nev: "határszög", min: 0, max: Math.PI / 2 }), n1: IDX("n_1", "a sűrűbb közeg törésmutatója (ahonnan a fény jön)"), n2: IDX("n_2", "a ritkább közeg törésmutatója") },
      solve: {
        ah: { tex: "\\alpha_h = \\arcsin\\dfrac{n_2}{n_1}", f: ({ n1, n2 }) => asinS(n2 / n1, "Teljes visszaverődés csak sűrűbb közegből ritkábba lehetséges (n₁ > n₂).") },
        n1: { tex: "n_1 = \\dfrac{n_2}{\\sin\\alpha_h}", f: ({ ah, n2 }) => n2 / nz(Math.sin(ah), "A határszög nem lehet 0.") },
        n2: { tex: "n_2 = n_1\\sin\\alpha_h", f: ({ ah, n1 }) => n1 * Math.sin(ah) },
      },
      minta: { ah: Math.asin(1 / 1.5), n1: 1.5, n2: 1 }, pelda: { szoveg: "Üveg–levegő (1,5 → 1): α_h ≈ 41,8°. Optikai szál, prizmás távcső, gyémánt csillogása.", adott: { n1: 1.5, n2: 1 }, keres: "ah" },
      jelentes: "Optikailag sűrűbb közegből ritkábba lépve, ha a beesési szög eléri a határszöget, a törési szög 90° lenne – ennél nagyobb szögnél a fény teljesen visszaverődik.",
      feltetel: "n₁ > n₂.", hiba: "Ritkább közegből sűrűbbe is teljes visszaverődést várnak.", kulcsszavak: "teljes visszaverődés határszög optikai szál üvegszál", kapcsolodo: ["snellius"] }),
    gen({ id: "lekepezesi", fejezet: GO, nev: "Leképezési törvény (lencse, gömbtükör)", tex: "\\dfrac1f = \\dfrac1t + \\dfrac1k",
      vars: { f: LEN("f", "fókusztávolság (szórólencse, domború tükör: negatív)"), t: LEN("t", "tárgytávolság"), k: LEN("k", "képtávolság (látszólagos kép: negatív)") },
      solve: {
        k: { tex: "k = \\dfrac{f\\,t}{t - f}", f: ({ f, t }) => (f * t) / nz(t - f, "A tárgy a fókuszpontban van: a kép a végtelenben keletkezik.") },
        t: { tex: "t = \\dfrac{f\\,k}{k - f}", f: ({ f, k }) => (f * k) / nz(k - f, "k = f esetén a tárgy a végtelenben van.") },
        f: { tex: "f = \\dfrac{t\\,k}{t + k}", f: ({ t, k }) => (t * k) / nz(t + k, "t + k nem lehet 0.") },
      },
      minta: { f: 0.2, t: 0.3, k: 0.6 }, pelda: { szoveg: "f = 20 cm-es gyűjtőlencse, tárgy 30 cm-re: k = 60 cm, valódi, fordított, kétszeres nagyítású kép.", adott: { f: 0.2, t: 0.3 }, keres: "k" },
      jelentes: "A tárgy-, kép- és fókusztávolság kapcsolata vékony lencsére és gömbtükörre. Ha t < f (gyűjtőlencse), a kép látszólagos (k < 0): ez a nagyító. Szóbeli mérések alapja.",
      feltetel: "Vékony lencse, optikai tengelyhez közeli (paraxiális) sugarak.", hiba: "Előjelhiba szórólencsénél és látszólagos képnél.",
      kulcsszavak: "leképezési törvény lencse tükör fókusztávolság tárgytávolság képtávolság", kapcsolodo: ["nagyitas", "dioptria", "gombtukor"] }),
    mono({ id: "nagyitas", fejezet: GO, nev: "Nagyítás", tex: "N = \\dfrac{K}{T} = \\dfrac{k}{t}", out: "N", terms: { k: 1, t: -1 },
      rtex: { k: "k = N\\,t", t: "t = \\dfrac{k}{N}" },
      vars: { N: { tex: "N", nev: "nagyítás (abszolút értéke)", dim: "egyseg" }, k: LEN("k", "képtávolság"), t: LEN("t", "tárgytávolság") }, minta: { k: 0.6, t: 0.3 },
      jelentes: "A kép és a tárgy méretének aránya a kép- és tárgytávolság arányával egyenlő.", feltetel: "Vékony lencse, gömbtükör.", hiba: "—",
      pelda: { szoveg: "k = 60 cm, t = 30 cm → kétszeres nagyítás." }, kulcsszavak: "nagyítás képnagyság tárgynagyság", kapcsolodo: ["lekepezesi"] }),
    mono({ id: "dioptria", fejezet: GO, nev: "Dioptria (törőképesség)", tex: "D = \\dfrac1f", out: "D", terms: { f: -1 },
      rtex: { f: "f = \\dfrac{1}{D}" },
      vars: { D: { tex: "D", nev: "dioptria", dim: "dioptria" }, f: LEN("f", "fókusztávolság méterben") }, minta: { f: 0.5 },
      jelentes: "Vékony, egymáshoz illesztett lencsék dioptriái összeadódnak. Rövidlátás: szórólencse (negatív), távollátás: gyűjtőlencse (pozitív).",
      feltetel: "f méterben.", hiba: "cm-ben mért fókusztávolsággal számolnak.", pelda: { szoveg: "f = 50 cm → +2 dioptria." },
      kulcsszavak: "dioptria szemüveg rövidlátás távollátás lencse", kapcsolodo: ["lekepezesi"] }),
    mono({ id: "gombtukor", fejezet: GO, nev: "Gömbtükör fókusztávolsága", tex: "f = \\dfrac{R}{2}", out: "f", c: 0.5, ctex: "\\tfrac12", cinv: "2", terms: { R: 1 },
      rtex: { R: "R = 2f" },
      vars: { f: LEN("f", "fókusztávolság"), R: v("R", { nev: "a gömbtükör görbületi sugara" }) }, minta: { R: 0.4 },
      jelentes: "Homorú tükör fókusza a görbületi középpont és a tükör között félúton van.", feltetel: "Az optikai tengelyhez közeli sugarak.", hiba: "—",
      pelda: { szoveg: "R = 40 cm → f = 20 cm." }, kulcsszavak: "gömbtükör homorú domború fókusz görbületi sugár", kapcsolodo: ["lekepezesi"] }),
  ]);

  /* ---------------- Hullámoptika ---------------- */
  const HO = "Hullámoptika";
  PO.addFormulas("hullamoptika", [
    gen({ id: "optikai-racs", fejezet: HO, nev: "Optikai rács (elhajlás, interferencia)", tex: "d\\,\\sin\\alpha_k = k\\,\\lambda",
      vars: { d: v("d", { nev: "rácsállandó (két rés távolsága)" }), alpha: v("alpha", { tex: "\\alpha_k", nev: "a k-adik maximum iránya", min: 0, max: Math.PI / 2 }), k: { tex: "k", nev: "a maximum rendje (0, 1, 2 …)", dim: "egyseg", min: 0 }, lambda: v("lambda") },
      solve: {
        lambda: { tex: "\\lambda = \\dfrac{d\\sin\\alpha_k}{k}", f: ({ d, alpha, k }) => (d * Math.sin(alpha)) / nz(k, "A nulladrendű maximumból nem számolható hullámhossz.") },
        alpha: { tex: "\\alpha_k = \\arcsin\\dfrac{k\\lambda}{d}", f: ({ d, k, lambda }) => asinS((k * lambda) / d, "Ilyen rendű maximum nincs (kλ > d).") },
        d: { tex: "d = \\dfrac{k\\lambda}{\\sin\\alpha_k}", f: ({ alpha, k, lambda }) => (k * lambda) / nz(Math.sin(alpha), "α nem lehet 0.") },
      },
      minta: { d: 1e-5, alpha: Math.asin(0.06), k: 1, lambda: 600e-9 },
      pelda: { szoveg: "100 rés/mm (d = 10 μm), 600 nm: α₁ ≈ 3,44°. Ernyőn: $\\tan\\alpha = x/L$ – így mérhető a lézer hullámhossza (szóbeli mérés).", adott: { d: 1e-5, k: 1, lambda: 600e-9 }, keres: "alpha" },
      jelentes: "Erősítés ott van, ahol a szomszédos résekből érkező hullámok útkülönbsége a hullámhossz egész számú többszöröse. Kettős résnél ugyanez a feltétel; CD/DVD felülete is rácsként viselkedik.",
      feltetel: "Párhuzamos (lézer)fény, a rácstól messzi ernyő.", hiba: "Kis szögközelítést használnak nagy szögeknél; a rácsállandó helyett a rések számát írják (d = 1 mm / 100).",
      kulcsszavak: "optikai rács elhajlás interferencia rácsállandó lézer hullámhossz mérés kettős rés", kapcsolodo: ["hullam-c-em"] }),
  ]);
})(typeof globalThis !== "undefined" ? globalThis : this);
