'use client';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CiLogout } from "react-icons/ci";

export default function SellerSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [seller, setSeller] = useState<{ name: string; image?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setSeller(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  const links = [
    { href: '/DashboardSeller', label: '🏠 Accueil' },
  ];

  return (
    <aside className="fixed top-0 left-0 w-64 h-full bg-gray-100 pt-25 shadow z-8">
      <div className="flex items-center mb-6 px-3">
        <div className="w-10 h-10 bg-blue-400 rounded-full me-5 flex items-center justify-center text-white text-2xl mb-2">
          {seller?.image ? (
            <img src={seller.image} alt="Photo de profil" className="w-full h-full object-cover" />
          ) : (
            <span className="text-white text-2xl">{seller?.name?.charAt(0) || 'S'}</span>
          )}
        </div>
        <div className='items-center justify-center text-2xl mb-2'>
          <h2 className="text-lg font-semibold">{seller?.name || 'Vendeur'}</h2>
          <p className="text-green-600 text-sm">En ligne</p>
        </div>
      </div>

      <nav className="flex flex-col space-y-3 px-0">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-2 rounded hover:bg-blue-100 transition-colors ${pathname === link.href ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto p-4 pt-30">
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
        >
          <CiLogout className="h-6 w-6" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
