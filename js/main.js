/* ═══════════════════════════════════════════════════════
   NANTES DASHBOARD v2 — MAIN.JS
   APIs: Open-Meteo · JCDecaux · TAN · Parkings Nantes ·
         OpenAgenda · Geo API · Wikipedia · Sun
   ═══════════════════════════════════════════════════════ */

// ── CLÉS API (optionnelles — les sans-clé fonctionnent immédiatement) ──
const JCDECAUX_KEY     = 'VOTRE_CLE_JCDECAUX';       // developer.jcdecaux.com
const OPENAGENDA_KEY   = 'VOTRE_CLE_OPENAGENDA';     // openagenda.com

// ── CONSTANTES ──────────────────────────────────────────
const LAT = 47.2184;
const LON = -1.5536;
const INSEE = '44109';

// ── UTILS ────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const setText = (id, val) => { const el = $(id); if (el) el.textContent = val; };
const setHTML = (id, val) => { const el = $(id); if (el) el.innerHTML = val; };
const fmt = (n, locale = 'fr-FR') => (n ?? '—').toLocaleString(locale);

function weatherIcon(code) {
  if (code === 0) return '☀️';
  if (code <= 2)  return '⛅';
  if (code === 3) return '☁️';
  if (code <= 48) return '🌫️';
  if (code <= 57) return '🌦️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌧️';
  if (code <= 86) return '🌨️';
  return '⛈️';
}

function weatherDesc(code) {
  const d = { 0:'Ciel dégagé',1:'Principalement dégagé',2:'Partiellement nuageux',3:'Couvert',
    45:'Brouillard',48:'Brouillard givrant',51:'Bruine légère',53:'Bruine modérée',55:'Bruine dense',
    61:'Pluie légère',63:'Pluie modérée',65:'Pluie forte',71:'Neige légère',73:'Neige modérée',75:'Neige forte',
    80:'Averses légères',81:'Averses modérées',82:'Averses violentes',95:'Orage',96:'Orage + grêle',99:'Orage violent' };
  return d[code] || 'Conditions variables';
}

function windDir(deg) {
  return ['N','NE','E','SE','S','SO','O','NO'][Math.round(deg/45)%8];
}

function toHM(s) {
  return `${Math.floor(s/3600)}h${String(Math.floor((s%3600)/60)).padStart(2,'0')}`;
}

function aqiColor(aqi) {
  if (aqi <= 20) return '#00e87a';
  if (aqi <= 40) return '#a8d8a8';
  if (aqi <= 60) return '#ffd166';
  if (aqi <= 80) return '#f77f00';
  return '#ff4d6d';
}

function aqiLabel(aqi) {
  if (aqi <= 20) return 'Bon';
  if (aqi <= 40) return 'Acceptable';
  if (aqi <= 60) return 'Modéré';
  if (aqi <= 80) return 'Mauvais';
  return 'Très mauvais';
}

function barColor(pct) {
  if (pct > 70) return '#00e87a';
  if (pct > 30) return '#ffd166';
  return '#ff4d6d';
}

