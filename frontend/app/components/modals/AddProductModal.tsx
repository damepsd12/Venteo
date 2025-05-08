'use client';

import React, { useState } from 'react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}

interface NewProductState {
  title: string;
  description: string;
  price: string;
  image: File | null;
  category: string;
}

export default function AddProductModal({ isOpen, onClose, onSubmit }: AddProductModalProps) {
  const [newProduct, setNewProduct] = useState<NewProductState>({
    title: '',
    description: '',
    price: '',
    image: null,
    category: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setNewProduct((prevState) => ({ ...prevState, image: selectedFile }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newProduct.image) {
      alert("Veuillez sélectionner une image pour le produit.");
      return;
    }

    const formData = new FormData();
    formData.append('title', newProduct.title);
    formData.append('description', newProduct.description);
    formData.append('price', newProduct.price);
    formData.append('category', newProduct.category);
    formData.append('image', newProduct.image);

    await onSubmit(formData);

    // Reset le formulaire après soumission
    setNewProduct({
      title: '',
      description: '',
      price: '',
      image: null,
      category: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
        <h2 className="text-2xl font-bold mb-4">Ajouter un nouveau produit</h2>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            type="text"
            placeholder="Titre"
            className="p-2 border rounded"
            value={newProduct.title}
            onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            className="p-2 border rounded"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Prix"
            className="p-2 border rounded"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            required
          />
          <input
            type="file"
            accept="image/*"
            className="p-2 border rounded"
            onChange={handleFileChange}
            required
          />
          {/* Aperçu de l'image sélectionnée */}
          {newProduct.image && (
            <img
              src={URL.createObjectURL(newProduct.image)}
              alt="Aperçu"
              className="w-32 h-32 object-cover rounded"
            />
          )}
          <select
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            className="p-2 border rounded"
            required
          >
            <option value="">Choisir un secteur</option>
            <option value="immobilier">Immobilier</option>
            <option value="electronique">Électronique</option>
            <option value="mode">Mode</option>
            <option value="services">Services</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Publier le produit
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-2 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400"
          >
            Annuler
          </button>
        </form>
      </div>
    </div>
  );
}
