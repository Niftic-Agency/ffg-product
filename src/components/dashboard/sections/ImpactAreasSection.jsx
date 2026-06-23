import React, { useState, useEffect } from 'react';
import { Icon } from '../icons/Icon';
import { STRATEGIES, IMPACT_AREAS } from '../data/orgTaxonomy';
import { ORGS } from '../data/organizationList';
import { OrgRow } from './OrgRow';
import { Pagination } from '../../organization/sections/Pagination';

function ImpactAreasSection({ cohortSize = 122 }) {
  const [strategy, setStrategy] = useState("all");
  const [area, setArea] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 5;

  const filtered = ORGS.filter((o) =>
  (strategy === "all" || o.strategy === strategy) && (
  area === "all" || o.tags.includes(area))
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  // Reset to page 1 whenever filters change.
  useEffect(() => {setPage(1);}, [strategy, area]);

  return (
    <section className="section-block" aria-label="Your impact areas">
      <div className="orgs-toolbar">
        <div className="orgs-toolbar__left">
          <div className="orgs-filter">
            <select
              aria-label="Filter by strategy"
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}>

              <option value="all">All Strategies</option>
              {STRATEGIES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <Icon.Caret />
          </div>
          <div className="orgs-filter">
            <select
              aria-label="Filter by impact area"
              value={area}
              onChange={(e) => setArea(e.target.value)}>

              <option value="all">All Impact Areas</option>
              {IMPACT_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
            <Icon.Caret />
          </div>
        </div>
        <div className="orgs-toolbar__right">
          <label className="orgs-search">
            <Icon.Search />
            <input type="text" placeholder="Search" aria-label="Search organizations" />
          </label>
          <button type="button" className="orgs-filter-btn">
            <Icon.Sliders />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="orgs-list">
        {pageRows.length === 0 ?
        <div className="empty-state">
            <p className="empty-state__copy">
              No organizations match the selected filters.
            </p>
          </div> :

        pageRows.map((o, i) => <OrgRow key={i} org={o} />)
        }
      </div>

      {filtered.length > 0 &&
      <div className="orgs-pagination">
          <div className="orgs-pagination__info">
            Showing {(safePage - 1) * perPage + 1}–{Math.min(safePage * perPage, filtered.length)} of {filtered.length}
          </div>
          <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
        </div>
      }
    </section>);

}


export { ImpactAreasSection };
