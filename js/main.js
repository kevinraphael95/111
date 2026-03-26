/* ═══════════════════════════════════════════════════
   NANTES DASHBOARD — MAIN.JS
   Météo · Air · Bicloo · Wikipedia · Géo · Soleil
   ═══════════════════════════════════════════════════ */

// ── CLÉS API (à remplir si besoin) ──────────────────
const JCDECAUX_KEY = 'VOTRE_CLE_JCDECAUX'; // https://developer.jcdecaux.com
const OPENAGENDA_KEY = 'VOTRE_CLE_OPENAGENDA'; // https://openagenda.com

// ── COORDONNÉES NANTES ───────────────────────────────
const LAT = 47.2184;
const LON = -1.5536;

// ════════════════════════════════════════════════════
// 01 — MÉTÉO (open-meteo.com — sans clé)
// ════════════════════════════════════════════════════
async function loadMeteo() {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}`
      + `&current=temperature_2m,apparent_temperature,relative_humidity_2m,`
      + `precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,`
      + `visibility,uv_index`
      + `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum`
      + `&timezone=Europe%2FParis&forecast_days=7`;

    const res = await fetch(url);
    const d = await res.json();
    const c = d.current;

    document.getElementById('meteo-temp').textContent = `${Math.round(c.temperature_2m)}°`;
    document.getElementById('meteo-feel').textContent = `${Math.round(c.apparent_temperature)}°C`;
    document.getElementById('meteo-humidity').textContent = `${c.relative_humidity_2m}%`;
    document.getElementById('meteo-wind').textContent = `${Math.round(c.wind_speed_10m)} km/h`;
    document.getElementById('meteo-wind-dir').textContent = windDir(c.wind_direction_10m);
    document.getElementById('meteo-precip').textContent = `${c.precipitation} mm`;
    document.getElementById('meteo-cloud').textContent = `${c.cloud_cover}%`;
    document.getElementById('meteo-vis').textContent = `${(c.visibility / 1000).toFixed(1)} km`;
    document.getElementById('meteo-uv').textContent = c.uv_index;
    document.getElementById('meteo-icon').textContent = weatherIcon(c.weather_code);
    document.getElementById('meteo-desc').textContent = weatherDesc(c.weather_code);
    document.getElementById('meteo-time').textContent = new Date().toLocaleString('fr-FR', {
      weekday: 'long', hour: '2-digit', minute: '2-digit'
    });

    // Prévisions 7 jours
    const fc = document.getElementById('forecast-container');
    fc.innerHTML = '';
    d.daily.time.forEach((day, i) => {
      const date = new Date(day);
      fc.innerHTML += `
        <div class="card fade-in">
          <div class="card-label">${date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
          <div style="font-size:1.8rem;margin:0.5rem 0">${weatherIcon(d.daily.weather_code[i])}</div>
          <div class="card-val" style="font-size:1.2rem">${Math.round(d.daily.temperature_2m_max[i])}°</div>
          <div class="card-sub">${Math.round(d.daily.temperature_2m_min[i])}° min · ${d.daily.precipitation_sum[i]}mm</div>
        </div>`;
    });
  } catch (e) {
    document.getElementById('meteo-desc').textContent = 'Erreur de chargement';
    console.error('Météo:', e);
  }
}

function windDir(deg) {
  const dirs = ['N','NE','E','SE','S','SO','O','NO'];
  return dirs[Math.round(deg / 45) % 8];
}

function weatherIcon(code) {
  if (code === 0) return '☀️';
  if (code <= 2) return '⛅';
  if (code === 3) return '☁️';
  if (code <= 48) return '🌫️';
  if (code <= 57) return '🌦️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌧️';
  if (code <= 86) return '🌨️';
  if (code <= 99) return '⛈️';
  return '🌡️';
}

function weatherDesc(code) {
  const descs = {
    0: 'Ciel dégagé', 1: 'Principalement dégagé', 2: 'Partiellement nuageux',
    3: 'Couvert', 45: 'Brouillard', 48: 'Brouillard givrant',
    51: 'Bruine légère', 53: 'Bruine modérée', 55: 'Bruine dense',
    61: 'Pluie légère', 63: 'Pluie modérée', 65: 'Pluie forte',
    71: 'Neige légère', 73: 'Neige modérée', 75: 'Neige forte',
    80: 'Averses légères', 81: 'Averses modérées', 82: 'Averses violentes',
    95: 'Orage', 96: 'Orage avec grêle', 99: 'Orage violent'
  };
  return descs[code] || 'Conditions variables';
}

// ════════════════════════════════════════════════════
// 02 — QUALITÉ DE L'AIR (open-meteo.com — sans clé)
// ════════════════════════════════════════════════════
async function loadAir() {
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${LAT}&longitude=${LON}`
      + `&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,european_aqi`;

    const res = await fetch(url);
    const d = await res.json();
    const c = d.current;

    const aqi = c.european_aqi;
    const aqiLabel = aqi <= 20 ? 'Bon' : aqi <= 40 ? 'Acceptable' : aqi <= 60 ? 'Modéré' : aqi <= 80 ? 'Mauvais' : 'Très mauvais';
    const aqiColor = aqi <= 20 ? 'var(--status-ok)' : aqi <= 40 ? '#a8d8a8' : aqi <= 60 ? 'var(--status-warn)' : aqi <= 80 ? '#e67e22' : 'var(--status-err)';

    document.getElementById('air-container').innerHTML = `
      <div class="card fade-in">
        <div class="card-label">AQI Européen</div>
        <div class="card-val" style="color:${aqiColor}">${aqi}</div>
        <div class="card-sub">${aqiLabel}</div>
      </div>
      <div class="card fade-in">
        <div class="card-label">PM10</div>
        <div class="card-val">${c.pm10?.toFixed(1) ?? '—'}</div>
        <div class="card-sub">µg/m³</div>
      </div>
      <div class="card fade-in">
        <div class="card-label">PM2.5</div>
        <div class="card-val">${c.pm2_5?.toFixed(1) ?? '—'}</div>
        <div class="card-sub">µg/m³</div>
      </div>
      <div class="card fade-in">
        <div class="card-label">NO₂</div>
        <div class="card-val">${c.nitrogen_dioxide?.toFixed(1) ?? '—'}</div>
        <div class="card-sub">µg/m³</div>
      </div>
      <div class="card fade-in">
        <div class="card-label">Ozone</div>
        <div class="card-val">${c.ozone?.toFixed(1) ?? '—'}</div>
        <div class="card-sub">µg/m³</div>
      </div>
      <div class="card fade-in">
        <div class="card-label">CO</div>
        <div class="card-val">${c.carbon_monoxide?.toFixed(0) ?? '—'}</div>
        <div class="card-sub">µg/m³</div>
      </div>`;

    // Barre AQI
    const bar = document.getElementById('aqi-bar-section');
    bar.style.display = 'block';
    document.getElementById('aqi-cursor').style.left = `${Math.min(aqi, 100)}%`;
  } catch (e) {
    document.getElementById('air-container').innerHTML = '<div class="card"><span class="error-text">Erreur chargement qualité de l\'air</span></div>';
    console.error('Air:', e);
  }
}

