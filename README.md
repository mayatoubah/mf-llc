# Maci Food — Africa Market (Vanilla)

## Lancement
- Ouvrir le dossier dans VS Code.
- Lancer **Live Server** sur `index.html` (recommandé, nécessaire pour charger `data/products.json`).
- Alternative: `python -m http.server 8000` puis ouvrir `http://localhost:8000`.

## Navigation
- `index.html`: accueil premium + best sellers/new arrivals.
- `shop.html`: filtres, tri, quick add, quick view.
- `product.html?slug=...`: détails produit via query string.
- `cart.html`: gestion panier complète.
- `checkout.html`: formulaire checkout UI (sans paiement réel).
- Pages info: `about.html`, `contact.html`, `faq.html`, `shipping-returns.html`.

## Tester le panier
1. Ajouter des produits depuis Home/Shop/Product.
2. Ouvrir le mini-cart (icône 🛒) pour vérifier badge + total.
3. Aller sur `cart.html` pour incrémenter/décrémenter/supprimer.
4. Recharger la page: le panier persiste via `localStorage`.
5. Finaliser sur `checkout.html` (simulation de confirmation).
