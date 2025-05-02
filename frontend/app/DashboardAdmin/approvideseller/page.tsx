"use client";
import { useEffect, useState } from "react";
import DashboardLayout from '../../(dashboard)/dashboard-layout';

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  pending: boolean;
  sellerInfo?: {
    companyName?: string;
  };
};

export default function ApproveSellerPage() {
  const [pendingSellers, setPendingSellers] = useState<User[]>([]);
  const [sortBy, setSortBy] = useState<"name" | "email">("name");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const fetchPendingSellers = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Veuillez vous reconnecter.");

    try {
      const res = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: User[] = await res.json();
      const sellers = data.filter(user => user.role === "seller" && user.pending);

      const sorted = [...sellers].sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
      setPendingSellers(sorted);
    } catch (err) {
      console.error(err);
      alert("Erreur de chargement des vendeurs.");
    }
  };

  const approveSeller = async (sellerId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Veuillez vous reconnecter.");

    try {
      const res = await fetch(`http://localhost:5000/api/admin/approve-seller/${sellerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erreur lors de l'approbation.");
      }

      alert("Vendeur approuvé !");
      fetchPendingSellers(); // Refresh list
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'approbation du vendeur.");
    }
  };

  const handleSort = (field: "name" | "email") => {
    setSortBy(field);
    const sorted = [...pendingSellers].sort((a, b) => a[field].localeCompare(b[field]));
    setPendingSellers(sorted);
  };

  useEffect(() => {
    fetchPendingSellers();
  }, []);

  const paginated = pendingSellers.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <DashboardLayout role="admin">
      <div className="p-20 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Vendeurs en attente</h1>

        <div className="mb-4 space-x-4">
          <button onClick={() => handleSort("name")} className="text-blue-600 underline">Trier par nom</button>
          <button onClick={() => handleSort("email")} className="text-blue-600 underline">Trier par email</button>
        </div>

        {paginated.length === 0 ? (
          <p className="text-gray-500">Aucun vendeur en attente.</p>
        ) : (
          <ul className="space-y-4">
            {paginated.map((seller) => (
              <li key={seller._id} className="bg-white p-4 shadow rounded flex justify-between items-center">
                <div>
                  <p><strong>{seller.name}</strong> - {seller.email}</p>
                  {seller.sellerInfo?.companyName && (
                    <p className="text-sm text-gray-500">{seller.sellerInfo.companyName}</p>
                  )}
                </div>
                <button
                  onClick={() => approveSeller(seller._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Valider
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Pagination */}
        <div className="mt-8 flex justify-center items-center space-x-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Préc.
          </button>
          <span>Page {page}</span>
          <button
            onClick={() => {
              const maxPage = Math.ceil(pendingSellers.length / itemsPerPage);
              setPage((prev) => (prev < maxPage ? prev + 1 : prev));
            }}
            disabled={page === Math.ceil(pendingSellers.length / itemsPerPage)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Suiv.
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
