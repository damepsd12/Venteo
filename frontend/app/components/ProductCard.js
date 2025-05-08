
// /components/ProductCard.js
export default function ProductCard({ product }) {
    return (
      <div className="border rounded-lg p-4 shadow">
        <img src={product.image} className="h-40 w-full object-cover rounded" alt={product.title} />
        <h3 className="mt-2 font-bold">{product.title}</h3>
        <p>{product.price} FCFA</p>
      </div>
    );
  }