/* ═══════════════════════════════════════════════════
   NANTES DASHBOARD — MAIN CSS
   Reset · Layout · Typography · Components · Animations
   ═══════════════════════════════════════════════════ */

@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800&display=swap');

/* ─── RESET ─────────────────────────────────────── */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
img, svg { display: block; max-width: 100%; }

/* ─── ROOT LAYOUT ────────────────────────────────── */
body {
  background-color: var(--bg-base);
  color: var(--text-primary);
  font-family: 'DM Mono', monospace;
  min-height: 100vh;
  overflow-x: hidden;
  transition: background-color 0.4s ease, color 0.4s ease;
}

/* ─── HERO ───────────────────────────────────────── */
.hero {
  position: relative;
  height: 100vh;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-bottom: 1px solid var(--border);
}

.hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 50% at 50% 100%, var(--glow-a) 0%, transparent 70%),
    radial-gradient(ellipse 50% 35% at 15% 50%, var(--glow-b) 0%, transparent 60%),
    var(--grid-pattern);
  pointer-events: none;
}

.hero-badge {
  position: relative;
  font-size: 0.6rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--accent);
  border: 1px solid var(--accent);
  padding: 5px 16px;
  margin-bottom: 2.5rem;
  animation: heroFadeIn 0.8s ease both;
}

.hero-title {
  position: relative;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(5rem, 18vw, 14rem);
  font-weight: 700;
  line-height: 0.85;
  letter-spacing: -0.02em;
  text-align: center;
  animation: heroFadeIn 0.8s 0.15s ease both;
  background: var(--title-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-sub {
  position: relative;
  margin-top: 2rem;
  font-size: 0.62rem;
  letter-spacing: 0.25em;
  color: var(--text-muted);
  animation: heroFadeIn 0.8s 0.3s ease both;
}

.live-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  background: var(--status-ok);
  border-radius: 50%;
  margin-right: 8px;
  animation: pulseDot 1.8s infinite;
}

.scroll-cue {
  position: absolute;
  bottom: 2rem;
  font-size: 0.55rem;
  letter-spacing: 0.35em;
  color: var(--text-muted);
  opacity: 0.5;
  animation: bounce 2.5s ease-in-out infinite, heroFadeIn 1s 0.8s ease both;
}

/* ─── NAVIGATION ─────────────────────────────────── */
.nav {
  position: sticky;
  top: 0;
  z-index: 200;
  background: var(--nav-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  transition: background 0.4s;
}

.nav-links {
  display: flex;
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;
}
.nav-links::-webkit-scrollbar { display: none; }

.nav-links a {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  text-decoration: none;
  padding: 0.9rem 1.25rem;
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border-right: 1px solid var(--border);
  white-space: nowrap;
  transition: color 0.2s, background 0.2s;
}
.nav-links a:hover { color: var(--text-primary); background: var(--hover-bg); }
.nav-links a .nav-icon { font-size: 0.9rem; }

/* Theme switcher button group */
.theme-switcher {
  display: flex;
  align-items: center;
  gap: 0;
  border-left: 1px solid var(--border);
  padding: 0 4px;
  flex-shrink: 0;
}

.theme-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  transition: background 0.2s, transform 0.15s;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  font-family: inherit;
  font-size: 0.55rem;
  text-transform: uppercase;
}
.theme-btn:hover { background: var(--hover-bg); color: var(--text-primary); }
.theme-btn.active { background: var(--accent); color: var(--accent-contrast); }

/* ─── SECTIONS ───────────────────────────────────── */
.section {
  padding: 5rem 2.5rem;
  max-width: 1440px;
  margin: 0 auto;
}

.section + .section {
  border-top: 1px solid var(--border);
}

.section-header {
  display: flex;
  align-items: baseline;
  gap: 1.25rem;
  margin-bottom: 3rem;
}

.section-num {
  font-size: 0.55rem;
  color: var(--accent);
  letter-spacing: 0.25em;
  font-weight: 500;
}

.section-title {
  font-family: 'Syne', sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.section-source {
  margin-left: auto;
  font-size: 0.52rem;
  color: var(--text-muted);
  letter-spacing: 0.15em;
  opacity: 0.6;
}

/* ─── CARD GRID ──────────────────────────────────── */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
}

.card {
  background: var(--card-bg);
  padding: 1.5rem;
  transition: background 0.2s;
  position: relative;
}
.card:hover { background: var(--card-hover); }

.card-label {
  font-size: 0.5rem;
  letter-spacing: 0.22em;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 0.6rem;
}

.card-val {
  font-family: 'Syne', sans-serif;
  font-size: 1.9rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.card-sub {
  font-size: 0.6rem;
  color: var(--text-muted);
}

/* ─── WEATHER GRID ───────────────────────────────── */
.meteo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
}

.meteo-main {
  background: var(--card-bg);
  padding: 2.5rem;
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 2.5rem;
  flex-wrap: wrap;
}

.meteo-temp {
  font-family: 'Cormorant Garamond', serif;
  font-size: 6rem;
  font-weight: 300;
  line-height: 1;
  color: var(--text-primary);
}

.meteo-icon { font-size: 4rem; line-height: 1; }

.meteo-info { display: flex; flex-direction: column; gap: 0.25rem; }
.meteo-desc { font-size: 0.9rem; color: var(--text-secondary); font-family: 'Syne', sans-serif; }
.meteo-time { font-size: 0.58rem; color: var(--text-muted); letter-spacing: 0.15em; }
.meteo-coords { font-size: 0.58rem; color: var(--text-muted); letter-spacing: 0.12em; margin-left: auto; text-align: right; }

.meteo-detail {
  background: var(--card-bg);
  padding: 1.25rem 1.5rem;
  transition: background 0.2s;
}
.meteo-detail:hover { background: var(--card-hover); }

/* ─── AQI BAR ────────────────────────────────────── */
.aqi-bar-section { margin-top: 2rem; }
.aqi-bar-label {
  font-size: 0.52rem;
  letter-spacing: 0.22em;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}
.aqi-bar {
  height: 6px;
  background: linear-gradient(90deg, #2ecc71 0%, #a8d8a8 25%, #f1c40f 50%, #e67e22 75%, #e74c3c 100%);
  position: relative;
  margin-bottom: 0.5rem;
}
.aqi-cursor {
  position: absolute;
  top: -5px;
  width: 3px;
  height: 16px;
  background: var(--text-primary);
  transition: left 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 6px var(--text-primary);
}
.aqi-scale {
  display: flex;
  justify-content: space-between;
  font-size: 0.5rem;
  color: var(--text-muted);
  margin-top: 4px;
}

/* ─── TRANSPORT LIST ─────────────────────────────── */
.transport-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
}

.transport-item {
  background: var(--card-bg);
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: background 0.2s;
}
.transport-item:hover { background: var(--card-hover); }

.transport-badge {
  min-width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 700;
  font-family: 'Syne', sans-serif;
  border-radius: 3px;
  flex-shrink: 0;
}

.badge-tram { background: var(--badge-tram-bg); color: var(--badge-tram-text); }
.badge-bus { background: var(--badge-bus-bg); color: var(--badge-bus-text); }
.badge-navibus { background: #0077b6; color: #fff; }
.badge-busway { background: #7b2d8b; color: #fff; }

.transport-name { flex: 1; font-size: 0.75rem; color: var(--text-secondary); }
.transport-status { font-size: 0.6rem; white-space: nowrap; }
.status-ok { color: var(--status-ok); }
.status-warn { color: var(--status-warn); }
.status-err { color: var(--status-err); }

/* ─── VÉLOS GRID ─────────────────────────────────── */
.velo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
}

.velo-card {
  background: var(--card-bg);
  padding: 1.25rem;
  transition: background 0.2s;
}
.velo-card:hover { background: var(--card-hover); }
.velo-name { font-size: 0.62rem; color: var(--text-muted); margin-bottom: 0.6rem; line-height: 1.4; }

.velo-bar-wrap { display: flex; gap: 6px; align-items: center; }
.velo-bar-outer { flex: 1; height: 4px; background: var(--border); border-radius: 0; }
.velo-bar-inner { height: 100%; background: var(--accent); transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1); }
.velo-count { font-size: 0.65rem; font-family: 'Syne', sans-serif; font-weight: 700; min-width: 28px; text-align: right; }
.velo-docks { font-size: 0.52rem; color: var(--text-muted); margin-top: 4px; }

/* ─── EVENTS ─────────────────────────────────────── */
.event-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
}

