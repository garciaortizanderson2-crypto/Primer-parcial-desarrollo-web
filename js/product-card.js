class ProductCard extends HTMLElement {

  static get observedAttributes() {
    return ['nombre', 'precio', 'descripcion', 'categoria', 'badge', 'imagen'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

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
    const nombre = this.getAttribute('nombre') || 'Producto';
    const precio = this.getAttribute('precio') || '0';
    const descripcion = this.getAttribute('descripcion') || '';
    const categoria = this.getAttribute('categoria') || '';
    const badge = this.getAttribute('badge') || '';
    const imagen = this.getAttribute('imagen') || '';

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .card {
          background: #ffffff;
          border: 1px solid rgba(180,100,20,.2);
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          font-family: 'Segoe UI', sans-serif;
          font-size: 14px;
          color: #1a1008;
          transition: all .2s;
          box-shadow: 0 1px 3px rgba(0,0,0,.08);
          height: 100%;
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 24px rgba(232,93,0,.18);
          border-color: rgba(232,93,0,.35);
        }

        .card-top {
          background: linear-gradient(135deg, #fdf8f0, rgba(232,93,0,.04));
          border-bottom: 1px solid rgba(180,100,20,.15);
          padding: 18px 12px;
          text-align: center;
          min-height: 90px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .card-top strong { font-size: 13px; font-weight: 700; color: #1a1008; }
        .card-top small  { font-size: 11px; color: #8c7a6b; }

        .badge-lbl {
          background: linear-gradient(135deg, #e85d00, #f5a623);
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 20px;
          border: none;
        }

        .wc-label {
          background: rgba(232,93,0,.08);
          border: 1px solid rgba(232,93,0,.25);
          color: #e85d00;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          padding: 2px 6px;
          border-radius: 20px;
          letter-spacing: .04em;
        }

        .card-body {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .card-cat {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .05em;
          color: #e85d00;
        }

        .card-name { font-size: 13px; font-weight: 700; color: #1a1008; }
        .card-desc { font-size: 12px; color: #8c7a6b; line-height: 1.4; flex: 1; }

        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid rgba(180,100,20,.1);
        }

        .card-price {
          font-size: 14px;
          font-weight: 900;
          background: linear-gradient(90deg, #e85d00, #f5a623);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .btn-add {
          background: linear-gradient(135deg, #e85d00, #f5a623);
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 5px 11px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Segoe UI', sans-serif;
          transition: all .2s;
        }

        .btn-add:hover {
          transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(232,93,0,.35);
        }

        .btn-add.added {
          background: linear-gradient(135deg, #f5a623, #e85d00);
        }

        /* ── Modo oscuro ── */
:host(.dark) .card {
  background: #1a1208;
  border-color: rgba(255,120,30,.15);
  color: #f5f0e8;
}

:host(.dark) .card-top {
  background: linear-gradient(135deg, #221a0e, rgba(255,107,26,.06));
  border-bottom-color: rgba(255,120,30,.12);
}

:host(.dark) .card-top strong { color: #f5f0e8; }
:host(.dark) .card-top small  { color: #8c7a6b; }
:host(.dark) .card-name       { color: #f5f0e8; }
:host(.dark) .card-desc       { color: #8c7a6b; }
:host(.dark) .card-footer     { border-top-color: rgba(255,120,30,.1); }
      </style>

      <div class="card">
        <div class="card-top">
  ${badge ? `<span class="badge-lbl">${badge}</span>` : ''}
  ${imagen
        ? `<img src="${imagen}" alt="${nombre}" style="width:100%;height:90px;object-fit:contain;padding:4px;">`
        : `<strong>${nombre}</strong>`
      }
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

    this.shadowRoot.querySelector('.btn-add').addEventListener('click', (e) => {
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
