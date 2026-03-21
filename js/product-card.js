/**
 * js/product-card.js — TechNova
 *
 * Web Component personalizado: <product-card>
 * Encapsula su estructura y estilos usando Shadow DOM.
 *
 * Atributos:
 *   nombre      — nombre del producto
 *   precio      — precio numérico (COP)
 *   descripcion — descripción breve
 *   categoria   — categoría del producto
 *   badge       — etiqueta opcional (Nuevo, Oferta, etc.)
 */
class ProductCard extends HTMLElement {

  static get observedAttributes() {
    return ['nombre', 'precio', 'descripcion', 'categoria', 'badge'];
  }

  constructor() {
    super();
    /* Adjuntar Shadow DOM en modo abierto */
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback()        { this.render(); }
  attributeChangedCallback() { this.render(); }

  /**
   * Formatea un número como precio en pesos colombianos.
   * @param {string|number} valor
   * @returns {string}
   */
  formatearPrecio(valor) {
    const num = parseFloat(valor);
    if (isNaN(num)) return valor;
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(num);
  }

  render() {
    const nombre      = this.getAttribute('nombre')      || 'Producto';
    const precio      = this.getAttribute('precio')      || '0';
    const descripcion = this.getAttribute('descripcion') || '';
    const categoria   = this.getAttribute('categoria')   || '';
    const badge       = this.getAttribute('badge')       || '';

    this.shadowRoot.innerHTML = `
      <style>
        /* Estilos encapsulados en Shadow DOM */
        :host { display: block; }
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .card {
          border: 1px solid #000;
          display: flex;
          flex-direction: column;
          font-family: sans-serif;
          font-size: 14px;
          color: #111;
        }

        .card:hover { outline: 2px solid #000; }

        .card-top {
          border-bottom: 1px solid #000;
          background: #f5f5f5;
          padding: 14px 10px;
          text-align: center;
          min-height: 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        .card-top strong { font-size: 13px; }
        .card-top small  { font-size: 11px; color: #555; }

        .badge-lbl {
          border: 1px solid #000;
          font-size: 10px;
          padding: 1px 6px;
        }

        .wc-label {
          border: 1px dashed #000;
          font-size: 9px;
          text-transform: uppercase;
          padding: 1px 5px;
        }

        .card-body {
          padding: 9px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .card-cat  { font-size: 10px; text-transform: uppercase; letter-spacing: .05em; }
        .card-name { font-size: 13px; font-weight: bold; }
        .card-desc { font-size: 12px; color: #555; line-height: 1.4; flex: 1; }

        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid #ccc;
        }

        .card-price { font-size: 13px; font-weight: bold; }

        .btn-add {
          border: 1px solid #000;
          background: #fff;
          padding: 4px 9px;
          font-size: 11px;
          cursor: pointer;
          font-family: sans-serif;
        }

        .btn-add:hover { background: #000; color: #fff; }
        .btn-add.added { background: #000; color: #fff; }
      </style>

      <div class="card">
        <div class="card-top">
          ${badge ? `<span class="badge-lbl">${badge}</span>` : ''}
          <strong>${nombre}</strong>
          <small>${categoria}</small>
          <span class="wc-label">Web Component</span>
        </div>
        <div class="card-body">
          <span class="card-cat">${categoria}</span>
          <h3 class="card-name">${nombre}</h3>
          <p class="card-desc">${descripcion}</p>
          <div class="card-footer">
            <span class="card-price">${this.formatearPrecio(precio)}</span>
            <button class="btn-add">+ Agregar</button>
          </div>
        </div>
      </div>`;

    /* Evento del botón dentro del Shadow DOM */
    this.shadowRoot.querySelector('.btn-add').addEventListener('click', (e) => {
      /* Disparar evento personalizado hacia el documento principal */
      this.dispatchEvent(new CustomEvent('agregar-producto', {
        bubbles: true,
        composed: true,
        detail: { nombre }
      }));
      const btn = e.target;
      btn.textContent = 'Agregado';
      btn.classList.add('added');
      setTimeout(() => {
        btn.textContent = '+ Agregar';
        btn.classList.remove('added');
      }, 2000);
    });
  }
}

customElements.define('product-card', ProductCard);
