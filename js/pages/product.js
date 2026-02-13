import { getProducts } from '../data.js';
import { initApp, money } from '../app.js';
import { cartStore } from '../store.js';

async function render() {
  const products = await getProducts();
  const slug = new URLSearchParams(location.search).get('slug');
  const p = products.find((x) => x.slug === slug) || products[0];
  document.querySelector('#productView').innerHTML = `<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.1rem"><img src="${p.images[0]}" alt="${p.name}"/><div><h1>${p.name}</h1><div class="price-row"><strong>${money(p.price)}</strong><span class="price-old">${money(p.compareAtPrice)}</span></div><p>${p.description}</p><p><strong>Stock:</strong> ${p.stock}</p><div class="grid" style="grid-template-columns:80px 1fr"><input id="qty" type="number" min="1" value="1" aria-label="Quantité"><button class="btn btn-primary" id="add">Add to cart</button></div></div></div>`;
  document.querySelector('#add').addEventListener('click', () => cartStore.add(p, Number(document.querySelector('#qty').value || 1)));
  document.querySelector('#acc').innerHTML = [`Description|${p.description}`, `Ingrédients|${p.ingredients}`, `Allergènes|${p.allergens}`].map((a) => {
    const [t, v] = a.split('|');
    return `<div class="accordion-item"><button class="accordion-trigger">${t}</button><div class="accordion-panel">${v}</div></div>`;
  }).join('');
  document.querySelectorAll('.accordion-trigger').forEach((btn) => btn.addEventListener('click', () => btn.parentElement.classList.toggle('active')));
  document.querySelector('#related').innerHTML = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4).map((x) => `<a class="card" href="product.html?slug=${x.slug}">${x.name}</a>`).join('');
}

initApp().then(render);