// ═══════════════════════════════════════════════════════
// HERO CANVAS — Particle grid
// ═══════════════════════════════════════════════════════
function initHeroCanvas() {
  const canvas = $('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    particles = [];
    const count = Math.floor((W * H) / 12000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.5 + 0.1
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#00d4ff';

    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${p.opacity})`;
      ctx.fill();
    });

    // Connect nearby
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${0.08 * (1 - dist/100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
}

// ═══════════════════════════════════════════════════════
// CLOCK
// ═══════════════════════════════════════════════════════
function startClock() {
  const update = () => {
    const now = new Date();
    const clock = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const date  = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    setText('hero-clock', clock);
    setText('hero-date', date);
  };
  update();
  setInterval(update, 1000);
}

// ═══════════════════════════════════════════════════════
// 01 — MÉTÉO
// ═══════════════════════════════════════════════════════
async function loadMeteo() {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}`
      + `&current=temperature_2m,apparent_temperature,relative_humidity_2m,`
      + `precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,visibility,uv_index`
      + `&hourly=temperature_2m,weather_code,precipitation_probability`
      + `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset`
      + `&timezone=Europe%2FParis&forecast_days=7`;

    const res = await fetch(url);
    const d   = await res.json();
    const c   = d.current;

    // Current
    setText('meteo-icon',     weatherIcon(c.weather_code));
    setText('meteo-temp',     `${Math.round(c.temperature_2m)}°`);
    setText('meteo-desc',     weatherDesc(c.weather_code));
    setText('meteo-feel',     `${Math.round(c.apparent_temperature)}°C`);
    setText('meteo-humidity', `${c.relative_humidity_2m}%`);
    setText('meteo-wind',     `${Math.round(c.wind_speed_10m)} km/h`);
    setText('meteo-wdir',     windDir(c.wind_direction_10m));
    setText('meteo-precip',   `${c.precipitation} mm`);
    setText('meteo-cloud',    `${c.cloud_cover}%`);
    setText('meteo-vis',      `${(c.visibility/1000).toFixed(1)} km`);
    setText('meteo-uv',       c.uv_index);
    setText('meteo-time',     new Date().toLocaleString('fr-FR', { weekday:'long', hour:'2-digit', minute:'2-digit' }));

    // Hero stats
    setText('h-temp', `${Math.round(c.temperature_2m)}°C`);

    // 7-day forecast
    const fc = $('forecast-container');
    fc.innerHTML = '';
    d.daily.time.forEach((day, i) => {
      const date = new Date(day);
      const div = document.createElement('div');
      div.className = 'fcard fade-in';
      div.style.animationDelay = `${i * 0.05}s`;
      div.innerHTML = `
        <div class="fcard-day">${date.toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'short'})}</div>
        <div class="fcard-icon">${weatherIcon(d.daily.weather_code[i])}</div>
        <div class="fcard-max">${Math.round(d.daily.temperature_2m_max[i])}°</div>
        <div class="fcard-min">${Math.round(d.daily.temperature_2m_min[i])}° min</div>
        <div class="fcard-rain">💧 ${d.daily.precipitation_sum[i]}mm</div>`;
      fc.appendChild(div);
    });

    // Hourly (next 24h)
    const hc = $('hourly-container');
    hc.innerHTML = '';
    const nowH = new Date().getHours();
    d.hourly.time.slice(0, 48).forEach((t, i) => {
      const hour = new Date(t);
      if (hour < new Date()) return;
      const div = document.createElement('div');
      div.className = 'hcard fade-in';
      div.innerHTML = `
        <div class="hcard-time">${hour.getHours()}h</div>
        <div class="hcard-icon">${weatherIcon(d.hourly.weather_code[i])}</div>
        <div class="hcard-temp">${Math.round(d.hourly.temperature_2m[i])}°</div>
        <div class="hcard-precip">${d.hourly.precipitation_probability[i]}%</div>`;
      hc.appendChild(div);
    });

  } catch(e) {
    console.error('Météo:', e);
  }
}

