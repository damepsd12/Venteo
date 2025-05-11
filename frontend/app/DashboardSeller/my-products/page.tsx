'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from "../../(dashboard)/dashboard-layout";
import { FaPlus } from 'react-icons/fa';

import AddProductModal from '../../components/modals/AddProductModal'
import DetailModal from '../../components/modals/DetailModal';
import EditModal from '../../components/modals/EditModal';

import { formatPrice } from '../../utils/formatters';
import { Product } from '../../types';

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'published':
      return 'text-green-600';
    case 'pending':
      return 'text-yellow-600';
    case 'rejected':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

export default function MyProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // correction ici
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchMyProducts = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('Aucun token trouvé.');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('http://localhost:5000/api/products/my-products', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const errorText = await res.text();
          if (res.status === 401 || res.status === 403) {
            setError(`Accès refusé : ${(JSON.parse(errorText)).message || 'Vérifiez votre statut vendeur.'}`);
          } else {
            setError(`Erreur chargement produits: ${res.status}`);
          }
          throw new Error(`Erreur: ${res.status}`);
        }
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        if (!error) setError('Erreur lors du chargement de vos produits.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyProducts();
  }, []);

  // const handleDelete = async (id: string) => {
  //   if (!confirm('Supprimer ce produit ?')) return;
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     alert('Veuillez vous reconnecter.');
  //     return;
  //   }
  //   try {
  //     const res = await fetch(`http://localhost:5000/api/products/${id}`, {
  //       method: 'DELETE',
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     if (res.ok) {
  //       setProducts(prev => prev.filter(p => p._id !== id));
  //       alert('Produit supprimé avec succès !');
  //     } else {
  //       const errorText = await res.text();
  //       alert(`Erreur suppression: ${(JSON.parse(errorText)).message || 'Une erreur est survenue.'}`);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     alert('Erreur lors de la suppression.');
  //   }
  // };
const handleDelete = async (id: string) => {
  if (!confirm('Supprimer ce produit ?')) return;

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Veuillez vous reconnecter.');
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      // Suppression réussie
      setProducts(prev => prev.filter(p => p._id !== id));
      alert('Produit supprimé avec succès !');
    } else {
      // La requête a échoué, on lit la réponse en texte brut
      const errorText = await res.text();
      let errorMsg = 'Une erreur est survenue.';

      // Essayer de parser la réponse en JSON pour obtenir un message précis
      try {
        const errorJson = JSON.parse(errorText);
        errorMsg = errorJson.message || errorJson.error || errorMsg;
      } catch {
        // Si la réponse n'est pas du JSON, utiliser le texte brut
        errorMsg = errorText;
      }

      alert(`Erreur suppression: ${errorMsg}`);
    }
  } catch (err) {
    console.error('Erreur réseau ou autre:', err);
    alert('Erreur lors de la suppression.');
  }
};
  const handleAddProduct = async (formData: FormData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Veuillez vous reconnecter.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          // Ne pas mettre Content-Type, fetch le gère avec FormData
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) {
        const errorData = await res.text();
        let message = 'Erreur inconnue.';
        try {
          const json = JSON.parse(errorData);
          message = json.message || json.error;
        } catch {
          message = errorData;
        }
        throw new Error(message);
      }
      const newProduct = await res.json();
      setProducts(prev => [...prev, newProduct]);
      setIsAddModalOpen(false); // correction ici
      alert('Produit publié avec succès et en attente de validation !');
    } catch (err: any) {
      alert(`Erreur : ${err.message}`);
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Veuillez vous reconnecter.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', updatedProduct.title);
      formData.append('description', updatedProduct.description);
      formData.append('price', updatedProduct.price.toString());
      formData.append('category', updatedProduct.category);
      // Ajoutez d'autres champs si nécessaire

      const res = await fetch(`http://localhost:5000/api/products/${updatedProduct._id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts(prev => prev.map(p => p._id === updated._id ? updated : p));
        setEditProduct(null);
        alert('Produit modifié avec succès');
      } else {
        const errorText = await res.text();
        alert(`Erreur: ${errorText}`);
      }
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la mise à jour.');
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="seller">
        <div className="container mx-auto p-20 text-center">Chargement...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout role="seller">
        <div className="container mx-auto p-20 text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Réessayer
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="seller">
      <div className="container mx-auto pl-59 p-20">
        {/* En-tête et bouton pour ajouter */}
        <div className='flex justify-between items-center mb-6'>
          <h1 className="text-2xl font-bold">Mes produits</h1>
          <button
            onClick={() => setIsAddModalOpen(true)} // correction ici
            className="flex items-center bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            <FaPlus className="mr-2" /> Ajouter un produit
          </button>
        </div>

        {/* Modal d'ajout */}
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddProduct}
        />

        {/* Liste produits */}
        {products.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>Vous n'avez pas encore de produits.</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Ajouter votre premier produit
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="border rounded-lg p-4 shadow-md bg-white flex flex-col">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-48 object-cover mb-4 rounded-md"
                />
                <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
                <p className="text-gray-700 text-sm flex-grow">{product.description}</p>
                <p className="mt-2 font-bold">💰 {formatPrice(product.price, 'XOF')}</p>
                <p className={`mt-2 ${getStatusColor(product.status)}`}>
                  Statut: {product.status}
                </p>
                {product.status === 'rejected' && product.rejectionReason && (
                  <p className="text-red-500 text-xs italic">Raison: {product.rejectionReason}</p>
                )}
                <div className="mt-4 flex flex-col gap-2">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                  >
                    Détails
                  </button>
                  <button
                    onClick={() => setEditProduct(product)}
                    className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modals détails et édition */}
        {selectedProduct && (
          <DetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )}
        {editProduct && (
          <EditModal
            product={editProduct}
            onClose={() => setEditProduct(null)}
            onSave={handleUpdateProduct}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

// 'use client';

// import { useEffect, useState } from 'react';
// import DashboardLayout from "../../(dashboard)/dashboard-layout";
// import { FaPlus } from 'react-icons/fa';
// import AddProductModal from '../../components/modals/AddProductModal';
// import { formatPrice } from '../../utils/formatters';

// interface Product {
//   _id: string;
//   title: string;
//   description: string;
//   price: number;
//   image: string;
//   cloudinary_public_id: string;
//   category: string;
//   status: 'pending' | 'approved' | 'rejected';
//   rejectionReason?: string;
//   seller?: {
//     _id: string;
//     name: string;
//     email?: string;
//   };
// }

// export default function MyProductsPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchMyProducts = async () => {
//       setLoading(true);
//       setError(null);
//       const token = localStorage.getItem('token');
//       if (!token) {
//         console.warn('Aucun token trouvé. Redirection vers la page de connexion...');
//         setLoading(false);
//         return;
//       }

//       try {
//         const res = await fetch('http://localhost:5000/api/products/my-products', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!res.ok) {
//           const errorText = await res.text();
//           console.error(`Erreur HTTP: ${res.status}`, errorText);
//           if (res.status === 401 || res.status === 403) {
//             setError(`Accès refusé : ${(JSON.parse(errorText)).message || 'Veuillez vérifier votre statut vendeur.'}`);
//           } else {
//             setError(`Erreur chargement produits: ${res.status}`);
//           }
//           throw new Error(`Erreur chargement produits: ${res.status}`);
//         }
//         const data = await res.json();
//         console.log('Produits récupérés:', data);
//         setProducts(data);
//       } catch (err: any) {
//         console.error('Erreur chargement produits :', err);
//         if (!error) {
//           setError('Erreur lors du chargement de vos produits.');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMyProducts();
//   }, [error]);

//   const handleDelete = async (id: string) => {
//     if (!confirm('Supprimer ce produit ?')) return;
//     const token = localStorage.getItem('token');
//     if (!token) {
//       alert('Veuillez vous reconnecter.');
//       return;
//     }
//     try {
//       const res = await fetch(`http://localhost:5000/api/products/${id}`, {
//         method: 'DELETE',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (res.ok) {
//         setProducts(products.filter((p) => p._id !== id));
//         alert('Produit supprimé avec succès !');
//       } else {
//         const errorText = await res.text();
//         console.error(`Erreur HTTP: ${res.status}`, errorText);
//         alert(`Erreur suppression produit: ${(JSON.parse(errorText)).message || 'Une erreur est survenue.'}`);
//       }
//     } catch (err) {
//       console.error('Erreur suppression produit :', err);
//       alert('Erreur lors de la suppression du produit.');
//     }
//   };
//   const handleAddProductSubmit = async (formData: FormData) => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       alert('Veuillez vous connecter.');
//       return;
//     }
  
//     try {
//       const res = await fetch('http://localhost:5000/api/products', {
//         method: 'POST',
//         headers: {
//           // Ne pas mettre 'Content-Type' ici
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });
  
