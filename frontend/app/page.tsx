'use client';

import { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import Navbar from './components/Navbar';
import TestSlider from './components/TestSlider';

import Slider from 'react-slick'; 
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 
import Footer from './components/Footer'
import {  FaBars, FaTshirt, FaHeartbeat, FaHome, FaHandsHelping } from "react-icons/fa";
import { MdDevices } from "react-icons/md";
import { GiFruitBowl } from "react-icons/gi";


interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  status?: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoris, setFavoris] = useState<string[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [favorisCount, setFavorisCount] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
   const [isExpanded, setIsExpanded] = useState(false);

  // Chargement initial
  useEffect(() => {
    const fetchApprovedProducts = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:5000/api/products', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error(`Erreur: ${res.statusText}`);
        const data: Product[] = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApprovedProducts();

    const favs = localStorage.getItem('favoris');
    if (favs) setFavoris(JSON.parse(favs));

    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cartItems.length);

    const favItems = JSON.parse(localStorage.getItem('favoris') || '[]');
    setFavorisCount(favItems.length);
  }, []);

  const groupByCategory = (products: Product[]) => {
    return products.reduce((acc, product) => {
      const category = product.category || 'Autres';
      if (!acc[category]) acc[category] = [];
      acc[category].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
  };

  const handleSearch = (searchText: string) => {
    setSearchTerm(searchText);
    if (!searchText) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(p =>
        p.title.toLowerCase().includes(searchText.toLowerCase()) ||
        p.description.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const handleAddToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    setCartCount(cart.length);
    alert(`"${product.title}" ajouté au panier`);
  };

  const toggleFavori = async (productId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vous devez être connecté.');
      return;
    }
    try {
      await fetch('http://localhost:5000/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });
      await fetchFavoris();
    } catch (err) {
      console.error('Erreur toggle favori:', err);
    }
  };

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

  const groupedProducts = groupByCategory(filteredProducts);

  // Slider pour chaque catégorie
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 640, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };
 const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <>
      {/* Navbar avec recherche */}
      <Navbar cartCount={cartCount} favorisCount={favoris.length} onSearch={handleSearch} />
       <div className="flex flex-col lg:flex-row gap-6 py-10 bg-gray-50 pt-25 px-3">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-md rounded-xl p-4 transition-all duration-300 ${
          isExpanded ? 'lg:w-1/5' : 'lg:w-[80px]'
        } w-full`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            className={`text-xl font-semibold text-gray-700 transition-opacity duration-300 ${
              isExpanded ? 'opacity-100' : 'opacity-0 lg:hidden'
            }`}
          >
            Catégories
          </h2>
          <button onClick={toggleSidebar}>
            <FaBars className="text-2xl text-gray-600 hover:text-yellow-500" />
          </button>
        </div>

        <ul className="space-y-4 text-gray-600">
          <li className="flex items-center gap-3 hover:text-yellow-500">
            <FaTshirt className="text-xl" />
            {isExpanded && <span>Mode</span>}
          </li>
          <li className="flex items-center gap-3 hover:text-yellow-500">
            <GiFruitBowl className="text-xl" />
            {isExpanded && <span>Alimentaires</span>}
          </li>
          <li className="flex items-center gap-3 hover:text-yellow-500">
            <MdDevices className="text-xl" />
            {isExpanded && <span>Électroniques</span>}
          </li>
          <li className="flex items-center gap-3 hover:text-yellow-500">
            <FaHeartbeat className="text-xl" />
            {isExpanded && <span>Santé</span>}
          </li>
          <li className="flex items-center gap-3 hover:text-yellow-500">
            <FaHome className="text-xl" />
            {isExpanded && <span>Immobilier</span>}
          </li>
          <li className="flex items-center gap-3 hover:text-yellow-500">
            <FaHandsHelping className="text-xl" />
            {isExpanded && <span>Services</span>}
          </li>
        </ul>
      </aside>

      {/* Main banner */}
      <main className="flex-1 bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-xl shadow-md p-6 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
          Votre nouvelle Marketplace, <br /> avec <span className="text-black">Venteo</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mt-4">Style affirmé, allure garantie</p>
        <p className="text-xl md:text-2xl font-semibold text-black mt-2">À partir de 590 FCFA</p>
        <button className="mt-6 bg-black hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded-full transition duration-300">
          DÉCOUVRIR
        </button>
      </main>

      {/* Right panel */}
      <aside className="lg:w-1/5 w-full bg-white rounded-xl shadow-md p-4 space-y-6 text-gray-700">
        <div>
          <h3 className="font-semibold text-lg">📞 Centre d’assistance</h3>
          <p className="text-sm">Guide du service client</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg">📱 Commandez au</h3>
          <p className="text-sm">+221 77 136 41 50</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg">🛒 Vendez sur Venteo</h3>
          <p className="text-sm">
            <a href="/hero" className="text-blue-600 hover:underline">
              Ouvrez votre shop ici
            </a>
          </p>
        </div>
      </aside>
    </div>

      <div className="p-0 bg-pink-100">
        <div className="p-20">
        <h1 className="text-2xl font-bold mb-6">Produits disponibles</h1>
        {loading ? (
          <p>Chargement des produits...</p>
        ) : Object.keys(groupedProducts).length === 0 ? (
          <p>Aucun produit disponible.</p>
        ) : (
          Object.entries(groupedProducts).map(([category, products]) => (
            <div key={category} className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{category}</h2>
              <Slider {...sliderSettings}>
                {products.map((product) => (
                  <div key={product._id} className="px-2">
                    <ProductCard
                      product={product}
                      addToCart={handleAddToCart}
                      toggleFavori={toggleFavori}
                      isFavori={favoris.includes(product._id)}
                    />
                  </div>
                ))}
              </Slider>
            </div>
          ))
        )}
        </div>
      </div>
      {/* Section test auto-slider */}
      <div className="my-8">
        <TestSlider />
      </div>

      <Footer/>

    </>
  );
}

