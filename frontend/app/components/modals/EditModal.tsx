import React from 'react';
import { Product } from '../../types';

interface Props {
  product: Product;
  onClose: () => void;
  onSave: (product: Product) => void;
}

const EditModal: React.FC<Props> = ({ product, onClose, onSave }) => {
  const [title, setTitle] = React.useState(product.title);
  const [description, setDescription] = React.useState(product.description);
  const [price, setPrice] = React.useState(product.price.toString());
  const [category, setCategory] = React.useState(product.category);
  const [stock, setStock] = React.useState((product as any).stock?.toString() || '0');
  const [imageFile, setImageFile] = React.useState<File | null>(null);

  const handleSave = () => {
    const updatedProduct: Product = {
      ...product,
      title,
      description,
      price: parseFloat(price),
      category,
      // si vous gérez le stock ou l’image, ajoutez-les ici
    };
    onSave(updatedProduct);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-xl w-full relative overflow-y-auto max-h-full">
        <button className="absolute top-2 right-2 text-red-600 font-bold" onClick={onClose}>Fermer</button>
        <h2 className="text-xl mb-4">Modifier {product.title}</h2>
        {/* Formulaire */}
        <div className="mb-2">
          <label className="block mb-1">Titre</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Prix</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border p-2"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Catégorie</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border p-2"
          />
        </div>
        {/* Ajoutez aussi le champ stock si nécessaire */}
        <div className="mb-2">
          <label className="block mb-1">Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full border p-2"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Image (optionnel)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
            className="w-full"
          />
        </div>
        <button
          className="mt-2 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          onClick={handleSave}
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
};

export default EditModal;