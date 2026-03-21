/**
 * js/main.js — TechNova
 *
 * Lógica principal de la aplicación:
 *   1. Verificar que hay sesión activa.
 *   2. Cargar fragmentos (header, sidebar, footer).
 *   3. Renderizar productos destacados con <template>.
 *   4. Cargar catálogo desde products.json con fetch + Web Component.
 *   5. Filtro de categorías.
 */

/* ── 1. Verificar sesión ──────────────────────────────── */
function verificarSesion() {
  if (sessionStorage.getItem('tn-sesion') !== 'activa') {
    window.location.href = 'login.html';
  }
}

/* ── 2. Post-carga de fragmentos ─────────────────────── */

/** Vincula el botón de cerrar sesión del header. */
function vincularLogout() {
  const btn = document.getElementById('btn-logout');
  if (btn) {
    btn.addEventListener('click', function() {
      sessionStorage.removeItem('tn-sesion');
      sessionStorage.removeItem('tn-usuario');
      window.location.href = 'login.html';
    });
  }
}

/** Muestra el nombre del usuario en el sidebar. */
function mostrarUsuario() {
  const el = document.getElementById('sidebar-username');
  if (el) el.textContent = sessionStorage.getItem('tn-usuario') || 'admin';
}

/* ── 3. Renderizado con <template> ───────────────────── */

/** Datos para los productos destacados (usados con <template>). */
const PRODUCTOS_DESTACADOS = [
  { nombre: 'Laptop TechNova X1',  precio: 3499900, descripcion: 'Intel Core i7 13va gen, 16GB RAM DDR5, 512GB NVMe SSD.', categoria: 'Laptops',     badge: 'Nuevo'      },
  { nombre: 'Smartphone TN-S23',   precio: 2199900, descripcion: 'Pantalla AMOLED 6.5", cámara triple 108MP, 5000mAh.',    categoria: 'Smartphones', badge: 'Top ventas' },
  { nombre: 'Auriculares TN-Pro',  precio: 459900,  descripcion: 'Cancelación de ruido activa, 40h batería, Bluetooth 5.3.',categoria: 'Audio',       badge: 'Oferta'     }
];

/**
 * Formatea un número como precio en pesos colombianos.
 * @param {number} valor
 * @returns {string}
 */
function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(valor);
}

/** Contador de artículos en el carrito. */
let contadorCarrito = 0;

/**
 * Agrega un producto al carrito y actualiza el contador en el header.
 * @param {string} nombre - Nombre del producto agregado.
 */
function agregarAlCarrito(nombre) {
  contadorCarrito++;
  const el = document.getElementById('cart-count');
  if (el) el.textContent = contadorCarrito;
}

/**
 * Clona el <template id="producto-template"> por cada producto
 * y lo agrega al contenedor #productos-template.
 *
 * @param {Array} lista - Lista de objetos producto.
 */
function renderizarConTemplate(lista) {
  const plantilla  = document.getElementById('producto-template');
  const contenedor = document.getElementById('productos-template');
  if (!plantilla || !contenedor) return;

  contenedor.innerHTML = '';

  lista.forEach(function(p) {
    /* Clonar el contenido de la plantilla */
    const clon = plantilla.content.cloneNode(true);

    clon.querySelector('.product-img-name').textContent = p.nombre;
    clon.querySelector('.product-img-cat').textContent  = p.categoria;
    const badge = clon.querySelector('.product-badge');
    if (p.badge) { badge.textContent = p.badge; } else { badge.style.display = 'none'; }
    clon.querySelector('.product-cat').textContent   = p.categoria;
    clon.querySelector('.product-name').textContent  = p.nombre;
    clon.querySelector('.product-desc').textContent  = p.descripcion;
    clon.querySelector('.product-price').textContent = formatearPrecio(p.precio);

    clon.querySelector('.btn-add-cart').addEventListener('click', function() {
      agregarAlCarrito(p.nombre);
      this.textContent = 'Agregado';
      this.classList.add('added');
      var self = this;
      setTimeout(function() {
        self.textContent = '+ Agregar';
        self.classList.remove('added');
      }, 2000);
    });

    contenedor.appendChild(clon);
  });
}

/* ── 4. Fetch + Web Component ────────────────────────── */

