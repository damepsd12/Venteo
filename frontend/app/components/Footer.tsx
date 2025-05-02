// frontend/components/Footer.tsx

import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram, FaShoppingBag} from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-100 bottom-0 left-0 border-t mt-10 text-sm text-gray-600">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Bloc 1 : Branding */}
        <div>
          <div className='text-xl font-bold text-yellow-500 flex items-center'>
              <FaShoppingBag size={24} />
              <span className="ml-2">Venteo</span>
          </div>
          <p className="mt-2">
            La plateforme idéale pour vendre et acheter facilement entre particuliers et professionnels.
          </p>
        </div>

        {/* Bloc 2 : Liens */}
        <div>
          <h3 className="font-semibold mb-2">Liens utiles</h3>
          <ul className="space-y-1">
            <li><Link href="dashboard" className="hover:underline">Accueil</Link></li>
            <li><Link href="/about" className="hover:underline">À propos</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            <li><Link href="/cgv" className="hover:underline">CGU / CGV</Link></li>
          </ul>
        </div>

        {/* Bloc 3 : Réseaux sociaux */}
        <div>
          <h3 className="font-semibold mb-2">Suivez-nous</h3>
          <div className="flex space-x-4 mt-2">
            <a href="#" className="hover:text-blue-600"><FaFacebookF /></a>
            <a href="#" className="hover:text-blue-400"><FaTwitter /></a>
            <a href="#" className="hover:text-pink-500"><FaInstagram /></a>
          </div>
        </div>
      </div>

      {/* Bas de page */}
      <div className="border-t py-4 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} MultiMarket. Tous droits réservés.
      </div>
    </footer>
  );
}


  