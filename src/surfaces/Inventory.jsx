import { useState } from 'react';
import { Toaster } from 'sonner';
import { ShieldCheck } from 'lucide-react';

// Living index of FFG-native components — every real UI component under
// src/components rendered live. Data/ and icons/ modules are excluded (they
// export values, not components). Each entry renders the component with realistic
// props, alongside its surface, source path, CSS class family, and status.
// Route: /inventory.

// ── Dashboard ────────────────────────────────────────────────────────────────
import { FilterChip } from '../components/shared/FilterChip';
import { OrgLogoPlaceholder } from '../components/dashboard/atoms/OrgLogoPlaceholder';
import { RidgeDivider } from '../components/dashboard/atoms/RidgeDivider';
import { Stat as StatApp } from '../components/dashboard/atoms/Stat.app';
import { StatusPill } from '../components/dashboard/atoms/StatusPill';
import { AllocationTreemap } from '../components/dashboard/sections/AllocationTreemap';
import { ImpactChart } from '../components/dashboard/sections/ImpactChart';
import { OrgRow } from '../components/dashboard/sections/OrgRow';
import { OverviewSelector } from '../components/dashboard/sections/OverviewSelector';
import { PageTabs } from '../components/dashboard/sections/PageTabs';
import { UpdatesArea } from '../components/dashboard/sections/UpdatesArea';
import { DynamicAction } from '../components/dashboard/sections/hero/DynamicAction';
import { Stepper } from '../components/dashboard/sections/hero/Stepper';
import { Welcome } from '../components/dashboard/sections/hero/Welcome';

// ── Onboarding ───────────────────────────────────────────────────────────────
import { ProgressBar } from '../components/onboarding/atoms/ProgressBar';
import { FocusBubbles } from '../components/onboarding/atoms/FocusBubbles';
import { StepChrome } from '../components/onboarding/atoms/StepChrome';
import { CausePriorities } from '../components/onboarding/steps/CausePriorities';
import { GoalsStep } from '../components/onboarding/steps/GoalsStep';
import { Landing } from '../components/onboarding/steps/Landing';
import { ScaleStep } from '../components/onboarding/steps/ScaleStep';
import { Submitted } from '../components/onboarding/steps/Submitted';

// ── Organization ──────────────────────────────────────────────────────────────────
import { Badge } from '../components/shared/Badge';
import { KPI } from '../components/organization/atoms/KPI';
import { LogoPlaceholder } from '../components/organization/atoms/LogoPlaceholder';
import { Section } from '../components/organization/atoms/Section';
import { Stat as StatOrganization } from '../components/organization/atoms/Stat.organization';
import { TimelineStep } from '../components/organization/atoms/TimelineStep';
import { ReviewStatusBadge, BADGE_TEXT } from '../components/organization/atoms/ReviewStatusBadge';
import { DotChart } from '../components/organization/charts/DotChart';
import { PIcon } from '../components/organization/icons/PIcon';
import { Accordion } from '../components/organization/modals/Accordion.organization';
import { OrgAccordionItem } from '../components/organization/sections/OrgAccordionItem';
import { Pagination } from '../components/organization/sections/Pagination';
import { OrganizationCard } from '../components/organization/sections/OrganizationCard';
import { SortDropdown } from '../components/shared/SortDropdown';

// ── Shared ───────────────────────────────────────────────────────────────────
import { CauseAllocationTreemap } from '../components/shared/CauseAllocationTreemap';
import { Footer } from '../components/shared/Footer';
import { UpdateCard } from '../components/shared/UpdateCard';
import { UpdatesSection } from '../components/shared/UpdatesSection';
import { TopNav } from '../topnav-auth.jsx';
import { TopNavUnauth } from '../topnav-unauth.jsx';

// Sample data pulled from the same modules production uses — no new fixtures.
import { ORGANIZATIONS } from '../components/organization/data/organizations';
import { statusForName } from '../components/organization/data/statusTaxonomy';
import { CATEGORY_ICONS } from '../components/shared/data/categoryIcons';
import { ORGANIZATION_UPDATE_ITEMS } from '../components/organization/data/updateItems';
import { CAUSE_AREAS } from '../components/onboarding/data/causeAreas';
import { ALLOCATION_DATA } from '../components/dashboard/data/allocationData';
import { UPDATE_ITEMS } from '../components/dashboard/data/updateItems';
import { IMPACT_DATA_YEAR } from '../components/dashboard/data/impactData';
import { ORGS } from '../components/dashboard/data/organizationList';

