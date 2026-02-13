const KEY = 'maci_cart_v1';
const listeners = new Set();

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
}
function save(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
  listeners.forEach((cb) => cb(items));
}

export const cartStore = {
  subscribe(cb) { listeners.add(cb); cb(load()); return () => listeners.delete(cb); },
  getItems: load,
  add(product, qty = 1) {
    const items = load();
    const found = items.find((i) => i.id === product.id);
    if (found) found.qty += qty;
    else items.push({ id: product.id, name: product.name, price: product.price, image: product.images?.[0], qty });
    save(items);
  },
  update(id, qty) {
    const items = load().map((i) => i.id === id ? { ...i, qty: Math.max(1, qty) } : i);
    save(items);
  },
  remove(id) { save(load().filter((i) => i.id !== id)); },
  clear() { save([]); },
  total() { return load().reduce((sum, i) => sum + i.price * i.qty, 0); }
};
