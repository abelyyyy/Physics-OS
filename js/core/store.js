/* PHYSICS OS — helyi mentés (localStorage), hibatűrően */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const KEY = "physics-os-v1";
  const blank = () => ({
    version: 1,
    topicsDone: {},        // témakör-id -> dátum
    sectionsRead: {},      // "tema:szakasz" -> true
    formulas: {},          // képlet-id -> "tanulom" | "tudom"
    favorites: {},         // képlet-id -> true
    verified: {},          // képlet-id -> true (a felhasználó ellenőrizte a függvénytáblázattal)
    tasks: {},             // feladat-id -> { ok, tries, last }
    last: { topic: null, sim: null, page: null },
    notes: {},             // témakör-id -> szöveg
    exams: {},
    meresek: {},           // mérés-id -> saját mért adatok
    cards: {},             // képlet-id -> { box, due } – képletkártyák (Leitner)             // vizsga-id -> { cur: folyamatban lévő próbálkozás, history: [...] }
  });

  let state = blank();
  let available = true;

  function load() {
    try {
      const raw = root.localStorage && root.localStorage.getItem(KEY);
      if (raw) state = Object.assign(blank(), JSON.parse(raw));
    } catch (e) {
      available = false;
    }
  }
  function save() {
    try {
      root.localStorage && root.localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      available = false;
    }
    listeners.forEach((f) => f(state));
  }
  const listeners = [];

  PO.store = {
    get: () => state,
    available: () => available,
    onChange: (f) => listeners.push(f),
    update(fn) { fn(state); save(); },
    exportJSON: () => JSON.stringify(state, null, 1),
    importJSON(text) {
      const obj = JSON.parse(text);
      if (!obj || typeof obj !== "object" || obj.version !== 1) throw new Error("Ismeretlen mentésformátum.");
      state = Object.assign(blank(), obj);
      save();
    },
    reset() { state = blank(); save(); },
    load,
  };
  load();
})(typeof globalThis !== "undefined" ? globalThis : this);
