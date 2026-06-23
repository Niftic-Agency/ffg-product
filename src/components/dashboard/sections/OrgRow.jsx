import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../icons/Icon';
import { IMPACT_AREA_ICONS } from '../data/orgTaxonomy';
import { OrgLogoPlaceholder } from '../atoms/OrgLogoPlaceholder';

function OrgRow({ org }) {
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();
  const openOrganization = () => navigate(`/organizations/${encodeURIComponent(org.name)}`);
  return (
    <article
      className="org-row"
      role="link"
      tabIndex={0}
      onClick={openOrganization}
      onKeyDown={(e) => {if (e.key === "Enter" || e.key === " ") {e.preventDefault();openOrganization();}}}>

      <OrgLogoPlaceholder name={org.name} size={48} />
      <div className="org-row__body">
        <div className="org-row__head">
          <h3 className="org-row__name" style={{ fontWeight: "400", fontSize: "20px" }}>{org.name}</h3>
          <div className="org-row__loc">
            <span style={{ fontSize: "14px", fontWeight: "300" }}>{org.loc}</span>
          </div>
        </div>
      </div>
      <div className="org-row__stats">
        <div className="org-stat">
          <div className="org-stat__label" style={{ fontSize: "14px", fontWeight: "300" }}>Confidence level</div>
          <div className="org-stat__value" style={{ fontWeight: "400" }}>{org.confidence}%</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label" style={{ fontSize: "14px", fontWeight: "300" }}>Strategy</div>
          <div className="org-stat__value" style={{ fontWeight: "300" }}>{org.strategy}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label" style={{ fontSize: "14px", fontWeight: "300" }}>Impact capital</div>
          <div className="org-stat__value" style={{ fontWeight: "300" }}>${org.donated.toLocaleString()}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label" style={{ fontSize: "14px", fontWeight: "300" }}>Outcomes</div>
          <div className="org-stat__value" style={{ fontWeight: "300" }}>{org.lives.toLocaleString()}</div>
        </div>
        <div className="org-stat">
          <div className="org-stat__label" style={{ fontSize: "14px", fontWeight: "300" }}>Lives impacted</div>
          <div className="org-stat__value" style={{ fontWeight: "300" }}>{org.livesImpacted.toLocaleString()}</div>
        </div>
      </div>
      <div className="org-row__tags">
        {org.tags.map((tag) => {
          const slug = tag.toLowerCase().replace(/\s+/g, "-");
          return (
            <span key={tag} className={`impact-badge impact-badge--${slug}`}>
              <span className="impact-badge__icon">{IMPACT_AREA_ICONS[tag]}</span>
              <span style={{ fontSize: "14px", fontWeight: "300", color: "var(--ffg-muted)" }}>{tag}</span>
            </span>);
        })}
        <button
          type="button"
          className={"org-row__add" + (added ? " is-added" : "")}
          aria-pressed={added}
          onClick={(e) => {e.stopPropagation();setAdded((v) => !v);}}>

          {added ? <Icon.Check /> : <Icon.Plus />}
          <span>{added ? "Added to portfolio" : "Add to portfolio"}</span>
        </button>
      </div>
    </article>);

}

export { OrgRow };
