import React from 'react';
import { Ic } from '../icons/Ic';

/* ── A single cause row — drag handle, name, icon, expandable description ──────
   Presentational: the parent owns ordering, drag state, and open state and
   passes them in. Used by the CausePriorities step and the component inventory. */
function ObCause({ cause, rank, isTop, isDragging, isOver, isOpen, onToggle, dragProps }) {
  const Icon = cause.icon;
  return (
    <div className="ob-cause" role="listitem">
      <div className="ob-cause__rank">{isTop ? rank : ''}</div>
      <div
        className={
          'ob-cause__row' +
          (isTop ? ' is-top' : '') +
          (isDragging ? ' is-dragging' : '') +
          (isOver ? ' is-over' : '') +
          (isOpen ? ' is-open' : '')
        }
        draggable
        {...dragProps}
        aria-label={`${cause.name}, rank ${rank}`}>

        <span className="ob-cause__handle"><Ic.Grip /></span>
        <span className="ob-cause__name" style={{ fontSize: '16px', fontWeight: '300' }}>{cause.name}</span>
        <span className="ob-cause__icon"><Icon /></span>
        <button
          type="button"
          className="ob-cause__caret"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-label="Toggle description">
          <Ic.Caret width="24" height="24" />
        </button>
        <div className="ob-cause__desc-wrap">
          <div className="ob-cause__desc-inner">
            <p className="ob-cause__desc">{cause.description}</p>
          </div>
        </div>
      </div>
    </div>);

}

export { ObCause };
