import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="container">
      <div className="shell" style={{ maxWidth: 540, margin: '100px auto 0' }}>
        <div className="header">
          <div>
            <div className="muted">Signal Access</div>
            <h1 style={{ margin: '8px 0 0' }}>Log in</h1>
          </div>
        </div>
        <div style={{ display: 'grid', gap: 14 }}>
          <input className="input" type="email" placeholder="user@example.com" aria-label="Email address" />
          <Link href="/home" aria-label="Continue as demo user">
            <button type="button">Send magic link</button>
          </Link>
          <Link href="/home" aria-label="Continue as demo user">
            <button type="button" className="secondary">Continue as demo user</button>
          </Link>
        </div>
      </div>
    </main>
  );
}
