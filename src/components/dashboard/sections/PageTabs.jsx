
/* ====== Page-level tabs ====== */
function PageTabs({ value, onChange }) {
  const tabs = [
  { id: "overview", label: "Overview" },
  { id: "areas", label: "Your impact portfolio" },
  { id: "history", label: "Transactions" }];

  return (
    <div className="page-tabs-wrap" style={{ margin: "-16px 0px 48px" }}>
      <div className="page-tabs" id="impact-tabs" role="tablist" aria-label="Impact view">
        {tabs.map((t) =>
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={value === t.id}
          className={"page-tabs__tab" + (value === t.id ? " is-active" : "")}
          onClick={() => onChange(t.id)} style={{ fontSize: "16px", fontWeight: "300" }}>

            {t.label}
          </button>
        )}
      </div>
      {/* Below the sm breakpoint the tablist collapses into this dropdown. */}
      <select
        className="page-tabs-select"
        aria-label="Impact view"
        value={value}
        onChange={(e) => onChange(e.target.value)}>
        {tabs.map((t) =>
        <option key={t.id} value={t.id}>{t.label}</option>
        )}
      </select>
    </div>);

}


export { PageTabs };