// ═══════════════════════════════════════════════════════
// 02 — QUALITÉ DE L'AIR
// ═══════════════════════════════════════════════════════
async function loadAir() {
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${LAT}&longitude=${LON}`
      + `&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,sulphur_dioxide,european_aqi`;

    const res = await fetch(url);
    const d   = await res.json();
    const c   = d.current;
    const aqi = c.european_aqi;

    // Gauge canvas
    drawAQIGauge(aqi);
    setText('aqi-val', aqi ?? '—');
    setText('aqi-label', aqiLabel(aqi));
    $('aqi-val').style.color = aqiColor(aqi);

    // Grid
    const items = [
      { label: 'PM10',      val: c.pm10?.toFixed(1),             unit: 'µg/m³', icon: '🌫️' },
      { label: 'PM2.5',     val: c.pm2_5?.toFixed(1),            unit: 'µg/m³', icon: '💨' },
      { label: 'NO₂',       val: c.nitrogen_dioxide?.toFixed(1), unit: 'µg/m³', icon: '🏭' },
      { label: 'Ozone',     val: c.ozone?.toFixed(1),            unit: 'µg/m³', icon: '🌐' },
      { label: 'CO',        val: c.carbon_monoxide?.toFixed(0),  unit: 'µg/m³', icon: '🔬' },
      { label: 'SO₂',       val: c.sulphur_dioxide?.toFixed(1),  unit: 'µg/m³', icon: '⚗️' },
    ];

    setHTML('air-container', items.map(it => `
      <div class="aqi-card fade-in">
        <div class="aqi-card-label">${it.icon} ${it.label}</div>
        <div class="aqi-card-val">${it.val ?? '—'}</div>
        <div class="aqi-card-unit">${it.unit}</div>
      </div>`).join(''));

    // Cursor
    const cursor = $('aqi-cursor');
    if (cursor) cursor.style.left = `${Math.min(aqi, 100)}%`;

    // Hero
    const aqiEl = $('h-aqi');
    if (aqiEl) { aqiEl.textContent = `${aqi} AQI`; aqiEl.style.color = aqiColor(aqi); }

  } catch(e) {
    console.error('Air:', e);
  }
}

function drawAQIGauge(aqi) {
  const canvas = $('aqi-gauge');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const cx = W/2, cy = H * 0.85, r = H * 0.75;
  const startAngle = Math.PI, endAngle = 2 * Math.PI;

  // Background arc
  ctx.beginPath();
  ctx.arc(cx, cy, r, startAngle, endAngle);
  ctx.lineWidth = 14;
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg4').trim() || '#1a2332';
  ctx.stroke();

  // Gradient arc
  const gradient = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
  gradient.addColorStop(0, '#00e87a');
  gradient.addColorStop(0.5, '#ffd166');
  gradient.addColorStop(1, '#ff4d6d');

  const progress = Math.min(aqi / 100, 1);
  ctx.beginPath();
  ctx.arc(cx, cy, r, startAngle, startAngle + progress * Math.PI);
  ctx.lineWidth = 14;
  ctx.strokeStyle = gradient;
  ctx.lineCap = 'round';
  ctx.stroke();
}

// ═══════════════════════════════════════════════════════
// 03 — TRANSPORTS TAN (open.tan.fr — sans clé)
// ═══════════════════════════════════════════════════════
const TAN_LINES = [
  { badge: 'T1', type: 'tram',    cls: 'badge-tram',    route: 'François-Mitterrand ↔ Beaujoire' },
  { badge: 'T2', type: 'tram',    cls: 'badge-tram',    route: 'Gare de Rezé ↔ Orvault Grand Val' },
  { badge: 'T3', type: 'tram',    cls: 'badge-tram',    route: 'Marcel-Paul ↔ Neustrie' },
  { badge: 'BW', type: 'busway',  cls: 'badge-busway',  route: 'Busway — Pôle Sud ↔ CHU Hôtel-Dieu' },
  { badge: '⛵', type: 'navibus', cls: 'badge-navibus', route: 'Navibus Loire — Trentemoult ↔ Gare Maritime' },
  { badge: 'C1', type: 'bus',     cls: 'badge-bus',     route: 'Bus Chronobus C1 — Orvault ↔ Rezé' },
  { badge: 'C2', type: 'bus',     cls: 'badge-bus',     route: 'Bus Chronobus C2 — Bellevue ↔ Erdre' },
];

const TAN_STOPS = [
  { id: 'CNAM', name: 'Commerce (Tram)' },
  { id: 'CRQU', name: 'Place du Cirque' },
  { id: 'GARE', name: 'Gare SNCF' },
  { id: 'OFFI', name: 'Hôtel de Ville' },
];

async function loadTransports() {
  // Static lines
  const linesEl = $('transport-lines');
  if (linesEl) {
    linesEl.innerHTML = TAN_LINES.map(l => `
      <div class="transport-row fade-in">
        <div class="line-badge ${l.cls}">${l.badge}</div>
        <div class="line-route">${l.route}
          <strong>Nantes Métropole · Naolib</strong>
        </div>
        <div class="line-status status-ok">● En service</div>
      </div>`).join('');
  }

  // Live wait times (CORS-proxied via open.tan.fr — essai direct)
  const stopsEl = $('stops-grid');
  if (stopsEl) {
    stopsEl.innerHTML = '';
    for (const stop of TAN_STOPS) {
      try {
        const res = await fetch(`https://open.tan.fr/ewp/tempsattente.json/${stop.id}`);
        if (!res.ok) throw new Error('not ok');
        const data = await res.json();
        const rows = data.slice(0, 4).map(p => `
          <div class="passage-row">
            <span class="passage-line badge-tram" style="background:#00a550;color:white">${p.ligne?.numLigne ?? '?'}</span>
            <span class="passage-dest">${p.terminus ?? '—'}</span>
            <span class="passage-time">${p.temps ?? '—'}</span>
          </div>`).join('');
        stopsEl.innerHTML += `
          <div class="stop-card fade-in">
            <div class="stop-name">📍 ${stop.name}</div>
            <div class="stop-passages">${rows || '<span style="font-size:0.7rem;color:var(--text3)">Pas de passage imminent</span>'}</div>
          </div>`;
      } catch {
        stopsEl.innerHTML += `
          <div class="stop-card fade-in">
            <div class="stop-name">📍 ${stop.name}</div>
            <div class="stop-passages"><span style="font-size:0.7rem;color:var(--text3)">⚠️ Temps réel non disponible (CORS)</span></div>
          </div>`;
      }
    }
  }

  // Perturbations
  try {
    const res = await fetch(`https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_info-trafic-tan-temps-reel/records?limit=5&lang=fr`);
    if (!res.ok) throw new Error();
    const d = await res.json();
    const pertEl = $('pert-list');
    if (pertEl && d.results?.length) {
      pertEl.innerHTML = d.results.map(r => `
        <div class="pert-item">
          <strong>${r.fields?.ligne ?? r.fields?.title ?? 'Perturbation'}</strong>
          ${r.fields?.message ?? r.fields?.titre ?? ''}
        </div>`).join('');
    } else if (pertEl) {
      pertEl.innerHTML = '<div class="pert-item info">✅ Aucune perturbation signalée</div>';
    }
  } catch {
    const pertEl = $('pert-list');
    if (pertEl) pertEl.innerHTML = '<div class="pert-item info">ℹ️ Info-trafic non disponible</div>';
  }
}

