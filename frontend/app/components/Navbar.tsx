'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

export default function Navbar() {
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
          className="w-full border border-gray-300 rounded-md px-4 py-2"
        />
      </div>

      {/* Panier + Auth */}
      <div className="flex items-center gap-4">
        <Link href="/cart" className="relative">
          <ShoppingCart className="w-6 h-6 text-gray-700" />
          {/* <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">2</span> */}
        </Link>

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

