import React from 'react';
import { Accordion } from '../modals/Accordion.organization';

// A single boxed assessment accordion — the `.ob-cause-card` shell around an
// organization Accordion. Used in the OrganizationDetail assessment list and
// showcased standalone in the component inventory.
function OrgAccordionItem({ icon, title, defaultOpen, children }) {
  return (
    <div className="ob-cause-card">
      <Accordion icon={icon} title={title} defaultOpen={defaultOpen}>
        {children}
      </Accordion>
    </div>
  );
}

export { OrgAccordionItem };