// ═══════════════════════════════════════════════════════
// 04 — BICLOO (JCDecaux)
// ═══════════════════════════════════════════════════════
async function loadBicloo() {
  const grid = $('velo-grid');

  if (JCDECAUX_KEY === 'VOTRE_CLE_JCDECAUX') {
    // Fallback to Nantes Métropole open data
    try {
      const res = await fetch('https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_disponibilite-temps-reel-bicloo/records?limit=100');
      if (!res.ok) throw new Error();
      const d = await res.json();
      renderBiclooData(d.results?.map(r => ({
        name: r.fields?.name ?? r.fields?.nom ?? 'Station',
        status: r.fields?.status ?? 'OPEN',
        available_bikes: r.fields?.available_bikes ?? 0,
        available_bike_stands: r.fields?.available_bike_stands ?? 0,
        bike_stands: r.fields?.bike_stands ?? 1,
      })) ?? []);
      return;
    } catch {}

    // Last fallback: static demo
    setText('velo-stations', '116');
    setText('velo-bikes', '—');
    setText('velo-docks', '—');
    setText('velo-ebikes', '—');
    setText('velo-rate', '—');
    setText('h-bikes', '—');
    if (grid) grid.innerHTML = `<div class="stop-card" style="grid-column:1/-1">
      <p style="font-size:0.8rem;color:var(--text3)">⚠️ Ajoutez votre clé JCDecaux pour voir les disponibilités en temps réel.<br>
      Inscrivez-vous gratuitement sur <a href="https://developer.jcdecaux.com" target="_blank">developer.jcdecaux.com</a></p>
    </div>`;
    return;
  }

  try {
    const url = `https://api.jcdecaux.com/vls/v1/stations?contract=nantes&apiKey=${JCDECAUX_KEY}`;
    const res  = await fetch(url);
    const data = await res.json();
    renderBiclooData(data);
  } catch(e) {
    console.error('Bicloo:', e);
  }
}

function renderBiclooData(stations) {
  const active = stations.filter(s => s.status === 'OPEN');
  const totalBikes  = active.reduce((a,s) => a + (s.available_bikes ?? 0), 0);
  const totalDocks  = active.reduce((a,s) => a + (s.available_bike_stands ?? 0), 0);
  const totalEBikes = active.reduce((a,s) => a + (s.available_mechanical_bikes ?? s.available_ebike ?? 0), 0);
  const totalSlots  = active.reduce((a,s) => a + Math.max(s.bike_stands ?? 1, 1), 0);
  const rate        = Math.round((totalBikes / Math.max(totalSlots,1)) * 100);

  setText('velo-stations', active.length);
  setText('velo-bikes', totalBikes);
  setText('velo-docks', totalDocks);
  setText('velo-ebikes', totalEBikes || '—');
  setText('velo-rate', `${rate}%`);
  setText('h-bikes', totalBikes);

  const grid = $('velo-grid');
  if (!grid) return;
  grid.innerHTML = '';

  active.slice(0, 48).sort((a,b) => (b.available_bikes??0) - (a.available_bikes??0)).forEach((s, i) => {
    const stands = Math.max(s.bike_stands ?? 1, 1);
    const pct    = Math.round(((s.available_bikes ?? 0) / stands) * 100);
    const color  = barColor(pct);
    const name   = (s.name ?? 'Station').replace(/^\d+ - /, '');
    const div = document.createElement('div');
    div.className = 'velo-card fade-in';
    div.style.animationDelay = `${i * 0.02}s`;
    div.innerHTML = `
      <div class="velo-card-name">🚲 ${name}</div>
      <div class="velo-bar-outer">
        <div class="velo-bar-inner" style="width:${pct}%;background:${color}"></div>
      </div>
      <div class="velo-nums">
        <span class="velo-available">${s.available_bikes ?? 0} vélos</span>
        <span class="velo-free">${s.available_bike_stands ?? 0} places</span>
      </div>`;
    grid.appendChild(div);
  });
}

