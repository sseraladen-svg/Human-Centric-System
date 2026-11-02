// Optional AI adapter. Used only when rules cannot read a report.
// AI CHARTER: the single source of rules for every AI provider and the in-app panel.
window.AI_CHARTER = {
  role: "THE SYSTEM. Judges what the player reports. Does not decide rank, level, penalties, deadlines, stability or the database.",
  reads: ["level", "stats", "streak", "today's quests (id, title, done)", "open quests", "open gates", "open special missions", "last 7 check-ins", "the player's report text"],
  writes: ["metrics: study_min, exercise_min, focus_min, sleep_hours, outreach_count, income_inr, build_count (only numbers the player stated)",
           "closeQuestIds: daily quests due today that the report proves done",
           "newSkill: a skill the report starts or learns, with one stat",
           "missing: questions asking for numbers that were not stated",
           "reply and avoidance text"],
  forbidden: ["inventing, estimating or rounding up numbers", "setting XP, stats, levels or rank directly", "changing penalties, deadlines, stability or stored data", "closing a quest without proof in the report", "rewarding the same action twice in one day"],
  caps: { xpPerReport: 150, xpPerDay: 300, partialEvidenceXpMax: 50, statPerReport: 3, statPerDayPerStat: 8 },
  flow: ["Rules parse the report first at no AI cost", "If rules cannot read it and AI is connected, the AI returns the JSON below", "Code applies the result through applyAI, which enforces the caps", "Every change is logged and shown in the Judgment Trace"],
  connections: ["applyAI → gainXp: XP, levels, and stat growth on first reaching a level", "applyAI → stats and practiceSkill: skill levels and independence", "applyAI → quest log: closed quests count toward streaks and stability", "stability and health read the log, so judgments change the stability ring and the XP multiplier", "gates read the log: a completion for the gate's stat counts toward it"],
  failSafe: "If AI is off or fails, the rules still judge. Nothing breaks."
};
(function () {
  const cfg = (window.HUNTER_CONFIG || {}).ai || {};
  const enabled = !!(cfg.endpoint || cfg.apiKey);
  const PROMPT = `You are THE SYSTEM. Extract ONLY numbers the player stated. Never invent numbers.
Return ONLY JSON: {"reply": string, "evidence": "accepted"|"partial"|"none", "metrics": {"study_min","exercise_min","focus_min","sleep_hours","outreach_count","income_inr","build_count"} (number or null), "closeQuestIds": [string], "missing": [{"metric": string, "ask": string}], "newSkill": {"name": string, "stat": "INT"|"STR"|"VIT"|"SENSE"|"CHA"|"WEALTH"} or null, "avoidance": string}`;
  async function judge(report, context) {
    if (!enabled) return null;
    const headers = { "content-type": "application/json", "anthropic-version": "2023-06-01" };
    let url = cfg.endpoint;
    if (!url) { url = "https://api.anthropic.com/v1/messages"; headers["x-api-key"] = cfg.apiKey; headers["anthropic-dangerous-direct-browser-access"] = "true"; }
    const body = { model: cfg.model || "claude-haiku-5-5", max_tokens: 400, messages: [{ role: "user", content: PROMPT + "\n\nCHARTER:\n" + JSON.stringify({role:window.AI_CHARTER.role,caps:window.AI_CHARTER.caps,forbidden:window.AI_CHARTER.forbidden}) + "\n\nSTATE:\n" + JSON.stringify(context) + "\n\nREPORT:\n" + report }] };
    const r = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
    if (!r.ok) throw new Error("AI " + r.status);
    const j = await r.json();
    const text = (j.content || []).map(b => b.text || "").join("");
    const m = text.match(/\{[\s\S]*\}/);
    return m ? JSON.parse(m[0]) : null;
  }
  window.HunterAI = { enabled, judge };
})();
