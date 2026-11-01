import Link from 'next/link';

const nav = [
  { label: 'home', href: '/home' },
  { label: 'directives', href: '/directives' },
  { label: 'ai', href: '/ai' },
  { label: 'missions', href: '/missions' },
  { label: 'health', href: '/health' },
  { label: 'stats', href: '/stats' },
] as const;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      <header className="header">
        <div>
          <div className="muted">Player System</div>
          <h1 style={{ margin: '6px 0 0' }}>Mission board</h1>
        </div>
        <Link href="/login">Log out</Link>
      </header>
      <nav className="nav" aria-label="Main navigation">
        {nav.map(({ label, href }) => (
          <Link key={label} href={href} className="nav-item">{label}</Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
