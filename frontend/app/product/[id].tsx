
// /app/product/[id].js - Fiche produit
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/products/${id}`)
        .then((res) => res.json())
        .then((data) => setProduct(data));
    }
  }, [id]);

  if (!product) return <p>Chargement...</p>;

  return (
    <div className="p-4">
      <img src={product.image} alt={product.title} className="w-full max-w-md rounded-xl" />
      <h1 className="text-2xl font-bold mt-4">{product.title}</h1>
      <p className="text-lg mt-2">{product.price} FCFA</p>
      <p className="mt-4">{product.description}</p>
      <p className="mt-2 italic">Vendu par : {product.seller?.name || "Inconnu"}</p>
    </div>
  );
}