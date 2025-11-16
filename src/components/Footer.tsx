export default function Footer() {
  return (
    <footer className="relative mt-12 pt-16 pb-10 text-center text-subtle text-sm overflow-hidden">
      <div className="footer-gradient" />

      <div className="footer-icons">
        {Array.from({ length: 60 }).map((_, i) => (
          <div key={i} className="tile">
            <FooterIcon type={[
              'doc','qr','stamp','shield','gear','db','layers','cloud','cpu','ai','check','stack'
            ][i % 12]} />
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-4">
          <a href="#privacy" className="hover:text-white transition">Privacy Policy</a>
          <span>•</span>
          <a href="#terms" className="hover:text-white transition">Terms of use</a>
        </div>

        <p className="mt-3 text-xs md:text-sm opacity-80">
          Armeta is a product of Armeta Inc. (USA | C‑Corp), headquartered in San Francisco, Astana and Doha.
        </p>
        <p className="mt-2 text-xs md:text-sm opacity-80">
          To join the waitlist or contact for collaboration: <a href="mailto:hello@armeta.ai" className="hover:text-white">hello@armeta.ai</a>
        </p>

        <div className="mt-4 flex items-center justify-center gap-5">
          <a aria-label="Twitter" href="#" className="opacity-80 hover:opacity-100 transition">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white">
              <path d="M22 5.8c-.7.3-1.4.5-2.2.6.8-.5 1.4-1.2 1.7-2.1-.7.4-1.6.8-2.4.9A3.7 3.7 0 0 0 12.6 8c0 .3 0 .6.1.9-3.1-.2-5.8-1.7-7.6-4-.3.6-.5 1.3-.5 2.1 0 1.4.8 2.7 2 3.4-.6 0-1.1-.2-1.6-.4v.1c0 2 1.5 3.6 3.4 4-.4.1-.8.1-1.3.1-.3 0-.6 0-.9-.1a3.8 3.8 0 0 0 3.5 2.6A7.5 7.5 0 0 1 4 18.9c.4.2.9.2 1.4.2 5.2 0 8.1-4.3 8.1-8v-.4c.8-.6 1.5-1.3 2.1-2z" strokeWidth="1"/>
            </svg>
          </a>
          <a aria-label="LinkedIn" href="#" className="opacity-80 hover:opacity-100 transition">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white">
              <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM3 8.98h4v12H3v-12zm7 0h3.8v1.6h.1a4.1 4.1 0 0 1 3.7-2c4 0 4.7 2.6 4.7 6v6.4h-4v-5.7c0-1.3 0-3-1.8-3-1.8 0-2 1.4-2 2.9v5.8h-4v-12z" strokeWidth="1"/>
            </svg>
          </a>
          <a aria-label="GitHub" href="#" className="opacity-80 hover:opacity-100 transition">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white">
              <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.1-3.4-1.1-.4-1.1-1-1.4-1-1.4-.8-.6.1-.6.1-.6.9.1 1.3 1 1.3 1 .8 1.3 2.1.9 2.6.7.1-.6.3-1 .5-1.3-2.2-.2-4.5-1.1-4.5-4.9 0-1.1.4-2 1-2.8-.1-.2-.4-1.2.1-2.4 0 0 .8-.3 2.7 1a9.3 9.3 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.2.2 2.2.1 2.4.6.8 1 1.7 1 2.8 0 3.9-2.3 4.7-4.6 4.9.3.3.6.8.6 1.6v2.4c0 .3.2.6.7.5A10 10 0 0 0 12 2z" strokeWidth="1"/>
            </svg>
          </a>
        </div>

        <div className="mt-6 opacity-80">Copyright © 2025 Armeta Inc. All Rights Reserved.</div>
      </div>
    </footer>
  )
}

function FooterIcon({ type }: { type: string }) {
  switch (type) {
    case 'doc':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M7 3h8l4 4v14H7z" />
          <path d="M15 3v6h6" />
        </svg>
      )
    case 'qr':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="3" y="3" width="6" height="6" rx="1" />
          <rect x="15" y="3" width="6" height="6" rx="1" />
          <rect x="3" y="15" width="6" height="6" rx="1" />
          <path d="M15 15h3v3h3" />
        </svg>
      )
    case 'stamp':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="12" cy="9" r="3" />
          <path d="M8 14h8l1 5H7l1-5z" />
        </svg>
      )
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M12 3l7 4v6c0 4-3.5 6.5-7 8-3.5-1.5-7-4-7-8V7z" />
        </svg>
      )
    case 'gear':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 6v2M12 16v2M6 12h2M16 12h2M8.5 8.5l1.4 1.4M14.1 14.1l1.4 1.4M8.5 15.5l1.4-1.4M14.1 9.9l1.4-1.4" />
        </svg>
      )
    case 'db':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <ellipse cx="12" cy="6" rx="5" ry="3" />
          <path d="M7 6v8c0 1.7 2.2 3 5 3s5-1.3 5-3V6" />
          <path d="M7 10c0 1.7 2.2 3 5 3s5-1.3 5-3" />
          <path d="M7 14c0 1.7 2.2 3 5 3s5-1.3 5-3" />
        </svg>
      )
    case 'layers':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M12 4l8 5-8 5-8-5 8-5z" />
          <path d="M4 14l8 5 8-5" />
        </svg>
      )
    case 'cloud':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M6 15a5 5 0 0 1 4-7 6 6 0 0 1 11 3 4 4 0 0 1-1 8H8a4 4 0 0 1-2-4z" />
        </svg>
      )
    case 'cpu':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="7" y="7" width="10" height="10" rx="2" />
          <rect x="10" y="10" width="4" height="4" />
          <path d="M3 10h3M3 14h3M18 10h3M18 14h3M10 3v3M14 3v3M10 18v3M14 18v3" />
        </svg>
      )
    case 'ai':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="12" cy="12" r="6" />
          <path d="M8 12h8M10 9v6M14 9v6" />
        </svg>
      )
    case 'check':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M5 13l4 4 10-10" />
        </svg>
      )
    case 'stack':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M12 5l8 4-8 4-8-4 8-4z" />
          <path d="M4 13l8 4 8-4" />
          <path d="M4 17l8 4 8-4" />
        </svg>
      )
    default:
      return null
  }
}