
// import React from 'react';

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (formData: FormData) => void;
// }

// const AddProductModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
//   const [title, setTitle] = React.useState('');
//   const [description, setDescription] = React.useState('');
//   const [price, setPrice] = React.useState('');
//   const [category, setCategory] = React.useState('');
//   const [stock, setStock] = React.useState('');
//   const [imageFile, setImageFile] = React.useState<File | null>(null);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('description', description);
//     formData.append('price', price);
//     formData.append('category', category);
//     formData.append('stock', stock);
//     if (imageFile) {
//       formData.append('image', imageFile);
//     }
//     onSubmit(formData);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white p-4 rounded-lg max-w-xl w-full relative overflow-y-auto max-h-full">
//         <button className="absolute top-2 right-2 text-red-600 font-bold" onClick={onClose}>Fermer</button>
//         <h2 className="text-xl mb-4">Ajouter un produit</h2>
//         <form onSubmit={handleSubmit}>
//           {/* Champs du formulaire */}
//           <div className="mb-2">
//             <label className="block mb-1">Titre</label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full border p-2"
//               required
//             />
//           </div>
//           <div className="mb-2">
//             <label className="block mb-1">Description</label>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full border p-2"
//               required
//             />
//           </div>
//           <div className="mb-2">
//             <label className="block mb-1">Prix</label>
//             <input
//               type="number"
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//               className="w-full border p-2"
//               required
//             />
//           </div>
//           <div className="mb-2">
//             <label className="block mb-1">Catégorie</label>
//             <input
//               type="text"
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               className="w-full border p-2"
//               required
//             />
//           </div>
//           <div className="mb-2">
//             <label className="block mb-1">Stock</label>
//             <input
//               type="number"
//               value={stock}
//               onChange={(e) => setStock(e.target.value)}
//               className="w-full border p-2"
//             />
//           </div>
//           <div className="mb-2">
//             <label className="block mb-1">Image</label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
//               className="w-full"
//             />
//           </div>
//           <button
//             type="submit"
//             className="mt-2 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
//           >
//             Publier
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddProductModal;

import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}

const AddProductModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [stock, setStock] = React.useState('');
  const [imageFile, setImageFile] = React.useState<File | null>(null);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setCategory('');
    setStock('');
    setImageFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('stock', stock);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    onSubmit(formData);
    resetForm(); // vide le formulaire après soumission
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-xl w-full relative overflow-y-auto max-h-full">
        <button className="absolute top-2 right-2 text-red-600 font-bold" onClick={onClose}>Fermer</button>
        <h2 className="text-xl mb-4">Ajouter un produit</h2>
        <form onSubmit={handleSubmit}>
          {/* Titre */}
          <div className="mb-2">
            <label className="block mb-1">Titre</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2"
              required
            />
          </div>
          {/* Description */}
          <div className="mb-2">
            <label className="block mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2"
              required
            />
          </div>
          {/* Prix */}
          <div className="mb-2">
            <label className="block mb-1">Prix</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border p-2"
              required
            />
          </div>
          {/* Catégorie */}
          <div className="mb-2">
            <label className="block mb-1">Catégorie</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-2 border rounded"
              required
            >
              <option value="">Choisir une catégorie</option>
              <option value="immobilier">Immobilier</option>
              <option value="electronique">Électronique</option>
              <option value="mode">Mode</option>
              <option value="services">Services</option>
            </select>
          </div>
          {/* Stock */}
          <div className="mb-2">
            <label className="block mb-1">Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full border p-2"
            />
          </div>
          {/* Image */}
          <div className="mb-2">
            <label className="block mb-1">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
              className="w-full"
            />
          </div>
          {/* Bouton submit */}
          <button
            type="submit"
            className="mt-2 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Publier
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;