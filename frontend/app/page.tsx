// /app/page.tsx - Page d'accueil
export default async function HomePage() {
  // MODIFICATION ICI : Changez l'URL pour appeler la route de liste des produits approuvés
  const res = await fetch("http://localhost:5000/api/products"); // Supprimez "/approved"
  const products = await res.json();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Produits disponibles</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <a href={`/product/${product._id}`} key={product._id}>
            <div className="border rounded-xl shadow p-4">
              <img src={product.image} alt={product.title} className="h-40 w-full object-cover rounded" />
              <h2 className="mt-2 font-semibold">{product.title}</h2>
              <p>{product.price} FCFA</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
