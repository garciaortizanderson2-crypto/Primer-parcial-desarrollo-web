function aplicarTemaGuardado() {
  if (localStorage.getItem('tn-tema') === 'dark') {
    document.documentElement.classList.add('dark-mode');
  }
}

function vincularToggleTema(idBoton) {
  var btn = document.getElementById(idBoton);
  if (!btn) return;

  var esDark = document.documentElement.classList.contains('dark-mode');
  btn.textContent = esDark ? '☀️ Modo claro' : '🌙 Modo oscuro';

  btn.addEventListener('click', function () {
    var activo = document.documentElement.classList.toggle('dark-mode');
    localStorage.setItem('tn-tema', activo ? 'dark' : 'light');
    this.textContent = activo ? '☀️ Modo claro' : '🌙 Modo oscuro';
  });
}

aplicarTemaGuardado();