/** Catálogo completo cargado desde JSON. */
let catalogoCompleto = [];

/**
 * Carga products.json con fetch y renderiza con <product-card>.
 * Si fetch falla (file://), usa los productos destacados como respaldo.
 */
async function cargarProductosConFetch() {
  const contenedor = document.getElementById('productos-fetch');
  if (!contenedor) return;

  contenedor.innerHTML = '<p class="loading-msg">Cargando catálogo...</p>';

  try {
    const respuesta = await fetch('data/products.json');
    if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);
    catalogoCompleto = await respuesta.json();
  } catch {
    /* Respaldo: datos del array local */
    catalogoCompleto = [
      { nombre: 'Laptop TechNova X1',  precio: 3499900, descripcion: 'Intel Core i7 13va gen, 16GB RAM DDR5, 512GB NVMe SSD.', categoria: 'Laptops',     badge: 'Nuevo'      },
      { nombre: 'Smartphone TN-S23',   precio: 2199900, descripcion: 'Pantalla AMOLED 6.5", cámara triple 108MP, 5000mAh.',    categoria: 'Smartphones', badge: 'Top ventas' },
      { nombre: 'Auriculares TN-Pro',  precio: 459900,  descripcion: 'Cancelación de ruido activa, 40h batería, Bluetooth 5.3.',categoria: 'Audio',       badge: 'Oferta'     },
      { nombre: 'Monitor TN-4K 27"',   precio: 1899900, descripcion: 'Panel IPS 4K 144Hz, HDR400, G-Sync compatible.',          categoria: 'Monitores',   badge: 'Gaming'     },
      { nombre: 'Tablet TN-Tab 11',    precio: 1299900, descripcion: 'Pantalla OLED 11", chip octa-core, 128GB storage.',       categoria: 'Tablets',     badge: 'Nuevo'      },
      { nombre: 'Mouse TN-Precision',  precio: 219900,  descripcion: '25600 DPI, 7 botones programables, peso ajustable.',      categoria: 'Periféricos', badge: ''           }
    ];
  }

  renderizarWebComponents(catalogoCompleto, contenedor);
}

/**
 * Crea elementos <product-card> para cada producto.
 * @param {Array}       lista     - Productos a mostrar.
 * @param {HTMLElement} contenedor
 */
function renderizarWebComponents(lista, contenedor) {
  contenedor.innerHTML = '';
  if (!lista.length) {
    contenedor.innerHTML = '<p class="loading-msg">No hay productos en esta categoría.</p>';
    return;
  }
  lista.forEach(function(p) {
    const tarjeta = document.createElement('product-card');
    tarjeta.setAttribute('nombre',      p.nombre);
    tarjeta.setAttribute('precio',      p.precio);
    tarjeta.setAttribute('descripcion', p.descripcion);
    tarjeta.setAttribute('categoria',   p.categoria || '');
    tarjeta.setAttribute('badge',       p.badge     || '');

    /* Escuchar el evento personalizado del Web Component */
    tarjeta.addEventListener('agregar-producto', function(e) {
      agregarAlCarrito(e.detail.nombre);
    });

    contenedor.appendChild(tarjeta);
  });
}

/* ── 5. Filtro de categorías ─────────────────────────── */

/** Inicializa los botones de filtro de categoría. */
function inicializarFiltros() {
  const chips      = document.querySelectorAll('.cat-chip');
  const contenedor = document.getElementById('productos-fetch');

  chips.forEach(function(chip) {
    chip.addEventListener('click', function() {
      chips.forEach(function(c) { c.classList.remove('active'); });
      chip.classList.add('active');

      const categoria = chip.dataset.cat;
      const filtrados = categoria === 'todos'
        ? catalogoCompleto
        : catalogoCompleto.filter(function(p) { return p.categoria === categoria; });

      renderizarWebComponents(filtrados, contenedor);
    });
  });
}

/* ── Inicialización ──────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async function() {
  verificarSesion();

  /* cargarFragmentos viene de fragments-loader.js */
  await cargarFragmentos();

  vincularLogout();
  mostrarUsuario();

  renderizarConTemplate(PRODUCTOS_DESTACADOS);
  await cargarProductosConFetch();
  inicializarFiltros();
});
