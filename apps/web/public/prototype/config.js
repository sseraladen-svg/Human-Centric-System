// Fill these in. Leave empty to keep the app fully local.
// Never commit real keys to GitHub: add config.js to .gitignore.
window.HUNTER_CONFIG = {
  // Free database: Supabase (https://supabase.com, free tier)
  supabaseUrl: "",          // e.g. "https://abcd1234.supabase.co"
  supabaseKey: "",          // the anon public key from Project Settings > API
  userId: "",               // any long random string you keep private, e.g. from crypto.randomUUID()
  // Optional AI API (leave empty to use rules only)
  ai: {
    endpoint: "",           // optional proxy URL. Leave empty to call Anthropic directly.
    apiKey: "",             // Anthropic API key (only if no endpoint is used)
    model: "claude-haiku-5-5"
  }
};
