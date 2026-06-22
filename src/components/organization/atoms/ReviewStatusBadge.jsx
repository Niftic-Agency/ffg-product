import { BadgeCheck, Clock, Search } from 'lucide-react';

// Review-status badge — reflects the org's place in FFG's vetting pipeline
// (statusTaxonomy). Verified gets a special image fill; the other states show
// their label with a matching icon.
// Text inside the status / "backed by" pills matches the impact (category) badges:
// 14px, weight 300, muted.
const BADGE_TEXT = { fontSize: "14px", fontWeight: 300, color: "var(--ffg-muted)" };

function ReviewStatusBadge({ status }) {
  if (status === "Verified")
    return (
      <span className="impact-badge impact-badge--verified">
        <BadgeCheck size={14} color="var(--ffg-surface-950)" /> <span style={{ ...BADGE_TEXT, color: "var(--ffg-surface-950)" }}>Verified</span>
      </span>);

  const Icon = status === "Screening" ? Clock : Search;
  return (
    <span className="impact-badge">
      <Icon size={14} color="var(--ffg-muted)" /> <span style={BADGE_TEXT}>{status}</span>
    </span>);

}

export { ReviewStatusBadge, BADGE_TEXT };
