/* PHYSICS OS — képletek: 6. Atomfizika, magfizika · 7. Világegyetem */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const { v, mono, gen, fail } = PO.fb;
  const K = PO.K;
  const nz = (x, m) => (Math.abs(x) < 1e-300 ? fail(m) : x);
  const eV = K.e;
  const RY = 13.6 * eV;
  const NN = (tex, nev) => ({ tex, nev, dim: "egyseg", min: 1, pos: true });
  const DB = (tex, nev) => ({ tex, nev, dim: "egyseg", min: 0, pos: true });
  const WKI = (o) => Object.assign({ tex: "W_{ki}", nev: "kilépési munka", dim: "energia", min: 0, pos: true }, o || {});

  /* ---------------- Atommodellek ---------------- */
  const AM = "Atommodellek, színképek";
  PO.addFormulas("atommodellek", [
    gen({ id: "bohr-E", fejezet: AM, nev: "A hidrogénatom energiaszintjei (Bohr-modell)", szint: "emelt", tex: "E_n = -\\dfrac{13{,}6\\ \\text{eV}}{n^2}",
      vars: { En: { tex: "E_n", nev: "az n-edik szint energiája", dim: "energia" }, nn: NN("n", "főkvantumszám (1, 2, 3 …)") },
      solve: {
        En: { tex: "E_n = -\\dfrac{13{,}6\\ \\text{eV}}{n^2}", f: ({ nn }) => -RY / (nn * nn) },
        nn: { tex: "n = \\sqrt{\\dfrac{-13{,}6\\ \\text{eV}}{E_n}}", f: ({ En }) => { if (En >= 0) fail("Kötött állapot energiája negatív."); return Math.sqrt(-RY / En); } },
      },
      minta: { En: -RY / 4, nn: 2 }, pelda: { szoveg: "n = 2: E₂ = −3,4 eV. Az ionizációs energia alapállapotból 13,6 eV.", adott: { nn: 2 }, keres: "En" },
      jelentes: "Az elektron csak meghatározott energiájú állapotokban lehet; a negatív előjel kötött állapotot jelent. A 0 energia a szabad (ionizált) elektron.",
      feltetel: "Hidrogénatom (egyetlen elektron).", nem: "Többelektronos atomra nem.", hiba: "Az előjelet elhagyják.",
      kulcsszavak: "bohr modell energiaszint hidrogén főkvantumszám ionizáció", kapcsolodo: ["bohr-atmenet"] }),
    gen({ id: "bohr-atmenet", fejezet: AM, nev: "Kibocsátott foton frekvenciája (átmenet)", szint: "emelt", tex: "h f = E_m - E_n = 13{,}6\\ \\text{eV}\\left(\\dfrac1{n^2} - \\dfrac1{m^2}\\right)",
      vars: { f: v("f", { nev: "a kibocsátott (elnyelt) foton frekvenciája" }), na: NN("n", "az alsó szint kvantumszáma"), nf: NN("m", "a felső szint kvantumszáma") },
      solve: {
        f: { tex: "f = \\dfrac{13{,}6\\ \\text{eV}}{h}\\left(\\dfrac1{n^2} - \\dfrac1{m^2}\\right)", f: ({ na, nf }) => { if (nf <= na) fail("A felső szint kvantumszáma (m) legyen nagyobb az alsóénál (n)."); return (RY / K.h) * (1 / (na * na) - 1 / (nf * nf)); } },
      },
      minta: { f: (RY / K.h) * (1 / 4 - 1 / 9), na: 2, nf: 3 }, pelda: { szoveg: "3 → 2 átmenet: f ≈ 4,57 · 10¹⁴ Hz, λ ≈ 656 nm (vörös Hα-vonal, Balmer-sorozat).", adott: { na: 2, nf: 3 }, keres: "f" },
      jelentes: "Magasabb szintről alacsonyabbra kerülve az atom a szintek energiakülönbségével egyenlő energiájú fotont bocsát ki – ezért vonalas a gázok színképe. Elnyelésnél ugyanezek a vonalak hiányoznak.",
      feltetel: "Hidrogénatom.", hiba: "Az energiakülönbség helyett az egyik szint energiáját veszik.",
      kulcsszavak: "színkép vonalas spektrum emisszió abszorpció balmer foton átmenet", kapcsolodo: ["bohr-E", "foton-E"] }),
  ]);

  /* ---------------- Kvantumfizika ---------------- */
  const KV = "Foton, fotoeffektus, anyaghullám";
  PO.addFormulas("kvantum", [
    mono({ id: "foton-E", fejezet: KV, nev: "A foton energiája", tex: "E = h\\,f", out: "E", c: K.h, ctex: "h", terms: { f: 1 },
      rtex: { f: "f = \\dfrac{E}{h}" },
      vars: { E: v("E", { nev: "a foton energiája", min: 0, pos: true }), f: v("f") }, minta: { f: 5e14 },
      jelentes: "A fény energiája adagokban (fotonokban) terjed; egy foton energiája a frekvenciával arányos. h = 6,63 · 10⁻³⁴ J·s.",
      feltetel: "Mindig.", hiba: "eV és J összekeverése (1 eV = 1,6 · 10⁻¹⁹ J).", pelda: { szoveg: "5 · 10¹⁴ Hz (zöld fény): E ≈ 3,3 · 10⁻¹⁹ J ≈ 2,1 eV." },
      kulcsszavak: "foton energia planck állandó kvantum", kapcsolodo: ["foton-lambda", "einstein-foto"] }),
    mono({ id: "foton-lambda", fejezet: KV, nev: "A foton energiája a hullámhosszal", tex: "E = \\dfrac{h\\,c}{\\lambda}", out: "E", c: K.h * K.c, ctex: "hc", terms: { lambda: -1 },
      rtex: { lambda: "\\lambda = \\dfrac{hc}{E}" },
      vars: { E: v("E", { nev: "a foton energiája", min: 0, pos: true }), lambda: v("lambda") }, minta: { lambda: 500e-9 },
      jelentes: "Rövidebb hullámhossz → nagyobb fotonenergia (UV, röntgen veszélyesebb). Hasznos: $hc \\approx 1240$ eV·nm.",
      feltetel: "Vákuumbeli hullámhosszal.", hiba: "nm-t nem váltanak m-re.", pelda: { szoveg: "500 nm: E ≈ 2,48 eV." },
      kulcsszavak: "foton energia hullámhossz", kapcsolodo: ["foton-E", "hullam-c-em"] }),
    mono({ id: "foton-p", fejezet: KV, nev: "A foton lendülete", szint: "emelt", tex: "p = \\dfrac{h}{\\lambda}", out: "pp", c: K.h, ctex: "h", terms: { lambda: -1 },
      rtex: { lambda: "\\lambda = \\dfrac{h}{p}" },
      vars: { pp: { tex: "p", nev: "lendület", dim: "lendulet", min: 0, pos: true }, lambda: v("lambda") }, minta: { lambda: 500e-9 },
      jelentes: "A fotonnak tömege nincs, de lendülete van: $p = E/c$. Ezért fejt ki a fény nyomást (napvitorla, üstökös csóvája).",
      feltetel: "Mindig.", hiba: "—", pelda: { szoveg: "500 nm-es foton: p ≈ 1,3 · 10⁻²⁷ kg·m/s." }, kulcsszavak: "foton lendület fénynyomás", kapcsolodo: ["de-broglie"] }),
    gen({ id: "einstein-foto", fejezet: KV, nev: "Einstein-féle fényelektromos egyenlet", tex: "h f = W_{ki} + \\tfrac12 m v_{max}^2",
      vars: { f: v("f", { nev: "a megvilágító fény frekvenciája" }), W: WKI(), Em: { tex: "E_{m}", nev: "a kilépő elektronok maximális mozgási energiája", dim: "energia", min: 0 } },
      solve: {
        Em: { tex: "E_m = hf - W_{ki}", f: ({ f, W }) => { const x = K.h * f - W; if (x < 0) fail("hf < W_ki: nincs fotoeffektus, elektron nem lép ki."); return x; } },
        W: { tex: "W_{ki} = hf - E_m", f: ({ f, Em }) => K.h * f - Em },
        f: { tex: "f = \\dfrac{W_{ki} + E_m}{h}", f: ({ W, Em }) => (W + Em) / K.h },
      },
      minta: { f: 1e15, W: 2.3 * eV, Em: K.h * 1e15 - 2.3 * eV },
      pelda: { szoveg: "Nátrium (W = 2,3 eV) 10¹⁵ Hz-es UV-fénnyel: E_m ≈ 1,84 eV.", adott: { f: 1e15, W: 2.3 * eV }, keres: "Em" },
      jelentes: "Egy foton egyetlen elektronnak adja át az energiáját; ebből a kilépési munka fedezi a kiszakítást, a maradék a mozgási energia. A fény erőssége csak a kilépő elektronok számát növeli, energiájukat nem!",
      feltetel: "hf ≥ W_ki.", hiba: "Azt hiszik, erősebb (de kis frekvenciájú) fénnyel is kiléphetnek elektronok.",
      kulcsszavak: "fotoeffektus fényelektromos jelenség einstein kilépési munka fotocella", kapcsolodo: ["hatarfrekvencia", "zarofeszultseg", "foton-E"] }),
    mono({ id: "hatarfrekvencia", fejezet: KV, nev: "Fotoeffektus határfrekvenciája", tex: "f_0 = \\dfrac{W_{ki}}{h}", out: "f0", c: 1 / K.h, ctex: "\\dfrac1h", cinv: "h", terms: { W: 1 },
      rtex: { W: "W_{ki} = h f_0" },
      vars: { f0: v("f", { tex: "f_0", nev: "határfrekvencia" }), W: WKI() }, minta: { W: 2.3 * eV },
      jelentes: "Ennél kisebb frekvenciájú fény – bármilyen erős – nem vált ki fotoeffektust. A határhullámhossz $\\lambda_0 = c/f_0$.",
      feltetel: "Mindig.", hiba: "—", pelda: { szoveg: "Nátrium: f₀ ≈ 5,6 · 10¹⁴ Hz, λ₀ ≈ 540 nm." },
      kulcsszavak: "határfrekvencia küszöbfrekvencia fotoeffektus", kapcsolodo: ["einstein-foto"] }),
    gen({ id: "zarofeszultseg", fejezet: KV, nev: "Zárófeszültség (fotocella)", szint: "emelt", tex: "e\\,U_0 = h f - W_{ki}",
      vars: { U0: v("U", { tex: "U_0", nev: "zárófeszültség", min: 0 }), f: v("f"), W: WKI() },
      solve: {
        U0: { tex: "U_0 = \\dfrac{hf - W_{ki}}{e}", f: ({ f, W }) => { const x = (K.h * f - W) / K.e; if (x < 0) fail("hf < W_ki: nincs fotoeffektus."); return x; } },
        f: { tex: "f = \\dfrac{eU_0 + W_{ki}}{h}", f: ({ U0, W }) => (K.e * U0 + W) / K.h },
        W: { tex: "W_{ki} = hf - eU_0", f: ({ U0, f }) => K.h * f - K.e * U0 },
      },
      minta: { U0: (K.h * 1e15 - 2.3 * eV) / K.e, f: 1e15, W: 2.3 * eV },
      pelda: { szoveg: "10¹⁵ Hz, W = 2,3 eV: U₀ ≈ 1,84 V. Az U₀–f grafikon meredeksége h/e, tengelymetszete a határfrekvencia.", adott: { f: 1e15, W: 2.3 * eV }, keres: "U0" },
      jelentes: "Az a fékezőfeszültség, amely a leggyorsabb fotoelektronokat is megállítja: $eU_0 = E_{m}$. Ezzel mérhető a Planck-állandó.",
      feltetel: "hf ≥ W_ki.", hiba: "—", kulcsszavak: "zárófeszültség fotocella planck állandó mérés", kapcsolodo: ["einstein-foto", "e-munka"] }),
    mono({ id: "de-broglie", fejezet: KV, nev: "De Broglie-hullámhossz", tex: "\\lambda = \\dfrac{h}{m\\,v}", out: "lambda", c: K.h, ctex: "h", terms: { m: -1, v: -1 },
      rtex: { m: "m = \\dfrac{h}{\\lambda v}", v: "v = \\dfrac{h}{m\\lambda}" },
      vars: { lambda: v("lambda", { nev: "anyaghullám hullámhossza" }), m: v("m", { nev: "a részecske tömege" }), v: v("v", { min: 0, pos: true }) }, minta: { m: K.me, v: 1e6 },
      jelentes: "Minden mozgó részecskéhez hullám tartozik ($\\lambda = h/p$). Elektronokra kimutatható elhajlás (elektronmikroszkóp); makroszkopikus testekre elhanyagolhatóan kicsi.",
      feltetel: "Nemrelativisztikus sebesség.", hiba: "—", pelda: { szoveg: "Elektron 10⁶ m/s-mal: λ ≈ 0,73 nm – atomi távolságok nagyságrendje." },
      kulcsszavak: "de broglie anyaghullám elektron hullámtermészet részecske", kapcsolodo: ["foton-p"] }),
  ]);

  /* ---------------- Atommag, relativitás ---------------- */
  const MAG = "Atommag, kötési energia";
  const REL = "A relativitáselmélet elemei";
  PO.addFormulas("atommag", [
    mono({ id: "tomeg-energia", fejezet: REL, nev: "Tömeg–energia egyenértékűség", tex: "E = m\\,c^2", out: "E", c: K.c * K.c, ctex: "c^2", terms: { m: 1 },
      rtex: { m: "m = \\dfrac{E}{c^2}" },
      vars: { E: v("E", { nev: "nyugalmi energia", min: 0 }), m: v("m") }, minta: { m: 0.001 },
      jelentes: "A tömeg és az energia egyenértékű: energiaváltozás tömegváltozással jár. Magreakcióknál, a Nap energiatermelésénél ezt használjuk.",
      feltetel: "Mindig (a nyugalmi tömegre).", hiba: "—", pelda: { szoveg: "1 g tömegnek megfelelő energia: 9 · 10¹³ J." },
      kulcsszavak: "tömeg energia egyenértékűség einstein relativitás", kapcsolodo: ["tomeghiany", "idodilatacio"] }),
    gen({ id: "idodilatacio", fejezet: REL, nev: "Idődilatáció", szint: "emelt", tex: "\\Delta t = \\dfrac{\\Delta t_0}{\\sqrt{1 - v^2/c^2}}",
      vars: { dt: v("dt", { nev: "a mozgó órán mért idő a nyugvó rendszerből nézve" }), dt0: v("dt", { tex: "\\Delta t_0", nev: "sajátidő (a jelenséggel együtt mozgó órán)" }), v: v("v", { min: 0, nev: "relatív sebesség" }) },
      solve: {
        dt: { tex: "\\Delta t = \\dfrac{\\Delta t_0}{\\sqrt{1 - v^2/c^2}}", f: ({ dt0, v }) => { if (v >= K.c) fail("A sebesség kisebb kell legyen a fénysebességnél."); return dt0 / Math.sqrt(1 - (v * v) / (K.c * K.c)); } },
        dt0: { tex: "\\Delta t_0 = \\Delta t\\sqrt{1 - v^2/c^2}", f: ({ dt, v }) => { if (v >= K.c) fail("v < c kell."); return dt * Math.sqrt(1 - (v * v) / (K.c * K.c)); } },
        v: { tex: "v = c\\sqrt{1 - (\\Delta t_0/\\Delta t)^2}", f: ({ dt, dt0 }) => { if (dt0 > dt) fail("A sajátidő a legrövidebb: Δt₀ ≤ Δt."); return K.c * Math.sqrt(1 - (dt0 / dt) ** 2); } },
      },
      minta: { dt: 2.2e-6 / Math.sqrt(1 - 0.995 * 0.995), dt0: 2.2e-6, v: 0.995 * K.c },
      pelda: { szoveg: "Müon (sajátidejű élettartam 2,2 μs) 0,995c-vel: a Földről nézve ≈ 22 μs-ig él – ezért éri el a felszínt (2024. május).", adott: { dt0: 2.2e-6, v: 0.995 * K.c }, keres: "dt" },
      jelentes: "A hozzánk képest mozgó órák lassabban járnak. Hétköznapi sebességeknél elhanyagolható, de a GPS-nél és a kozmikus müonoknál mérhető.",
      feltetel: "Egyenes vonalú egyenletes mozgás (inerciarendszerek).", hiba: "Fordítva veszik a sajátidőt és a mért időt.",
      kulcsszavak: "idődilatáció relativitás müon sajátidő fénysebesség lorentz", kapcsolodo: ["tomeg-energia"] }),
    mono({ id: "tomeghiany", fejezet: MAG, nev: "Kötési energia és tömeghiány", tex: "E_k = \\Delta m\\,c^2", out: "E", c: K.c * K.c, ctex: "c^2", terms: { dm: 1 },
      rtex: { dm: "\\Delta m = \\dfrac{E_k}{c^2}" },
      vars: { E: v("E", { tex: "E_k", nev: "a mag kötési energiája", min: 0 }), dm: v("m", { tex: "\\Delta m", nev: "tömeghiány (a nukleonok tömegének összege − a mag tömege)" }) }, minta: { dm: 0.0304 * K.u },
      jelentes: "Az atommag tömege kisebb, mint az alkotó nukleonok tömegének összege; a hiány a kötési energiának felel meg. 1 u ↔ 931,5 MeV.",
      feltetel: "Mindig.", hiba: "Atomtömeggel számolva elfelejtik az elektronokat.", pelda: { szoveg: "He-4: Δm ≈ 0,0304 u → E_k ≈ 28,3 MeV." },
      kulcsszavak: "tömeghiány tömegdefektus kötési energia atommag", kapcsolodo: ["fajlagos-kotesi", "tomeg-energia"] }),
    mono({ id: "fajlagos-kotesi", fejezet: MAG, nev: "Egy nukleonra jutó kötési energia", tex: "\\varepsilon = \\dfrac{E_k}{A}", out: "eps", terms: { E: 1, An: -1 },
      vars: { eps: { tex: "\\varepsilon", nev: "fajlagos kötési energia", dim: "energia", min: 0 }, E: v("E", { tex: "E_k", nev: "a mag kötési energiája", min: 0 }), An: NN("A", "tömegszám (nukleonszám)") },
      minta: { E: 28.3e6 * eV, An: 4 },
      jelentes: "A görbe a vas (Fe-56) környékén maximális (≈ 8,8 MeV): nehéz magok hasadásakor és könnyű magok fúziójakor energia szabadul fel.",
      feltetel: "Mindig.", hiba: "—", pelda: { szoveg: "He-4: 28,3 MeV / 4 ≈ 7,1 MeV/nukleon." },
      kulcsszavak: "fajlagos kötési energia nukleon vas görbe hasadás fúzió", kapcsolodo: ["tomeghiany", "hasadas-szam"] }),
  ]);

  /* ---------------- Radioaktivitás ---------------- */
  const RA = "Radioaktivitás, sugárvédelem";
  PO.addFormulas("radioaktivitas", [
    gen({ id: "bomlastorveny", fejezet: RA, nev: "Radioaktív bomlástörvény", tex: "N = N_0 \\cdot 2^{-t/T_{1/2}}",
      vars: { N: DB("N", "a még el nem bomlott magok száma"), N0: DB("N_0", "kezdeti magszám"), t: v("t"), T: v("T", { tex: "T_{1/2}", nev: "felezési idő" }) },
      solve: {
        N: { tex: "N = N_0 \\cdot 2^{-t/T_{1/2}}", f: ({ N0, t, T }) => N0 * Math.pow(2, -t / T) },
        N0: { tex: "N_0 = N \\cdot 2^{t/T_{1/2}}", f: ({ N, t, T }) => N * Math.pow(2, t / T) },
        t: { tex: "t = T_{1/2}\\log_2\\dfrac{N_0}{N}", f: ({ N, N0, T }) => { if (N <= 0 || N > N0) fail("0 < N ≤ N₀ kell."); return T * Math.log2(N0 / N); } },
        T: { tex: "T_{1/2} = \\dfrac{t}{\\log_2(N_0/N)}", f: ({ N, N0, t }) => { if (N <= 0 || N >= N0) fail("0 < N < N₀ kell."); return t / Math.log2(N0 / N); } },
      },
      minta: { N: 250, N0: 1000, t: 16 * 86400, T: 8 * 86400 },
      pelda: { szoveg: "Jód-131 (T = 8 nap): 16 nap alatt negyedére csökken. Az aktivitásra ugyanez igaz: $A = A_0 \\cdot 2^{-t/T}$.", adott: { N0: 1000, t: 16 * 86400, T: 8 * 86400 }, keres: "N" },
      jelentes: "Felezési időnként a még el nem bomlott magok száma (és az aktivitás) a felére csökken. Egyetlen mag bomlásának ideje nem jósolható meg – a törvény statisztikus. Radiokarbon kormeghatározás (C-14, 5730 év).",
      feltetel: "Nagy számú mag.", hiba: "Lineáris csökkenést feltételeznek (2T alatt nem bomlik el mind, csak ¾-e).",
      kulcsszavak: "bomlástörvény felezési idő radioaktív bomlás kormeghatározás exponenciális", kapcsolodo: ["aktivitas", "bomlasi-allando"] }),
    mono({ id: "aktivitas", fejezet: RA, nev: "Aktivitás", tex: "A = \\lambda\\,N", out: "Aa", terms: { lam: 1, N: 1 },
      vars: { Aa: { tex: "A", nev: "aktivitás", dim: "aktivitas", min: 0 }, lam: { tex: "\\lambda", nev: "bomlási állandó", dim: "bomlasall", min: 0, pos: true }, N: DB("N", "a radioaktív magok száma") }, minta: { lam: 1e-6, N: 1e12 },
      jelentes: "Időegység alatt elbomló magok száma; 1 Bq = 1 bomlás/s.", feltetel: "Mindig.", hiba: "A bomlási állandót összekeverik a hullámhossz jelével.",
      pelda: { szoveg: "10¹² mag, λ = 10⁻⁶ 1/s: A = 10⁶ Bq = 1 MBq." }, kulcsszavak: "aktivitás becquerel bomlás", kapcsolodo: ["bomlasi-allando", "bomlastorveny"] }),
    mono({ id: "bomlasi-allando", fejezet: RA, nev: "Bomlási állandó és felezési idő", szint: "emelt", tex: "\\lambda = \\dfrac{\\ln 2}{T_{1/2}}", out: "lam", c: Math.LN2, ctex: "\\ln 2", cinv: "\\dfrac{1}{\\ln 2}", terms: { T: -1 },
      rtex: { T: "T_{1/2} = \\dfrac{\\ln 2}{\\lambda}" },
      vars: { lam: { tex: "\\lambda", nev: "bomlási állandó", dim: "bomlasall", min: 0, pos: true }, T: v("T", { tex: "T_{1/2}", nev: "felezési idő" }) }, minta: { T: 8 * 86400 },
      jelentes: "A rövid felezési idejű izotóp gyorsan bomlik (nagy λ, adott magszámnál nagy aktivitás).", feltetel: "Mindig.", hiba: "—",
      pelda: { szoveg: "T = 8 nap → λ ≈ 1,0 · 10⁻⁶ 1/s." }, kulcsszavak: "bomlási állandó felezési idő ln2", kapcsolodo: ["aktivitas"] }),
    mono({ id: "elnyelt-dozis", fejezet: RA, nev: "Elnyelt dózis", tex: "D = \\dfrac{E}{m}", out: "Dd", terms: { E: 1, m: -1 },
      vars: { Dd: { tex: "D", nev: "elnyelt dózis", dim: "dozis", min: 0 }, E: v("E", { nev: "elnyelt sugárzási energia", min: 0 }), m: v("m", { nev: "az elnyelő test tömege" }) }, minta: { E: 0.07, m: 70 },
      jelentes: "Az egységnyi tömegben elnyelt sugárzási energia; 1 Gy = 1 J/kg.", feltetel: "Egyenletes elnyelés.", hiba: "—",
      pelda: { szoveg: "70 kg-os ember 0,07 J-t nyel el: D = 1 mGy." }, kulcsszavak: "elnyelt dózis gray sugárzás", kapcsolodo: ["egyenertek-dozis"] }),
    mono({ id: "egyenertek-dozis", fejezet: RA, nev: "Egyenérték dózis", tex: "H = w_R\\,D", out: "H", terms: { w: 1, Dd: 1 },
      vars: { H: { tex: "H", nev: "egyenérték dózis", dim: "egyenerto", min: 0 }, w: { tex: "w_R", nev: "sugárzási súlytényező (γ, β: 1; α: 20)", dim: "egyseg", min: 1 }, Dd: { tex: "D", nev: "elnyelt dózis", dim: "dozis", min: 0 } }, minta: { w: 20, Dd: 0.001 },
      jelentes: "A biológiai hatást is figyelembe veszi; mértékegysége a sievert (Sv). Természetes háttérsugárzás ≈ 2–3 mSv/év. Védekezés: távolság, idő, árnyékolás.",
      feltetel: "Mindig.", hiba: "—", pelda: { szoveg: "1 mGy α-sugárzásból: H = 20 mSv." },
      kulcsszavak: "egyenérték dózis sievert súlytényező sugárvédelem háttérsugárzás", kapcsolodo: ["elnyelt-dozis"] }),
  ]);

  /* ---------------- Maghasadás ---------------- */
  PO.addFormulas("maghasadas", [
    mono({ id: "hasadas-szam", fejezet: "Maghasadás, atomerőmű", nev: "Szükséges hasadások száma (atomerőmű)", tex: "N = \\dfrac{P\\,t}{E_1}", out: "N", terms: { P: 1, t: 1, E1: -1 },
      vars: { N: DB("N", "hasadások száma"), P: v("P", { nev: "a reaktor (hő)teljesítménye", min: 0, pos: true }), t: v("t"), E1: v("E", { tex: "E_1", nev: "egy hasadásban felszabaduló energia (≈ 200 MeV)", min: 0, pos: true }) },
      minta: { P: 1e9, t: 1, E1: 200e6 * eV },
      jelentes: "Egy U-235 mag hasadásakor ≈ 200 MeV szabadul fel. A láncreakciót moderátor (lassítja a neutronokat) és szabályzórudak (elnyelik) tartják kordában.",
      feltetel: "Állandó teljesítmény; ha villamos teljesítmény adott, a hatásfokkal osztani kell.", hiba: "MeV-ot nem váltanak J-ra.",
      pelda: { szoveg: "1 GW hőteljesítményhez másodpercenként ≈ 3,1 · 10¹⁹ hasadás kell." }, kulcsszavak: "maghasadás atomerőmű láncreakció urán reaktor", kapcsolodo: ["fajlagos-kotesi", "tomeg-energia"] }),
  ]);

  /* ---------------- Világegyetem ---------------- */
  PO.addFormulas("csillagok", [
    mono({ id: "wien", fejezet: "Csillagok", nev: "Wien-féle eltolódási törvény", tex: "\\lambda_{max}\\,T = b", out: "lambda", c: K.b, ctex: "b", terms: { Tk: -1 },
      rtex: { lambda: "\\lambda_{max} = \\dfrac{b}{T}", Tk: "T = \\dfrac{b}{\\lambda_{max}}" },
      vars: { lambda: v("lambda", { tex: "\\lambda_{max}", nev: "a legerősebb sugárzás hullámhossza" }), Tk: v("Tk", { nev: "felszíni hőmérséklet" }) }, minta: { Tk: 5800 },
      jelentes: "Melegebb test sugárzásának maximuma rövidebb hullámhosszra esik: a vörös csillagok hidegebbek, a kékek forróbbak. b ≈ 2,9 · 10⁻³ m·K.",
      feltetel: "Abszolút fekete test (jó közelítés csillagokra).", hiba: "°C-ban helyettesítenek.", pelda: { szoveg: "Nap (5800 K): λ_max ≈ 500 nm (zöldeskék)." },
      kulcsszavak: "wien törvény hőmérsékleti sugárzás csillag színe fekete test", kapcsolodo: ["stefan-boltzmann"] }),
    mono({ id: "stefan-boltzmann", fejezet: "Csillagok", nev: "Stefan–Boltzmann-törvény", szint: "emelt", tex: "P = \\sigma\\,A\\,T^4", out: "P", c: K.sigma, ctex: "\\sigma", terms: { A: 1, Tk: 4 },
      vars: { P: v("P", { nev: "kisugárzott teljesítmény (luminozitás)", min: 0 }), A: v("A", { nev: "a sugárzó felület" }), Tk: v("Tk") }, minta: { A: 6.09e18, Tk: 5772 },
      jelentes: "A fekete test által kisugárzott teljesítmény a hőmérséklet negyedik hatványával arányos. Gömb alakú csillagra $A = 4\\pi R^2$.",
      feltetel: "Abszolút fekete test.", hiba: "—", pelda: { szoveg: "Nap: A ≈ 6,09 · 10¹⁸ m², T = 5772 K → P ≈ 3,8 · 10²⁶ W." },
      kulcsszavak: "stefan boltzmann hőmérsékleti sugárzás luminozitás csillag", kapcsolodo: ["wien"] }),
  ]);
  PO.addFormulas("kozmologia", [
    mono({ id: "hubble", fejezet: "Galaxisok, táguló Univerzum", nev: "Hubble-törvény", tex: "v = H_0\\,d", out: "v", terms: { H0: 1, d: 1 },
      vars: { v: v("v", { nev: "a galaxis távolodási sebessége", min: 0 }), H0: { tex: "H_0", nev: "Hubble-állandó (≈ 70 km/s/Mpc)", dim: "hubble", min: 0, pos: true }, d: v("d", { nev: "a galaxis távolsága" }) },
      minta: { H0: 70e3 / 3.0857e22, d: 100 * 3.0857e22 },
      jelentes: "A távoli galaxisok a távolságukkal arányos sebességgel távolodnak (vöröseltolódás) – az Univerzum tágul. $1/H_0$ az Univerzum korának becslése (≈ 14 milliárd év).",
      feltetel: "Nem túl közeli és nem túl távoli galaxisok.", hiba: "Mértékegység: km/s/Mpc → 1/s átváltás.", pelda: { szoveg: "100 Mpc távolságú galaxis: v ≈ 7000 km/s." },
      kulcsszavak: "hubble törvény táguló univerzum vöröseltolódás galaxis ősrobbanás", kapcsolodo: ["doppler"] }),
  ]);
})(typeof globalThis !== "undefined" ? globalThis : this);
