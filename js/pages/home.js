import { getProducts, countries } from '../data.js';
import { initApp, productCard } from '../app.js';

async function render() {
  const products = await getProducts();
  const best = products.slice(0, 8);
  const latest = [...products].reverse().slice(0, 8);

  const section = (id, list) => {
    const el = document.querySelector(id);
    if (!el) return;
    el.innerHTML = '<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>';
    setTimeout(() => {
      el.innerHTML = list.map((p) => productCard(p)).join('');
    }, 600);
  };

  section('#bestSellers', best);
  section('#newArrivals', latest);
  const c = document.querySelector('#countryGrid');
  c.innerHTML = countries.map((country) => `<div class="card"><strong>${country}</strong><p>Produits premium importés.</p></div>`).join('');
}

initApp().then(render);
