import React, { useMemo } from 'react';
import {
  Pagination as UIPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

// Controlled wrapper over the themed @ffg/pagination primitives. Keeps the
// { page, totalPages, onChange } API used across the app; the library links are
// navigational by default, so each one preventDefaults and calls onChange.
function Pagination({ page, totalPages, onChange }) {
  // Build a compact list of page tokens: always show first, last, current and
  // neighbours; insert ellipses for gaps. Works for any number of pages.
  const tokens = useMemo(() => {
    const out = [];
    const add = (v) => {if (out[out.length - 1] !== v) out.push(v);};
    const window = 1; // neighbours on each side of current

    add(1);
    if (page - window > 2) add("…");
    for (let i = Math.max(2, page - window); i <= Math.min(totalPages - 1, page + window); i++) add(i);
    if (page + window < totalPages - 1) add("…");
    if (totalPages > 1) add(totalPages);
    return out;
  }, [page, totalPages]);

  // Disabled links have no native disabled state — block the click and dim them.
  const navTo = (target, blocked) => (e) => {
    e.preventDefault();
    if (!blocked) onChange(target);
  };
  const disabledProps = (blocked) =>
    blocked ? { 'aria-disabled': true, tabIndex: -1, className: 'pointer-events-none opacity-50' } : {};

  return (
    <UIPagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={navTo(page - 1, page <= 1)}
            {...disabledProps(page <= 1)}
          />
        </PaginationItem>
        {tokens.map((t, i) =>
          t === "…" ?
          <PaginationItem key={"e" + i}>
            <PaginationEllipsis />
          </PaginationItem> :
          <PaginationItem key={t}>
            <PaginationLink
              href="#"
              isActive={t === page}
              onClick={navTo(t, false)}>
              {t}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={navTo(page + 1, page >= totalPages)}
            {...disabledProps(page >= totalPages)}
          />
        </PaginationItem>
      </PaginationContent>
    </UIPagination>);

}


export { Pagination };
