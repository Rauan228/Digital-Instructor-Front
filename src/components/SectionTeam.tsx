import Reveal from './Reveal'

function TelegramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" {...props}>
      <g strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </g>
    </svg>
  )
}

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.1-3.4-1.1-.4-1.1-1-1.4-1-1.4-.8-.6.1-.6.1-.6.9.1 1.3 1 1.3 1 .8 1.3 2.1.9 2.6.7.1-.6.3-1 .5-1.3-2.2-.2-4.5-1.1-4.5-4.9 0-1.1.4-2 1-2.8-.1-.2-.4-1.2.1-2.4 0 0 .8-.3 2.7 1a9.3 9.3 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.2.2 2.2.1 2.4.6.8 1 1.7 1 2.8 0 3.9-2.3 4.7-4.6 4.9.3.3.6.8.6 1.6v2.4c0 .3.2.6.7.5A10 10 0 0 0 12 2z" strokeWidth="1"/>
    </svg>
  )
}

export default function SectionTeam() {
  const team = [
    { name: 'Rauan Akhemtov', role: '', links: { telegram: 'https://t.me/rrrrricardo', github: 'https://github.com/Rauan228' } },
    { name: 'Arslan Abdigali', role: '', links: { telegram: 'https://t.me/lumpalampla', github: 'https://github.com/abdigaliarslan' } },
    { name: 'Yechshanov Alisher', role: '', links: { telegram: 'https://t.me/Iwantjuice456', github: '#' } },
  ]

  return (
    <section id="team" className="py-24 relative section-fade-bottom">
      <div className="container mx-auto px-4">
        <Reveal className="glass rounded-2xl p-8 md:p-12 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Team</h2>
          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {team.map((m, i) => (
              <div key={i} className="glass rounded-xl p-6 text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-white/10" />
                <div className="mt-3 font-semibold">{m.name}</div>
                {m.role && <div className="text-subtle text-sm">{m.role}</div>}
                <div className="mt-4 flex items-center justify-center gap-5">
                  <a
                    href={m.links.telegram}
                    aria-label="Telegram"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-80 hover:opacity-100 transition"
                  >
                    <TelegramIcon width={22} height={22} className="text-white" />
                  </a>
                  <a
                    href={m.links.github}
                    aria-label="GitHub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-80 hover:opacity-100 transition"
                  >
                    <GitHubIcon width={22} height={22} className="text-white" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}