// ════════════════════════════════════════════════════
// 03+04 — BICLOO (JCDecaux — clé gratuite requise)
// ════════════════════════════════════════════════════
async function loadBicloo() {
  if (JCDECAUX_KEY === 'VOTRE_CLE_JCDECAUX') {
    document.getElementById('velo-grid').innerHTML = '<div class="card" style="grid-column:1/-1"><span class="error-text">⚠️ Clé JCDecaux manquante — inscrivez-vous sur developer.jcdecaux.com</span></div>';
    document.getElementById('velo-transport-status').textContent = '⚠️ Clé manquante';
    return;
  }
  try {
    const url = `https://api.jcdecaux.com/vls/v1/stations?contract=nantes&apiKey=${JCDECAUX_KEY}`;
    const res = await fetch(url);
    const stations = await res.json();

    const active = stations.filter(s => s.status === 'OPEN');
    const totalBikes = active.reduce((a, s) => a + s.available_bikes, 0);
    const totalDocks = active.reduce((a, s) => a + s.available_bike_stands, 0);
    const totalSlots = active.reduce((a, s) => a + s.bike_stands, 0);
    const rate = Math.round((totalBikes / totalSlots) * 100);

    document.getElementById('velo-stations').textContent = active.length;
    document.getElementById('velo-bikes').textContent = totalBikes;
    document.getElementById('velo-docks').textContent = totalDocks;
    document.getElementById('velo-rate').textContent = `${rate}%`;
    document.getElementById('velo-total-stations').textContent = active.length;
    document.getElementById('velo-transport-status').innerHTML = '<span class="status-ok">● En service</span>';

    // Grid stations (top 24)
    const grid = document.getElementById('velo-grid');
    grid.innerHTML = '';
    active.slice(0, 24).forEach(s => {
      const pct = s.bike_stands > 0 ? Math.round((s.available_bikes / s.bike_stands) * 100) : 0;
      grid.innerHTML += `
        <div class="velo-card fade-in">
          <div class="velo-name">${s.name.replace(/^[0-9]+ - /, '')}</div>
          <div class="velo-bar-wrap">
            <div class="velo-bar-outer"><div class="velo-bar-inner" style="width:${pct}%"></div></div>
            <div class="velo-count">${s.available_bikes}</div>
          </div>
          <div class="velo-docks">${s.available_bike_stands} places libres</div>
        </div>`;
    });
  } catch (e) {
    document.getElementById('velo-grid').innerHTML = '<div class="card" style="grid-column:1/-1"><span class="error-text">Erreur chargement Bicloo</span></div>';
    console.error('Bicloo:', e);
  }
}

