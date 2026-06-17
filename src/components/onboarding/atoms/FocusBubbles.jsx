import React, { useEffect, useRef } from 'react';
import { CAUSE_BY_ID, CAUSE_AREAS } from '../data/causeAreas';
import { CATEGORY_ICONS } from '../../partner/data/categoryIcons';

/* ── Step 6: review profile ──────────────────────────── */
function FocusBubbles({ top3 }) {
  const HOME = [
    { cx: 170, cy: 145, r: 70 }, // rank 0 — biggest
    { cx: 78,  cy: 72,  r: 48 }, // rank 1 — upper-left
    { cx: 242, cy: 254, r: 60 }, // rank 2 — lower-right
  ];
  const DECO = [
    { cx: 228, cy: 76,  r: 20 },
    { cx: 106, cy: 209, r: 20 },
    { cx: 164, cy: 235, r: 20 },
  ];
  const ALL = [...HOME, ...DECO];

  const remaining = CAUSE_AREAS.filter(c => !top3.includes(c.id));

  // Unique slow breathing params per bubble — golden-ratio-spaced phases
  const BREATH = ALL.map((_, i) => ({
    ax: 2 + (i % 3) * 0.8,           // x amplitude 2–4 px
    ay: 2 + (i % 3) * 0.8,           // y amplitude 2–4 px
    fx: 0.006 + i * 0.0007,          // x freq  (~3.5–5 s period)
    fy: 0.005 + i * 0.0006,          // y freq  (~4–6 s period)
    px: i * Math.PI * 0.618,         // golden-ratio phase offset x
    py: i * Math.PI * 1.0,           // phase offset y
  }));

  // Start positions: gently offset from home so they float in softly
  const physRef = useRef(ALL.map((b, i) => {
    const angle = Math.random() * Math.PI * 2;
    const dist  = 60 + Math.random() * 30;
    return {
      x:     b.cx + Math.cos(angle) * dist,
      y:     b.cy + Math.sin(angle) * dist,
      vx:    0,
      vy:    0,
      delay: i * 18,
    };
  }));

  const gRefs  = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    const phys = physRef.current;
    let t = 0;
    const SETTLE = 150;

    const tick = () => {
      t++;

      phys.forEach((p, i) => {
        if (t < p.delay) return;

        const home = ALL[i];
        const b    = BREATH[i];

        const elapsed   = t - p.delay;
        const breathFade = elapsed < SETTLE ? 0 : Math.min(1, (elapsed - SETTLE) / 80);
        const targetX = home.cx + Math.sin(t * b.fx + b.px) * b.ax * breathFade;
        const targetY = home.cy + Math.cos(t * b.fy + b.py) * b.ay * breathFade;

        if (t - p.delay < SETTLE) {
          // Pure lerp entrance — exponential ease-out, zero bounce by definition
          p.x  += (home.cx - p.x) * 0.038;
          p.y  += (home.cy - p.y) * 0.038;
          p.vx  = 0;
          p.vy  = 0;
        } else {
          // Spring breathing — gentle oscillation around the slow sinusoidal target
          p.vx += (targetX - p.x) * 0.025;
          p.vy += (targetY - p.y) * 0.025;
          p.vx *= 0.90;
          p.vy *= 0.90;
          p.x  += p.vx;
          p.y  += p.vy;
        }
      });

      phys.forEach((p, i) => {
        const el = gRefs.current[i];
        if (el) el.setAttribute('transform',
          `translate(${(p.x - ALL[i].cx).toFixed(2)},${(p.y - ALL[i].cy).toFixed(2)})`);
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="ob-bubbles" aria-hidden="true">
      <svg viewBox="0 0 320 320">
        {DECO.map((d, i) => {
          const delay  = `${(i + top3.length) * 180}ms`;
          return (
            <g key={`d${i}`} style={{ animation: `ob-bubble-in 600ms ease both`, animationDelay: delay }}>
              <g ref={el => { gRefs.current[HOME.length + i] = el; }}>
                <circle cx={d.cx} cy={d.cy} r={d.r} fill="none" stroke="var(--ffg-surface-950)" strokeWidth="1" />
              </g>
            </g>
          );
        })}

        {top3.map((id, i) => {
          const c         = CAUSE_BY_ID[id];
          const p         = HOME[i];
          const cat       = CATEGORY_ICONS[c.name];
          const fillColor = cat ? cat.color : 'var(--ffg-surface-950)';
          const delay     = `${i * 180}ms`;
          return (
            <g key={id} style={{ animation: `ob-bubble-in 600ms ease both`, animationDelay: delay }}>
              <g ref={el => { gRefs.current[i] = el; }} className="ob-bubble-group">
                <circle className="ob-bubble__fill"
                  cx={p.cx} cy={p.cy} r={p.r}
                  fill={fillColor} fillOpacity="0" stroke="none"
                  style={{ transition: 'fill-opacity 120ms ease' }} />
                <circle cx={p.cx} cy={p.cy} r={p.r} fill="none" stroke="var(--ffg-surface-950)" strokeWidth="1" />
                {cat?.svg &&
                  <g className="ob-bubble-icon" transform={`translate(${p.cx},${p.cy}) scale(${Math.min(p.r, 32) / 16})`} style={{ color: 'var(--ffg-surface-950)' }}>
                    <g transform="translate(-8,-8)">{cat.svg}</g>
                  </g>
                }
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export { FocusBubbles };
