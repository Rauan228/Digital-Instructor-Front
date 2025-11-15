import logoUrl from '../img/Logo.png'

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass backdrop-blur-xl">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <a href="#" className="inline-flex items-center">
          <img src={logoUrl} alt="ARMETA AI" className="h-8 md:h-5 w-auto" />
        </a>
        <nav className="hidden md:flex gap-6 text-sm text-subtle">
          <a href="#problem" className="hover:text-white transition">Problems</a>
          <a href="#solution" className="hover:text-white transition">Solution</a>
          <a href="#benefits" className="hover:text-white transition">Benefits</a>
          <a href="#demo" className="hover:text-white transition">Demo</a>
          <a href="#team" className="hover:text-white transition">Team</a>
          <a href="#contact" className="hover:text-white transition">Contact</a>
        </nav>
      </div>
    </header>
  )
}