// ═══════════════════════════════════════════════════════
// 05 — PARKINGS (data.nantesmetropole.fr — sans clé)
// ═══════════════════════════════════════════════════════
async function loadParkings() {
  const grid = $('parkings-grid');
  try {
    const url = `https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_info-parking-nantes-metropole-temps-reel/records?limit=25&lang=fr`;
    const res  = await fetch(url);
    if (!res.ok) throw new Error('Parking API error');
    const d    = await res.json();

    if (!d.results?.length) throw new Error('No data');

    grid.innerHTML = '';
    d.results.forEach((r, i) => {
      const f       = r.fields ?? r;
      const name    = f.nom ?? f.name ?? 'Parking';
      const free    = parseInt(f.grp_disponible ?? f.available ?? 0);
      const total   = parseInt(f.grp_capacite ?? f.capacity ?? 1);
      const pct     = Math.round((free / Math.max(total,1)) * 100);
      const color   = barColor(pct);
      const status  = f.grp_statut ?? f.status ?? 'Ouvert';
      const isOpen  = !status.toLowerCase().includes('ferm') && !status.toLowerCase().includes('clos');

      const div = document.createElement('div');
      div.className = 'parking-card fade-in';
      div.style.animationDelay = `${i * 0.04}s`;
      div.innerHTML = `
        <div class="parking-name">🅿️ ${name}</div>
        <div class="parking-free" style="color:${color}">${free}</div>
        <div class="parking-total">places libres / ${total}</div>
        <div class="parking-bar-outer">
          <div class="parking-bar-inner" style="width:${pct}%;background:${color}"></div>
        </div>
        <div class="parking-nums">
          <span>${pct}% libre</span>
          <span class="parking-status ${isOpen ? 'status-ok' : 'status-err'}">${isOpen ? '● Ouvert' : '● Fermé'}</span>
        </div>`;
      grid.appendChild(div);
    });
  } catch(e) {
    console.error('Parkings:', e);
    if (grid) grid.innerHTML = `<div class="stop-card" style="grid-column:1/-1;padding:2rem;font-size:0.8rem;color:var(--text3)">
      ℹ️ Données parkings non disponibles — API data.nantesmetropole.fr<br>
      <a href="https://data.nantesmetropole.fr" target="_blank" style="color:var(--accent)">data.nantesmetropole.fr</a>
    </div>`;
  }
}

// ═══════════════════════════════════════════════════════
// 06 — AGENDA (OpenAgenda)
// ═══════════════════════════════════════════════════════
async function loadAgenda() {
  const container = $('agenda-container');

  if (OPENAGENDA_KEY === 'VOTRE_CLE_OPENAGENDA') {
    // Fallback: quelques événements statiques representatifs
    const events = [
      { title: 'Voyage à Nantes', date: 'Été 2025', lieu: 'Tout Nantes', cat: 'Culture' },
      { title: 'Folles Journées — Festival de musique classique', date: 'Janv/Fév', lieu: 'La Cité, Nantes', cat: 'Musique' },
      { title: 'Rendez-Vous de l\'Erdre', date: 'Été', lieu: 'Quais de l\'Erdre', cat: 'Jazz' },
    ];
    container.innerHTML = `
      <div style="padding:1rem;background:var(--bg3);border:1px solid var(--border);border-radius:2px;margin-bottom:1rem;font-size:0.78rem;color:var(--text3)">
        ⚠️ Clé OpenAgenda manquante — inscrivez-vous sur <a href="https://openagenda.com" target="_blank">openagenda.com</a> pour les événements en temps réel.
        <br>Affichage d'événements emblématiques nantais à titre d'exemple :
      </div>
      ${events.map(ev => `
        <div class="event-card fade-in">
          <div class="event-date-block">
            <div class="event-day">—</div>
            <div class="event-month">${ev.date}</div>
          </div>
          <div>
            <div class="event-title">${ev.title}</div>
            <div class="event-venue">📍 ${ev.lieu}</div>
          </div>
          <div class="event-cat">${ev.cat}</div>
        </div>`).join('')}`;
    return;
  }

  try {
    const agendaUid = '96579854';
    const url = `https://api.openagenda.com/v2/agendas/${agendaUid}/events?key=${OPENAGENDA_KEY}&size=10&lang=fr`;
    const res  = await fetch(url);
    const d    = await res.json();

    container.innerHTML = '';
    if (!d.events?.length) {
      container.innerHTML = '<div class="event-card">Aucun événement trouvé</div>';
      return;
    }

    d.events.forEach((ev, i) => {
      const debut   = ev.timings?.[0]?.begin ? new Date(ev.timings[0].begin) : null;
      const title   = ev.title?.fr ?? ev.title?.en ?? 'Événement';
      const lieu    = ev.location?.name ?? '';
      const cat     = ev.keywords?.fr?.[0] ?? '';
      const div = document.createElement('div');
      div.className = 'event-card fade-in';
      div.style.animationDelay = `${i * 0.06}s`;
      div.innerHTML = `
        <div class="event-date-block">
          <div class="event-day">${debut ? debut.getDate() : '—'}</div>
          <div class="event-month">${debut ? debut.toLocaleDateString('fr-FR',{month:'short',year:'numeric'}) : '—'}</div>
        </div>
        <div>
          <div class="event-title">${title}</div>
          ${lieu ? `<div class="event-venue">📍 ${lieu}</div>` : ''}
        </div>
        ${cat ? `<div class="event-cat">${cat}</div>` : ''}`;
      container.appendChild(div);
    });
  } catch(e) {
    console.error('Agenda:', e);
  }
}

