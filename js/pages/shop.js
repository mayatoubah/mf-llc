import { getProducts } from '../data.js';
import { initApp, productCard } from '../app.js';

let all = [];
function apply() {
  const cat = document.querySelector('#fCat').value;
  const origin = document.querySelector('#fOrigin').value;
  const min = Number(document.querySelector('#fMin').value || 0);
  const max = Number(document.querySelector('#fMax').value || 9999);
  const promo = document.querySelector('#fPromo').checked;
  const stock = document.querySelector('#fStock').checked;
  const sort = document.querySelector('#sortBy').value;
  let items = all.filter(p => (!cat || p.category === cat) && (!origin || p.origin === origin) && p.price >= min && p.price <= max && (!promo || p.compareAtPrice > p.price) && (!stock || p.stock > 0));
  if (sort === 'price-asc') items.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') items.sort((a, b) => b.price - a.price);
  if (sort === 'new') items.sort((a, b) => b.id - a.id);
  document.querySelector('#shopGrid').innerHTML = items.map((p) => productCard(p)).join('') || '<p>Aucun produit.</p>';
}

async function render() {
  all = await getProducts();
  const cats = [...new Set(all.map((p) => p.category))];
  const origins = [...new Set(all.map((p) => p.origin))];
  document.querySelector('#fCat').innerHTML += cats.map(c => `<option>${c}</option>`).join('');
  document.querySelector('#fOrigin').innerHTML += origins.map(c => `<option>${c}</option>`).join('');
  ['#fCat','#fOrigin','#fMin','#fMax','#fPromo','#fStock','#sortBy'].forEach((s) => document.querySelector(s).addEventListener('input', apply));
  setTimeout(apply, 600);
}

initApp().then(render);
