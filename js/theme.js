// js/theme.js
const THEMES = ['nuit', 'jour', 'aube', 'foret'];

const labels = {
  nuit:  '🌙 Nuit',
  jour:  '☀️ Jour',
  aube:  '🌅 Aube',
  foret: '🌿 Forêt',
};

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });
}

function initTheme() {
  // Injecte les boutons dans #theme-switcher
  const switcher = document.getElementById('theme-switcher');
  THEMES.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'theme-btn';
    btn.dataset.theme = t;
    btn.textContent = labels[t];
    btn.onclick = () => setTheme(t);
    switcher.appendChild(btn);
  });

  // Restaure le thème sauvegardé ou garde nuit par défaut
  const saved = localStorage.getItem('theme') || 'nuit';
  setTheme(saved);
}

initTheme();
