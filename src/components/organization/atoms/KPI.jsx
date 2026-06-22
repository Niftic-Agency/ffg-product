import { PIcon } from '../icons/PIcon';

// ── Small pieces ────────────────────────────────────────────────────────────
const KPI = ({ label, value }) =>
<div className="org-kpi" style={{ width: "200px" }}>
    <div className="org-kpi__label" style={{ fontSize: "14px", alignItems: "center", justifyContent: "flex-start" }}>
      {label} <PIcon.Info className="org-info" />
    </div>
    <div className="org-kpi__value" style={{ fontSize: "32px", width: "200px", margin: "0px", padding: "0px 0px 24px", fontFamily: "\"PP Fragment Sans\"" }}>{value}</div>
  </div>;


export { KPI };
