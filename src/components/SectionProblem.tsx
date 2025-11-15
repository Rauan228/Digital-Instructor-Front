import Reveal from './Reveal'

export default function SectionProblem() {
  return (
    <section id="problem" className="py-24 relative section-fade-bottom">
      <div className="container mx-auto px-4">
        <Reveal className="glass rounded-2xl p-8 md:p-12 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">The Problem</h2>
          <p className="mt-4 text-subtle max-w-3xl">
            Manual review of engineering documents is slow, repetitive, and expensive. 
            Human error leads to inconsistencies, compliance issues, and constant rework — while the volume of documentation continues to grow.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Too much time spent on routine checks',
              'Hard to maintain high compliance',
              'Errors grow with project scale',
              'Costs increase non-linearly',
              'Unpredictable quality of results',
              'Manual processes don’t scale',
            ].map((text, i) => (
              <div key={i} className="glass rounded-xl p-5">
                <div className="text-sm text-subtle">Pain #{i + 1}</div>
                <div className="mt-2 font-semibold">{text}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}