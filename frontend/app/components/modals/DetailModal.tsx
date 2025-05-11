import React from 'react';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatters';

interface Props {
  product: Product;
  onClose: () => void;
}

const DetailModal: React.FC<Props> = ({ product, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-xl w-full relative overflow-y-auto max-h-full">
        <button className="absolute top-2 right-2 text-red-600 font-bold" onClick={onClose}>Fermer</button>
        <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
        <img src={product.image} alt={product.title} className="w-full h-64 object-cover mb-4" />
        <p className="mb-2">{product.description}</p>
        <p className="mb-2">Prix: {formatPrice(product.price, 'XOF')}</p>
        <p className="mb-2">Catégorie: {product.category}</p>
        {/* Ajoute des autres détails si besoin */}
      </div>
    </div>
  );
};

export default DetailModal;