import { initApp } from '../app.js';
import { cartStore } from '../store.js';

initApp().then(() => {
  document.querySelector('#checkoutForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    document.querySelector('#confirmation').hidden = false;
    cartStore.clear();
  });
});
