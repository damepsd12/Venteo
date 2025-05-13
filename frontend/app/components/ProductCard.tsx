import { FaHeart, FaRegHeart } from 'react-icons/fa';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  status?: string;
}

interface Props {
  product: Product;
  addToCart: (product: Product) => void;
  toggleFavori: (productId: string) => void;
  isFavori: boolean;
}

export default function ProductCard({ product, addToCart, toggleFavori, isFavori }: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition relative min-w-[200px] max-w-[250px]">
      <img
        src={product.image}
        alt={product.title}
        className="h-48 w-full object-cover rounded mb-2"
      />
      <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
      
      <p className="text-gray-700 text-sm mb-2">{product.description}</p>
      
      <p className="mt-2 font-bold text-blue-600">{product.price.toLocaleString()} F CFA</p>

      {/* Boutons */}
      <div className="flex justify-between items-center mt-4">
        {/* Ajouter au panier */}
        <button
          onClick={() => addToCart(product)}
          className="flex items-center space-x-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          <FaHeart className="w-4 h-4" />
          <span>Panier</span>
        </button>

        {/* Favori */}
        <button
          onClick={() => toggleFavori(product._id)}
          className="flex items-center space-x-2 text-red-500 hover:text-red-700"
        >
          {isFavori ? <FaHeart className="w-4 h-4" /> : <FaRegHeart className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}