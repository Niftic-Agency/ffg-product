// FFG Organization surface — ported from the prototype's organization.jsx shell.
// Single app toggling between the directory and an individual organization page.
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OrganizationDetail } from '../components/organization/sections/OrganizationDetail.jsx';
import { Directory } from '../components/organization/sections/Directory.jsx';
import { ORGANIZATIONS } from '../components/organization/data/organizations.jsx';

function OrganizationApp() {
  // URL-driven: /organization shows the directory, /organizations/:name opens that detail.
  // This lets other surfaces (e.g. the dashboard org rows) deep-link to a organization.
  const { name } = useParams();
  const navigate = useNavigate();
  const active = name ? ORGANIZATIONS.find((p) => p.name === decodeURIComponent(name)) ?? null : null;

  // Reset scroll when switching between directory and detail.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [name]);

  return (
    <div className="org-app">
      {active ?
        <OrganizationDetail organization={active} onBack={() => navigate('/organization')} /> :
        <Directory onOpen={(p) => navigate(`/organizations/${encodeURIComponent(p.name)}`)} />}
    </div>);
}

export default function Organization() {
  // The .app wrapper (transparent background + lighter type scale) and the top
  // nav are supplied by AuthLayout — see this route's `handle` in main.jsx.
  // Uses the shared responsive .shell padding (no inline override).
  return (
    <div className="shell">
      <OrganizationApp />
    </div>
  );
}
