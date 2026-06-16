import { useEffect } from 'react';
import { initGradient } from './gradient/controller.js';
import { shouldShowSplash } from './splash-state.js';

// Mounts the animated mesh gradient once at app root. The vertex configs now
// live in ./gradients/*.json and are owned by the gradient controller singleton
// (the renderer prepends its own fixed, pointer-events:none canvas to <body>).
// Route-driven morphing is handled by GradientRouteSync inside the router.
export default function MeshBackground() {
  useEffect(() => {
    // On the first load of the session the engine starts on the splash gradient
    // (the splash overlay morphs it into the destination surface); afterwards it
    // initialises straight onto the route's surface as before.
    initGradient(window.location.pathname, { splash: shouldShowSplash() });
  }, []);

  return null;
}
