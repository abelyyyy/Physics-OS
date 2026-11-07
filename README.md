# PHYSICS OS

Interaktív fizika tanulórendszer az emelt szintű érettségiig – build és telepítés nélkül fut, internet nélkül is.

**Tartalom:** 7 témakör + alapozás, 37 kidolgozott alfejezet · 179 képlet kalkulátorral (565 átrendezés) ·
15 szimuláció · 20 szóbeli mérés adatfeldolgozóval · 5 hivatalos próbavizsga · 120 önellenőrző feladat ·
képletkártyák ismétlő rendszerrel · állandók, anyagjellemzők, mértékegység-átváltó.

## Indítás gépen
Dupla kattintás az `index.html`-re (Chrome, Edge, Firefox, Safari). Minden helyben van, net nem kell.

## Telepítés iPhone-ra (és Androidra)
Telefonon az app akkor működik igazán jól (főképernyő-ikon, teljes képernyő, offline), ha egy https-es
webcímről nyitod meg. A legegyszerűbb, ingyenes mód:

1. Csomagold ki a zipet, hogy meglegyen a `physics-os` mappa.
2. Nyisd meg gépen az **app.netlify.com/drop** oldalt (Netlify-fiókkal), és húzd rá a `physics-os` mappát.
   Pár másodperc múlva kapsz egy linket (pl. `valami-nev.netlify.app`). A Site settings → Change site name
   menüben átnevezheted (pl. `physics-os-abel`).
3. iPhone-on nyisd meg a linket **Safariban** → Megosztás gomb (négyzet felfelé nyíllal) →
   **Főképernyőhöz adás** → Hozzáadás.
4. Indítsd el egyszer az ikonról, amíg van net: ekkor letölti az összes tartalmat (≈ 8 MB). Utána repülő
   üzemmódban is működik.

Android: Chrome-ban ⋮ menü → „Telepítés” / „Hozzáadás a kezdőképernyőhöz”.

**Frissítés:** módosítás után futtasd a `python3 tools/build_sw.py` parancsot (új gyorsítótár-verzió),
és töltsd fel újra a mappát ugyanarra a Netlify-oldalra (Deploys → húzd rá). A telefonon az app a következő
indításkor magától frissül.

**Haladás átvitele:** a telepített app külön tárhelyet kap. Kezdőlap → Mentés → „Mentés kimásolása”,
majd a másik eszközön „Betöltés”.

## Tesztek
```
node --test tests/*.test.js
```
A tesztek mind a 179 képlet minden átrendezését (565 db) visszaszámolják a mintaértékekből, ellenőrzik a mértékegységeket, a hivatkozásokat és néhány ismert fizikai eredményt (első kozmikus sebesség, Hα-vonal, határszög), valamint a hajítás-modellt és a próbavizsgák adatait.

## Felépítés
```
index.html
css/app.css                 monokróm designrendszer
js/core/                    util (formázás, DOM), store (helyi mentés), tex (KaTeX)
js/physics/kinematics.js    tiszta fizikai számítások (tesztelhetők)
js/data/                    képletek, tananyag, feladatok, mértékegységek — új tartalom ide kerül
js/plot/plot.js             grafikonmotor
js/sims/                    szimulációk: kit.js (közös keret), mechanika.js, tobbi.js, tovabbi.js, projectile.js, uniform.js
js/data/tananyag-*.js       a 37 alfejezet szövege (PO.lesson építővel), meresek.js: a 20 mérés
js/ui/                      oldalak, kalkulátor, vizsga, mérések, képletkártyák (cards.js), telepítés (install.js)
sw.js, manifest.webmanifest offline működés és telepíthetőség (sw.js-t a tools/build_sw.py generálja)
js/app.js                   navigáció
vendor/katex/               KaTeX 0.16 (helyben)
tests/
```

## Új képlet hozzáadása
Képletfájlok témakörönként: `formulas-kinematika`, `-mechanika`, `-energia`, `-kornyezet`, `-elektro`, `-hullam`, `-modern`.
A `PO.addFormulas("<alfejezet-id>", [...])` hívásban kétféle építő használható (`js/data/formula-builder.js`):
- `mono({...})` – hatványszorzat alakú képlet (pl. $F = k Q_1 Q_2 / r^2$): elég megadni a `terms` kitevőit, a megoldók
  és az átrendezett TeX-alakok automatikusan készülnek;
- `gen({...})` – összegek, szögfüggvények, logaritmus: a `solve` objektumban kézzel adott átrendezések.

Kötelező: konzisztens `minta` (SI), `vars` létező dimenzióval (`js/data/units.js`), jelentés, feltétel, számpélda.
A kalkulátor, a keresés és az adatlap automatikusan elkészül, a `tests/formulas.test.js` pedig ellenőrzi.
Állandók, anyagjellemzők, égitestadatok: `js/data/constants.js` (Adatok menü).

## Új szimuláció
A `PO.simkit.define({...})` (`js/sims/kit.js`) leírásból építi fel a paneleket, a lejátszást, az idővonalat,
a grafikonokat és a kiírásokat. Meg kell adni: `params`, `model(st)` (a fizika, DOM nélkül – a `tests/sims.test.js`
ezt ellenőrzi), `series`, `values`, `draw` és opcionálisan `duration` (animációhoz). Minta: `js/sims/tobbi.js`.

## Próbavizsgák (Vizsga menü)
Öt hivatalos emelt szintű írásbeli feladatsor (2024. május – 2026. október). A `tools/build_exams.py` a feladatlap és a
javítási útmutató PDF-jéből kivágja a kérdéseket, témákat, feladatokat és megoldásokat (`assets/exams/`), és legenerálja
a `js/data/exams.js` fájlt. A feleletválasztós kérdések magyarázatai és témakörei: `js/data/exam-notes.js`.
Új feladatsor: a PDF-eket a `src/` mappába (`26maj_fl.pdf`, `26maj_ut.pdf`), egy sor az `EXAMS` listába, majd `python3 tools/build_exams.py`.
