// Database adapter. Talks to Supabase's REST API with fetch. No SDK, no build step.
// Table: hunter_state (user_id text primary key, data jsonb, updated_at timestamptz).
(function () {
  const cfg = window.HUNTER_CONFIG || {};
  const enabled = !!(cfg.supabaseUrl && cfg.supabaseKey && cfg.userId);
  let userId = cfg.userId;
  const headers = () => ({ apikey: cfg.supabaseKey, Authorization: "Bearer " + cfg.supabaseKey, "Content-Type": "application/json" });
  let timer = null;

  async function push(state) {
    if (!enabled) return false;
    const r = await fetch(cfg.supabaseUrl + "/rest/v1/hunter_state?on_conflict=user_id", {
      method: "POST",
      headers: { ...headers(), Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify([{ user_id: userId, data: state, updated_at: new Date().toISOString() }])
    });
    return r.ok;
  }
  function pushDebounced(state) {
    if (!enabled) return;
    clearTimeout(timer);
    timer = setTimeout(() => push(state).catch(() => {}), 1500);
  }
  async function pull() {
    if (!enabled) return null;
    const r = await fetch(cfg.supabaseUrl + "/rest/v1/hunter_state?user_id=eq." + encodeURIComponent(userId) + "&select=data", { headers: headers() });
    if (!r.ok) return null;
    const rows = await r.json();
    return rows[0] ? rows[0].data : null;
  }
  function setUserId(id) {
    userId = id || cfg.userId;
  }
  window.HunterDB = { enabled, push, pushDebounced, pull, setUserId };
})();
