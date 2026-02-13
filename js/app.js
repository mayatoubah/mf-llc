import { cartStore } from './store.js';
import { getProducts } from './data.js';

const app = {
  products: [],
  themeKey: 'maci_theme'
};

export function money(v) { return `${v.toFixed(2)} €`; }

export function toast(msg) {
  const wrap = document.querySelector('#toastWrap');
  if (!wrap) return;
  const n = document.createElement('div');
  n.className = 'toast';
  n.textContent = msg;
  wrap.appendChild(n);
  setTimeout(() => n.remove(), 2600);
}

export function productCard(product, { quick = true } = {}) {
  return `<article class="card product-card">
      <a href="product.html?slug=${encodeURIComponent(product.slug)}"><img loading="lazy" src="${product.images[0]}" alt="${product.name}"></a>
      <div class="pill">${product.category}</div>
      <strong>${product.name}</strong>
      <small>${product.origin}</small>
      <div class="price-row"><strong>${money(product.price)}</strong><span class="price-old">${money(product.compareAtPrice)}</span></div>
      <div class="grid" style="grid-template-columns:1fr ${quick ? '1fr' : ''}">
        <button class="btn btn-primary" data-add="${product.id}">Ajouter</button>
        ${quick ? `<button class="btn btn-ghost" data-quick="${product.id}">Quick view</button>` : ''}
      </div>
    </article>`;
}

function initTheme() {
  const stored = localStorage.getItem(app.themeKey) || 'light';
  document.documentElement.setAttribute('data-theme', stored);
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(app.themeKey, next);
  }));
}

function renderCartDrawer(items) {
  const list = document.querySelector('#drawerItems');
  const total = document.querySelector('#drawerTotal');
  const badges = document.querySelectorAll('[data-cart-count]');
  badges.forEach((b) => b.setAttribute('data-count', items.reduce((s, i) => s + i.qty, 0)));
  if (!list) return;
  list.innerHTML = items.length ? items.map(i => `<div class="table-row"><span>${i.name} x${i.qty}</span><strong>${money(i.price * i.qty)}</strong></div>`).join('') : '<p>Panier vide.</p>';
  total.textContent = money(items.reduce((s, i) => s + i.price * i.qty, 0));
}

function setupLayer(selector, openBtns, closeBtns) {
  const layer = document.querySelector(selector);
  if (!layer) return;
  openBtns.forEach((s) => document.querySelectorAll(s).forEach((b) => b.addEventListener('click', () => layer.classList.add('open'))));
  closeBtns.forEach((s) => layer.querySelectorAll(s).forEach((b) => b.addEventListener('click', () => layer.classList.remove('open'))));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') layer.classList.remove('open'); });
}

async function setupSearch() {
  app.products = await getProducts();
  const out = document.querySelector('#searchResults');
  const input = document.querySelector('#searchInput');
  if (!out || !input) return;
  const draw = (q = '') => {
    const k = q.trim().toLowerCase();
    out.innerHTML = app.products.filter(p => !k || p.name.toLowerCase().includes(k) || p.origin.toLowerCase().includes(k)).slice(0, 8).map(p => `<a href="product.html?slug=${p.slug}" class="card" style="display:block;margin-bottom:.5rem">${p.name} · ${p.origin} · ${money(p.price)}</a>`).join('');
  };
  draw();
  input.addEventListener('input', (e) => draw(e.target.value));
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      document.querySelector('#searchModal')?.classList.add('open');
      setTimeout(() => input.focus(), 30);
    }
  });
}

export async function initApp() {
  initTheme();
  cartStore.subscribe(renderCartDrawer);
  setupLayer('#cartDrawer', ['[data-open-cart]'], ['[data-close-layer]']);
  setupLayer('#quickView', [], ['[data-close-layer]']);
  setupLayer('#searchModal', ['[data-open-search]'], ['[data-close-layer]']);
  await setupSearch();

  document.body.addEventListener('click', async (e) => {
    const addBtn = e.target.closest('[data-add]');
    const quickBtn = e.target.closest('[data-quick]');
    if (addBtn) {
      const id = Number(addBtn.dataset.add);
      const p = app.products.find((x) => x.id === id) || (await getProducts()).find((x) => x.id === id);
      if (p) { cartStore.add(p, 1); toast('Added to cart'); }
    }
    if (quickBtn) {
      const id = Number(quickBtn.dataset.quick);
      const p = app.products.find((x) => x.id === id);
      const body = document.querySelector('#quickViewBody');
      if (!p || !body) return;
      body.innerHTML = `<div class="grid" style="grid-template-columns:1fr 1fr;gap:1rem"><img src="${p.images[0]}" alt="${p.name}"><div><h3>${p.name}</h3><p>${p.description}</p><div class="price-row"><strong>${money(p.price)}</strong><span class="price-old">${money(p.compareAtPrice)}</span></div><button class="btn btn-primary" data-add="${p.id}">Ajouter</button></div></div>`;
      document.querySelector('#quickView')?.classList.add('open');
    }
  });
}
