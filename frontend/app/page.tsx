
'use client';

import { useState, useEffect } from 'react';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  status?: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchApprovedProducts = async () => {
    const token = localStorage.getItem('token'); // si ton API nécessite auth
    try {
      const res = await fetch('http://localhost:5000/api/products', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        throw new Error(`Erreur: ${res.statusText}`);
      }

      const data: Product[] = await res.json();
      console.log('Réponse de l\'API :', data);  // Ajout d'un log pour voir la réponse

      setProducts(data); // Mettre à jour les produits
    } catch (error) {
      console.error('Erreur chargement produits approuvés:', error);
    } finally {
      setLoading(false); // Charger après avoir récupéré ou en cas d'erreur
    }
  };

  fetchApprovedProducts();
}, []); // Dépendance vide, s'exécute une seule fois au montage du composant


  return (
    <div className="pt-20 px-4">
      <h1 className="text-2xl font-bold mb-6">Produits disponibles</h1>

      {loading ? (
        <p>Chargement des produits...</p> // Affichage pendant le chargement
      ) : products.length === 0 ? (
        <p>Aucun produit disponible.</p> // Affichage si aucun produit n'est trouvé
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <a key={product._id} href={`/product/${product._id}`}>
              <div className="border rounded-xl shadow p-4 hover:shadow-lg transition">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-48 w-full object-cover rounded mb-2"
                />
                <h2 className="text-lg font-semibold">{product.title}</h2>
                <p className="text-gray-600 text-sm">{product.description}</p>
                <p className="mt-2 font-bold text-blue-600">
                  {product.price.toLocaleString()} F CFA
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
