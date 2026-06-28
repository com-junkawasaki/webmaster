const achievementsData = [
  {
    period: "2025",
    title: "DEF CON 33 · Car Hacking Village CTF — World 2nd place (solo team)",
    description: "Las Vegas — automotive cybersecurity (Capture The Flag)",
    href: "https://prtimes.jp/main/html/rd/p/000000005.000129278.html",
  },
];

export default function Achievements() {
  return (
    <section style={{ marginTop: '2.5em' }}>
      <h2
        style={{
          fontSize: '1.5em',
          fontWeight: 600,
          paddingBottom: '0.3em',
          borderBottom: '1px solid #d0d7de',
          marginTop: 0,
          marginBottom: '1em',
          fontFamily: "'Noto Sans JP', 'Poppins', ui-sans-serif, system-ui, sans-serif",
        }}
        className="md-ach-heading"
      >
        Achievements
      </h2>

      <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
        {achievementsData.map((item, index) => (
          <li
            key={index}
            style={{
              padding: '0.75em 0',
              borderBottom: index < achievementsData.length - 1 ? '1px solid #d8dee4' : 'none',
            }}
            className="md-ach-item"
          >
            <strong
              style={{
                fontWeight: 600,
                fontFamily: "'Noto Sans JP', 'Poppins', ui-sans-serif, system-ui, sans-serif",
              }}
            >
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'inherit', textDecoration: 'underline', textDecorationStyle: 'dotted' }}
                >
                  {item.title}
                </a>
              ) : (
                item.title
              )}
            </strong>
            <br />
            <span
              style={{
                color: '#57606a',
                fontSize: '0.875em',
                fontFamily: "'Poppins', 'Noto Sans JP', ui-sans-serif, system-ui, sans-serif",
              }}
              className="md-ach-meta"
            >
              {item.period} &mdash; {item.description}
            </span>
          </li>
        ))}
      </ul>

      <style>{`
        body[data-mode="dark"] .md-ach-heading {
          border-bottom-color: #30363d !important;
        }
        body[data-mode="dark"] .md-ach-item {
          border-bottom-color: #21262d !important;
        }
        body[data-mode="dark"] .md-ach-meta {
          color: #8b949e !important;
        }
      `}</style>
    </section>
  );
}
