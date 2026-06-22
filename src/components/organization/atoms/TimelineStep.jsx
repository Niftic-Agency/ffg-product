
const TimelineStep = ({ n, tag, time }) =>
<div className="org-tl-card">
  <div className="org-tl-card__header">
    <span className="org-tl-card__n">{n}</span>
    <span className="org-tl-card__tag">{tag}</span>
    <span className="org-tl-card__time">{time}</span>
  </div>
  <p className="org-tl-card__copy">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  </p>
</div>;


export { TimelineStep };
