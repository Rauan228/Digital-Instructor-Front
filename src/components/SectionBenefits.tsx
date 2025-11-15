import Reveal from './Reveal'

export default function SectionBenefits() {
  const items = [
    { title: 'Saves engineering time', desc: 'Frees specialists from repetitive tasks.' },
    { title: 'Improves quality', desc: 'Unified criteria ensure stable and reliable results.' },
    { title: 'Eliminates repetitive work', desc: 'Fully automates recurring validation steps.' },
    { title: 'Works with any document layout', desc: 'Robust to different formats, templates, and page types.' },
  ]

  return (
    <section id="benefits" className="py-24 relative section-fade-bottom">
      <div className="container mx-auto px-4">
        <Reveal className="glass rounded-2xl p-8 md:p-12 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Benefits</h2>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((b, i) => (
              <div key={i} className="glass rounded-xl p-6">
                <div className="text-lg font-semibold">{b.title}</div>
                <div className="mt-2 text-subtle text-sm">{b.desc}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}