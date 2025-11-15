import Reveal from './Reveal'

export default function SectionSolution() {
  const benefits = [
    { title: '10× Faster Reviews', desc: 'Automate repetitive checks and get results instantly.' },
    { title: 'Higher Compliance', desc: 'Consistent rules, unified standards, and verifiable outputs.' },
    { title: 'Fewer Errors', desc: 'Eliminate human mistakes in critical review stages.' },
    { title: 'Lower Costs', desc: 'Reduce manual labor and accelerate approval cycles.' },
    { title: 'Up to 99% Accuracy', desc: 'AI-powered document understanding trained on real engineering data.' },
  ]

  return (
    <section id="solution" className="py-24 relative section-fade-bottom">
      <div className="container mx-auto px-4">
        <Reveal className="glass rounded-2xl p-8 md:p-12 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">The Solution</h2>
          <p className="mt-4 text-subtle max-w-3xl">
            Our Computer Vision model automatically detects signatures, stamps, and QR codes in engineering documents, annotates important elements, and provides a clean structured result — ready for instant review.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {benefits.map((b, i) => (
              <div key={i} className="relative overflow-hidden rounded-xl glass p-5">
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-accent/10 to-transparent" />
                <div className="text-sm text-subtle">Feature #{i + 1}</div>
                <div className="mt-2 font-semibold">{b.title}</div>
                <div className="mt-1 text-subtle text-sm">{b.desc}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}