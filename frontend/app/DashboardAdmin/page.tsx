
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../(dashboard)/dashboard-layout";

export default function DashboardAdmin() {
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/pending-sellers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Erreur inconnue");
        }
    
        const data = await res.json();
        setSellers(data);
      } catch (err: any) {
        alert("Erreur : " + err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSellers();
  }, []);

  const handleAction = async (userId: string, action: "approve" | "reject") => {
    const res = await fetch(`http://localhost:5000/api/admin/${action}/${userId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const data = await res.json();
    
    alert(data.message);
    setSellers((prev) => prev.filter((u) => u._id !== userId));
  };

  return (
    <DashboardLayout role="admin">
    <div className="pl-59 p-15">
      <h1 className="text-2xl font-bold mb-4">Vendeurs en attente</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : sellers.length === 0 ? (
        <p>Aucun vendeur en attente.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Nom</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Entreprise</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => (
                <tr key={seller._id}>
                  <td className="p-2 border">{seller.name}</td>
                  <td className="p-2 border">{seller.email}</td>
                  <td className="p-2 border">{seller.sellerInfo?.companyName || "-"}</td>
                  <td className="p-2 border space-x-2">
                    <button
                      className="bg-green-600 text-white px-2 py-1 rounded"
                      onClick={() => handleAction(seller._id, "approve")}
                    >
                      Approuver
                    </button>
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded"
                      onClick={() => handleAction(seller._id, "reject")}
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
}