// ═══════════════════════════════════════════════════════
// 07 — NANTES EN CHIFFRES
// ═══════════════════════════════════════════════════════
async function loadVille() {
  try {
    const res = await fetch(`https://geo.api.gouv.fr/communes/${INSEE}?fields=nom,code,codesPostaux,codeDepartement,codeRegion,population,surface,centre`);
    const d   = await res.json();

    const pop     = d.population;
    const surface = d.surface ? (d.surface / 100) : null;
    const density = (pop && surface) ? Math.round(pop / surface) : null;

    setText('ville-pop',     pop ? pop.toLocaleString('fr-FR') : '—');
    setText('ville-surface', surface ? surface.toFixed(1) : '—');
    setText('ville-density', density ? density.toLocaleString('fr-FR') : '—');

    const [lon, lat] = d.centre?.coordinates ?? [LON, LAT];

    setHTML('ville-codes', `
      <strong>Code INSEE</strong> ${d.code}<br>
      <strong>Codes postaux</strong> ${d.codesPostaux?.join(', ')}<br>
      <strong>Département</strong> ${d.codeDepartement} — Loire-Atlantique<br>
      <strong>Région</strong> ${d.codeRegion} — Pays de la Loire<br>
    `);

    setHTML('ville-geo', `
      <strong>Latitude</strong> ${lat.toFixed(4)}°N<br>
      <strong>Longitude</strong> ${Math.abs(lon).toFixed(4)}°O<br>
      <strong>Superficie</strong> ${surface ? surface.toFixed(2) : '—'} km²<br>
      <strong>Densité</strong> ${density ? density.toLocaleString('fr-FR') : '—'} hab/km²<br>
    `);
  } catch(e) {
    console.error('Ville:', e);
  }
}

