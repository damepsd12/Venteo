// /dashboardadmin/approvalproduct/page.tsx
'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '../../(dashboard)/dashboard-layout';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  cloudinary_public_id: string;
  category: string;
  approved: boolean;
  seller: {
    _id: string;
    name: string;
    email?: string;
  };
}

export default function ApprovedProductsPage() {
  const [approvedProducts, setApprovedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchApprovedProducts = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // MODIFICATION ICI : Appelle la nouvelle route admin pour les produits approuvés
        const res = await fetch('http://localhost:5000/api/products/admin/approved-products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
        setApprovedProducts(data);
      } catch (error) {
        console.error('Erreur chargement produits approuvés:', error);
      }
    };
    fetchApprovedProducts();
  }, []);

  return (
    <DashboardLayout role="admin">
      <div className="container pl-59 mx-auto p-20">
        <h1 className="text-3xl font-bold mb-4">Produits approuvés</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {approvedProducts.map(product => (
            <div key={product._id} className="border rounded-lg p-4 bg-white shadow">
              <img src={product.image} alt={product.title} className="w-full h-40 object-cover mb-2 rounded" />
              <h2 className="text-xl font-semibold">{product.title}</h2>
              <p className="text-gray-700">{product.description}</p>
              <p className="text-sm mt-2">Vendeur : {product.seller?.name}</p>
              <p className="text-sm text-green-600 font-semibold mt-1">Statut : Approuvé</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

// // /dashboardadmin/approvalproduct/page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import DashboardLayout from '../../(dashboard)/dashboard-layout';

// interface Product {
//   _id: string;
//   title: string;
//   description: string;
//   price: number;
//   image: string;
//   cloudinary_public_id: string;
//   category: string;
//   approved: boolean;
//   seller: {
//     _id: string;
//     name: string;
//     email?: string;
//   };
// }

// export default function ApprovedProductsPage() {
//   const [approvedProducts, setApprovedProducts] = useState<Product[]>([]);

//   useEffect(() => {
//     const fetchApprovedProducts = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       try {
//         const res = await fetch('http://localhost:5000/api/products/approved', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (!res.ok) throw new Error(await res.text());

//         const data = await res.json();
//         setApprovedProducts(data);
//       } catch (error) {
//         console.error('Erreur chargement produits approuvés:', error);
//       }
//     };
//     fetchApprovedProducts();
//   }, []);

//   return (
//     <DashboardLayout role="admin">
//       <div className="container pl-59 mx-auto p-20">
//         <h1 className="text-3xl font-bold mb-4">Produits approuvés</h1>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {approvedProducts.map(product => (
//             <div key={product._id} className="border rounded-lg p-4 bg-white shadow">
//               <img src={product.image} alt={product.title} className="w-full h-40 object-cover mb-2 rounded" />
//               <h2 className="text-xl font-semibold">{product.title}</h2>
//               <p className="text-gray-700">{product.description}</p>
//               <p className="text-sm mt-2">Vendeur : {product.seller?.name}</p>
//               <p className="text-sm text-green-600 font-semibold mt-1">Statut : Approuvé</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }
