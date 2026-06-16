// Framework-agnostic singleton that owns the live MeshGradient instance.
//
// The renderer prepends a fixed, full-viewport canvas to <body>, so the instance
// must outlive React layout swaps (Auth ↔ Unauth) and route changes. Keeping it
// in a module-level singleton (rather than React state) means it survives those
// remounts and is reachable from both React (route sync) and plain modules
// (e.g. an action handler firing a pulse).
import { MeshGradient } from '../mesh-gradient.js';
import { gradientForPath, GRADIENTS } from '../gradients/index.js';

let engine = null;
let currentConfig = null; // the vertex array currently shown/targeted
// While the initial-load splash is on screen the engine is initialised with the
// splash gradient; route sync must not morph away from it. `splashActive` gates
// that, and `pendingPath` remembers the latest route observed during the splash
// so `endSplash` knows which surface to morph into when the splash hands off.
let splashActive = false;
let pendingPath = null;

// Mount the gradient for the initial route and play the intro. Idempotent: a
// second call (e.g. React StrictMode's double-invoke) reuses the live instance
// and drops any stray canvas left by a torn-down one. When `opts.splash` is set
// the engine starts on the splash gradient instead of the route's surface, and
// route-driven morphing is suspended until `endSplash` is called.
export function initGradient(pathname = '/', opts = {}) {
  if (engine) return engine;

  // Drop a canvas orphaned by a prior mount before creating a fresh instance.
  document.querySelectorAll('canvas[data-ffg-mesh]').forEach((c) => c.remove());

  if (opts.splash) {
    splashActive = true;
    pendingPath = pathname;
    currentConfig = GRADIENTS.splash;
  } else {
    currentConfig = gradientForPath(pathname);
  }
  engine = new MeshGradient({
    bgColor: '#f7f5f1',
    introDuration: 1800,
    outroDuration: 1400,
    rows: 4,
    cols: 4,
    vertices: currentConfig,
  });
  if (engine.canvas) engine.canvas.setAttribute('data-ffg-mesh', '');
  // Short delay lets the page settle before the intro fires, preventing stutter.
  setTimeout(() => engine && engine.playIntro(), 250);
  return engine;
}

// Morph the gradient to the config for `pathname`, if it differs from the
// current one. No-op until the gradient has been initialised.
export function setSurface(pathname = '/') {
  if (!engine) return;
  // While the splash is up, just remember where we're headed; the morph into
  // that surface fires from endSplash once the splash hands off.
  if (splashActive) {
    pendingPath = pathname;
    return;
  }
  const next = gradientForPath(pathname);
  if (next === currentConfig) return;
  currentConfig = next;
  engine.morphTo(next, 2400);
}

// End the splash and morph from the splash gradient into the destination
// surface's gradient. Called by the splash overlay as it begins fading out, so
// the gradient transition plays under the fade and into the revealed surface.
export function endSplash(pathname = '/', duration = 2200) {
  splashActive = false;
  if (!engine) return;
  const next = gradientForPath(pendingPath ?? pathname);
  pendingPath = null;
  if (next === currentConfig) return;
  currentConfig = next;
  engine.morphTo(next, duration);
}

// Morph to a named gradient config (a key of GRADIENTS) regardless of route.
// Used by in-surface actions that change the gradient without navigating —
// e.g. the onboarding "Let's get started" transition. No-op until initialised.
export function morphToGradient(name, duration = 2400) {
  if (!engine) return;
  const next = GRADIENTS[name];
  if (!next || next === currentConfig) return;
  currentConfig = next;
  engine.morphTo(next, duration);
}

// Fire a one-shot pulse. The reusable action trigger — any module can call this.
export function pulse() {
  if (engine) engine.playPulse();
}

// Single import surface for callers that prefer an object handle.
export const gradientController = { initGradient, setSurface, morphToGradient, pulse };
