import React, { useState } from 'react';
import { PIcon } from '../icons/PIcon';

function Accordion({ icon, title, children, defaultOpen, variant }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className={"org-acc" + (variant ? " org-acc--" + variant : "") + (open ? " is-open" : "")}>
      <button className="org-acc__head" onClick={() => setOpen(!open)}>
        <span className="org-acc__title" style={{ fontSize: "16px", fontWeight: "400" }}>
          {icon && <span className="org-acc__icon">{icon}</span>}
          {title}
        </span>
        <span className="org-acc__caret org-acc__caret--anim">
          <PIcon.Chevron />
        </span>
      </button>
      <div className="org-acc__body" aria-hidden={!open}>
        <div className="org-acc__body-inner" style={{ color: "var(--ffg-muted)" }}>
          {children ||
            <p className="org-acc__copy" style={{ color: "var(--ffg-muted)", fontSize: "16px" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
              ut labore et dolore magna aliqua.
            </p>
          }
        </div>
      </div>
    </div>);
}


export { Accordion };
