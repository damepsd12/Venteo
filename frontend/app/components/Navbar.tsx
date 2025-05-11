'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { FaRegHeart } from 'react-icons/fa';

interface NavbarProps {
  cartCount: number;
  favorisCount: number;
  onSearch?: (searchTerm: string) => void; // fonction callback pour remonter la recherche
}

export default function Navbar({ cartCount, favorisCount, onSearch }: NavbarProps) {
  const [localCartCount, setLocalCartCount] = useState(cartCount);
  const [localFavorisCount, setLocalFavorisCount] = useState(favorisCount);
  const [searchTerm, setSearchTerm] = useState('');

  // Mettre à jour si props changent
  useEffect(() => {
    setLocalCartCount(cartCount);
  }, [cartCount]);

  useEffect(() => {
    setLocalFavorisCount(favorisCount);
  }, [favorisCount]);

  // Écoute en temps réel si localStorage change (optionnel)
  useEffect(() => {
    const handleStorageChange = () => {
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      const favItems = JSON.parse(localStorage.getItem('favoris') || '[]');
      setLocalCartCount(cartItems.length);
      setLocalFavorisCount(favItems.length);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Gestion de la recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <nav className="bg-white fixed top-0 left-0 w-full z-10 shadow px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <Link href="/" className="text-xl font-bold text-green-600">
        <span>Venteo</span>
      </Link>

      {/* Barre de recherche */}
      <div className="flex-1 mx-4 max-w-xl">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2"
        />
      </div>

      {/* Panier + Favoris + Auth */}
      <div className="flex items-center gap-4">
        <Link href="/cart" className="relative">
          <ShoppingCart className="w-6 h-6 text-gray-700" />
          {localCartCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
              {localCartCount}
            </span>
          )}
        </Link>

        <div className="relative">
          <Link
            href="/favoris"
            className="relative text-gray-700 hover:text-green-600 transition font-medium"
          >
            <FaRegHeart className="w-6 h-6 text-gray-700" />
            {localFavorisCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                {localFavorisCount}
              </span>
            )}
          </Link>
        </div>

        <Link
          href="/auth/login"
          className="text-gray-700 hover:text-green-600 transition font-medium"
        >
          Connexion
        </Link>

        <Link
          href="/auth/register"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
        >
          Inscription
        </Link>
      </div>
    </nav>
  );
}