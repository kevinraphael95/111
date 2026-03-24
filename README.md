/* ═══════════════════════════════════════════════════
   NANTES DASHBOARD — ui.js
   Toutes les fonctions de rendu DOM
   ═══════════════════════════════════════════════════ */

import {
  WMO_CODES, windDir, formatTime, formatDate, dayDuration,
  fetchMeteo, fetchAir, fetchVelos, fetchAgenda, fetchVille, fetchWiki,
  aqiLabel,
} from './data.js';

// ─── HELPERS DOM ───────────────────────────────────
function el(id) { return document.getElementById(id); }

function setHTML(id, html) {
  const e = el(id);
  if (e) e.innerHTML = html;
}

function setText(id, text) {
  const e = el(id);
  if (e) e.textContent = text;
}

// ─── MÉTÉO ─────────────────────────────────────────
export async function renderMeteo() {
  try {
    const d = await fetchMeteo();
    const c = d.current;
    const wmo = WMO_CODES[c.weather_code] || '🌡 Données';
    const [icon, ...descParts] = wmo.split(' ');

    setText('meteo-icon', icon);
    setText('meteo-temp', Math.round(c.temperature_2m) + '°C');
    setText('meteo-desc', descParts.join(' '));
    setText('meteo-time', 'Mis à jour ' + formatTime(c.time));
    setText('meteo-feel', Math.round(c.apparent_temperature) + '°C');
    setText('meteo-humidity', c.relative_humidity_2m + '%');
    setText('meteo-wind', Math.round(c.wind_speed_10m) + ' km/h');
    setText('meteo-wind-dir', windDir(c.wind_direction_10m));
    setText('meteo-precip', c.precipitation + ' mm');
    setText('meteo-cloud', c.cloud_cover + '%');
    setText('meteo-vis', (c.visibility / 1000).toFixed(1) + ' km');
    setText('meteo-uv', c.uv_index);

    // ─ Prévisions 7j ─
    const fc = el('forecast-container');
    if (fc) {
      fc.innerHTML = d.daily.time.map((t, i) => {
        const wmoD = WMO_CODES[d.daily.weather_code[i]] || '—';
        return `<div class="card fade-in" style="animation-delay:${i * 0.06}s">
          <div class="card-label">${formatDate(t)}</div>
          <div style="font-size:1.6rem;margin:0.4rem 0;line-height:1">${wmoD.split(' ')[0]}</div>
          <div class="card-val" style="font-size:1rem">${Math.round(d.daily.temperature_2m_max[i])}° <span style="color:var(--text-muted)">/ ${Math.round(d.daily.temperature_2m_min[i])}°</span></div>
          <div class="card-sub">${d.daily.precipitation_sum[i]} mm</div>
        </div>`;
      }).join('');
    }

    // ─ Astronomie ─
    const sunBox = el('sun-container');
    if (sunBox) {
      const items = [
        { label: 'Lever du soleil',    val: formatTime(d.daily.sunrise[0]),              icon: '🌅' },
        { label: 'Coucher du soleil',  val: formatTime(d.daily.sunset[0]),               icon: '🌇' },
        { label: 'Durée du jour',      val: dayDuration(d.daily.sunrise[0], d.daily.sunset[0]), icon: '⏱' },
        { label: 'UV max aujourd\'hui',val: d.daily.uv_index_max[0],                     icon: '☀️' },
      ];
      sunBox.innerHTML = items.map(s => `<div class="card">
        <div class="card-label">${s.label}</div>
        <div style="font-size:1.5rem;margin:0.3rem 0;line-height:1">${s.icon}</div>
        <div class="card-val" style="font-size:1.1rem">${s.val}</div>
      </div>`).join('');
    }

  } catch (e) {
    setHTML('meteo-desc', '<span class="error-text">Erreur météo — ' + e.message + '</span>');
    console.error('[Météo]', e);
  }
}

