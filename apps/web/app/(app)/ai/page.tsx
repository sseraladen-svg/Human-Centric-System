export default function AIPage() {
  return (
    <main className="shell">
      <h2>AI review</h2>
      <div style={{ display: 'grid', gap: 12 }}>
        <textarea className="input" rows={6} placeholder="Write your report or evidence"></textarea>
        <button type="button">Submit for review</button>
      </div>
    </main>
  );
}
