import React from 'react';
import { ChevronDown, Square, SquareCheck, Plus } from 'lucide-react';
import { GIVING_CIRCLES } from '../data/givingCircles';

/* ====== Overview "superselector" variant ======
   A styled radio selector for impact scope. "Your impact" and "Factory impact"
   behave like the toggle group; the middle "Giving circles" option opens a
   multi-select dropdown of the user's circles. Selection drives `scope` =
   "you" | "circle" | "factory" (same contract the ToggleGroup uses), plus a
   `selectedCircles` id list owned by the parent. */
function OverviewSelector({ scope, selectedCircles, onScopeChange, onCirclesChange }) {
  const [open, setOpen] = React.useState(false);
  const circleRef = React.useRef(null);

  // Click-outside + Escape to close the dropdown (mirrors topnav-auth.jsx).
  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (circleRef.current && !circleRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const toggleCircle = (id) => {
    const next = selectedCircles.includes(id)
      ? selectedCircles.filter((c) => c !== id)
      : [...selectedCircles, id];
    onCirclesChange(next);
    // Picking a circle activates the circle scope; clearing the last one falls
    // back to "your impact" so the view never shows an empty (0×) state.
    onScopeChange(next.length ? 'circle' : 'you');
  };

  // Dynamic label for the Giving circles chip.
  const circleLabel = selectedCircles.length === 0
    ? 'Giving circles'
    : `${selectedCircles.length} selected`;

  // Selecting Your/Factory impact closes the dropdown and clears the circle
  // selection so the Giving circles chip resets to its default label.
  const selectScope = (next) => {
    setOpen(false);
    onCirclesChange([]);
    onScopeChange(next);
  };

  const chipClass = (active) =>
    'overview-superselector__chip' + (active ? ' is-active' : '');

  return (
    <div className="overview-superselector" role="radiogroup" aria-label="Impact scope">
      <button
        type="button"
        role="radio"
        aria-checked={scope === 'you'}
        className={chipClass(scope === 'you')}
        onClick={() => selectScope('you')}>
        Your impact
      </button>

      <div className="overview-superselector__circle" ref={circleRef}>
        <button
          type="button"
          role="radio"
          aria-checked={scope === 'circle'}
          aria-expanded={open}
          className={chipClass(scope === 'circle') + ' overview-superselector__chip--menu'}
          onClick={() => setOpen((o) => !o)}>
          {circleLabel}
          <ChevronDown size={18} aria-hidden="true" />
        </button>

        {open && (
          <div className="overview-superselector__menu" role="menu">
            {GIVING_CIRCLES.map((circle) => {
              const checked = selectedCircles.includes(circle.id);
              return (
                <button
                  type="button"
                  role="menuitemcheckbox"
                  aria-checked={checked}
                  key={circle.id}
                  className="overview-superselector__option"
                  onClick={() => toggleCircle(circle.id)}>
                  {checked
                    ? <SquareCheck size={18} aria-hidden="true" />
                    : <Square size={18} aria-hidden="true" />}
                  {circle.name}
                </button>
              );
            })}
            <div className="overview-superselector__divider" />
            <button
              type="button"
              className="overview-superselector__option overview-superselector__option--create"
              title="Coming soon">
              <Plus size={18} aria-hidden="true" />
              Create a new giving circle
            </button>
          </div>
        )}
      </div>

      <button
        type="button"
        role="radio"
        aria-checked={scope === 'factory'}
        className={chipClass(scope === 'factory')}
        onClick={() => selectScope('factory')}>
        Factory impact
      </button>
    </div>
  );
}

export { OverviewSelector };