// ─── QUALITÉ DE L'AIR ──────────────────────────────
export async function renderAir() {
  const container = el('air-container');
  try {
    const d = await fetchAir();
    const c = d.current;
    const { label, color } = aqiLabel(c.european_aqi);

    const items = [
      { label: 'AQI Européen', val: c.european_aqi,                    unit: '',       note: label, clr: color },
      { label: 'PM2.5',        val: c.pm2_5?.toFixed(1),               unit: 'µg/m³' },
      { label: 'PM10',         val: c.pm10?.toFixed(1),                unit: 'µg/m³' },
      { label: 'NO₂',          val: c.nitrogen_dioxide?.toFixed(1),    unit: 'µg/m³' },
      { label: 'Ozone O₃',     val: c.ozone?.toFixed(1),              unit: 'µg/m³' },
      { label: 'SO₂',          val: c.sulphur_dioxide?.toFixed(1),     unit: 'µg/m³' },
      { label: 'CO',           val: (c.carbon_monoxide / 1000)?.toFixed(2), unit: 'mg/m³' },
    ];

    if (container) {
      container.innerHTML = items.map(item => `<div class="card">
        <div class="card-label">${item.label}</div>
        <div class="card-val" style="${item.clr ? `color:${item.clr}` : ''}">${item.val ?? '—'}</div>
        <div class="card-sub">${item.unit}${item.note ? ' · ' + item.note : ''}</div>
      </div>`).join('');
    }

    // ─ AQI Bar ─
    const barSection = el('aqi-bar-section');
    if (barSection) barSection.style.display = 'block';
    const cursor = el('aqi-cursor');
    if (cursor) {
      requestAnimationFrame(() => {
        cursor.style.left = Math.min(100, (c.european_aqi / 100) * 100) + '%';
      });
    }

  } catch (e) {
    if (container) container.innerHTML = `<div class="card"><span class="error-text">Qualité de l'air indisponible</span></div>`;
    console.error('[Air]', e);
  }
}

// ─── VÉLOS ─────────────────────────────────────────
export async function renderVelos() {
  try {
    const stations = await fetchVelos();
    const active = stations.filter(s => s.status === 'OPEN');
    const totalBikes    = active.reduce((a, s) => a + s.available_bikes, 0);
    const totalDocks    = active.reduce((a, s) => a + s.available_bike_stands, 0);
    const totalCapacity = active.reduce((a, s) => a + s.bike_stands, 0);

    setText('velo-stations', active.length);
    setText('velo-bikes', totalBikes);
    setText('velo-docks', totalDocks);
    setText('velo-rate', Math.round((totalBikes / totalCapacity) * 100) + '%');
    setText('velo-total-stations', active.length);
    setHTML('velo-transport-status', `<span class="status-ok">● ${active.length} stations actives</span>`);

    const grid = el('velo-grid');
    if (grid) {
      const top = [...active].sort((a, b) => b.available_bikes - a.available_bikes).slice(0, 24);
      grid.innerHTML = top.map(s => {
        const pct = Math.round((s.available_bikes / Math.max(s.bike_stands, 1)) * 100);
        const name = s.name.replace(/^\d+ - /, '');
        return `<div class="velo-card">
          <div class="velo-name">${name}</div>
          <div class="velo-bar-wrap">
            <div class="velo-bar-outer"><div class="velo-bar-inner" style="width:${pct}%"></div></div>
            <div class="velo-count">${s.available_bikes}</div>
          </div>
          <div class="velo-docks">${s.available_bike_stands} places libres · ${pct}%</div>
        </div>`;
      }).join('');
    }

  } catch (e) {
    // Démo sans clé
    setText('velo-stations', '102');
    setText('velo-bikes', '~850');
    setText('velo-docks', '~650');
    setText('velo-rate', '~57%');
    setText('velo-total-stations', '102');
    setHTML('velo-transport-status', `<span class="status-warn">● Clé API requise</span>`);
    setHTML('velo-grid', `<div class="card" style="grid-column:1/-1">
      <p style="font-size:0.72rem;color:var(--text-muted);line-height:1.9">
        ⚠️ Clé API JCDecaux requise pour les données temps réel.<br>
        Inscription gratuite sur <a href="https://developer.jcdecaux.com" target="_blank">developer.jcdecaux.com</a><br>
        Ajoutez votre clé dans <code style="color:var(--accent)">js/data.js → JCDECAUX_KEY</code>
      </p>
    </div>`);
    console.error('[Vélos]', e);
  }
}

