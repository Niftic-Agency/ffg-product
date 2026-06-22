import { useState } from 'react';
import { BadgeCheck, Check, Plus, ShieldCheck } from 'lucide-react';
import { PIcon } from '../icons/PIcon';
import { ORGANIZATION_DESC } from '../data/organizations';
import { statusForName } from '../data/statusTaxonomy';
import { CauseAllocationTreemap } from '../../shared/CauseAllocationTreemap';
import { Badge } from '../../shared/Badge';
import { LogoPlaceholder } from '../atoms/LogoPlaceholder';
import { KPI } from '../atoms/KPI';
import { Section } from '../atoms/Section';
import { Stat } from '../atoms/Stat.organization';
import { TimelineStep } from '../atoms/TimelineStep';
import { ReviewStatusBadge, BADGE_TEXT } from '../atoms/ReviewStatusBadge';
import { UpdatesSection } from '../../shared/UpdatesSection';
import { ORGANIZATION_UPDATE_ITEMS } from '../data/updateItems';
import { Accordion } from '../modals/Accordion.organization';
import { DotChart } from '../charts/DotChart';


// ═══════════════════════════════════════════════════════════════════════════
// INDIVIDUAL ORGANIZATION PAGE
// ═══════════════════════════════════════════════════════════════════════════
function OrganizationDetail({ organization, onBack }) {
  // Cause Allocation treemap mirrors this org's impact-area badges
  // (organization.tags); the primary tag takes the larger share so the allocation
  // reads as primary/secondary.
  const TAG_SPLIT = { 1: [100], 2: [60, 40], 3: [50, 30, 20] };
  const split = TAG_SPLIT[organization.tags.length] || organization.tags.map(() => Math.round(100 / organization.tags.length));
  const allocData = organization.tags.map((name, i) => ({ name, size: split[i] }));
  const status = statusForName(organization.name);
  const isVerified = status === "Verified";
  const [added, setAdded] = useState(false);
  return (
    <div className="org-detail">
      {/* Top bar — Back link + right-side badges */}
      <div className="org-topbar">
        <button className="org-back" onClick={onBack} style={{ fontSize: "14px" }}>
          <PIcon.ArrowLeft />
          All Opportunities
        </button>
      </div>

      {/* Hero — left content column (logo + name, meta, desc, tags, KPIs) + right CTA column */}
      <section className="org-hero">
        <div className="org-hero__main">
        {/* Logo + name + meta */}
        <div className="org-hero__id">
          <LogoPlaceholder size={84} name={organization.name} />
          <div className="org-hero__id-text">
            <h1 style={{ fontFamily: "\"PP Fragment Sans\", sans-serif", fontWeight: 400, fontStyle: "normal", fontSize: "48px", lineHeight: 1.05, letterSpacing: "-0.01em", margin: 0, display: "inline-flex", alignItems: "center", gap: "10px" }}>
              {organization.name}
              {isVerified &&
              <BadgeCheck size={40} fill="var(--ffg-surface-950)" stroke="#FFFCF6" style={{ flexShrink: 0 }} />}
            </h1>
            <div className="org-side__meta">
              <span className="org-side__meta-item" style={{ fontSize: "13px", color: "var(--ffg-muted)", fontWeight: 300 }}>
                EIN: 12-3456789
              </span>
              <span className="org-side__meta-dot" />
              <a className="org-side__meta-item org-side__meta-item--link" href="#">
                <PIcon.Link />
                Website
              </a>
            </div>
          </div>
        </div>

        {/* Description — full width */}
        <p className="org-side__desc" style={{ marginTop: "24px" }}>{ORGANIZATION_DESC}</p>

        {/* Status, backed-by, then impact-area tags */}
        <div className="org-side__tags" style={{ marginTop: "24px" }}>
          <ReviewStatusBadge status={status} />
          <span className="impact-badge"><ShieldCheck size={14} color="var(--ffg-muted)" /> <span style={BADGE_TEXT}>Backed by 112 Builders</span></span>
          {organization.tags.map((t, i) => <Badge key={i}>{t}</Badge>)}
        </div>
        </div>

        {/* KPIs row — 3 items (left column, second grid row) */}
        <div className="org-hero__kpis">
          <KPI label="Yearly People Reached" value="142" />
          <KPI label="Cost Per Outcome" value="$1,600" />
          <KPI label="Stage" value="500K–2M" />
        </div>

        {/* CTA — right column, top-aligned with the KPI labels */}
        <div className="org-hero__aside">
          <button
            className={`hero-btn hero-btn--lg ${added ? "hero-btn--solid" : "hero-btn--ghost"}`}
            onClick={() => setAdded((a) => !a)}
          >
            {added
              ? <><Check size={18} /> Added to portfolio</>
              : <><Plus size={18} /> Add to portfolio</>}
          </button>
        </div>
      </section>

      {/* Two-column row: "Why we chose" accordions on the left, photo + location on the right */}
      <div className="org-photo-loc">
        <div className="org-why">
        <Section title="Why we chose this organization" fullWidth aside={
          <div className="org-reviewed-by">
            <div className="org-reviewed-by__badge" aria-hidden="true" />
            <span className="org-reviewed-by__pipe" aria-hidden="true" />
            <div className="org-reviewed-by__text">
              <span className="org-reviewed-by__label">Reviewed by</span>
              <span className="org-reviewed-by__name">FFG Impact Team</span>
            </div>
          </div>
        }>
          <div className="org-acc-list org-acc-list--boxed">
            <div className="ob-cause-card">
              <Accordion icon={<PIcon.Target />} title="Problem Quality" defaultOpen>
                <p className="org-acc__copy" style={{ color: "var(--ffg-muted)", fontSize: "16px" }}>
{organization.name} addresses a clearly defined, high-impact problem with strong evidence of need. The scope is focused enough to drive measurable change while meaningful enough to matter at scale.
                </p>
              </Accordion>
            </div>
            <div className="ob-cause-card">
              <Accordion icon={<PIcon.Users />} title="Team & Leadership">
                <p className="org-acc__copy" style={{ color: "var(--ffg-muted)", fontSize: "16px" }}>
The leadership team brings deep domain expertise, lived experience, and a track record of sound decision-making. We trust them to operate with integrity, humility, and community connection.
                </p>
              </Accordion>
            </div>
            <div className="ob-cause-card">
              <Accordion icon={<PIcon.BarChart />} title="Track Record & Approach">
                <p className="org-acc__copy" style={{ color: "var(--ffg-muted)", fontSize: "16px" }}>
{organization.name} has demonstrated consistent, reproducible results over time. Their methodology is grounded in evidence and adapted thoughtfully to the communities they serve.
                </p>
              </Accordion>
            </div>
            <div className="ob-cause-card">
              <Accordion icon={<PIcon.TrendingUp />} title="Growth Potential & Fit">
                <p className="org-acc__copy" style={{ color: "var(--ffg-muted)", fontSize: "16px" }}>
This organization is positioned for responsible growth. Their model aligns well with Factory for Good's strategic focus areas and has clear pathways to expand reach without sacrificing quality.
                </p>
              </Accordion>
            </div>
            <div className="ob-cause-card">
              <Accordion icon={<PIcon.Coin />} title="Cost Effectiveness & Leverage">
                <p className="org-acc__copy" style={{ color: "var(--ffg-muted)", fontSize: "16px" }}>
Dollars directed to {organization.name} go far. Their cost-per-outcome benchmarks favorably against peers, and their model creates downstream leverage — multiplying impact beyond the direct investment.
                </p>
              </Accordion>
            </div>
          </div>
        </Section>
        </div>

        {/* Right column — photo stacked above the location box */}
        <div className="org-photo-loc__side">
          <div className="org-photo">
            <img
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80&auto=format&fit=crop"
              alt={`${organization.name} — organization photo`}
              className="org-photo__img"
            />
          </div>
          <div className="org-photo-loc__info">
            <div className="org-loc-box">
              <span className="org-hero__detail-label">Location (1)</span>
              <span className="org-hero__detail-sub">Places where this organization intervenes</span>
              <span className="org-hero__detail-value">{organization.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="org-why">
        <Section title="Performance Metrics" fullWidth>
          <div className="org-metrics-grid">
            {/* Left column — POI slider + charts stacked */}
            <div className="org-metrics-left">
              {/* Point of Intervention slider */}
              <div className="org-poi">
                <div className="org-label-row">
                  <span className="org-label">Point of Intervention</span>
                  <PIcon.Info className="org-info" />
                </div>
                <p className="org-sub" style={{ fontSize: "14px" }}>
                  Our intervention keeps individuals and families on stable footing.
                </p>
                <div className="org-poi__track">
                  <div className="org-poi__fill" style={{ width: "50%" }} />
                  <div className="org-poi__dot" style={{ left: "50%" }} />
                </div>
                <div className="org-poi__labels">
                  <span style={{ fontSize: "14px" }}>Suffering</span>
                  <span style={{ fontSize: "14px" }}>Stable</span>
                  <span style={{ fontSize: "14px" }}>Flourishing</span>
                </div>
              </div>

              {/* Dot scatter chart */}
              <DotChart peopleReached={1000} depth={2} />
            </div>

            {/* Right column — Cause Allocation treemap */}
            <div className="org-metrics-right">
              <div className="org-alloc">
                <div className="org-label-row">
                  <span className="org-label">Cause Allocation</span>
                  <PIcon.Info className="org-info" />
                </div>
                <CauseAllocationTreemap data={allocData} />
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* How Your Impact Works — full width */}
      <div className="org-why">
        <Section title="How Your Impact Works" fullWidth>
          <div className="org-tl-cards">
            <TimelineStep n="01" tag="Funding" time="1–2 weeks" />
            <TimelineStep n="02" tag="Intervention" time="6–8 weeks" />
            <TimelineStep n="03" tag="Outputs" time="6–8 Months" />
            <TimelineStep n="04" tag="Outcomes" time="6–8 Months" />
          </div>
        </Section>
      </div>

      <main className="org-main">
        {/* Proven Outcomes */}
        <Section title="Proven Outcomes">
          <div className="org-results">
            <Stat label="Evictions avoided" value="1,345" />
            <Stat label="People supported" value="3,442" />
            <Stat label="Homes built" value="8,142" />
          </div>
        </Section>
      </main>

      {/* Updates from your organizations and community */}
      <UpdatesSection items={ORGANIZATION_UPDATE_ITEMS.map((u) => ({ ...u, organization: organization.name }))} />
    </div>);

}


export { OrganizationDetail };
