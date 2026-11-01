async function getState() {
  const res = await fetch('http://localhost:3000/api/state', { cache: 'no-store' });
  return res.json();
}

export default async function DirectivesPage() {
  const state = await getState();
  return (
    <main className="shell">
      <h2>Directives</h2>
      <div style={{ display: 'grid', gap: 12 }}>
        {state.quests.map((quest: any) => (
          <div key={quest.id} className="card">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <div>
                <strong>{quest.title}</strong>
                <div className="muted">{quest.kind} • {quest.stat}</div>
              </div>
              <button type="button">Complete</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
