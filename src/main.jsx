import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './index.css';
import MeshBackground from './lib/MeshBackground.jsx';
import GradientRouteSync from './lib/gradient/GradientRouteSync.jsx';
import Splash from './surfaces/Splash.jsx';
import { shouldShowSplash } from './lib/splash-state.js';
import AuthLayout from './layouts/AuthLayout.jsx';
import UnauthLayout from './layouts/UnauthLayout.jsx';
import Dashboard from './surfaces/Dashboard.jsx';
import DashboardUnauth from './surfaces/DashboardUnauth.jsx';
import Home from './surfaces/Home.jsx';
import Onboarding from './surfaces/Onboarding.jsx';
import OrganizationsUnauth from './surfaces/OrganizationsUnauth.jsx';
import Organization from './surfaces/Organization.jsx';
import Inventory from './surfaces/Inventory.jsx';

// Layout routes keep the top nav mounted across child navigations: only the
// <Outlet/> content swaps, so moving between sibling surfaces never reloads
// the page or remounts the nav. Crossing the auth boundary swaps the layout.
// A single root route wraps the whole tree with GradientRouteSync so one
// instance observes every navigation and morphs the mesh to the active surface.
const router = createBrowserRouter([
  {
    element: <GradientRouteSync />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" replace /> },
      {
        element: <AuthLayout />,
        children: [
          { path: '/dashboard', element: <Dashboard /> },
          {
            // Bare path shows the directory; :name deep-links to one organization's detail.
            path: '/organizations/:name?',
            element: <Organization />,
            // Organization runs a lighter type scale than the other authenticated
            // surfaces. (The mesh shows through by default — see .app in styles.css.)
            handle: { appStyle: { fontSize: '14px', fontWeight: 200 } },
          },
        ],
      },
      {
        element: <UnauthLayout />,
        children: [
          { path: '/home', element: <Home /> },
          { path: '/dashboard-unauth', element: <DashboardUnauth /> },
          { path: '/organizations-unauth', element: <OrganizationsUnauth /> },
        ],
      },
      { path: '/onboarding', element: <Onboarding /> },
{ path: '/inventory', element: <Inventory /> },
      { path: '*', element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);

// On the first load of the session the splash overlay is shown ahead of the
// router (the mesh, mounted separately, starts on the splash gradient and morphs
// into the destination surface as the splash hands off). The router mounts only
// once the splash finishes, so nothing renders behind the overlay.
function AppGate() {
  const [showSplash, setShowSplash] = useState(shouldShowSplash); // read once
  if (showSplash) return <Splash onDone={() => setShowSplash(false)} />;
  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Mounted once: the renderer prepends its own fixed canvas to <body>. */}
    <MeshBackground />
    <AppGate />
  </React.StrictMode>,
);