//       if (!res.ok) {
//         const errorData = await res.text();
//         console.log('Réponse erreur brute :', errorData);
//         let errorMsg = 'Erreur inconnue.';
//         try {
//           const errorJson = JSON.parse(errorData);
//           errorMsg = errorJson.message || errorJson.error 
//         } catch (e) {
//           errorMsg = errorData;
//         }
//         throw new Error(errorMsg);
//       }
  
//       const createdProduct = await res.json();
//       setProducts([...products, createdProduct]);
//       setIsModalOpen(false);
//       alert('Produit publié avec succès et en attente de validation !');
//     } catch (err: any) {
//       console.error('Erreur:', err);
//       alert(`Erreur : ${err.message}`);
//     }
//   };

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   const getStatusColor = (status: 'pending' | 'approved' | 'rejected') => {
//     switch (status) {
//       case 'approved':
//         return 'text-green-600';
//       case 'pending':
//         return 'text-yellow-600';
//       case 'rejected':
//         return 'text-red-600';
//       default:
//         return 'text-gray-600';
//     }
//   };

//   if (loading) {
//     return (
//       <DashboardLayout role="seller">
//         <div className="container mx-auto p-20 pl-59 pr-0 text-center">Chargement de vos produits...</div>
//       </DashboardLayout>
//     );
//   }

//   if (error) {
//     return (
//       <DashboardLayout role="seller">
//         <div className="container mx-auto p-20 pl-59 pr-0 text-center text-red-600">
//           <p>{error}</p>
//           <button
//             onClick={() => setError(null)}
//             className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//           >
//             Réessayer
//           </button>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout role="seller">
//       <div className="container mx-auto p-20 pl-58">
//         <div className='flex flex-col md:flex-row items-center justify-between mb-6'>
//           <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">Mes produits</h1>
//           <button
//             onClick={openModal}
//             className="flex items-center bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
//           >
//             <FaPlus className="mr-2" /> Ajouter un produit
//           </button>
//           <AddProductModal
//             isOpen={isModalOpen}
//             onClose={closeModal}
//             onSubmit={handleAddProductSubmit}
//           />
//         </div>

//         {products.length === 0 ? (
//           <div className="text-center text-gray-600">
//             <p>Vous n'avez pas encore de produits.</p>
//             <button
//               onClick={openModal}
//               className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//             >
//               Ajouter votre premier produit
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {products.map((product) => (
//               <div key={product._id} className="border rounded-lg p-4 shadow-md bg-white flex flex-col">
//                 <img
//                   src={product.image}
//                   alt={product.title}
//                   className="w-full h-48 object-cover mb-4 rounded-md flex-shrink-0"
//                 />
//                 <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
//                 <p className="text-gray-700 text-sm flex-grow">{product.description}</p>
//                 <p className="text-base font-bold mt-3">
//                   💰 {typeof product.price === 'number' ? formatPrice(product.price, 'XOF') : 'Prix non disponible'}
//                 </p>
//                 <p className="text-sm mt-2">
//                   Statut: <span className={`${getStatusColor(product.status)} font-semibold capitalize`}>{product.status}</span>
//                 </p>
//                 {product.status === 'rejected' && product.rejectionReason && (
//                   <p className="text-xs text-red-500 italic mt-1">Raison: {product.rejectionReason}</p>
//                 )}
//                 <button
//                   onClick={() => handleDelete(product._id)}
//                   className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
//                 >
//                   Supprimer
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }

