import { PIcon } from '../icons/PIcon';

const Stat = ({ label, value }) =>
<div className="org-stat">
    <div className="org-stat__label" style={{ fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
      {label} <PIcon.Info className="org-info" />
    </div>
    <div className="org-stat__value" style={{ fontFamily: "\"PP Fragment Sans\"", fontWeight: "400", fontSize: "32px", margin: "0px", padding: "0px 0px 24px" }}>{value}</div>
  </div>;


export { Stat };
