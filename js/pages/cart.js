import { initApp, money } from '../app.js';
import { cartStore } from '../store.js';

function draw() {
  const items = cartStore.getItems();
  document.querySelector('#cartRows').innerHTML = items.map((i) => `<div class="table-row"><span>${i.name}</span><div><button class="btn btn-ghost" data-dec="${i.id}">-</button> ${i.qty} <button class="btn btn-ghost" data-inc="${i.id}">+</button></div><strong>${money(i.price * i.qty)}</strong><button class="btn btn-ghost" data-rm="${i.id}">Retirer</button></div>`).join('') || '<p>Votre panier est vide.</p>';
  document.querySelector('#cartTotal').textContent = money(cartStore.total());
}

initApp().then(() => {
  cartStore.subscribe(draw);
  document.body.addEventListener('click', (e) => {
    const inc = e.target.closest('[data-inc]'); const dec = e.target.closest('[data-dec]'); const rm = e.target.closest('[data-rm]');
    if (inc) { const i = cartStore.getItems().find(x => x.id === Number(inc.dataset.inc)); cartStore.update(i.id, i.qty + 1); }
    if (dec) { const i = cartStore.getItems().find(x => x.id === Number(dec.dataset.dec)); if (i.qty > 1) cartStore.update(i.id, i.qty - 1); }
    if (rm) cartStore.remove(Number(rm.dataset.rm));
  });
});
