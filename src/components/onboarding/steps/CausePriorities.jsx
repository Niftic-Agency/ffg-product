import React, { useState } from 'react';
import { CAUSE_BY_ID } from '../data/causeAreas';
import { ObCause } from '../atoms/ObCause';

/* ── Step 1: cause priorities, drag to reorder ──────── */
function CausePriorities({ order, setOrder }) {
  const [dragId, setDragId] = useState(null);
  const [overId, setOverId] = useState(null);
  const [openId, setOpenId] = useState(null);

  const onDragStart = (e, id) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
    // Firefox requires data to be set
    try {e.dataTransfer.setData("text/plain", id);} catch {}
  };
  const onDragOver = (e, id) => {
    e.preventDefault();
    if (id !== overId) setOverId(id);
  };
  const onDragEnd = () => {setDragId(null);setOverId(null);};
  const onDrop = (e, targetId) => {
    e.preventDefault();
    if (!dragId || dragId === targetId) {onDragEnd();return;}
    const next = [...order];
    const from = next.indexOf(dragId);
    const to = next.indexOf(targetId);
    if (from < 0 || to < 0) {onDragEnd();return;}
    next.splice(from, 1);
    next.splice(to, 0, dragId);
    setOrder(next);
    onDragEnd();
  };

  return (
    <div className="ob-step">
      <h2 className="ob-title">What three cause areas matter most to you?</h2>
      <p className="ob-subtitle">Drag to reorder</p>
      <div className="ob-causes" role="list">
        {order.map((id, idx) => {
          const cause = CAUSE_BY_ID[id];
          const isTop = idx < 3;
          return (
            <ObCause
              key={id}
              cause={cause}
              rank={idx + 1}
              isTop={isTop}
              isDragging={dragId === id}
              isOver={overId === id && dragId && dragId !== id}
              isOpen={openId === id}
              onToggle={(e) => { e.stopPropagation(); setOpenId(openId === id ? null : id); }}
              dragProps={{
                onDragStart: (e) => onDragStart(e, id),
                onDragOver: (e) => onDragOver(e, id),
                onDragEnd,
                onDrop: (e) => onDrop(e, id),
              }} />);

        })}
      </div>
    </div>);

}


export { CausePriorities };
