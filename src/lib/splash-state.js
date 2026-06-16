// Tracks whether the initial-load splash screen has already been shown in this
// browser. Persisted in localStorage so the splash plays once per browser and
// is skipped on later loads. Shared by MeshBackground (which inits the mesh
// with the splash gradient on first load) and the app gate (which renders the
// splash overlay) so both agree on the first render — the flag is only written
// once the splash finishes.
const KEY = 'ffg_splash_seen';

export function shouldShowSplash() {
  try {
    return localStorage.getItem(KEY) !== 'true';
  } catch {
    return false;
  }
}

export function markSplashSeen() {
  try {
    localStorage.setItem(KEY, 'true');
  } catch {
    /* ignore (private mode, storage disabled) */
  }
}