// ── Derived variant sets ─────────────────────────────────────────────────────
const CATEGORIES = Object.keys(CATEGORY_ICONS);
const STATUS_PILL_VARIANTS = ['idle', 'active', 'resolved', 'failed', 'cancelled', 'reversed'];
const CAUSE_IDS = CAUSE_AREAS.map((c) => c.id);
// One organization per pipeline status (status is hashed from the name).
const ORGANIZATIONS_BY_STATUS = ['Verified', 'Ongoing Review', 'Screening']
  .map((st) => ORGANIZATIONS.find((p) => statusForName(p.name) === st))
  .filter(Boolean);

const SURFACES = ['All', 'Dashboard', 'Onboarding', 'Organization', 'Shared'];

// ── Small layout helpers ─────────────────────────────────────────────────────
// A labeled variant cell: the live component above, a caption below.
function Variant({ label, children, grow }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        flex: grow ? '1 1 100%' : '0 0 auto',
        minWidth: 0,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', width: grow ? '100%' : 'auto' }}>
        {children}
      </div>
      {label && <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{label}</span>}
    </div>
  );
}

// Flex-wrap row of variants.
function Variants({ children, gap = 24, align = 'flex-end' }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap, justifyContent: 'center', alignItems: align, width: '100%' }}>
      {children}
    </div>
  );
}

// Full-width well for components that need real horizontal room.
function Wide({ children, height }) {
  return <div style={{ width: '100%', ...(height ? { height } : null) }}>{children}</div>;
}

// Pagination is controlled — give each preview its own local state.
function PaginationPreview({ initial, total }) {
  const [page, setPage] = useState(initial);
  return <Pagination page={page} totalPages={total} onChange={setPage} />;
}

// Controlled-state wrappers for components whose host owns the value.
function FilterChipPreview() {
  const [value, setValue] = useState('all');
  return (
    <FilterChip
      value={value}
      onChange={setValue}
      ariaLabel="Filter"
      options={[
        { value: 'all', label: 'All orgs' },
        { value: 'mine', label: 'My picks' },
        { value: 'circle', label: 'My circle' },
      ]}
    />
  );
}

function OverviewSelectorPreview() {
  const [scope, setScope] = useState('you');
  const [circles, setCircles] = useState([]);
  return (
    <OverviewSelector
      scope={scope}
      selectedCircles={circles}
      onScopeChange={setScope}
      onCirclesChange={setCircles}
    />
  );
}

function PageTabsPreview() {
  const [value, setValue] = useState('overview');
  return <PageTabs value={value} onChange={setValue} />;
}

function SortDropdownPreview() {
  const [value, setValue] = useState('recommended');
  return <SortDropdown value={value} onChange={setValue} />;
}

function CausePrioritiesPreview() {
  const [order, setOrder] = useState(CAUSE_IDS);
  return <CausePriorities order={order} setOrder={setOrder} />;
}

function GoalsStepPreview() {
  const [selected, setSelected] = useState([]);
  return <GoalsStep causeId="environment" selected={selected} setSelected={setSelected} />;
}

function ScaleStepPreview() {
  const [scales, setScales] = useState([]);
  const [locations, setLocations] = useState([]);
  return (
    <ScaleStep scales={scales} setScales={setScales} locations={locations} setLocations={setLocations} />
  );
}

const noop = () => {};

