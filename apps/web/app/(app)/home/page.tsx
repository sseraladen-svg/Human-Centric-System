async function getState() {
  const res = await fetch('http://localhost:3000/api/state', { cache: 'no-store' });
  return res.json();
}

export default async function HomePage() {
  const state = await getState();
  return (
    <main>
      <section className="shell">
        <div className="header">
          <div>
            <div className="muted">Profile</div>
            <h2 style={{ margin: '8px 0 0' }}>{state.profile.displayName}</h2>
          </div>
          <div className="card" style={{ padding: '10px 14px' }}>
            <div className="muted">Level</div>
            <div className="metric">{state.level}</div>
          </div>
        </div>
        <div className="grid">
          <div className="card"><h3>Stability</h3><div className="metric">{state.stability}</div></div>
          <div className="card"><h3>Streak</h3><div className="metric">{state.streak}</div></div>
          <div className="card"><h3>Debuff</h3><div className="metric">{state.debuff}</div></div>
          <div className="card"><h3>Pending rewards</h3><div className="metric">{state.pendingRewards.length}</div></div>
        </div>
      </section>
      <section className="shell" style={{ marginTop: 18 }}>
        <h3>Active quests</h3>
        <ul className="list">
          {state.quests.map((quest: any) => (
            <li key={quest.id}>
              <strong>{quest.title}</strong>
              <div className="muted">{quest.stat} • {quest.xp} XP</div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
