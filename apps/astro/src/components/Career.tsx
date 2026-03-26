const careerData = [
  {
    period: "2024 - Present",
    company: "Niigata University Graduate School of Medical and Dental Sciences Department of Biofunction Regulation and Systems Brain Pathology",
    description: "Medical Doctoral Course",
  },
  {
    period: "2017 - 2022",
    company: "Kyoto - Tendai, Enryakuji Temple on Mount Hiei, Mana, Daishuji Temple",
    description: "Buddhist Scholar",
  },
  {
    period: "2010 - 2014",
    company: "Keio University",
    description: "Faculty of Letters, Department of Philosophy, Philosophy of Science",
  }
];

export default function Career() {
  return (
    <section>
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
        className="md-career-heading"
      >
        Career
      </h2>

      <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
        {careerData.map((item, index) => (
          <li
            key={index}
            style={{
              padding: '0.75em 0',
              borderBottom: index < careerData.length - 1 ? '1px solid #d8dee4' : 'none',
            }}
            className="md-career-item"
          >
            <strong
              style={{
                fontWeight: 600,
                fontFamily: "'Noto Sans JP', 'Poppins', ui-sans-serif, system-ui, sans-serif",
              }}
            >
              {item.company}
            </strong>
            <br />
            <span
              style={{
                color: '#57606a',
                fontSize: '0.875em',
                fontFamily: "'Poppins', 'Noto Sans JP', ui-sans-serif, system-ui, sans-serif",
              }}
              className="md-career-meta"
            >
              {item.period} &mdash; {item.description}
            </span>
          </li>
        ))}
      </ul>

      <style>{`
        body[data-mode="dark"] .md-career-heading {
          border-bottom-color: #30363d !important;
        }
        body[data-mode="dark"] .md-career-item {
          border-bottom-color: #21262d !important;
        }
        body[data-mode="dark"] .md-career-meta {
          color: #8b949e !important;
        }
      `}</style>
    </section>
  );
}
