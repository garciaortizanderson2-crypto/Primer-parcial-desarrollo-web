
function verificarSesion() {
  if (sessionStorage.getItem('tn-sesion') !== 'activa') {
    window.location.href = 'login.html';
  }
}

function vincularLogout() {
  var btn = document.getElementById('btn-logout');
  if (btn) {
    btn.addEventListener('click', function() {
      sessionStorage.removeItem('tn-sesion');
      sessionStorage.removeItem('tn-usuario');
      window.location.href = 'login.html';
    });
  }
}

function vincularToggleTema() {
  var btn = document.getElementById('btn-tema');
  if (!btn) return;

  var esDark = document.documentElement.classList.contains('dark-mode');
  btn.textContent = esDark ? '☀️ Modo claro' : '🌙 Modo oscuro';

  btn.addEventListener('click', function() {
    var activo = document.documentElement.classList.toggle('dark-mode');
    localStorage.setItem('tn-tema', activo ? 'dark' : 'light');
    this.textContent = activo ? '☀️ Modo claro' : '🌙 Modo oscuro';
    sincronizarTemaCards(); 
  });
}


function mostrarUsuario() {
  const el = document.getElementById('sidebar-username');
  if (el) el.textContent = sessionStorage.getItem('tn-usuario') || 'admin';
}

const PRODUCTOS_DESTACADOS = [
  { nombre: 'Laptop TechNova X1',  precio: 3499900, descripcion: 'Intel Core i7 13va gen, 16GB RAM DDR5, 512GB NVMe SSD.', categoria: 'Laptops',     badge: 'Nuevo'      },
  { nombre: 'Smartphone TN-S23',   precio: 2199900, descripcion: 'Pantalla AMOLED 6.5", cámara triple 108MP, 5000mAh.',    categoria: 'Smartphones', badge: 'Top ventas' },
  { nombre: 'Auriculares TN-Pro',  precio: 459900,  descripcion: 'Cancelación de ruido activa, 40h batería, Bluetooth 5.3.',categoria: 'Audio',       badge: 'Oferta'     }
];


 
function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(valor);
}

let contadorCarrito = 0;
var itemsCarrito = []; 

function agregarAlCarrito(nombre) {
  var existente = itemsCarrito.find(function(i) { return i.nombre === nombre; });
  if (existente) {
    existente.cantidad++;
  } else {
    var prod = catalogoCompleto.find(function(p) { return p.nombre === nombre; })
            || PRODUCTOS_DESTACADOS.find(function(p) { return p.nombre === nombre; });
    itemsCarrito.push({ nombre: nombre, precio: prod ? prod.precio : 0, cantidad: 1 });
  }
  contadorCarrito++;
  var el = document.getElementById('cart-count');
  if (el) {el.textContent = contadorCarrito;
   el.classList.add('visible'); 
  }
  actualizarPanelCarrito();
}

function actualizarPanelCarrito() {
  var contenedor = document.getElementById('carrito-items');
  var totalEl    = document.getElementById('carrito-total');
  if (!contenedor) return;

  if (!itemsCarrito.length) {
    contenedor.innerHTML = '<p class="carrito-vacio">El carrito está vacío.</p>';
    if (totalEl) totalEl.textContent = '$ 0';
    return;
  }

  var total = 0;
  contenedor.innerHTML = '';

  itemsCarrito.forEach(function(item) {
    total += item.precio * item.cantidad;
    var div = document.createElement('div');
    div.className = 'carrito-item';
    div.innerHTML =
      '<div class="carrito-item-info">' +
        '<p class="carrito-item-nombre">' + item.nombre + '</p>' +
        '<p class="carrito-item-precio">' + formatearPrecio(item.precio) + ' x ' + item.cantidad + '</p>' +
      '</div>' +
      '<div class="carrito-item-controles">' +
        '<button onclick="cambiarCantidad(\'' + item.nombre + '\',-1)">−</button>' +
        '<span class="carrito-item-cantidad">' + item.cantidad + '</span>' +
        '<button onclick="cambiarCantidad(\'' + item.nombre + '\',1)">+</button>' +
      '</div>';
    contenedor.appendChild(div);
  });

  if (totalEl) totalEl.textContent = formatearPrecio(total);
}

function cambiarCantidad(nombre, delta) {
  var item = itemsCarrito.find(function(i) { return i.nombre === nombre; });
  if (!item) return;
  item.cantidad += delta;
  if (item.cantidad <= 0) {
    itemsCarrito = itemsCarrito.filter(function(i) { return i.nombre !== nombre; });
  }
  contadorCarrito = itemsCarrito.reduce(function(a, i) { return a + i.cantidad; }, 0);
 var el = document.getElementById('cart-count');
if (el) {
  el.textContent = contadorCarrito;
  if (contadorCarrito > 0) {
    el.classList.add('visible');
  } else {
    el.classList.remove('visible');
  }
}
  actualizarPanelCarrito();
}

function vincularCarrito() {
  var btnAbrir  = document.getElementById('btn-carrito');
  var btnCerrar = document.getElementById('btn-cerrar-carrito');
  var panel     = document.getElementById('carrito-panel');
  var overlay   = document.getElementById('carrito-overlay');

  /* Crear el span del contador dinámicamente */
  if (btnAbrir && !document.getElementById('cart-count')) {
    var badge = document.createElement('span');
    badge.id = 'cart-count';
    badge.textContent = '0';
    btnAbrir.appendChild(badge);
  }

  if (btnAbrir) btnAbrir.addEventListener('click', function() {
    panel.classList.add('abierto');
    overlay.classList.add('visible');
  });

  if (btnCerrar) btnCerrar.addEventListener('click', cerrarCarrito);
  if (overlay)   overlay.addEventListener('click', cerrarCarrito);
}


function cerrarCarrito() {
  var panel   = document.getElementById('carrito-panel');
  var overlay = document.getElementById('carrito-overlay');
  if (panel)   panel.classList.remove('abierto');
  if (overlay) overlay.classList.remove('visible');
}
function sincronizarTemaCards() {
  var esDark = document.documentElement.classList.contains('dark-mode');
  document.querySelectorAll('product-card').forEach(function(card) {
    card.classList.toggle('dark', esDark);
  });
}

 
 
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


let catalogoCompleto = [];


async function cargarProductosConFetch() {
  const contenedor = document.getElementById('productos-fetch');
  if (!contenedor) return;

  contenedor.innerHTML = '<p class="loading-msg">Cargando catálogo...</p>';

  try {
    const respuesta = await fetch('data/products.json');
    if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);
    catalogoCompleto = await respuesta.json();
  } catch {
   
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

    
    tarjeta.addEventListener('agregar-producto', function(e) {
      agregarAlCarrito(e.detail.nombre);
    });

    contenedor.appendChild(tarjeta);
  });
}


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

document.addEventListener('DOMContentLoaded', async function() {
  verificarSesion();

  await cargarFragmentos();

  vincularLogout();
  vincularToggleTema('btn-tema');
  vincularCarrito(); 
  mostrarUsuario();

  renderizarConTemplate(PRODUCTOS_DESTACADOS);
  await cargarProductosConFetch();
  inicializarFiltros();
  sincronizarTemaCards();
});