.event-item {
  background: var(--card-bg);
  padding: 1.25rem 1.5rem;
  display: grid;
  grid-template-columns: 90px 1fr auto;
  gap: 1.25rem;
  align-items: start;
  transition: background 0.2s;
}
.event-item:hover { background: var(--card-hover); }

.event-date { font-size: 0.6rem; color: var(--accent); line-height: 1.6; }
.event-title { font-size: 0.82rem; color: var(--text-primary); font-family: 'Syne', sans-serif; font-weight: 600; }
.event-venue { font-size: 0.58rem; color: var(--text-muted); margin-top: 4px; }
.event-cat {
  font-size: 0.5rem;
  letter-spacing: 0.12em;
  padding: 3px 8px;
  border: 1px solid var(--border);
  color: var(--text-muted);
  white-space: nowrap;
  align-self: start;
}

/* ─── BIG STATS ──────────────────────────────────── */
.big-stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
}

.big-stat {
  background: var(--card-bg);
  padding: 2rem 1.5rem;
  position: relative;
  overflow: hidden;
  transition: background 0.2s;
}
.big-stat:hover { background: var(--card-hover); }

.big-stat::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}
.big-stat:hover::after { transform: scaleX(1); }

.big-stat-val {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.8rem;
  font-weight: 600;
  line-height: 1;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.big-stat-label {
  font-size: 0.52rem;
  letter-spacing: 0.18em;
  color: var(--text-muted);
  text-transform: uppercase;
}

/* ─── TWO-COL ────────────────────────────────────── */
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  margin-top: 1px;
}
.two-col-block {
  background: var(--card-bg);
  padding: 1.75rem;
  font-size: 0.68rem;
  line-height: 2.2;
  color: var(--text-muted);
}
.two-col-block strong { color: var(--text-secondary); font-weight: 500; }

