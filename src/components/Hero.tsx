export default function Hero() {
  return (
    <section className="pt-24 md:pt-28 pb-28 md:pb-36 relative overflow-hidden section-fade-bottom-strong">
      <div className="absolute inset-0 pointer-events-none">
        <div className="hero-grid" />
        <div className="glow-top-left" />
        <div className="glow-bottom-right" />
      </div>

      <div className="container mx-auto px-4 text-center relative">
        <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight">
          Stop wasting time on manual reviews.
        </h1>
        <p className="mt-4 text-base md:text-lg text-subtle">
          Start automating critical engineering document workflows with AI.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <a href="#demo" className="pill bg-white text-black px-6 py-3 font-semibold shadow-glow hover:opacity-90 transition">
            Try the Demo
          </a>
        <a href="#solution" className="pill px-6 py-3 font-semibold text-accent hover:bg-accent/10 transition">
          Learn More
        </a>
        </div>
      </div>
    </section>
  )
}