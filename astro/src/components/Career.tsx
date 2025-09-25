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
    <section className="mb-16 md:mb-24">
      <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight mb-8">
        Career
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {careerData.map((item, index) => (
          <div key={index}>
            <h3 className="text-xl font-semibold mb-2">{item.company}</h3>
            <p className="text-gray-600 mb-2">{item.period}</p>
            <p className="text-gray-700">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