/* ─── WIKI ───────────────────────────────────────── */
.wiki-block {
  border: 1px solid var(--border);
  background: var(--card-bg);
}
.wiki-content {
  padding: 2.5rem;
  font-size: 0.82rem;
  line-height: 2;
  color: var(--text-secondary);
  font-family: 'DM Mono', monospace;
}
.wiki-meta {
  padding: 1rem 2.5rem;
  border-top: 1px solid var(--border);
  font-size: 0.56rem;
  color: var(--text-muted);
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  align-items: center;
}
.wiki-meta a { color: var(--accent); text-decoration: none; }
.wiki-meta a:hover { text-decoration: underline; }

/* ─── MAP ────────────────────────────────────────── */
.map-frame {
  width: 100%;
  height: 420px;
  border: 1px solid var(--border);
  overflow: hidden;
  position: relative;
}
.map-frame iframe {
  width: 100%;
  height: 100%;
  border: none;
  filter: var(--map-filter);
  opacity: 0.88;
}
.map-credit {
  font-size: 0.52rem;
  color: var(--text-muted);
  padding: 0.5rem 0;
  text-align: right;
}
.map-credit a { color: var(--text-muted); text-decoration: none; }
.map-credit a:hover { color: var(--accent); }

/* ─── APIS LIST ──────────────────────────────────── */
.api-item {
  background: var(--card-bg);
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  transition: background 0.2s;
}
.api-item:hover { background: var(--card-hover); }
.api-name { font-size: 0.72rem; color: var(--text-secondary); flex: 1; }
.api-url { font-size: 0.56rem; color: var(--text-muted); margin-top: 2px; display: block; }
.api-note { font-size: 0.56rem; color: var(--text-muted); white-space: nowrap; }

.tag {
  display: inline-flex;
  align-items: center;
  font-size: 0.48rem;
  letter-spacing: 0.12em;
  padding: 3px 8px;
  border-radius: 2px;
  font-weight: 500;
  flex-shrink: 0;
}
.tag-live { background: color-mix(in srgb, var(--status-ok) 15%, transparent); color: var(--status-ok); border: 1px solid var(--status-ok); }
.tag-key { background: color-mix(in srgb, var(--status-warn) 15%, transparent); color: var(--status-warn); border: 1px solid var(--status-warn); }
.tag-static { background: color-mix(in srgb, var(--text-muted) 15%, transparent); color: var(--text-muted); border: 1px solid var(--border); }

/* ─── INFO BLOCK ─────────────────────────────────── */
.info-block {
  background: var(--card-bg);
  border: 1px solid var(--border);
  padding: 1.25rem 1.5rem;
  font-size: 0.68rem;
  line-height: 1.8;
  color: var(--text-muted);
  margin-top: 1px;
}
.info-block a { color: var(--accent); text-decoration: none; }
.info-block a:hover { text-decoration: underline; }

/* ─── LOADER ─────────────────────────────────────── */
.loader {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 1.5px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  vertical-align: middle;
  margin-right: 6px;
}
.error-text { color: var(--status-err); font-size: 0.68rem; }

/* ─── FOOTER ─────────────────────────────────────── */
.footer {
  border-top: 1px solid var(--border);
  padding: 4rem 2.5rem 3rem;
  max-width: 1440px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;
}

.footer-brand {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 1rem;
}
.footer-tagline { font-size: 0.6rem; color: var(--text-muted); line-height: 1.8; }

.footer-col h4 {
  font-size: 0.52rem;
  letter-spacing: 0.22em;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 1rem;
}
.footer-col a {
  display: block;
  font-size: 0.65rem;
  color: var(--text-muted);
  text-decoration: none;
  padding: 3px 0;
  transition: color 0.2s;
}
.footer-col a:hover { color: var(--accent); }

.footer-bottom {
  border-top: 1px solid var(--border);
  padding: 1.25rem 2.5rem;
  display: flex;
  justify-content: space-between;
  font-size: 0.52rem;
  color: var(--text-muted);
  max-width: 1440px;
  margin: 0 auto;
}

/* ─── ANIMATIONS ─────────────────────────────────── */
@keyframes heroFadeIn {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes pulseDot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.35; transform: scale(0.7); }
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(9px); }
}
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in { animation: fadeIn 0.5s ease both; }

/* ─── RESPONSIVE ─────────────────────────────────── */
@media (max-width: 900px) {
  .section { padding: 3.5rem 1.5rem; }
  .footer { grid-template-columns: 1fr 1fr; }
  .two-col { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .meteo-main { flex-direction: column; gap: 1rem; padding: 1.5rem; }
  .meteo-temp { font-size: 4rem; }
  .event-item { grid-template-columns: 70px 1fr; }
  .event-cat { display: none; }
  .footer { grid-template-columns: 1fr; gap: 2rem; }
  .meteo-coords { display: none; }
  .section-source { display: none; }
  .meteo-grid { grid-template-columns: 1fr; }
  .footer-bottom { flex-direction: column; gap: 0.5rem; }
}