// ════════════════════════════════════════════════════
// 05 — AGENDA (OpenAgenda — clé gratuite requise)
// ════════════════════════════════════════════════════
async function loadAgenda() {
  if (OPENAGENDA_KEY === 'VOTRE_CLE_OPENAGENDA') {
    document.getElementById('agenda-container').innerHTML = `
      <div class="event-item">
        <div class="event-date">—</div>
        <div><span class="error-text">⚠️ Clé OpenAgenda manquante — inscrivez-vous sur openagenda.com</span></div>
      </div>`;
    return;
  }
  try {
    // Agenda officiel de Nantes Métropole
    const agendaUid = '96579854';
    const url = `https://api.openagenda.com/v2/agendas/${agendaUid}/events?key=${OPENAGENDA_KEY}&size=8&lang=fr`;
    const res = await fetch(url);
    const d = await res.json();

    const container = document.getElementById('agenda-container');
    container.innerHTML = '';

    if (!d.events || d.events.length === 0) {
      container.innerHTML = '<div class="event-item"><div class="event-date">—</div><div>Aucun événement trouvé</div></div>';
      return;
    }

    d.events.forEach(ev => {
      const debut = ev.timings?.[0]?.begin ? new Date(ev.timings[0].begin) : null;
      const dateStr = debut ? debut.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
      const title = ev.title?.fr || ev.title?.en || 'Événement';
      const lieu = ev.location?.name || '';
      const cat = ev.keywords?.fr?.[0] || '';

      container.innerHTML += `
        <div class="event-item fade-in">
          <div class="event-date">${dateStr}</div>
          <div>
            <div class="event-title">${title}</div>
            ${lieu ? `<div class="event-venue">📍 ${lieu}</div>` : ''}
          </div>
          ${cat ? `<div class="event-cat">${cat}</div>` : ''}
        </div>`;
    });
  } catch (e) {
    document.getElementById('agenda-container').innerHTML = '<div class="event-item"><div class="event-date">—</div><div><span class="error-text">Erreur chargement agenda</span></div></div>';
    console.error('Agenda:', e);
  }
}