// ─── AGENDA ────────────────────────────────────────
export async function renderAgenda() {
  const container = el('agenda-container');
  try {
    const d = await fetchAgenda();
    if (!d.events?.length) throw new Error('Aucun événement');

    container.innerHTML = d.events.map(ev => {
      const t = ev.timings?.[0];
      const title = ev.title?.fr || ev.title?.[''] || 'Événement';
      const cat   = ev.keywords?.[0] || 'Culture';
      return `<div class="event-item">
        <div class="event-date">${t ? formatDate(t.begin) : '—'}<br><span style="color:var(--text-muted)">${t ? formatTime(t.begin) : ''}</span></div>
        <div>
          <div class="event-title">${title}</div>
          <div class="event-venue">${ev.location?.name || ''}</div>
        </div>
        <div class="event-cat">${cat}</div>
      </div>`;
    }).join('');

  } catch (e) {
    // Données de démo
    const demo = [
      { date: 'Sam 5 Avr', time: '20h30', title: 'Concert au Lieu Unique',       lieu: 'Le Lieu Unique',       cat: 'Musique'  },
      { date: 'Dim 6 Avr', time: '15h00', title: 'Les Machines de l\'île',       lieu: 'Île de Nantes',        cat: 'Art'      },
      { date: 'Mar 8 Avr', time: '19h00', title: 'Conférence Citoyenne',         lieu: 'Maison de l\'Erdre',   cat: 'Citoyen'  },
      { date: 'Mer 9 Avr', time: '18h30', title: 'Marché nocturne Talensac',     lieu: 'Marché Talensac',      cat: 'Marché'   },
      { date: 'Ven 11 Avr',time: '21h00', title: 'Nuit du Cinéma',               lieu: 'Le Katorza',           cat: 'Cinéma'   },
      { date: 'Sam 12 Avr',time: '10h00', title: 'Vide-grenier République',      lieu: 'Pl. de la République', cat: 'Braderie' },
    ];
    if (container) {
      container.innerHTML = demo.map(ev => `<div class="event-item">
        <div class="event-date">${ev.date}<br><span style="color:var(--text-muted)">${ev.time}</span></div>
        <div>
          <div class="event-title">${ev.title}</div>
          <div class="event-venue">${ev.lieu}</div>
        </div>
        <div class="event-cat">${ev.cat}</div>
      </div>`).join('')
      + `<div class="event-item" style="font-size:0.62rem;color:var(--text-muted)">
          ⚠️ Données illustratives — clé <a href="https://openagenda.com" target="_blank">OpenAgenda</a> requise
        </div>`;
    }
    console.error('[Agenda]', e);
  }
}

// ─── VILLE ─────────────────────────────────────────
export async function renderVille() {
  try {
    const d = await fetchVille();
    setText('ville-pop', d.population?.toLocaleString('fr-FR') ?? '—');
    setText('ville-surface', d.surface ? (d.surface / 100).toFixed(1) : '65.2');

    setHTML('ville-codes', `
      <span style="color:var(--text-muted)">Code INSEE :</span> ${d.code}<br>
      <span style="color:var(--text-muted)">Code postal :</span> ${d.codesPostaux?.join(', ')}<br>
      <span style="color:var(--text-muted)">SIREN :</span> ${d.siren ?? '217441090'}<br>
      <span style="color:var(--text-muted)">Code EPCI :</span> ${d.codeEpci}<br>
      <span style="color:var(--text-muted)">Département :</span> ${d.codeDepartement} — Loire-Atlantique<br>
      <span style="color:var(--text-muted)">Région :</span> ${d.codeRegion} — Pays de la Loire
    `);

    const [lon, lat] = d.centre?.coordinates ?? [-1.5536, 47.2184];
    setHTML('ville-geo', `
      <span style="color:var(--text-muted)">Latitude :</span> ${lat.toFixed(4)}°N<br>
      <span style="color:var(--text-muted)">Longitude :</span> ${lon.toFixed(4)}°<br>
      <span style="color:var(--text-muted)">Surface :</span> ${d.surface ? (d.surface / 100).toFixed(1) : '65.2'} km²<br>
      <span style="color:var(--text-muted)">Population :</span> ${d.population?.toLocaleString('fr-FR') ?? '322 319'}<br>
      <span style="color:var(--text-muted)">Fuseau :</span> Europe/Paris (UTC+1)<br>
      <span style="color:var(--text-muted)">Altitude mairie :</span> ~8 m
    `);

  } catch (e) {
    setHTML('ville-codes', '<span class="error-text">API Géo Gouv indisponible</span>');
    console.error('[Ville]', e);
  }
}

// ─── WIKIPEDIA ─────────────────────────────────────
export async function renderWiki() {
  try {
    const d = await fetchWiki();
    setHTML('wiki-content', `<p>${d.extract}</p>`);
    setHTML('wiki-meta', `
      <span>📅 Modifié le ${new Date(d.timestamp).toLocaleDateString('fr-FR')}</span>
      <a href="${d.content_urls?.desktop?.page}" target="_blank">→ Lire sur Wikipedia</a>
      <span style="margin-left:auto;color:var(--text-muted)">${d.lang?.toUpperCase()} · ${d.description ?? ''}</span>
    `);
  } catch (e) {
    setHTML('wiki-content', '<span class="error-text">Wikipedia indisponible</span>');
    console.error('[Wiki]', e);
  }
}
