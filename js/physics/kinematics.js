/* PHYSICS OS — kinematikai számítások (tiszta függvények, SI-egységekben)
 * Minden függvény Node-ban is tesztelhető: tests/kinematics.test.js */
(function (root) {
  const PO = (root.PO = root.PO || {});

  /** Egyenletesen változó mozgás a t időpontban (x0 kezdőhely, v0 kezdősebesség, a gyorsulás). */
  function uniformAccel(x0, v0, a, t) {
    return { x: x0 + v0 * t + 0.5 * a * t * t, v: v0 + a * t, a };
  }

  /**
   * Hajítás homogén nehézségi mezőben, közegellenállás nélkül.
   * v0 [m/s], alpha [rad] a vízszinteshez képest, g [m/s²] > 0, h0 [m] ≥ 0 kezdőmagasság.
   * A pálya a talajig (y = 0) tart.
   */
  function projectile(v0, alpha, g, h0 = 0) {
    if (!(g > 0)) throw new RangeError("g legyen pozitív");
    if (!(v0 >= 0)) throw new RangeError("v0 nem lehet negatív");
    if (!(h0 >= 0)) throw new RangeError("h0 nem lehet negatív");
    const vx = v0 * Math.cos(alpha);
    const vy = v0 * Math.sin(alpha);
    // y(t) = h0 + vy t − g t²/2 = 0  →  pozitív gyök
    const tFlight = (vy + Math.sqrt(vy * vy + 2 * g * h0)) / g;
    const tTop = vy > 0 ? vy / g : 0;
    const hMax = vy > 0 ? h0 + (vy * vy) / (2 * g) : h0;
    const range = vx * tFlight;
    const pos = (t) => ({ x: vx * t, y: h0 + vy * t - 0.5 * g * t * t });
    const vel = (t) => ({ x: vx, y: vy - g * t });
    const vLand = Math.hypot(vx, vy - g * tFlight);
    return { vx, vy, tFlight, tTop, hMax, range, pos, vel, vLand, g, h0, v0, alpha };
  }

  /** Talajszintről indított ferde hajítás zárt képletei (h0 = 0). */
  const ballistic = {
    range: (v0, alpha, g) => (v0 * v0 * Math.sin(2 * alpha)) / g,
    hMax: (v0, alpha, g) => (Math.pow(v0 * Math.sin(alpha), 2)) / (2 * g),
    tFlight: (v0, alpha, g) => (2 * v0 * Math.sin(alpha)) / g,
  };

  /** Egyenletes körmozgás. r [m], T [s] */
  function circular(r, T) {
    const omega = (2 * Math.PI) / T;
    const v = r * omega;
    return { omega, v, f: 1 / T, acp: (v * v) / r };
  }

  /** a·t²/2 + v0·t − s = 0 pozitív (nemnegatív) gyökei, növekvő sorrendben. */
  function timeForDistance(s, v0, a) {
    if (Math.abs(a) < 1e-15) return v0 !== 0 && s / v0 >= 0 ? [s / v0] : [];
    const D = v0 * v0 + 2 * a * s;
    if (D < 0) return [];
    const r = Math.sqrt(D);
    return [(-v0 + r) / a, (-v0 - r) / a]
      .filter((t) => t >= -1e-12)
      .map((t) => Math.max(0, t))
      .sort((p, q) => p - q)
      .filter((t, i, arr) => i === 0 || Math.abs(t - arr[i - 1]) > 1e-12);
  }

  PO.kin = { uniformAccel, projectile, ballistic, circular, timeForDistance };
  if (typeof module !== "undefined") module.exports = PO.kin;
})(typeof globalThis !== "undefined" ? globalThis : this);
