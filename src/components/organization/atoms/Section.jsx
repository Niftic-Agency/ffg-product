
const Section = ({ title, body, aside, children, fullWidth }) =>
<section className="org-sec" style={{ gap: "40px", alignItems: "flex-start", width: fullWidth ? "100%" : "900px" }}>
    <div className="org-sec__header">
      <h2 className="org-sec__title" style={{ fontFamily: "\"PP Fragment Sans\"", fontSize: "20px" }}>{title}</h2>
      {aside && <div className="org-sec__aside">{aside}</div>}
    </div>
    {body && <p className="org-sec__body">{body}</p>}
    <div className="org-sec__content" style={{ gap: "40px", width: fullWidth ? "100%" : "900px" }}>{children}</div>
  </section>;


export { Section };
