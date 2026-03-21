# TechNova — Tienda de Tecnología

> **Primer Parcial — Construcción de una Aplicación Web Modularizada**
> Repositorio: `Primer-parcial-desarrollo-web`

---

## 🚀 Cómo abrir el proyecto

**Sin instalar nada:** abre `login.html` directamente desde el explorador de archivos.
El proyecto incluye un sistema de respaldo que hace que todo funcione sin servidor.

**Con Live Server (recomendado):**
1. Abre la carpeta en VS Code.
2. Clic derecho en `login.html` → "Open with Live Server".

**Credenciales de demo:**
- Usuario: `admin`
- Contraseña: `technova2024`

---

## 📁 Estructura de carpetas

```
Primer-parcial-desarrollo-web/
├── login.html                   ← Página de inicio de sesión
├── index.html                   ← Página principal
├── components/
│   ├── header.html              ← Fragmento: encabezado
│   ├── sidebar.html             ← Fragmento: barra lateral
│   └── footer.html              ← Fragmento: pie de página
├── css/
│   ├── styles.css               ← Estilos globales
│   └── login.css                ← Estilos del login
├── js/
│   ├── login.js                 ← Validación del formulario
│   ├── fragments-loader.js      ← Carga dinámica de fragmentos
│   ├── main.js                  ← Lógica principal
│   └── product-card.js          ← Web Component <product-card>
├── data/
│   └── products.json            ← Catálogo de productos
└── README.md
```

---

## 🧩 ¿Qué es la modularización?

La **modularización** consiste en dividir la aplicación en partes
independientes con responsabilidad única. Cada módulo puede desarrollarse
y mantenerse por separado, lo que facilita el trabajo en equipo y la
escalabilidad del proyecto.

---

## 🔸 Fragmentos reutilizables

Archivos HTML parciales que se cargan dinámicamente con `fetch()` y se
inyectan en la página principal. Si `fetch` falla (apertura desde
`file://`), el sistema usa el HTML incrustado en `fragments-loader.js`
como respaldo automático.

```javascript
async function cargarFragmento(ruta, idSlot) {
  try {
    const respuesta = await fetch(ruta);
    slot.innerHTML  = await respuesta.text();
  } catch {
    slot.innerHTML = FRAGMENTOS[ruta]; // respaldo inline
  }
}
```

---

## 🧱 Plantillas con `<template>`

El elemento `<template>` define una estructura HTML que no se renderiza
hasta que JavaScript la clona e inserta en el DOM.

```javascript
const clon = plantilla.content.cloneNode(true);
clon.querySelector('.product-name').textContent = producto.nombre;
contenedor.appendChild(clon);
```

---

## 🌐 Web Component `<product-card>`

Elemento HTML personalizado con Shadow DOM encapsulado. Acepta atributos:
`nombre`, `precio`, `descripcion`, `categoria`, `badge`.

```javascript
class ProductCard extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); }
  render() { this.shadowRoot.innerHTML = `<style>...</style><div>...</div>`; }
}
customElements.define('product-card', ProductCard);
```

---

## 🔐 Login

Las credenciales están en el código del cliente **solo con fines educativos**.
En producción la autenticación debe hacerse en el servidor con HTTPS y
contraseñas hasheadas.

---

## ✅ Buenas prácticas aplicadas

| Categoría | Detalle |
|-----------|---------|
| camelCase en JS | `cargarFragmento`, `renderizarConTemplate`, `vincularLogout` |
| kebab-case en CSS | `.app-header`, `.product-card`, `.btn-add-cart` |
| Separación de responsabilidades | Cada archivo tiene una sola función |
| Comentarios y JSDoc | Todas las funciones documentadas |
| HTML semántico | `<header>`, `<main>`, `<aside>`, `<footer>`, `<section>` |

---

*TechNova — Proyecto educativo · Desarrollo Web · 2024*
