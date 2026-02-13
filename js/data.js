export async function getProducts() {
  const res = await fetch('data/products.json');
  if (!res.ok) throw new Error('Impossible de charger les produits');
  return res.json();
}

export const countries = ['Guinea', 'Senegal', 'Mali', 'Ghana', 'Nigeria', "Côte d'Ivoire", 'Cameroon', 'Benin'];
