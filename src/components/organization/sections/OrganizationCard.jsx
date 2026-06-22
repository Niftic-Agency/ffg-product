import { BadgeCheck, Info } from 'lucide-react';
import { PIcon } from '../icons/PIcon';
import { statusForName, tierForName } from '../data/statusTaxonomy';
import { ORGANIZATION_DESC } from '../data/organizations';
import { Badge } from '../../shared/Badge';
import { LogoPlaceholder } from '../atoms/LogoPlaceholder';

function OrganizationCard({ organization, onOpen }) {
  const status = statusForName(organization.name);
  const tier = tierForName(organization.name, status);
  const isVerified = status === "Verified";

  return (
    <article className="org-card" onClick={onOpen} role="button" tabIndex={0}
    onKeyDown={(e) => {if (e.key === "Enter") onOpen();}}>
      {/* Identity: logo + name (+ verified badge) + location, with the
              open-card affordance pinned top-right. */}
      <div className="org-card__head">
        <div className="org-card__id">
          <LogoPlaceholder name={organization.name} />
          <div className="org-card__name-block">
            <h3 className="org-card__name">
              <span>{organization.name}</span>
              {isVerified &&
              <span className="org-card__verified" aria-label="Verified" title="Verified">
                  <BadgeCheck />
                </span>}
            </h3>
            <div className="org-card__loc">
              <span>{organization.location}</span>
            </div>
          </div>
        </div>
        <button
          className="org-card__open"
          aria-label={`Open ${organization.name}`}
          onClick={(e) => {e.stopPropagation();onOpen();}}>
          <PIcon.ArrowUpRight />
        </button>
      </div>

      <p className="org-card__desc">{organization.desc || ORGANIZATION_DESC}</p>

      <div className="org-card__tags">
        {organization.tags.map((t, i) => <Badge key={i}>{t}</Badge>)}
      </div>

      {/* Footer: credibility tier (1–5) */}
      <div className="org-card__foot org-card__foot--tier">
        <span className="org-card__tier">{tier * 20}%</span>
        <span className="org-card__tier-unit">Confidence Level</span>
        <Info size={14} strokeWidth={1.5} className="org-info" />
      </div>
    </article>);

}


export { OrganizationCard };
