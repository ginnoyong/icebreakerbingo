// Shared Supabase config — loaded by index.html, auth.html, dashboard.html, game.html
// Requires the Supabase UMD script (window.supabase) to be loaded BEFORE this file.

const SUPABASE_URL = "https://hqgemmfrpbpkecxxxhab.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxZ2VtbWZycGJwa2VjeHh4aGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MzcyMDgsImV4cCI6MjA5NDExMzIwOH0.WjHpA2_MBg-CVY9G6t0cw31f_ZfXT-tZekcBWquT2x4";

const DEFAULT_PHRASES = [
  "Has more than 2 pets", "Takes more than 1hr to get to school", "Owns a Casio watch",
  "Can speak 3 or more languages", "Has cried watching K-drama before", "Has a part-time job",
  "Plays Mobile Legends or MLBB", "Has a Spotify student plan", "Has typed OTW while still at home",
  "Drinks bubble tea 3+ times a week", "Is in the school team of a CCA", "Has a group chat with 50+ members",
  "Has overslept on an exam day", "Follows local influencers on Instagram", "Has posted a TikTok before",
  "Has own baby photo(s) in phone", "Can recite parents phone numbers by heart", "Hates durians",
  "Cannot take spicy food", "Has dozed off on the MRT and missed their stop",
  "Plays basketball at the void deck", "Has studied for exams at the airport",
  "Has mistaken a stranger for a friend", "Has more than 250 followers on social media"
];

// Global Supabase client instance — reuse this everywhere, never call createClient() again.
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
