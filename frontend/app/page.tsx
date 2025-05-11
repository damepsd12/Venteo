'use client';

import { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import Navbar from './components/Navbar';

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
  const [favoris, setFavoris] = useState<string[]>([]); // liste des IDs favoris
  const [cartCount, setCartCount] = useState(0);
  const [favorisCount, setFavorisCount] = useState(0);

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Chargement initial
  useEffect(() => {
    // Charger produits
    const fetchApprovedProducts = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:5000/api/products', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error(`Erreur: ${res.statusText}`);
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApprovedProducts();

    // Charger favoris
    const favs = localStorage.getItem('favoris');
    if (favs) {
      setFavoris(JSON.parse(favs));
    }

    // Charger compteur panier
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cartItems.length);

    // Charger compteur favoris
    const favItems = JSON.parse(localStorage.getItem('favoris') || '[]');
    setFavorisCount(favItems.length);
  }, []);

  // Fonction pour filtrer selon la recherche
  const handleSearch = (searchText: string) => {
    setSearchTerm(searchText);
    if (!searchText) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(p =>
        p.title.toLowerCase().includes(searchText.toLowerCase()) ||
        p.description.toLowerCase().includes(searchText.toLowerCase())
        // Ajoute si tu veux filtrer par catégorie, etc.
      );
      setFilteredProducts(filtered);
    }
  };

  // Fonction pour ajouter au panier
  const handleAddToCart = (product: Product) => {
    const cart = localStorage.getItem('cart');
    const cartItems = cart ? JSON.parse(cart) : [];
    cartItems.push(product);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    alert(`"${product.title}" ajouté au panier`);
    setCartCount(cartItems.length);
  };

  // Fonction pour basculer favoris
  const toggleFavori = async (productId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vous devez être connecté.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error('Erreur lors de la mise à jour');
      await fetchFavoris();
    } catch (err) {
      console.error('Erreur toggle favori:', err);
    }
  };

  // Charger favoris depuis backend
  const fetchFavoris = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setFavoris([]);
      setFavorisCount(0);
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/favorites', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Erreur lors du chargement des favoris');
      const data = await res.json();
      const favIds = data.map((fav: any) => fav.productId);
      setFavoris(favIds);
      setFavorisCount(favIds.length);
    } catch (err) {
      console.error('Erreur fetch favoris:', err);
    }
  };

  return (
    <>
      {/* Passe les compteurs à la Navbar */}
      <Navbar cartCount={cartCount} favorisCount={favoris.length}  onSearch={handleSearch}  />

      <div className="pt-20 px-4">
        <h1 className="text-2xl font-bold mb-6">Produits disponibles</h1>

        {loading ? (
          <p>Chargement des produits...</p>
        ) : products.length === 0 ? (
          <p>Aucun produit disponible.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                addToCart={handleAddToCart}
                toggleFavori={toggleFavori}
                isFavori={favoris.includes(product._id)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}