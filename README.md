# TechNova — Tienda de Tecnología

> **Primer Parcial — Construcción de una Aplicación Web Modularizada**  
> Repositorio: `Primer-parcial-desarrollo-web`

**Credenciales de demo:**
- Usuario: `admin`
- Contraseña: `technova2024`

---

## Tabla de contenido

1. [Descripción del proyecto](#descripción-del-proyecto)
2. [Estructura del proyecto](#estructura-del-proyecto)
3. [Conceptos implementados](#conceptos-implementados)
   - [Fragmentos HTML](#1-fragmentos-html)
   - [Plantillas HTML (Template)](#2-plantillas-html-template)
   - [Web Components](#3-web-components)
4. [Formulario de inicio de sesión](#formulario-de-inicio-de-sesión)
5. [Buenas prácticas aplicadas](#buenas-prácticas-aplicadas)
6. [Evidencia de colaboración en GitHub](#evidencia-de-colaboración-en-github)

---

## Descripción del proyecto

TechNova es una tienda de tecnología desarrollada como proyecto académico de Desarrollo Web. La aplicación permite al usuario iniciar sesión, explorar un catálogo de productos organizados por categorías, filtrarlos dinámicamente y agregarlos a un carrito de compras. Todo esto sin usar ningún framework externo — solo HTML, CSS y JavaScript vanilla.

---

## Estructura del proyecto

Primer-parcial-desarrollo-web/
├── components/
│   ├── carrito/
│   │   ├── carrito.css
│   │   └── carrito.html
│   ├── footer/
│   │   ├── footer.html
│   │   └── stylesFooter.css
│   ├── header/
│   │   ├── header.html
│   │   └── stylesHeader.css
│   └── sidebar/
│       ├── sidebar.html
│       └── stylesSideber.css
├── css/
│   ├── login.css
│   └── styles.css
├── data/
│   └── products.json
├── img/
├── js/
│   ├── fragments-loader.js
│   ├── login.js
│   ├── main.js
│   ├── modo.js
│   └── product-card.js
├── modos/
│   └── modos.html
├── index.html
├── login.html
└── README.md


## Conceptos implementados

### 1. Fragmentos HTML

**¿Qué son?**  
Los fragmentos son porciones de HTML que viven en archivos separados y se cargan dinámicamente dentro de la página principal. En lugar de repetir el header, sidebar y footer en cada página HTML, se definen una sola vez en su propio archivo y se insertan en donde se necesitan usando JavaScript.

**¿Cómo se implementó?**  
El archivo `js/fragments-loader.js` contiene la función `cargarFragmento()`, que usa `fetch()` para solicitar el archivo HTML del fragmento y luego inyecta su contenido en el elemento contenedor (`slot`) correspondiente mediante `innerHTML`.

```javascript
async function cargarFragmento(ruta, idSlot) {
  const slot = document.getElementById(idSlot);
  try {
    const respuesta = await fetch(ruta);
    if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);
    slot.innerHTML = await respuesta.text();
  } catch {
    // Si fetch falla (ej: abrir desde file://), usa HTML incrustado como respaldo
    slot.innerHTML = FRAGMENTOS[ruta] || '';
  }
}
```

Se implementó un **sistema dual**: si `fetch` falla (por ejemplo al abrir el proyecto directamente desde el explorador de archivos sin servidor), el sistema usa HTML incrustado en el objeto `FRAGMENTOS` como respaldo automático. Esto garantiza que la aplicación funcione tanto con Live Server como sin él.

Los fragmentos cargados son: `header`, `sidebar`, `footer` y `carrito`.

---

### 2. Plantillas HTML (Template)

**¿Qué son?**  
La etiqueta `<template>` de HTML permite definir un bloque de HTML que no se renderiza al cargar la página, sino que se mantiene inactivo hasta que JavaScript lo clona y lo inserta dinámicamente. Es ideal para generar elementos repetitivos como tarjetas de productos.

**¿Cómo se implementó?**  
En `index.html` se definió una plantilla para las tarjetas de productos destacados:

```html
<template id="producto-template">
  <div class="product-card">
    <div class="product-img-area">
      <span class="product-badge"></span>
      <img class="product-img" src="" alt="" style="display:none;">
      <strong class="product-img-name"></strong>
      <small class="product-img-cat"></small>
    </div>
    <div class="product-body">
      <span class="product-cat"></span>
      <h3 class="product-name"></h3>
      <p class="product-desc"></p>
      <div class="product-footer">
        <span class="product-price"></span>
        <button class="btn-add-cart">+ Agregar</button>
      </div>
    </div>
  </div>
</template>
```

En `main.js`, la función `renderizarConTemplate()` clona este template por cada producto y rellena sus campos con los datos correspondientes:

```javascript
const clon = plantilla.content.cloneNode(true);
clon.querySelector('.product-name').textContent = p.nombre;
clon.querySelector('.product-price').textContent = formatearPrecio(p.precio);
contenedor.appendChild(clon);
```

Esta técnica se usó para renderizar la sección **"Productos destacados"**.

---

### 3. Web Components

**¿Qué son?**  
Los Web Components son una tecnología nativa del navegador que permite crear elementos HTML personalizados y reutilizables con su propio encapsulamiento de estilos y lógica. Se componen de tres partes: Custom Elements, Shadow DOM y HTML Templates.

**¿Cómo se implementó?**  
En `js/product-card.js` se creó el Web Component `<product-card>`, que extiende `HTMLElement`:

```javascript
class ProductCard extends HTMLElement {
  static get observedAttributes() {
    return ['nombre', 'precio', 'descripcion', 'categoria', 'badge', 'imagen'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }); // Shadow DOM encapsulado
  }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  render() {
    const nombre = this.getAttribute('nombre') || 'Producto';
    // ... lee atributos y genera el HTML interno
    this.shadowRoot.innerHTML = `<style>...</style><div class="card">...</div>`;
  }
}

customElements.define('product-card', ProductCard);
```

**Características del Web Component:**
- Usa **Shadow DOM** para encapsular sus estilos, evitando conflictos con el CSS global.
- Responde a cambios en sus atributos mediante `attributeChangedCallback`.
- Emite un **Custom Event** (`agregar-producto`) cuando el usuario hace clic en "+ Agregar", que `main.js` escucha para actualizar el carrito.
- Soporta **modo oscuro** mediante la clase `:host(.dark)`.
- Muestra la imagen del producto si se le pasa el atributo `imagen`, o el nombre en texto si no hay imagen.

Se usó para renderizar el **"Catálogo completo"** con los productos cargados desde `data/products.json`.

---

## Formulario de inicio de sesión

El formulario de login (`login.html` + `js/login.js`) implementa autenticación del lado del cliente con fines educativos.

**Flujo de funcionamiento:**

1. El usuario ingresa sus credenciales y hace clic en "Ingresar".
2. Se ejecuta `validarFormulario()`, que verifica que los campos no estén vacíos y cumplan el largo mínimo (3 caracteres para usuario, 6 para contraseña).
3. Si la validación falla, se muestran mensajes de error inline bajo cada campo mediante `mostrarErrorCampo()`.
4. Si la validación es exitosa, se comparan las credenciales con las constantes `CREDENCIALES` definidas en el archivo.
5. Si coinciden, se guarda la sesión en `sessionStorage` con las claves `tn-sesion` y `tn-usuario`, y se redirige al `index.html` después de 800ms.
6. Si no coinciden, se muestra una alerta global y se limpia el campo de contraseña.

**Protección de rutas:**  
Todas las páginas protegidas llaman a `verificarSesion()` al cargarse, que verifica la existencia del valor `tn-sesion` en `sessionStorage`. Si no existe, redirige automáticamente a `login.html`.

> **Nota importante:** Las credenciales están en el código del cliente **solo con fines educativos**. En una aplicación real, la autenticación debe hacerse en el servidor con HTTPS y contraseñas hasheadas.

---

## Buenas prácticas aplicadas

**Separación de responsabilidades**  
Cada archivo tiene una única responsabilidad: `main.js` maneja la lógica de la tienda, `modo.js` maneja el tema visual, `login.js` maneja la autenticación, `fragments-loader.js` maneja la carga de fragmentos y `product-card.js` define el componente de tarjeta.

**Modularización**  
Los componentes visuales (header, sidebar, footer, carrito) están en carpetas independientes con su propio HTML y CSS, lo que facilita el mantenimiento y el trabajo en equipo.

**Persistencia del tema**  
El modo oscuro/claro se guarda en `localStorage`, de modo que la preferencia del usuario se mantiene entre sesiones. La función `aplicarTemaGuardado()` en `modo.js` lo aplica antes de que la página termine de cargar, evitando el "flash" de tema incorrecto.

**Manejo de errores con sistema de respaldo**  
El `fragments-loader.js` y `cargarProductosConFetch()` en `main.js` implementan bloques `try/catch` que garantizan que la aplicación funcione aunque fallen las peticiones de red, usando datos incrustados como respaldo.

**Encapsulamiento con Shadow DOM**  
El Web Component `<product-card>` usa Shadow DOM para aislar sus estilos del resto de la página, evitando conflictos de CSS y haciendo el componente verdaderamente reutilizable.

**Validación del lado del cliente**  
El formulario de login valida los campos antes de enviarlos, mostrando mensajes de error descriptivos al usuario en tiempo real.

**Semántica HTML**  
Se usan etiquetas semánticas como `<header>`, `<main>`, `<aside>`, `<footer>`, `<section>` y `<nav>` para mejorar la accesibilidad y el SEO.

**Variables CSS personalizadas**  
Todos los colores y valores del tema están definidos como variables CSS en `:root` y `html.dark-mode`, lo que permite cambiar el tema completo de la aplicación modificando solo esas variables.

---

## Evidencia de colaboración en GitHub

El repositorio del proyecto se encuentra en GitHub bajo el nombre `Primer-parcial-desarrollo-web`.

| Integrante | Contribuciones principales |
|---|---|
| garciaortizanderson2-crypto | Estructura inicial del proyecto, estilos CSS, modificación del login, subida de imágenes de productos |
| maryj192593 | Primer avance parcial, actualización del README, carpetas, agregando productos, edición de tema |

**Historial de commits:**

| Fecha | Commit | Autor |
|---|---|---|
| 23 mar 2026 | `Imágenes_Productos` | garciaortizanderson2-crypto |
| 23 mar 2026 | `Fusionar la rama 'main'` | maryj192593 |
| 23 mar 2026 | `agregando productos` | maryj192593 |
| 23 mar 2026 | `modificación del login` | garciaortizanderson2-crypto |
| 23 mar 2026 | `editar tema` | maryj192593 |
| 21 mar 2026 | `Estilos` | garciaortizanderson2-crypto |
| 21 mar 2026 | `Fusionar la rama 'main'` | maryj192593 |
| 21 mar 2026 | `carpetas` | maryj192593 |
| 21 mar 2026 | `Revise el archivo README para mayor claridad y contenido actualizado` | maryj192593 |
| 21 mar 2026 | `primer avance parcial` | maryj192593 |
| 14 mar 2026 | `Compromiso inicial` | garciaortizanderson2-crypto |






*TechNova — Proyecto educativo · Desarrollo Web · 2026*