// ═══════════════════════════════════════════════════════
// 08 — SOLEIL & ASTRONOMIE
// ═══════════════════════════════════════════════════════
async function loadSoleil() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const url   = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}`
      + `&daily=sunrise,sunset,daylight_duration,sunshine_duration`
      + `&timezone=Europe%2FParis&start_date=${today}&end_date=${today}`;

    const res = await fetch(url);
    const d   = await res.json();

    const sunrise  = new Date(d.daily.sunrise[0]);
    const sunset   = new Date(d.daily.sunset[0]);
    const daylight = d.daily.daylight_duration[0];
    const sunshine = d.daily.sunshine_duration[0];

    const fmtTime = dt => dt.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });

    // Hero
    setText('h-sunrise', fmtTime(sunrise));

    // Sun arc canvas
    drawSunArc(sunrise, sunset);

    // Cards
    const container = $('sun-container');
    const items = [
      { icon: '🌅', val: fmtTime(sunrise), lbl: 'Lever du soleil' },
      { icon: '🌇', val: fmtTime(sunset),  lbl: 'Coucher du soleil' },
      { icon: '⏱', val: toHM(daylight),    lbl: 'Durée du jour' },
      { icon: '☀️', val: toHM(sunshine),   lbl: 'Ensoleillement effectif' },
    ];
    container.innerHTML = items.map((it, i) => `
      <div class="sun-card fade-in" style="animation-delay:${i*0.1}s">
        <div class="sun-card-icon">${it.icon}</div>
        <div class="sun-card-val">${it.val}</div>
        <div class="sun-card-lbl">${it.lbl}</div>
      </div>`).join('');

  } catch(e) {
    console.error('Soleil:', e);
  }
}

function drawSunArc(sunrise, sunset) {
  const canvas = $('sun-arc');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const now    = new Date();
  const dayMs  = 24 * 3600 * 1000;
  const riseMs = sunrise.getTime() - new Date(sunrise).setHours(0,0,0,0);
  const setMs  = sunset.getTime()  - new Date(sunrise).setHours(0,0,0,0);
  const nowMs  = now.getHours() * 3600000 + now.getMinutes() * 60000 + now.getSeconds() * 1000;

  const toAngle = ms => Math.PI + (ms / dayMs) * Math.PI;

  const cx = W/2, cy = H + 20, r = H - 30;

  // Night arc background
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI, 2*Math.PI);
  ctx.lineWidth = 3;
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border').trim() || '#1e2d3d';
  ctx.stroke();

  // Day arc (sunrise to sunset)
  const riseAngle = toAngle(riseMs);
  const setAngle  = toAngle(setMs);
  const grad = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
  grad.addColorStop(0, '#f77f00');
  grad.addColorStop(0.5, '#ffd166');
  grad.addColorStop(1, '#f77f00');
  ctx.beginPath();
  ctx.arc(cx, cy, r, riseAngle, setAngle);
  ctx.lineWidth = 4;
  ctx.strokeStyle = grad;
  ctx.stroke();

  // Sun position
  if (nowMs > riseMs && nowMs < setMs) {
    const nowAngle = toAngle(nowMs);
    const sunX = cx + r * Math.cos(nowAngle);
    const sunY = cy + r * Math.sin(nowAngle);
    ctx.beginPath();
    ctx.arc(sunX, sunY, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd166';
    ctx.fill();
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ffd166';
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Labels
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text3').trim() || '#5a7290';
  ctx.font = `500 11px 'JetBrains Mono', monospace`;
  ctx.textAlign = 'center';
  ctx.fillText(sunrise.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}), 60, H - 10);
  ctx.fillText(sunset.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}),  W - 60, H - 10);
  ctx.fillText('MIDI', cx, 30);
}

// ═══════════════════════════════════════════════════════
// 09 — WIKIPEDIA
// ═══════════════════════════════════════════════════════
async function loadWiki() {
  try {
    const res = await fetch('https://fr.wikipedia.org/api/rest_v1/page/summary/Nantes');
    const d   = await res.json();

    setHTML('wiki-content', d.extract ?? '—');
    setHTML('wiki-meta', `
      <span>📖 Wikipedia · fr</span>
      <a href="${d.content_urls?.desktop?.page}" target="_blank">Lire l'article complet →</a>
      <span>Mis à jour : ${new Date(d.timestamp).toLocaleDateString('fr-FR')}</span>
    `);

    if (d.originalimage?.source) {
      const img = $('wiki-img');
      if (img) { img.src = d.originalimage.source; img.style.display = 'block'; }
    }
  } catch(e) {
    console.error('Wiki:', e);
  }
}

// ═══════════════════════════════════════════════════════
// 11 — CATALOGUE APIs
// ═══════════════════════════════════════════════════════
function renderAPIs() {
  const apis = [
    { tag:'LIVE',    cls:'tag-live',   name:'Open-Meteo',              desc:'Météo, prévisions, qualité de l\'air, astronomie',  url:'api.open-meteo.com/v1/forecast',                  note:'Gratuit · Sans clé' },
    { tag:'LIVE',    cls:'tag-live',   name:'TAN Naolib — Temps réel', desc:'Passages aux arrêts, perturbations (SIRI)',          url:'open.tan.fr/ewp/tempsattente.json/{code}',        note:'Gratuit · Sans clé' },
    { tag:'LIVE',    cls:'tag-live',   name:'Parkings Nantes Métropole',desc:'Disponibilité temps réel des parkings',             url:'data.nantesmetropole.fr/api/explore/v2.1/catalog', note:'Gratuit · Sans clé' },
    { tag:'CLÉ',     cls:'tag-key',    name:'JCDecaux Bicloo',         desc:'Stations vélos disponibilité temps réel',            url:'api.jcdecaux.com/vls/v1/stations?contract=nantes', note:'Clé gratuite' },
    { tag:'CLÉ',     cls:'tag-key',    name:'OpenAgenda',              desc:'Événements culturels Nantes Métropole',              url:'api.openagenda.com/v2/agendas/{id}/events',       note:'Clé gratuite' },
    { tag:'LIVE',    cls:'tag-live',   name:'API Géo Gouv',            desc:'Données INSEE, communes, géographie',               url:'geo.api.gouv.fr/communes/44109',                  note:'Gratuit · Sans clé' },
    { tag:'LIVE',    cls:'tag-live',   name:'Wikipedia REST',          desc:'Résumé encyclopédique et image',                    url:'fr.wikipedia.org/api/rest_v1/page/summary/Nantes', note:'Gratuit · Sans clé' },
    { tag:'STATIQUE',cls:'tag-static', name:'OpenStreetMap',           desc:'Fond de carte standard, cycle, transport',          url:'openstreetmap.org/export/embed.html',             note:'CC-BY-SA' },
    { tag:'LIVE',    cls:'tag-live',   name:'Info-Trafic TAN',         desc:'Perturbations tram, bus, navibus Naolib',           url:'data.nantesmetropole.fr/...info-trafic-tan...',   note:'Gratuit · Sans clé' },
    { tag:'LIVE',    cls:'tag-live',   name:'Air Quality — Open-Meteo',desc:'PM10, PM2.5, NO₂, O₃, CO, SO₂, AQI',             url:'air-quality-api.open-meteo.com/v1/air-quality',   note:'Gratuit · Sans clé' },
    { tag:'LIVE',    cls:'tag-live',   name:'Horaires TAN (GTFS)',     desc:'Arrêts, circuits, horaires théoriques',             url:'data.nantesmetropole.fr/...tan-arrets-horaires...', note:'Gratuit · Open data' },
    { tag:'LIVE',    cls:'tag-live',   name:'ATMO Pays de la Loire',   desc:'Épisodes pollution, capteurs air',                  url:'data-atmo-paysdelaloire.opendatasoft.com',        note:'Open data' },
  ];

  const grid = $('apis-grid');
  if (!grid) return;
  grid.innerHTML = apis.map((api, i) => `
    <div class="api-card fade-in" style="animation-delay:${i*0.04}s">
      <div><span class="api-tag ${api.cls}">${api.tag}</span></div>
      <div>
        <div class="api-name">${api.name}</div>
        <div style="font-size:0.73rem;color:var(--text2);margin:0.2rem 0">${api.desc}</div>
        <span class="api-url">${api.url}</span>
      </div>
      <div class="api-note">${api.note}</div>
    </div>`).join('');
}

// ═══════════════════════════════════════════════════════
// CURSOR GLOW
// ═══════════════════════════════════════════════════════
function initCursor() {
  const glow = $('cursor-glow');
  if (!glow) return;
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}

// ═══════════════════════════════════════════════════════
// THEME SWITCHER
// ═══════════════════════════════════════════════════════
function initTheme() {
  const saved = localStorage.getItem('nantes-theme') || 'nuit';
  setTheme(saved);

  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      setTheme(theme);
      localStorage.setItem('nantes-theme', theme);
    });
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.querySelectorAll('.theme-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.theme === theme);
  });
}

// ═══════════════════════════════════════════════════════
// MAP TABS
// ═══════════════════════════════════════════════════════
function initMapTabs() {
  const layers = {
    mapnik:    `https://www.openstreetmap.org/export/embed.html?bbox=-1.6500%2C47.1700%2C-1.4500%2C47.2800&layer=mapnik&marker=47.2184%2C-1.5536`,
    cycle:     `https://www.openstreetmap.org/export/embed.html?bbox=-1.6500%2C47.1700%2C-1.4500%2C47.2800&layer=cyclemap&marker=47.2184%2C-1.5536`,
    transport: `https://www.openstreetmap.org/export/embed.html?bbox=-1.6500%2C47.1700%2C-1.4500%2C47.2800&layer=transportmap&marker=47.2184%2C-1.5536`,
  };

  document.querySelectorAll('.map-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.map-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const iframe = $('map-iframe');
      if (iframe) iframe.src = layers[tab.dataset.layer];
    });
  });
}

// ═══════════════════════════════════════════════════════
// NAVBAR SCROLL
// ═══════════════════════════════════════════════════════
function initNavbar() {
  const nav = $('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 100
      ? 'rgba(8,12,16,0.97)'
      : 'rgba(8,12,16,0.92)';
  });
}

// ═══════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCursor();
  initHeroCanvas();
  startClock();
  initNavbar();
  initMapTabs();
  renderAPIs();

  // API calls
  loadMeteo();
  loadAir();
  loadTransports();
  loadBicloo();
  loadParkings();
  loadAgenda();
  loadVille();
  loadSoleil();
  loadWiki();

  // Auto-refresh toutes les 5 minutes
  setInterval(() => {
    loadMeteo();
    loadAir();
    loadBicloo();
    loadParkings();
    loadTransports();
  }, 5 * 60 * 1000);
});