// ════════════════════════════════════════════════════
// 06 — NANTES EN CHIFFRES (geo.api.gouv.fr — sans clé)
// ════════════════════════════════════════════════════
async function loadVille() {
  try {
    const res = await fetch('https://geo.api.gouv.fr/communes/44109?fields=nom,code,codesPostaux,codeDepartement,codeRegion,population,surface,centre,contour');
    const d = await res.json();

    document.getElementById('ville-pop').textContent = d.population?.toLocaleString('fr-FR') ?? '—';
    document.getElementById('ville-surface').textContent = d.surface ? (d.surface / 100).toFixed(1) : '—';

    document.getElementById('ville-codes').innerHTML = `
      <strong>Code INSEE</strong> ${d.code}<br>
      <strong>Code postal</strong> ${d.codesPostaux?.join(', ')}<br>
      <strong>Département</strong> ${d.codeDepartement} — Loire-Atlantique<br>
      <strong>Région</strong> ${d.codeRegion} — Pays de la Loire<br>
    `;

    const [lon, lat] = d.centre?.coordinates ?? [LON, LAT];
    document.getElementById('ville-geo').innerHTML = `
      <strong>Latitude</strong> ${lat.toFixed(4)}°N<br>
      <strong>Longitude</strong> ${Math.abs(lon).toFixed(4)}°O<br>
      <strong>Superficie</strong> ${d.surface ? (d.surface / 100).toFixed(2) : '—'} km²<br>
      <strong>Densité</strong> ${d.population && d.surface ? Math.round(d.population / (d.surface / 100)) : '—'} hab/km²<br>
    `;
  } catch (e) {
    console.error('Ville:', e);
  }
}

// ════════════════════════════════════════════════════
// 07 — WIKIPEDIA (sans clé)
// ════════════════════════════════════════════════════
async function loadWiki() {
  try {
    const res = await fetch('https://fr.wikipedia.org/api/rest_v1/page/summary/Nantes');
    const d = await res.json();

    document.getElementById('wiki-content').textContent = d.extract;
    document.getElementById('wiki-meta').innerHTML = `
      <span>📖 Wikipedia · fr</span>
      <a href="${d.content_urls?.desktop?.page}" target="_blank">Lire l'article complet →</a>
      <span>Dernière modification : ${new Date(d.timestamp).toLocaleDateString('fr-FR')}</span>
    `;
  } catch (e) {
    document.getElementById('wiki-content').innerHTML = '<span class="error-text">Erreur chargement Wikipedia</span>';
    console.error('Wiki:', e);
  }
}

// ════════════════════════════════════════════════════
// 08 — SOLEIL & ASTRONOMIE (open-meteo.com — sans clé)
// ════════════════════════════════════════════════════
async function loadSoleil() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}`
      + `&daily=sunrise,sunset,daylight_duration,sunshine_duration`
      + `&timezone=Europe%2FParis&start_date=${today}&end_date=${today}`;

    const res = await fetch(url);
    const d = await res.json();

    const sunrise = new Date(d.daily.sunrise[0]);
    const sunset = new Date(d.daily.sunset[0]);
    const daylight = d.daily.daylight_duration[0];
    const sunshine = d.daily.sunshine_duration[0];

    const fmt = (dt) => dt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const toHM = (s) => `${Math.floor(s / 3600)}h${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}`;

    document.getElementById('sun-container').innerHTML = `
      <div class="card fade-in"><div class="card-label">Lever du soleil</div><div class="card-val">${fmt(sunrise)}</div></div>
      <div class="card fade-in"><div class="card-label">Coucher du soleil</div><div class="card-val">${fmt(sunset)}</div></div>
      <div class="card fade-in"><div class="card-label">Durée du jour</div><div class="card-val">${toHM(daylight)}</div></div>
      <div class="card fade-in"><div class="card-label">Ensoleillement</div><div class="card-val">${toHM(sunshine)}</div></div>
    `;
  } catch (e) {
    document.getElementById('sun-container').innerHTML = '<div class="card"><span class="error-text">Erreur chargement soleil</span></div>';
    console.error('Soleil:', e);
  }
}

// ════════════════════════════════════════════════════
// INIT — tout charger au démarrage
// ════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  loadMeteo();
  loadAir();
  loadBicloo();
  loadAgenda();
  loadVille();
  loadWiki();
  loadSoleil();

  // Rafraîchissement auto toutes les 5 minutes
  setInterval(() => {
    loadMeteo();
    loadAir();
    loadBicloo();
  }, 5 * 60 * 1000);
});
