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
    <section className="mb-16 md:mb-24 animate-fade-in-up">
      <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight mb-8 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
        Career
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {careerData.map((item, index) => (
          <div
            key={index}
            className="group p-6 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-lg"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors duration-300">
              {item.company}
            </h3>
            <p className="text-slate-400 mb-2 text-sm font-medium">{item.period}</p>
            <p className="text-slate-300 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
