
function verificarSesion() {
  if (sessionStorage.getItem('tn-sesion') !== 'activa') {
    window.location.href = 'login.html';
  }
}

function vincularLogout() {
  var btn = document.getElementById('btn-logout');
  if (btn) {
    btn.addEventListener('click', function () {
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

  btn.addEventListener('click', function () {
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
  { nombre: 'Lenovo IdeaPad 1 Ryzen 3', precio: 2199900, descripcion: 'Procesador AMD Ryzen 3, 8GB RAM, 256GB SSD. Ideal para estudio y tareas básicas.', categoria: 'Laptops', badge: 'Nuevo', imagen: 'img/laptop-technova.png' },
  { nombre: 'Logitech G502 Hero', precio: 249900, descripcion: 'Mouse gaming de alta precisión.', categoria: 'Periféricos', badge: 'Gaming', imagen: 'img/periferico1.png' },
  { nombre: 'Razer DeathAdder Essential', precio: 149900, descripcion: 'Mouse ergonómico para gaming.', categoria: 'Periféricos', badge: 'Gaming', imagen: 'img/periferico2.png' },
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
  var existente = itemsCarrito.find(function (i) { return i.nombre === nombre; });
  if (existente) {
    existente.cantidad++;
  } else {
    var prod = catalogoCompleto.find(function (p) { return p.nombre === nombre; })
      || PRODUCTOS_DESTACADOS.find(function (p) { return p.nombre === nombre; });
    itemsCarrito.push({ nombre: nombre, precio: prod ? prod.precio : 0, cantidad: 1 });
  }
  contadorCarrito++;
  var el = document.getElementById('cart-count');
  if (el) {
    el.textContent = contadorCarrito;
    el.classList.add('visible');
  }
  actualizarPanelCarrito();
}

function actualizarPanelCarrito() {
  var contenedor = document.getElementById('carrito-items');
  var totalEl = document.getElementById('carrito-total');
  if (!contenedor) return;

  if (!itemsCarrito.length) {
    contenedor.innerHTML = '<p class="carrito-vacio">El carrito está vacío.</p>';
    if (totalEl) totalEl.textContent = '$ 0';
    return;
  }

  var total = 0;
  contenedor.innerHTML = '';

  itemsCarrito.forEach(function (item) {
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
  var item = itemsCarrito.find(function (i) { return i.nombre === nombre; });
  if (!item) return;
  item.cantidad += delta;
  if (item.cantidad <= 0) {
    itemsCarrito = itemsCarrito.filter(function (i) { return i.nombre !== nombre; });
  }
  contadorCarrito = itemsCarrito.reduce(function (a, i) { return a + i.cantidad; }, 0);
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
  var btnAbrir = document.getElementById('btn-carrito');
  var btnCerrar = document.getElementById('btn-cerrar-carrito');
  var panel = document.getElementById('carrito-panel');
  var overlay = document.getElementById('carrito-overlay');

  /* Crear el span del contador dinámicamente */
  if (btnAbrir && !document.getElementById('cart-count')) {
    var badge = document.createElement('span');
    badge.id = 'cart-count';
    badge.textContent = '0';
    btnAbrir.appendChild(badge);
  }

  if (btnAbrir) btnAbrir.addEventListener('click', function () {
    panel.classList.add('abierto');
    overlay.classList.add('visible');
  });

  if (btnCerrar) btnCerrar.addEventListener('click', cerrarCarrito);
  if (overlay) overlay.addEventListener('click', cerrarCarrito);
}


function cerrarCarrito() {
  var panel = document.getElementById('carrito-panel');
  var overlay = document.getElementById('carrito-overlay');
  if (panel) panel.classList.remove('abierto');
  if (overlay) overlay.classList.remove('visible');
}
function sincronizarTemaCards() {
  var esDark = document.documentElement.classList.contains('dark-mode');
  document.querySelectorAll('product-card').forEach(function (card) {
    card.classList.toggle('dark', esDark);
  });
}



function renderizarConTemplate(lista) {
  const plantilla = document.getElementById('producto-template');
  const contenedor = document.getElementById('productos-template');
  if (!plantilla || !contenedor) return;

  contenedor.innerHTML = '';

  lista.forEach(function (p) {
    /* Clonar el contenido de la plantilla */
    const clon = plantilla.content.cloneNode(true);

    clon.querySelector('.product-img-name').textContent = p.nombre;
    clon.querySelector('.product-img-cat').textContent = p.categoria;
    const badge = clon.querySelector('.product-badge');
    if (p.badge) { badge.textContent = p.badge; } else { badge.style.display = 'none'; }
    clon.querySelector('.product-cat').textContent = p.categoria;
    clon.querySelector('.product-name').textContent = p.nombre;
    clon.querySelector('.product-desc').textContent = p.descripcion;
    clon.querySelector('.product-price').textContent = formatearPrecio(p.precio);

    clon.querySelector('.btn-add-cart').addEventListener('click', function () {
      agregarAlCarrito(p.nombre);
      this.textContent = 'Agregado';
      this.classList.add('added');
      var self = this;
      setTimeout(function () {
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

      { nombre: 'Lenovo IdeaPad 1 Ryzen 3', precio: 2199900, descripcion: 'Procesador AMD Ryzen 3, 8GB RAM, 256GB SSD. Ideal para estudio y tareas básicas.', categoria: 'Laptops', badge: 'Nuevo', imagen: 'img/laptop-technova.png' },
      { nombre: 'HP 15 Core i5 12va Gen', precio: 1744900, descripcion: 'Intel Core i5, 8GB RAM, 512GB SSD. Rendimiento sólido para trabajo y multitarea.', categoria: 'Laptops', badge: 'Top ventas', imagen: 'img/smartphone-tns23.png' },
      { nombre: 'Asus VivoBook Go 15', precio: 1035000, descripcion: 'Intel Core i3, 8GB RAM, 512GB SSD. Diseño moderno y portátil', categoria: 'Laptops', badge: 'Oferta', imagen: 'img/auriculares-tnpro.png' },
      { nombre: 'Acer Aspire 5 Core i5"', precio: 2069900, descripcion: 'Intel Core i5, 8GB RAM, 512GB SSD, pantalla Full HD.', categoria: 'Laptops', badge: 'Gaming', imagen: 'img/monitor-tn4k.png' },
      { nombre: 'Lenovo V14 G4 Ryzen 5', precio: 2031000, descripcion: 'Ryzen 5, 8GB RAM, 512GB SSD. Equipo balanceado para oficina.', categoria: 'Laptops', badge: 'Nuevo', imagen: 'img/tablet-tn11.png' },
      { nombre: 'HP Pavilion 14 Táctil', precio: 2199000, descripcion: 'Convertible 2 en 1, 8GB RAM, SSD 512GB.', categoria: 'Laptops', badge: '', imagen: 'img/mouse-tnprecision.png' },
      { nombre: 'Asus VivoBook 15 i3 12GB', precio: 1499900, descripcion: '12GB RAM, 512GB SSD, excelente para productividad.', categoria: 'Laptops', badge: 'Nuevo', imagen: 'img/tablet-tn11.png' },
      { nombre: 'Acer Aspire 3 i3', precio: 1549900, descripcion: 'Intel Core i3, 8GB RAM, 256GB SSD. Económico y confiable.', categoria: 'Laptops', badge: 'Nuevo', imagen: 'img/tablet-tn11.png' },
      { nombre: 'Lenovo V15 i5 13va Gen', precio: 2479900, descripcion: '16GB RAM, 1TB SSD, alto rendimiento.', categoria: 'Laptops', badge: 'Nuevo', imagen: 'img/tablet-tn11.png' },
      { nombre: 'Lenovo ThinkPad E14', precio: 4699900, descripcion: 'Core Ultra 5, 16GB RAM, 512GB SSD. Profesional y resistente.', categoria: 'Laptops', badge: 'Nuevo', imagen: 'img/tablet-tn11.png' },

      { nombre: 'Samsung Galaxy S25 Ultra', precio: 5817000, descripcion: '256GB, 12GB RAM, cámara avanzada premium.', categoria: 'Smartphones', badge: 'Top ventas', imagen: 'img/monitor-tn4k.png' },
      { nombre: 'Xiaomi 15T 5G', precio: 2599000, descripcion: '12GB RAM, 256GB, alto rendimiento.', categoria: 'Smartphones', badge: 'Top ventas', imagen: 'img/monitor-tn4k.png' },
      { nombre: 'Redmi Note 14 Pro+ 5G', precio: 1299900, descripcion: 'Cámara de alta resolución, carga rápida.', categoria: 'Smartphones', badge: 'Top ventas', imagen: 'img/monitor-tn4k.png' },
      { nombre: 'Poco X7 5G', precio: 949900, descripcion: 'Potente procesador gaming, 8GB RAM.', categoria: 'Smartphones', badge: 'Top ventas', imagen: 'img/monitor-tn4k.png' },
      { nombre: 'Redmi Note 15 Pro', precio: 984900, descripcion: '256GB, 8GB RAM, cámara 200MP.', categoria: 'Smartphones', badge: 'Gaming', imagen: 'img/monitor-tn4k.png' },
      { nombre: 'Xiaomi Redmi 15', precio: 609900, descripcion: '256GB, batería de larga duración.', categoria: 'Smartphones', badge: 'Gaming', imagen: 'img/monitor-tn4k.png' },
      { nombre: 'Redmi 15C', precio: 472000, descripcion: 'Modelo económico, 128GB.', categoria: 'Smartphones', badge: 'Nuevo', imagen: 'img/monitor-tn4k.png' },
      { nombre: 'Samsung Galaxy S25+', precio: 2144000, descripcion: 'Pantalla AMOLED, alto rendimiento.', categoria: 'Smartphones', badge: 'Nuevo', imagen: 'img/monitor-tn4k.png' },
      { nombre: 'Poco X7 Pro 5G', precio: 1222000, descripcion: 'Rendimiento extremo para gaming.', categoria: 'Smartphones', badge: 'Oferta', imagen: 'img/monitor-tn4k.png' },
      { nombre: 'Redmi Note 14', precio: 880000, descripcion: '128GB, 6GB RAM, buen equilibrio calidad-precio..', categoria: 'Smartphones', badge: 'Oferta', imagen: 'img/monitor-tn4k.png' },

      { nombre: 'Sony WH-1000XM5', precio: 1799900, descripcion: 'Audífonos inalámbricos con cancelación de ruido premium.', categoria: 'Audio', badge: 'Top ventas', imagen: 'img/audio1.png' },
      { nombre: 'JBL Tune 510BT', precio: 199900, descripcion: 'Audífonos Bluetooth con sonido JBL Pure Bass.', categoria: 'Audio', badge: 'Oferta', imagen: 'img/audio2.png' },
      { nombre: 'AirPods Pro 2', precio: 1199900, descripcion: 'Cancelación activa de ruido y audio espacial.', categoria: 'Audio', badge: 'Top ventas', imagen: 'img/audio3.png' },
      { nombre: 'Galaxy Buds2 Pro', precio: 799900, descripcion: 'Sonido Hi-Fi y cancelación de ruido.', categoria: 'Audio', badge: 'Nuevo', imagen: 'img/audio4.png' },
      { nombre: 'Sony WF-C500', precio: 349900, descripcion: 'Audífonos compactos con gran batería.', categoria: 'Audio', badge: 'Oferta', imagen: 'img/audio5.png' },
      { nombre: 'JBL Flip 6', precio: 499900, descripcion: 'Parlante portátil resistente al agua.', categoria: 'Audio', badge: 'Top ventas', imagen: 'img/audio6.png' },
      { nombre: 'Bose QC Earbuds II', precio: 1399900, descripcion: 'Cancelación de ruido de alta gama.', categoria: 'Audio', badge: 'Premium', imagen: 'img/audio7.png' },
      { nombre: 'Logitech G435', precio: 299900, descripcion: 'Audífonos gaming inalámbricos ligeros.', categoria: 'Audio', badge: 'Gaming', imagen: 'img/audio8.png' },
      { nombre: 'HyperX Cloud II', precio: 399900, descripcion: 'Sonido envolvente 7.1 para gaming.', categoria: 'Audio', badge: 'Gaming', imagen: 'img/audio9.png' },
      { nombre: 'Redmi Buds 4 Lite', precio: 129900, descripcion: 'Audífonos económicos con buena batería.', categoria: 'Audio', badge: 'Oferta', imagen: 'img/audio10.png' },

      { nombre: 'Samsung Odyssey G5 27"', precio: 1299900, descripcion: 'Monitor QHD 165Hz ideal para gaming.', categoria: 'Monitores', badge: 'Gaming', imagen: 'img/monitor1.png' },
      { nombre: 'LG UltraGear 24GN600', precio: 899900, descripcion: '144Hz IPS con respuesta rápida.', categoria: 'Monitores', badge: 'Top ventas', imagen: 'img/monitor2.png' },
      { nombre: 'ASUS TUF VG249Q', precio: 999900, descripcion: 'Monitor gaming 144Hz con FreeSync.', categoria: 'Monitores', badge: 'Gaming', imagen: 'img/monitor3.png' },
      { nombre: 'Acer Nitro KG241Y', precio: 799900, descripcion: 'Monitor 165Hz para gaming competitivo.', categoria: 'Monitores', badge: 'Oferta', imagen: 'img/monitor4.png' },
      { nombre: 'HP M24f', precio: 699900, descripcion: 'Monitor Full HD con diseño elegante.', categoria: 'Monitores', badge: 'Nuevo', imagen: 'img/monitor5.png' },
      { nombre: 'Samsung Smart Monitor M5', precio: 1099900, descripcion: 'Monitor con funciones Smart TV.', categoria: 'Monitores', badge: 'Top ventas', imagen: 'img/monitor6.png' },
      { nombre: 'LG 27UP600-W', precio: 1499900, descripcion: 'Resolución 4K UHD ideal para diseño.', categoria: 'Monitores', badge: 'Premium', imagen: 'img/monitor7.png' },
      { nombre: 'Dell P2422H', precio: 1199900, descripcion: 'Monitor profesional ergonómico.', categoria: 'Monitores', badge: 'Oficina', imagen: 'img/monitor8.png' },
      { nombre: 'AOC 24G2SP', precio: 899900, descripcion: '165Hz IPS para gaming fluido.', categoria: 'Monitores', badge: 'Gaming', imagen: 'img/monitor9.png' },
      { nombre: 'MSI Optix G241', precio: 949900, descripcion: 'Monitor gaming 144Hz.', categoria: 'Monitores', badge: 'Gaming', imagen: 'img/monitor10.png' },

      { nombre: 'iPad 10ª generación', precio: 2299900, descripcion: 'Chip A14, pantalla Retina.', categoria: 'Tablets', badge: 'Top ventas', imagen: 'img/tablet1.png' },
      { nombre: 'Galaxy Tab S9', precio: 3499900, descripcion: 'Pantalla AMOLED de alto rendimiento.', categoria: 'Tablets', badge: 'Premium', imagen: 'img/tablet2.png' },
      { nombre: 'Xiaomi Pad 6', precio: 1799900, descripcion: 'Pantalla 144Hz y gran rendimiento.', categoria: 'Tablets', badge: 'Nuevo', imagen: 'img/tablet3.png' },
      { nombre: 'Lenovo Tab P11 Gen 2', precio: 1299900, descripcion: 'Pantalla 2K ideal multimedia.', categoria: 'Tablets', badge: 'Oferta', imagen: 'img/tablet4.png' },
      { nombre: 'Huawei MatePad 11', precio: 1899900, descripcion: 'Pantalla 120Hz y diseño premium.', categoria: 'Tablets', badge: 'Premium', imagen: 'img/tablet5.png' },
      { nombre: 'Galaxy Tab A9+', precio: 899900, descripcion: 'Tablet económica para uso diario.', categoria: 'Tablets', badge: 'Oferta', imagen: 'img/tablet6.png' },
      { nombre: 'Amazon Fire HD 10', precio: 699900, descripcion: 'Ideal para contenido multimedia.', categoria: 'Tablets', badge: 'Oferta', imagen: 'img/tablet7.png' },
      { nombre: 'Lenovo Tab M10 Plus', precio: 799900, descripcion: 'Tablet familiar con buena batería.', categoria: 'Tablets', badge: 'Nuevo', imagen: 'img/tablet8.png' },
      { nombre: 'iPad Air M1', precio: 3499900, descripcion: 'Potencia con chip M1.', categoria: 'Tablets', badge: 'Premium', imagen: 'img/tablet9.png' },
      { nombre: 'Redmi Pad SE', precio: 699900, descripcion: 'Tablet económica de pantalla grande.', categoria: 'Tablets', badge: 'Oferta', imagen: 'img/tablet10.png' },

      { nombre: 'Logitech G502 Hero', precio: 249900, descripcion: 'Mouse gaming de alta precisión.', categoria: 'Periféricos', badge: 'Gaming', imagen: 'img/periferico1.png' },
      { nombre: 'Razer DeathAdder Essential', precio: 149900, descripcion: 'Mouse ergonómico para gaming.', categoria: 'Periféricos', badge: 'Gaming', imagen: 'img/periferico2.png' },
      { nombre: 'Logitech K380', precio: 159900, descripcion: 'Teclado Bluetooth compacto.', categoria: 'Periféricos', badge: 'Top ventas', imagen: 'img/periferico3.png' },
      { nombre: 'Redragon Kumara K552', precio: 199900, descripcion: 'Teclado mecánico económico.', categoria: 'Periféricos', badge: 'Gaming', imagen: 'img/periferico4.png' },
      { nombre: 'Razer BlackWidow V3', precio: 499900, descripcion: 'Teclado mecánico RGB.', categoria: 'Periféricos', badge: 'Premium', imagen: 'img/periferico5.png' },
      { nombre: 'Logitech G733', precio: 599900, descripcion: 'Audífonos gaming inalámbricos.', categoria: 'Periféricos', badge: 'Gaming', imagen: 'img/periferico6.png' },
      { nombre: 'HyperX Alloy Core RGB', precio: 249900, descripcion: 'Teclado gaming con iluminación.', categoria: 'Periféricos', badge: 'Gaming', imagen: 'img/periferico7.png' },
      { nombre: 'Logitech MX Master 3S', precio: 499900, descripcion: 'Mouse premium para productividad.', categoria: 'Periféricos', badge: 'Premium', imagen: 'img/periferico8.png' },
      { nombre: 'Corsair HS55', precio: 299900, descripcion: 'Headset cómodo para gaming.', categoria: 'Periféricos', badge: 'Gaming', imagen: 'img/periferico9.png' },
      { nombre: 'Trust GXT 838 Combo', precio: 199900, descripcion: 'Kit teclado y mouse gaming.', categoria: 'Periféricos', badge: 'Oferta', imagen: 'img/periferico10.png' },




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
  lista.forEach(function (p) {
    const tarjeta = document.createElement('product-card');
    tarjeta.setAttribute('nombre', p.nombre);
    tarjeta.setAttribute('precio', p.precio);
    tarjeta.setAttribute('descripcion', p.descripcion);
    tarjeta.setAttribute('categoria', p.categoria || '');
    tarjeta.setAttribute('badge', p.badge || '');
    tarjeta.setAttribute('imagen', p.imagen || '');


    tarjeta.addEventListener('agregar-producto', function (e) {
      agregarAlCarrito(e.detail.nombre);
    });

    contenedor.appendChild(tarjeta);
  });
  sincronizarTemaCards();
}


function inicializarFiltros() {
  const chips = document.querySelectorAll('.cat-chip');
  const contenedor = document.getElementById('productos-fetch');

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');

      const categoria = chip.dataset.cat;
      const filtrados = categoria === 'todos'
        ? catalogoCompleto
        : catalogoCompleto.filter(function (p) { return p.categoria === categoria; });

      renderizarWebComponents(filtrados, contenedor);
    });
  });
}

document.addEventListener('DOMContentLoaded', async function () {
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
