// app/DashboardAdmin/pendingproduct/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from "../../(dashboard)/dashboard-layout";

const PendingProductsPage = () => {
    const [pendingProducts, setPendingProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    // Premier useEffect pour lire le token
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
    }, []);

    // Deuxième useEffect pour le fetch des produits
    useEffect(() => {
        const fetchPendingProducts = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const res = await fetch('http://localhost:5000/api/products/admin/pending-products', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`HTTP error! status: ${res.status}, message: ${errorText.substring(0, 200)}...`);
                }

                const data = await res.json();

                if (Array.isArray(data)) {
                    setPendingProducts(data);
                } else {
                    throw new Error('Invalid data format received from server.');
                }

            } catch (err: any) {
                setError(err.message || 'Failed to fetch pending products');
                console.error('Error fetching pending products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPendingProducts();

    }, [token]);

    // *** DÉFINISSEZ LA FONCTION handleProductAction ICI ***
    const handleProductAction = async (productId: string, action: 'approve' | 'reject') => {
        if (!token) {
            alert("Vous n'êtes pas authentifié.");
            return;
        }

        // Optionnel: Demander confirmation avant de rejeter/approuver
        if (action === 'reject' && !window.confirm("Êtes-vous sûr de vouloir rejeter ce produit ?")) {
             return; // Annule l'action si l'utilisateur clique sur Annuler
        }
         if (action === 'approve' && !window.confirm("Êtes-vous sûr de vouloir approuver ce produit ?")) {
             return; // Annule l'action si l'utilisateur clique sur Annuler
        }


        try {
            // Vous pourriez vouloir désactiver les boutons spécifiques à ce produit pendant l'action
            // Cela nécessite un état plus complexe, pour l'instant, on désactive globalement via 'loading' si vous le souhaitez.
            // Ou mieux, gérer l'état de chargement par produit si vous avez beaucoup de produits.

            const res = await fetch(`http://localhost:5000/api/products/${productId}/validate`, { // <== URL de votre route de validation
                method: 'PATCH', // Ou PUT, selon votre backend
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ action: action }), // Envoyer l'action (approve ou reject)
            });

            const data = await res.json(); // Votre backend devrait renvoyer un message de succès/échec

            if (!res.ok) {
                 // Si la réponse n'est pas OK, il y a une erreur
                 const errorData = data.message || 'Erreur inconnue lors de l\'action.';
                 throw new Error(`Erreur lors de l'action: ${errorData}`);
            }


            // Si l'action est réussie, retirer le produit de la liste des produits en attente
            setPendingProducts(prevProducts => prevProducts.filter(product => product._id !== productId));

            // Afficher un message de succès
            alert(data.message || `Produit ${action}é avec succès.`);

        } catch (err: any) {
            console.error(`Error performing ${action} action for product ${productId}:`, err);
            alert("Erreur lors de l'action : " + err.message);
        }
    };

    if (loading) return <p>Loading pending products...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <DashboardLayout role="admin">
            <div className="container mx-auto p-20 pl-56">
                <h1 className="text-2xl font-bold mb-4">Produits en attente d'approbation</h1>
                {pendingProducts.length === 0 ? (
                    <p>Aucun produit en attente.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border text-left">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2 border">Image</th>
                                    <th className="p-2 border">Titre</th>
                                    <th className="p-2 border">Description</th>
                                    <th className="p-2 border">Prix</th>
                                    <th className="p-2 border">Catégorie</th>
                                    <th className="p-2 border">Vendeur</th>
                                    <th className="p-2 border">Statut</th>
                                    <th className="p-2 border">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingProducts.map((product) => (
                                    <tr key={product._id}>
                                        <td className="p-2 border">
                                            {product.image && (
                                                <img src={product.image} alt={product.title} className="w-16 h-16 object-cover rounded" />
                                            )}
                                        </td>
                                        <td className="p-2 border">{product.title}</td>
                                        <td className="p-2 border">{product.description.substring(0, 100)}...</td>
                                        <td className="p-2 border">{product.price} F CFA</td>
                                        <td className="p-2 border">{product.category}</td>
                                        {/* Assurez-vous que product.seller est bien peuplé et a un champ 'name' */}
                                        <td className="p-2 border">{product.seller?.name || 'N/A'}</td>
                                        <td className="p-2 border">{product.status}</td>
                                        <td className="p-2 border space-x-2">
                                            {/* Appelle handleProductAction avec l'ID du produit et l'action */}
                                            <button
                                                className="bg-green-600 text-white px-2 py-1 rounded disabled:opacity-50"
                                                onClick={() => handleProductAction(product._id, 'approve')}
                                                disabled={loading} // Désactiver pendant le chargement global
                                            >
                                                Approuver
                                            </button>
                                            <button
                                                className="bg-red-600 text-white px-2 py-1 rounded disabled:opacity-50"
                                                onClick={() => handleProductAction(product._id, 'reject')}
                                                disabled={loading} // Désactiver pendant le chargement global
                                            >
                                                Rejeter
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default PendingProductsPage;