// ── Registry ─────────────────────────────────────────────────────────────────
// One entry per FFG-native component file. `render` mounts it live.
const REGISTRY = [
  // ── Dashboard ──────────────────────────────────────────────────────────────
  {
    name: 'StatusPill',
    surface: 'Dashboard',
    classFamily: '.status-pill',
    path: 'src/components/dashboard/atoms/StatusPill.jsx',
    status: 'FFG-NATIVE',
    note: 'Design contract — do not alter without a design decision.',
    render: () => (
      <Variants gap={10} align="center">
        {STATUS_PILL_VARIANTS.map((v) => (
          <Variant key={v} label={v}>
            <StatusPill variant={v} label={v[0].toUpperCase() + v.slice(1)} />
          </Variant>
        ))}
      </Variants>
    ),
  },
  {
    name: 'FilterChip',
    surface: 'Shared',
    classFamily: '.chip / .chip--select',
    path: 'src/components/shared/FilterChip.jsx',
    status: 'FFG-NATIVE',
    note: 'Controlled native-select chip (interactive).',
    render: () => <FilterChipPreview />,
  },
  {
    name: 'OrgLogoPlaceholder',
    surface: 'Dashboard',
    classFamily: 'SVG (var(--radius))',
    path: 'src/components/dashboard/atoms/OrgLogoPlaceholder.jsx',
    status: 'FFG-NATIVE',
    note: 'Deterministic palette from the org name.',
    render: () => (
      <Variants gap={16} align="center">
        {['Jesse Tree', 'Boise Rescue', 'Idaho Foodbank', 'Wild Lands'].map((n) => (
          <Variant key={n} label={n}>
            <OrgLogoPlaceholder name={n} size={48} />
          </Variant>
        ))}
      </Variants>
    ),
  },
  {
    name: 'RidgeDivider',
    surface: 'Dashboard',
    classFamily: '--ffg-surface-800/950',
    path: 'src/components/dashboard/atoms/RidgeDivider.jsx',
    status: 'FFG-NATIVE',
    note: 'Decorative ridge band — spans the full width.',
    render: () => (
      <Wide>
        <RidgeDivider />
      </Wide>
    ),
  },
  {
    name: 'Stat (app)',
    surface: 'Dashboard',
    classFamily: '.stat-card / .stat-value',
    path: 'src/components/dashboard/atoms/Stat.app.jsx',
    status: 'FFG-NATIVE',
    note: 'Count-up animates on mount; trend + info variants. The card frame comes from the .stats-row parent (styles.css), so it is wrapped here to render faithfully.',
    render: () => (
      <Wide>
        <div className="stats-row" style={{ marginBottom: 0 }}>
          <StatApp label="Total donated" rawNum={200000} prefix="$" trend="+12%" />
          <StatApp label="Lives impacted" rawNum={1284} trend="+8%" />
          <StatApp label="Confidence" value="100%" />
        </div>
      </Wide>
    ),
  },
  {
    name: 'AllocationTreemap',
    surface: 'Dashboard',
    classFamily: '.org-tm-grid',
    path: 'src/components/dashboard/sections/AllocationTreemap.jsx',
    status: 'FFG-NATIVE',
    note: 'Self-sourced treemap; needs a fixed-height parent.',
    nested: ['CauseAllocationTreemap'],
    render: () => (
      <Wide height={260}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <AllocationTreemap />
        </div>
      </Wide>
    ),
  },
  {
    name: 'org-row',
    surface: 'Dashboard',
    classFamily: '.org-row',
    path: 'src/components/dashboard/sections/OrgRow.jsx',
    status: 'FFG-NATIVE',
    note: 'Single organization row — uses useNavigate, served by the app router.',
    nested: ['OrgLogoPlaceholder'],
    render: () => (
      <Wide>
        <OrgRow org={ORGS[0]} />
      </Wide>
    ),
  },
  {
    name: 'ImpactChart',
    surface: 'Dashboard',
    classFamily: '.chart-wrap',
    path: 'src/components/dashboard/sections/ImpactChart.jsx',
    status: 'FFG-NATIVE',
    note: 'Recharts dollars/outcomes/balance — yearly fixture.',
    render: () => (
      <Wide>
        <ImpactChart data={IMPACT_DATA_YEAR} />
      </Wide>
    ),
  },
  {
    name: 'OverviewSelector',
    surface: 'Dashboard',
    classFamily: '.overview-superselector__*',
    path: 'src/components/dashboard/sections/OverviewSelector.jsx',
    status: 'FFG-NATIVE',
    note: 'Scope + giving-circle selector (controlled, interactive).',
    render: () => <OverviewSelectorPreview />,
  },
  {
    name: 'PageTabs',
    surface: 'Dashboard',
    classFamily: '.page-tabs',
    path: 'src/components/dashboard/sections/PageTabs.jsx',
    status: 'FFG-NATIVE',
    note: 'Overview / areas / history (controlled).',
    render: () => (
      <Wide>
        <PageTabsPreview />
      </Wide>
    ),
  },
  {
    name: 'UpdatesArea',
    surface: 'Dashboard',
    classFamily: '.updates-area',
    path: 'src/components/dashboard/sections/UpdatesArea.jsx',
    status: 'FFG-NATIVE',
    note: 'Single-update banner — four types; each dismissible via the ✕.',
    nested: ['Stepper (hero)'],
    render: () => (
      <div style={{ display: 'grid', gap: 20, width: '100%' }}>
        <Variant label="type: update-status" grow>
          <UpdatesArea
            update={{
              type: 'update-status',
              title: 'Your transfer to Jesse Tree is on its way',
              copy: 'Funds were released and are clearing now.',
              steps: [
                { label: 'Released', date: 'Jun 1', progress: 100, state: 'done' },
                { label: 'Clearing', date: 'Jun 3', progress: 60, state: 'active' },
                { label: 'Delivered', progress: 0, state: 'pending' },
              ],
            }}
          />
        </Variant>
        <Variant label="type: update-action" grow>
          <UpdatesArea
            update={{
              type: 'update-action',
              title: 'Confirm your June allocation',
              copy: 'Your monthly gift is ready to send to your chosen organizations.',
              action: { label: 'Review & confirm', onClick: noop },
            }}
          />
        </Variant>
        <Variant label="type: update-advisory" grow>
          <UpdatesArea
            update={{
              type: 'update-advisory',
              title: 'A organization is completing verification',
              copy: 'Jesse Tree is finishing review — allocations resume once verified.',
            }}
          />
        </Variant>
        <Variant label="type: update-general" grow>
          <UpdatesArea
            update={{
              type: 'update-general',
              title: 'New impact report available',
              copy: 'See where your giving went over the last quarter.',
            }}
          />
        </Variant>
      </div>
    ),
  },
  {
    name: 'DynamicAction (hero)',
    surface: 'Dashboard',
    classFamily: '.alloc-card / .alloc-carousel',
    path: 'src/components/dashboard/sections/hero/DynamicAction.jsx',
    status: 'FFG-NATIVE',
    note: 'Allocation carousel; confirm fires a sonner toast.',
    render: () => (
      <Wide>
        <DynamicAction enabled onAmountConfirm={noop} />
      </Wide>
    ),
  },
  {
    name: 'Stepper (hero)',
    surface: 'Dashboard',
    classFamily: '.stepper',
    path: 'src/components/dashboard/sections/hero/Stepper.jsx',
    status: 'FFG-NATIVE',
    note: 'done / active / pending states across the track.',
    render: () => (
      <Wide>
        <Stepper
          steps={[
            { label: 'Funded', date: 'Jun 1', progress: 100, state: 'done' },
            { label: 'Released', date: 'Jun 3', progress: 100, state: 'done' },
            { label: 'Clearing', date: 'Jun 5', progress: 50, state: 'active' },
            { label: 'Delivered', progress: 0, state: 'pending' },
          ]}
        />
      </Wide>
    ),
  },
  {
    name: 'Welcome (hero)',
    surface: 'Dashboard',
    classFamily: '.hero-text / .accent-link',
    path: 'src/components/dashboard/sections/hero/Welcome.jsx',
    status: 'FFG-NATIVE',
    note: 'Greeting + accent links. "new good" state shows livesCount. The serif (Glare) heading comes from the .hero parent (styles.css), so each state is wrapped in .hero to render faithfully.',
    render: () => (
      <Wide>
        <div style={{ display: 'grid', gap: 24 }}>
          <div className="hero" style={{ paddingBottom: 0 }}>
            <Welcome name="Alex" livesCount={1284} state="new good" />
          </div>
          <div className="hero" style={{ paddingBottom: 0 }}>
            <Welcome name="Alex" state="generic" />
          </div>
        </div>
      </Wide>
    ),
  },

  // ── Onboarding ───────────────────────────────────────────────────────────────
  {
    name: 'ProgressBar',
    surface: 'Onboarding',
    classFamily: '.ob-progress',
    path: 'src/components/onboarding/atoms/ProgressBar.jsx',
    status: 'FFG-NATIVE',
    note: 'Six steps — shown at every position.',
    render: () => (
      <div style={{ display: 'grid', gap: 14, width: '100%' }}>
        {[1, 2, 3, 4, 5, 6].map((step) => (
          <div key={step} style={{ display: 'grid', gridTemplateColumns: '64px 1fr', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>step={step}</span>
            <ProgressBar step={step} />
          </div>
        ))}
      </div>
    ),
  },
  {
    name: 'FocusBubbles',
    surface: 'Onboarding',
    classFamily: '.ob-bubbles',
    path: 'src/components/onboarding/atoms/FocusBubbles.jsx',
    status: 'FFG-NATIVE',
    note: 'Packed-circle SVG, keyed by the top-3 cause ranking.',
    render: () => (
      <Variants gap={32} align="flex-start">
        <Variant label={CAUSE_IDS.slice(0, 3).join(' · ')}>
          <FocusBubbles top3={CAUSE_IDS.slice(0, 3)} />
        </Variant>
        <Variant label={CAUSE_IDS.slice(3, 6).join(' · ')}>
          <FocusBubbles top3={CAUSE_IDS.slice(3, 6)} />
        </Variant>
      </Variants>
    ),
  },
  {
    name: 'StepChrome',
    surface: 'Onboarding',
    classFamily: '.ob-chrome / .ob-header',
    path: 'src/components/onboarding/atoms/StepChrome.jsx',
    status: 'FFG-NATIVE',
    note: 'Header chrome: back, progress, close.',
    nested: ['ProgressBar'],
    render: () => (
      <Wide>
        <StepChrome step={2} onBack={noop} onClose={noop} />
      </Wide>
    ),
  },
  {
    name: 'CausePriorities',
    surface: 'Onboarding',
    classFamily: '.ob-causes / .ob-cause__row',
    path: 'src/components/onboarding/steps/CausePriorities.jsx',
    status: 'FFG-NATIVE',
    note: 'Drag-to-reorder cause ranking (controlled).',
    render: () => (
      <Wide>
        <CausePrioritiesPreview />
      </Wide>
    ),
  },
  {
    name: 'GoalsStep',
    surface: 'Onboarding',
    classFamily: '.ob-goals / .ob-goal',
    path: 'src/components/onboarding/steps/GoalsStep.jsx',
    status: 'FFG-NATIVE',
    note: 'Pick up to 3 goals for a cause (environment shown).',
    render: () => (
      <Wide>
        <GoalsStepPreview />
      </Wide>
    ),
  },
  {
    name: 'Landing',
    surface: 'Onboarding',
    classFamily: '.ob-landing',
    path: 'src/components/onboarding/steps/Landing.jsx',
    status: 'FFG-NATIVE',
    note: 'Onboarding intro screen.',
    render: () => (
      <Wide>
        <Landing onStart={noop} />
      </Wide>
    ),
  },
  {
    name: 'ScaleStep',
    surface: 'Onboarding',
    classFamily: '.ob-scales / .ob-loc-search',
    path: 'src/components/onboarding/steps/ScaleStep.jsx',
    status: 'FFG-NATIVE',
    note: 'Scale picker; location search appears once a scale is chosen.',
    render: () => (
      <Wide>
        <ScaleStepPreview />
      </Wide>
    ),
  },
  {
    name: 'Submitted',
    surface: 'Onboarding',
    classFamily: '.ob-done',
    path: 'src/components/onboarding/steps/Submitted.jsx',
    status: 'FFG-NATIVE',
    note: 'Final confirmation screen.',
    render: () => (
      <Wide>
        <Submitted />
      </Wide>
    ),
  },

  // ── Organization ──────────────────────────────────────────────────────────────────
  {
    name: 'Badge',
    surface: 'Shared',
    classFamily: '.org-badge / .impact-badge',
    path: 'src/components/shared/Badge.jsx',
    status: 'FFG-NATIVE',
    note: 'Two paths only: impact-badge (icon, per category) and the plain org-badge / org-badge--solid pill. Any other text routes to org-badge — the label varies, the variant does not.',
    render: () => (
      <div style={{ display: 'grid', gap: 20, width: '100%' }}>
        <Variants gap={10} align="center">
          {CATEGORIES.map((cat) => (
            <Badge key={cat}>{cat}</Badge>
          ))}
        </Variants>
        <Variants gap={16} align="center">
          <Variant label="org-badge">
            <Badge>Featured</Badge>
          </Variant>
          <Variant label="org-badge--solid">
            <Badge solid>Featured</Badge>
          </Variant>
        </Variants>
      </div>
    ),
  },
  {
    name: 'ReviewStatusBadge',
    surface: 'Organization',
    classFamily: '.impact-badge / .impact-badge--verified',
    path: 'src/components/organization/atoms/ReviewStatusBadge.jsx',
    status: 'FFG-NATIVE',
    note: 'Vetting-pipeline pill — one icon per status. The "backed by" pill (last) is a sibling inline span in OrganizationDetail that shares BADGE_TEXT, not part of this component.',
    render: () => (
      <Variants gap={12} align="center">
        {['Verified', 'Ongoing Review', 'Screening'].map((status) => (
          <Variant key={status} label={status}>
            <ReviewStatusBadge status={status} />
          </Variant>
        ))}
        <Variant label="Backed by (inline)">
          <span className="impact-badge">
            <ShieldCheck size={14} color="var(--ffg-muted)" /> <span style={BADGE_TEXT}>Backed by 112 Builders</span>
          </span>
        </Variant>
      </Variants>
    ),
  },
  {
    name: 'KPI',
    surface: 'Organization',
    classFamily: '.org-kpi',
    path: 'src/components/organization/atoms/KPI.jsx',
    status: 'FFG-NATIVE',
    render: () => (
      <Variants gap={24} align="flex-start">
        <KPI label="Cost per outcome" value="$142" />
        <KPI label="Families served" value="1,284" />
        <KPI label="Confidence level" value="100%" />
      </Variants>
    ),
  },
  {
    name: 'LogoPlaceholder',
    surface: 'Organization',
    classFamily: '.org-logo',
    path: 'src/components/organization/atoms/LogoPlaceholder.jsx',
    status: 'FFG-NATIVE',
    note: 'Initials + deterministic palette from the organization name.',
    render: () => (
      <Variants gap={16} align="center">
        {ORGANIZATIONS.slice(0, 5).map((p) => (
          <Variant key={p.name} label={p.name}>
            <LogoPlaceholder name={p.name} size={56} />
          </Variant>
        ))}
      </Variants>
    ),
  },
  {
    name: 'Section',
    surface: 'Organization',
    classFamily: '.org-sec',
    path: 'src/components/organization/atoms/Section.jsx',
    status: 'FFG-NATIVE',
    note: 'Titled content block (fullWidth used here).',
    render: () => (
      <Wide>
        <Section title="About this organization" body="A short description of the organization and its work." fullWidth>
          <p style={{ margin: 0 }}>Body content goes here.</p>
        </Section>
      </Wide>
    ),
  },
  {
    name: 'Stat (organization)',
    surface: 'Organization',
    classFamily: '.org-stat / .org-info',
    path: 'src/components/organization/atoms/Stat.organization.jsx',
    status: 'FFG-NATIVE',
    render: () => (
      <Variants gap={24} align="flex-start">
        <StatOrganization label="Cost per outcome" value="$142" />
        <StatOrganization label="Outcomes / yr" value="3,400" />
      </Variants>
    ),
  },
  {
    name: 'TimelineStep',
    surface: 'Organization',
    classFamily: '.org-tl-card (.org-tl-cards)',
    path: 'src/components/organization/atoms/TimelineStep.jsx',
    status: 'FFG-NATIVE',
    note: 'The full four-step intervention sequence.',
    render: () => (
      <div className="org-tl-cards" style={{ maxWidth: 560 }}>
        <TimelineStep n="01" tag="Funding" time="1–2 weeks" />
        <TimelineStep n="02" tag="Intervention" time="6–8 weeks" />
        <TimelineStep n="03" tag="Outputs" time="6–8 Months" />
        <TimelineStep n="04" tag="Outcomes" time="6–8 Months" />
      </div>
    ),
  },
  {
    name: 'DotChart',
    surface: 'Organization',
    classFamily: '.org-label-row / .org-info',
    path: 'src/components/organization/charts/DotChart.jsx',
    status: 'FFG-NATIVE',
    note: 'Log-scaled people-reached dot field.',
    render: () => (
      <Wide>
        <DotChart peopleReached={1284} depth={1.8} />
      </Wide>
    ),
  },
  {
    name: 'Accordion',
    surface: 'Organization',
    classFamily: '.org-acc',
    path: 'src/components/organization/modals/Accordion.organization.jsx',
    status: 'FFG-NATIVE',
    note: 'Click-toggle disclosure; default-open and variant shown.',
    render: () => (
      <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 560 }}>
        <Accordion title="How funds are used" defaultOpen>
          <p style={{ margin: 0 }}>Every dollar is tracked to a verified outcome.</p>
        </Accordion>
        <Accordion title="Methodology" variant="muted" />
      </div>
    ),
  },
  {
    name: 'org-acc',
    surface: 'Organization',
    classFamily: '.org-acc-list / .org-acc',
    path: 'src/components/organization/sections/OrgAccordionItem.jsx',
    status: 'FFG-NATIVE',
    note: 'Boxed assessment accordion — composed from Accordion in the org detail.',
    nested: ['Accordion'],
    render: () => (
      <div className="org-acc-list org-acc-list--boxed" style={{ width: '100%', maxWidth: 560 }}>
        <OrgAccordionItem icon={<PIcon.Target />} title="Problem Quality" defaultOpen>
          <p className="org-acc__copy" style={{ color: 'var(--ffg-muted)', fontSize: '16px' }}>
            Addresses a clearly defined, high-impact problem with strong evidence of need.
          </p>
        </OrgAccordionItem>
        <OrgAccordionItem icon={<PIcon.Users />} title="Team & Leadership">
          <p className="org-acc__copy" style={{ color: 'var(--ffg-muted)', fontSize: '16px' }}>
            Deep domain expertise, lived experience, and a track record of sound decision-making.
          </p>
        </OrgAccordionItem>
      </div>
    ),
  },
  {
    name: 'Pagination',
    surface: 'Organization',
    classFamily: '@ffg/pagination',
    path: 'src/components/organization/sections/Pagination.jsx',
    status: 'SHADCN',
    note: 'Controlled wrapper over @ffg/pagination; token compaction at the start, middle, and end of a long range.',
    render: () => (
      <div style={{ display: 'grid', gap: 18, width: '100%', justifyItems: 'center' }}>
        <Variant label="page 1 of 8">
          <PaginationPreview initial={1} total={8} />
        </Variant>
        <Variant label="page 4 of 8">
          <PaginationPreview initial={4} total={8} />
        </Variant>
        <Variant label="page 8 of 8">
          <PaginationPreview initial={8} total={8} />
        </Variant>
      </div>
    ),
  },
  {
    name: 'OrganizationCard',
    surface: 'Organization',
    classFamily: '.org-card',
    path: 'src/components/organization/sections/OrganizationCard.jsx',
    status: 'FFG-NATIVE',
    note: 'One card per pipeline status — Verified, Ongoing Review, Screening.',
    nested: ['LogoPlaceholder', 'Badge'],
    render: () => (
      <Variants gap={20} align="flex-start">
        {ORGANIZATIONS_BY_STATUS.map((p) => (
          <Variant key={p.name} label={statusForName(p.name)}>
            <div style={{ width: 280 }}>
              <OrganizationCard organization={p} onOpen={() => {}} />
            </div>
          </Variant>
        ))}
      </Variants>
    ),
  },
  {
    name: 'SortDropdown',
    surface: 'Shared',
    classFamily: '.org-sort-native',
    path: 'src/components/shared/SortDropdown.jsx',
    status: 'FFG-NATIVE',
    note: 'Native sort select (controlled).',
    render: () => <SortDropdownPreview />,
  },

  // ── Shared ───────────────────────────────────────────────────────────────────
  {
    name: 'CauseAllocationTreemap',
    surface: 'Shared',
    classFamily: '.org-tm-rc / .org-tm__*',
    path: 'src/components/shared/CauseAllocationTreemap.jsx',
    status: 'FFG-NATIVE',
    note: 'Recharts treemap shared by Dashboard + Organization; needs a height.',
    render: () => (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: 240 }}>
        <CauseAllocationTreemap data={ALLOCATION_DATA} />
      </div>
    ),
  },
  {
    name: 'Footer',
    surface: 'Shared',
    classFamily: '.app-footer',
    path: 'src/components/shared/Footer.jsx',
    status: 'FFG-NATIVE',
    note: 'App footer with inline-SVG wordmark.',
    render: () => (
      <Wide>
        <Footer />
      </Wide>
    ),
  },
  {
    name: 'UpdateCard',
    surface: 'Shared',
    classFamily: '.update-card',
    path: 'src/components/shared/UpdateCard.jsx',
    status: 'FFG-NATIVE',
    note: 'Image variants (every sample item) plus the striped placeholder.',
    render: () => (
      <Variants gap={20} align="flex-start">
        {UPDATE_ITEMS.map((item) => (
          <div key={item.title} style={{ width: 280 }}>
            <UpdateCard
              title={item.title}
              copy={item.body}
              organization={item.organization}
              tag={item.tag}
              img={item.img}
              alt={item.alt}
            />
          </div>
        ))}
        <Variant label="no img → placeholder">
          <div style={{ width: 280 }}>
            <UpdateCard
              title="120 families kept in their homes"
              copy="Emergency rental assistance reached a record number of households facing eviction this quarter."
              organization="Jesse Tree"
              tag="Community"
            />
          </div>
        </Variant>
      </Variants>
    ),
  },
  {
    name: 'UpdatesSection',
    surface: 'Shared',
    classFamily: '.updates-section / .updates-grid',
    path: 'src/components/shared/UpdatesSection.jsx',
    status: 'FFG-NATIVE',
    note: 'Grid of UpdateCards with a heading and see-more.',
    nested: ['UpdateCard'],
    render: () => (
      <Wide>
        <UpdatesSection items={ORGANIZATION_UPDATE_ITEMS} title="Recent updates" />
      </Wide>
    ),
  },
  {
    name: 'TopNav',
    surface: 'Shared',
    classFamily: '.nav / .nav-links / .nav-dropdown',
    path: 'src/topnav-auth.jsx',
    status: 'FFG-NATIVE',
    note: 'Authenticated top nav: wordmark, primary links, notifications, avatar menu. Mounted by AuthLayout.',
    render: () => (
      <Wide>
        <TopNav padded={false} />
      </Wide>
    ),
  },
  {
    name: 'TopNavUnauth',
    surface: 'Shared',
    classFamily: '.nav / .nav-cta',
    path: 'src/topnav-unauth.jsx',
    status: 'FFG-NATIVE',
    note: 'Unauthenticated top nav: same wordmark + links, swaps avatar for Log in / Get started CTAs. Mounted by UnauthLayout.',
    render: () => (
      <Wide>
        <TopNavUnauth padded={false} />
      </Wide>
    ),
  },
];

const SURFACE_COLORS = {
  Dashboard: '#15315A',
  Onboarding: '#5B7A3A',
  Organization: '#8A5A2B',
  Shared: '#6B5B95',
};

function MetaRow({ label, children }) {
  return (
    <div style={{ display: 'flex', gap: 8, fontSize: 13, lineHeight: 1.5 }}>
      <span style={{ color: 'var(--muted-foreground)', minWidth: 88 }}>{label}</span>
      <span style={{ minWidth: 0, wordBreak: 'break-word' }}>{children}</span>
    </div>
  );
}

export default function Inventory() {
  const [filter, setFilter] = useState('All');

  const visible = REGISTRY.filter((c) => filter === 'All' || c.surface === filter);

  return (
    <div
      data-theme="light"
      style={{ minHeight: '100vh', padding: '48px', background: 'var(--background)', color: 'var(--foreground)' }}
    >
      {/* Mounted once so DynamicAction / Hero toasts have a target. */}
      <Toaster position="bottom-right" />
      <div style={{ maxWidth: 980, margin: '0 auto', display: 'grid', gap: 32 }}>
        <header style={{ display: 'grid', gap: 6 }}>
          <h1 style={{ fontFamily: 'var(--font-serif, serif)', fontWeight: 300, fontSize: 32, margin: 0 }}>
            FFG · component inventory
          </h1>
          <p style={{ color: 'var(--muted-foreground)', margin: 0 }}>
            Every FFG-native component under <code>src/components</code>, rendered live.{' '}
            <code>data/</code> and <code>icons/</code> modules are omitted.
          </p>
        </header>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SURFACES.map((s) => {
            const active = filter === s;
            const count = s === 'All' ? REGISTRY.length : REGISTRY.filter((c) => c.surface === s).length;
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 999,
                  fontSize: 13,
                  cursor: 'pointer',
                  border: '1px solid var(--border)',
                  background: active ? 'var(--foreground)' : 'transparent',
                  color: active ? 'var(--background)' : 'var(--foreground)',
                }}
              >
                {s} <span style={{ opacity: 0.6 }}>{count}</span>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'grid', gap: 24 }}>
          {visible.map((c) => (
            <section
              key={c.name}
              style={{
                border: '1px solid var(--border)',
                borderRadius: 12,
                overflow: 'hidden',
                background: 'var(--card, #fff)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '14px 18px',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <h2 style={{ fontSize: 18, margin: 0 }}>{c.name}</h2>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: 0.4,
                    padding: '3px 9px',
                    borderRadius: 999,
                    color: '#fff',
                    background: SURFACE_COLORS[c.surface] || '#555',
                  }}
                >
                  {c.surface}
                </span>
              </div>

              {/* Live preview well */}
              <div
                style={{
                  padding: 24,
                  background:
                    'repeating-conic-gradient(var(--muted, #f1efe9) 0% 25%, transparent 0% 50%) 0 / 16px 16px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 120,
                }}
              >
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>{c.render()}</div>
              </div>

              {/* Metadata strip */}
              <div style={{ display: 'grid', gap: 4, padding: '14px 18px', borderTop: '1px solid var(--border)' }}>
                <MetaRow label="Class">
                  <code>{c.classFamily}</code>
                </MetaRow>
                <MetaRow label="Source">
                  <code>{c.path}</code>
                </MetaRow>
                <MetaRow label="Status">
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 999,
                      border: '1px solid var(--border)',
                      color: 'var(--muted-foreground)',
                    }}
                  >
                    {c.status}
                  </span>
                </MetaRow>
                <MetaRow label="Nests">
                  {c.nested && c.nested.length ? (
                    <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 6 }}>
                      {c.nested.map((n) => (
                        <span
                          key={n}
                          style={{
                            fontSize: 11,
                            padding: '2px 8px',
                            borderRadius: 999,
                            border: '1px solid var(--border)',
                            background: 'var(--muted, #f1efe9)',
                            color: 'var(--foreground)',
                          }}
                        >
                          {n}
                        </span>
                      ))}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--muted-foreground)' }}>—</span>
                  )}
                </MetaRow>
                {c.note && <MetaRow label="Note">{c.note}</MetaRow>}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
