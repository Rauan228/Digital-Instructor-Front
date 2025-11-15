import Reveal from './Reveal'

export default function SectionContact() {
  return (
    <section id="contact" className="py-24 relative section-fade-bottom">
      <div className="container mx-auto px-4">
  <Reveal className="glass rounded-2xl p-8 md:p-12 shadow-[0_0_30px_rgba(0,0,0,0.5)] text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Ready to get started?</h2>
          <p className="mt-4 text-subtle max-w-xl mx-auto">Contact us or try the demo to see how AI can transform engineering workflows.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <a href="#demo" className="pill bg-white text-black px-6 py-3 font-semibold shadow-glow hover:opacity-90 transition">Try the Demo</a>
      <a href="mailto:sales@armeta.ai" className="pill px-6 py-3 font-semibold text-accent hover:bg-accent/10 transition">Contact Sales</a>
    </div>
  </Reveal>
      </div>
    </section>
  )
}