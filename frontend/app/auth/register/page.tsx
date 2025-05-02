'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isSeller: false,
    phone: "",
    address: "",
    username: "",
    companyName: "",
    businessRegNumber: "",
    businessType: "",
    website: "",
    bankDetails: "",
    paymentMethod: "",
    productCategories: "",
    productDescription: "",
    returnPolicy: "",
    shippingInfo: "",
    termsAccepted: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.termsAccepted) {
      alert("Vous devez accepter les conditions.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Erreur lors de l'inscription");

      alert("Inscription réussie !");
      router.push("/auth/login");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold text-center text-gray-700">Créer un compte</h1>

        <input name="name" type="text" placeholder="Nom complet" onChange={handleChange} required className="input" />
        <input name="email" type="email" placeholder="Adresse e-mail" onChange={handleChange} required className="input" />

        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            onChange={handleChange}
            required
            className="input pr-10"
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        <label className="flex items-center gap-2">
          <input type="checkbox" name="isSeller" onChange={handleChange} />
          Je veux vendre sur la plateforme
        </label>

        {formData.isSeller && (
          <div className="space-y-3 bg-gray-50 p-4 rounded-md border mt-2">
            <input name="phone" type="text" placeholder="Numéro de téléphone" onChange={handleChange} className="input" />
            <input name="address" type="text" placeholder="Adresse physique" onChange={handleChange} className="input" />
            <input name="username" type="text" placeholder="Nom d’utilisateur" onChange={handleChange} className="input" />
            <input name="companyName" type="text" placeholder="Nom de l'entreprise" onChange={handleChange} className="input" />
            <input name="businessRegNumber" type="text" placeholder="N° d'enregistrement" onChange={handleChange} className="input" />
            <input name="businessType" type="text" placeholder="Type d’entreprise" onChange={handleChange} className="input" />
            <input name="website" type="text" placeholder="Site web de l'entreprise" onChange={handleChange} className="input" />
            <input name="bankDetails" type="text" placeholder="Détails du compte bancaire" onChange={handleChange} className="input" />
            <input name="paymentMethod" type="text" placeholder="Mode de paiement préféré" onChange={handleChange} className="input" />
            <input name="productCategories" type="text" placeholder="Catégories de produits" onChange={handleChange} className="input" />
            <textarea name="productDescription" placeholder="Description des produits" onChange={handleChange} className="input" />
            <textarea name="returnPolicy" placeholder="Politique de retour" onChange={handleChange} className="input" />
            <textarea name="shippingInfo" placeholder="Informations de livraison" onChange={handleChange} className="input" />
          </div>
        )}

        <label className="flex items-center gap-2">
          <input type="checkbox" name="termsAccepted" onChange={handleChange} required />
          J’accepte les Conditions Générales d’Utilisation
        </label>

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          S'inscrire
        </button>
      </form>
    </div>
  );
}
