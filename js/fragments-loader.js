/**
 * js/fragments-loader.js — TechNova
 *
 * Carga los fragmentos HTML (header, sidebar, footer) de forma dinámica.
 *
 * Sistema dual:
 *   1. Intenta cargar el archivo con fetch() — funciona con Live Server.
 *   2. Si fetch falla (apertura desde file://), usa el HTML incrustado
 *      en FRAGMENTOS como respaldo automático.
 *
 * Esto resuelve el error "No se pudo cargar components/header.html"
 * al abrir el proyecto directamente desde el explorador de archivos.
 */

/* ── Fragmentos incrustados (respaldo sin servidor) ─── */
const FRAGMENTOS = {

  'components/header.html': `
<header class="app-header">
  <a href="index.html" class="header-logo">TechNova</a>
  <nav class="header-nav">
    <a href="index.html">Inicio</a>
    <a href="#productos">Productos</a>
    <a href="#categorias">Categorías</a>
    <a href="#contacto">Contacto</a>
  </nav>
  <div class="header-actions">
    <button type="button">Buscar</button>
    <button type="button" id="btn-carrito">Carrito (<span id="cart-count">0</span>)</button>
    <button type="button" id="btn-logout">Salir</button>
  </div>
</header>`,

  'components/sidebar.html': `
<aside class="app-sidebar">
  <div class="sidebar-user">
    <strong id="sidebar-username">admin</strong>
    <span>Cliente Premium</span>
  </div>

  <p class="sidebar-group">Menú</p>
  <ul class="sidebar-menu">
    <li><a href="#inicio"    class="sidebar-link active">Inicio</a></li>
    <li><a href="#productos" class="sidebar-link">Productos</a></li>
    <li><a href="#contacto"  class="sidebar-link">Contacto</a></li>
  </ul>

  <p class="sidebar-group">Categorías</p>
  <ul class="sidebar-menu">
    <li><a href="#" class="sidebar-link">Laptops</a></li>
    <li><a href="#" class="sidebar-link">Smartphones</a></li>
    <li><a href="#" class="sidebar-link">Audio</a></li>
    <li><a href="#" class="sidebar-link">Monitores</a></li>
  </ul>
</aside>`,

  'components/footer.html': `
<footer class="app-footer" id="contacto">
  <div class="footer-cols">
    <div class="footer-brand">
      <strong>TechNova</strong>
      <p>Tecnología de vanguardia al alcance de todos. Envíos en 24h a Colombia.</p>
    </div>
    <div class="footer-col">
      <h4>Tienda</h4>
      <a href="#">Laptops</a>
      <a href="#">Smartphones</a>
      <a href="#">Audio</a>
      <a href="#">Monitores</a>
    </div>
    <div class="footer-col">
      <h4>Empresa</h4>
      <a href="#">Nosotros</a>
      <a href="#">Blog</a>
      <a href="#">Carreras</a>
    </div>
    <div class="footer-col">
      <h4>Soporte</h4>
      <a href="#">Centro de ayuda</a>
      <a href="#">Garantías</a>
      <a href="#">Devoluciones</a>
      <a href="#">Contacto</a>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© 2024 TechNova. Todos los derechos reservados.</p>
    <p>Proyecto educativo — Desarrollo Web 2024</p>
  </div>
</footer>`
};

/**
 * Carga un fragmento HTML e inyecta su contenido en el slot indicado.
 * Si fetch falla, usa el respaldo incrustado en FRAGMENTOS.
 *
 * @param {string} ruta   - Ruta relativa al archivo del fragmento.
 * @param {string} idSlot - ID del contenedor donde se inyectará.
 */
async function cargarFragmento(ruta, idSlot) {
  const slot = document.getElementById(idSlot);
  if (!slot) return;

  try {
    const respuesta = await fetch(ruta);
    if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);
    slot.innerHTML = await respuesta.text();
  } catch {
    /* Respaldo: usar HTML incrustado */
    slot.innerHTML = FRAGMENTOS[ruta] || '';
  }
}

/**
 * Carga los tres fragmentos de la interfaz en paralelo.
 */
async function cargarFragmentos() {
  await Promise.all([
    cargarFragmento('components/header/header.html',   'app-header-slot'),
cargarFragmento('components/sidebar/sidebar.html', 'app-sidebar-slot'),
cargarFragmento('components/footer/footer.html',   'app-footer-slot'),
cargarFragmento('components/carrito/carrito.html', 'app-carrito-slot') 
  ]);
}
