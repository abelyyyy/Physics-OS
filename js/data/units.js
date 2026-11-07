/* PHYSICS OS — mértékegységek dimenziónként.
 * Egy sor: [jelölés, szorzó, eltolás]: SI = érték · szorzó + eltolás (eltolás csak a °C-nál van). */
(function (root) {
  const PO = (root.PO = root.PO || {});
  const D = Math.PI / 180;
  const eV = 1.602176634e-19;
  PO.units = {
    hossz:        { nev: "Hossz", si: "m", list: [["m", 1], ["cm", 0.01], ["mm", 0.001], ["μm", 1e-6], ["nm", 1e-9], ["km", 1000], ["CSE", 1.495978707e11], ["fényév", 9.4607304725808e15], ["pc", 3.0856775814913673e16], ["Mpc", 3.0856775814913673e22]] },
    terulet:      { nev: "Terület", si: "m²", list: [["m²", 1], ["dm²", 0.01], ["cm²", 1e-4], ["mm²", 1e-6], ["km²", 1e6]] },
    terfogataram: { nev: "Térfogatáram", si: "m³/s", list: [["m³/s", 1], ["l/s", 1e-3], ["l/min", 1e-3 / 60], ["m³/h", 1 / 3600]] },
    feluleti:     { nev: "Felületi feszültség", si: "N/m", list: [["N/m", 1], ["mN/m", 1e-3]] },
    terfogat:     { nev: "Térfogat", si: "m³", list: [["m³", 1], ["dm³ (l)", 1e-3], ["cm³ (ml)", 1e-6], ["mm³", 1e-9]] },
    ido:          { nev: "Idő", si: "s", list: [["s", 1], ["ms", 0.001], ["μs", 1e-6], ["ns", 1e-9], ["min", 60], ["h", 3600], ["nap", 86400], ["év", 365.25 * 86400]] },
    sebesseg:     { nev: "Sebesség", si: "m/s", list: [["m/s", 1], ["km/h", 1 / 3.6], ["cm/s", 0.01], ["km/s", 1000]] },
    gyorsulas:    { nev: "Gyorsulás", si: "m/s²", list: [["m/s²", 1], ["cm/s²", 0.01]] },
    szog:         { nev: "Szög", si: "rad", list: [["°", D], ["rad", 1]], default: "°" },
    szogseb:      { nev: "Szögsebesség", si: "1/s", list: [["1/s", 1], ["°/s", D], ["fordulat/min", (2 * Math.PI) / 60]] },
    szoggyors:    { nev: "Szöggyorsulás", si: "1/s²", list: [["1/s²", 1], ["°/s²", D]] },
    frekvencia:   { nev: "Frekvencia", si: "1/s", list: [["1/s (Hz)", 1], ["kHz", 1e3], ["MHz", 1e6], ["GHz", 1e9], ["1/min", 1 / 60]] },
    tomeg:        { nev: "Tömeg", si: "kg", list: [["kg", 1], ["g", 1e-3], ["mg", 1e-6], ["μg", 1e-9], ["t", 1000], ["u", 1.6605390666e-27]] },
    ero:          { nev: "Erő", si: "N", list: [["N", 1], ["mN", 1e-3], ["kN", 1e3], ["MN", 1e6]] },
    energia:      { nev: "Energia, munka, hő", si: "J", list: [["J", 1], ["kJ", 1e3], ["MJ", 1e6], ["Wh", 3600], ["kWh", 3.6e6], ["eV", eV], ["keV", 1e3 * eV], ["MeV", 1e6 * eV], ["cal", 4.1868]] },
    teljesitmeny: { nev: "Teljesítmény", si: "W", list: [["W", 1], ["mW", 1e-3], ["kW", 1e3], ["MW", 1e6], ["GW", 1e9]] },
    nyomas:       { nev: "Nyomás", si: "Pa", list: [["Pa", 1], ["hPa", 100], ["kPa", 1e3], ["MPa", 1e6], ["bar", 1e5], ["atm", 101325], ["Hgmm", 133.322]] },
    suruseg:      { nev: "Sűrűség", si: "kg/m³", list: [["kg/m³", 1], ["g/cm³", 1000], ["kg/dm³", 1000]] },
    lendulet:     { nev: "Lendület", si: "kg·m/s", list: [["kg·m/s", 1]] },
    nyomatek:     { nev: "Forgatónyomaték", si: "N·m", list: [["N·m", 1]] },
    tehetetlen:   { nev: "Tehetetlenségi nyomaték", si: "kg·m²", list: [["kg·m²", 1]] },
    perdulet:     { nev: "Perdület", si: "kg·m²/s", list: [["kg·m²/s", 1]] },
    rugoallando:  { nev: "Rugóállandó", si: "N/m", list: [["N/m", 1], ["N/cm", 100]] },
    homerseklet:  { nev: "Hőmérséklet", si: "K", list: [["K", 1, 0], ["°C", 1, 273.15]] },
    homdiff:      { nev: "Hőmérséklet-változás", si: "K", list: [["K (°C)", 1]] },
    anyagmenny:   { nev: "Anyagmennyiség", si: "mol", list: [["mol", 1], ["mmol", 1e-3]] },
    molaris:      { nev: "Moláris tömeg", si: "kg/mol", list: [["kg/mol", 1], ["g/mol", 1e-3]] },
    fajho:        { nev: "Fajhő", si: "J/(kg·K)", list: [["J/(kg·K)", 1], ["kJ/(kg·K)", 1e3]] },
    hokapacitas:  { nev: "Hőkapacitás", si: "J/K", list: [["J/K", 1], ["kJ/K", 1e3]] },
    latens:       { nev: "Olvadás-, forráshő", si: "J/kg", list: [["J/kg", 1], ["kJ/kg", 1e3], ["MJ/kg", 1e6]] },
    hotagulas:    { nev: "Hőtágulási együttható", si: "1/K", list: [["1/K", 1], ["10⁻⁶/K", 1e-6]] },
    toltes:       { nev: "Töltés", si: "C", list: [["C", 1], ["mC", 1e-3], ["μC", 1e-6], ["nC", 1e-9], ["e", eV], ["mAh", 3.6], ["Ah", 3600]] },
    feszultseg:   { nev: "Feszültség", si: "V", list: [["V", 1], ["mV", 1e-3], ["kV", 1e3]] },
    aram:         { nev: "Áramerősség", si: "A", list: [["A", 1], ["mA", 1e-3], ["μA", 1e-6], ["kA", 1e3]] },
    ellenallas:   { nev: "Ellenállás", si: "Ω", list: [["Ω", 1], ["mΩ", 1e-3], ["kΩ", 1e3], ["MΩ", 1e6]] },
    fajlagos:     { nev: "Fajlagos ellenállás", si: "Ω·m", list: [["Ω·m", 1], ["Ω·mm²/m", 1e-6]] },
    kapacitas:    { nev: "Kapacitás", si: "F", list: [["F", 1], ["mF", 1e-3], ["μF", 1e-6], ["nF", 1e-9], ["pF", 1e-12]] },
    induktivitas: { nev: "Induktivitás", si: "H", list: [["H", 1], ["mH", 1e-3], ["μH", 1e-6]] },
    terero:       { nev: "Elektromos térerősség", si: "N/C", list: [["N/C (V/m)", 1], ["kV/m", 1e3]] },
    indukcio:     { nev: "Mágneses indukció", si: "T", list: [["T", 1], ["mT", 1e-3], ["μT", 1e-6]] },
    fluxus:       { nev: "Mágneses fluxus", si: "Wb", list: [["Wb", 1], ["mWb", 1e-3]] },
    intenzitas:   { nev: "Intenzitás", si: "W/m²", list: [["W/m²", 1], ["mW/m²", 1e-3], ["μW/m²", 1e-6]] },
    hangszint:    { nev: "Hangerősségszint", si: "dB", list: [["dB", 1]] },
    aktivitas:    { nev: "Aktivitás", si: "Bq", list: [["Bq", 1], ["kBq", 1e3], ["MBq", 1e6], ["GBq", 1e9]] },
    bomlasall:    { nev: "Bomlási állandó", si: "1/s", list: [["1/s", 1], ["1/h", 1 / 3600], ["1/nap", 1 / 86400], ["1/év", 1 / (365.25 * 86400)]] },
    dozis:        { nev: "Elnyelt dózis", si: "Gy", list: [["Gy", 1], ["mGy", 1e-3]] },
    egyenerto:    { nev: "Egyenértékdózis", si: "Sv", list: [["Sv", 1], ["mSv", 1e-3], ["μSv", 1e-6]] },
    dioptria:     { nev: "Dioptria", si: "1/m", list: [["1/m (dioptria)", 1]] },
    hubble:       { nev: "Hubble-állandó", si: "1/s", list: [["km/s/Mpc", 1000 / 3.0856775814913673e22], ["1/s", 1]], default: "km/s/Mpc" },
    egyseg:       { nev: "Mértékegység nélküli", si: "", list: [["–", 1]] },
    szazalek:     { nev: "Arány", si: "", list: [["–", 1], ["%", 0.01]] },
  };
  const row = (dim, label) => { const u = PO.units[dim]; return (u && u.list.find((r) => r[0] === label)) || u.list[0]; };
  PO.unitDefault = (dim) => { const u = PO.units[dim]; return u.default || u.list[0][0]; };
  PO.unitFactor = (dim, label) => row(dim, label)[1];
  PO.toSI = (dim, label, x) => { const r = row(dim, label); return x * r[1] + (r[2] || 0); };
  PO.fromSI = (dim, label, x) => { const r = row(dim, label); return (x - (r[2] || 0)) / r[1]; };
  if (typeof module !== "undefined") module.exports = PO.units;
})(typeof globalThis !== "undefined" ? globalThis : this);
