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
    // <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    //   <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl space-y-4">
    //     <h1 className="text-2xl font-bold text-center text-gray-700">Créer un compte</h1>

    //     <input name="name" type="text" placeholder="Nom complet" onChange={handleChange} required className="input" />
    //     <input name="email" type="email" placeholder="Adresse e-mail" onChange={handleChange} required className="input" />

    //     <div className="relative">
    //       <input
    //         name="password"
    //         type={showPassword ? "text" : "password"}
    //         placeholder="Mot de passe"
    //         onChange={handleChange}
    //         required
    //         className="input pr-10"
    //       />
    //       <span
    //         className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
    //         onClick={() => setShowPassword(!showPassword)}
    //       >
    //         {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    //       </span>
    //     </div>

    //     <label className="flex items-center gap-2">
    //       <input type="checkbox" name="isSeller" onChange={handleChange} />
    //       Je veux vendre sur la plateforme
    //     </label>

    //     {formData.isSeller && (
    //       <div className="space-y-3 bg-gray-50 p-4 rounded-md border mt-2">
    //         <input name="phone" type="text" placeholder="Numéro de téléphone" onChange={handleChange} className="input" />
    //         <input name="address" type="text" placeholder="Adresse physique" onChange={handleChange} className="input" />
    //         <input name="username" type="text" placeholder="Nom d’utilisateur" onChange={handleChange} className="input" />
    //         <input name="companyName" type="text" placeholder="Nom de l'entreprise" onChange={handleChange} className="input" />
    //         <input name="businessRegNumber" type="text" placeholder="N° d'enregistrement" onChange={handleChange} className="input" />
    //         <input name="businessType" type="text" placeholder="Type d’entreprise" onChange={handleChange} className="input" />
    //         <input name="website" type="text" placeholder="Site web de l'entreprise" onChange={handleChange} className="input" />
    //         <input name="bankDetails" type="text" placeholder="Détails du compte bancaire" onChange={handleChange} className="input" />
    //         <input name="paymentMethod" type="text" placeholder="Mode de paiement préféré" onChange={handleChange} className="input" />
    //         <input name="productCategories" type="text" placeholder="Catégories de produits" onChange={handleChange} className="input" />
    //         <textarea name="productDescription" placeholder="Description des produits" onChange={handleChange} className="input" />
    //         <textarea name="returnPolicy" placeholder="Politique de retour" onChange={handleChange} className="input" />
    //         <textarea name="shippingInfo" placeholder="Informations de livraison" onChange={handleChange} className="input" />
    //       </div>
    //     )}

    //     <label className="flex items-center gap-2">
    //       <input type="checkbox" name="termsAccepted" onChange={handleChange} required />
    //       J’accepte les Conditions Générales d’Utilisation
    //     </label>

    //     <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
    //       S'inscrire
    //     </button>
    //   </form>
    // </div>
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
  <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-xl space-y-6">
    <h1 className="text-3xl font-semibold text-center text-gray-800">Créer un compte</h1>

    <div className="space-y-4">
      <input name="name" type="text" placeholder="Nom complet" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
      <input name="email" type="email" placeholder="Adresse e-mail" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
      
      <div className="relative">
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Mot de passe"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </span>
      </div>
    </div>

    <label className="flex items-center gap-2 text-sm text-gray-700">
      <input type="checkbox" name="isSeller" onChange={handleChange} className="accent-green-600" />
      Je veux vendre sur la plateforme
    </label>

    {formData.isSeller && (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
        <input name="phone" type="text" placeholder="Téléphone" onChange={handleChange} className="input-style" />
        <input name="address" type="text" placeholder="Adresse" onChange={handleChange} className="input-style" />
        <input name="username" type="text" placeholder="Nom d’utilisateur" onChange={handleChange} className="input-style" />
        <input name="companyName" type="text" placeholder="Entreprise" onChange={handleChange} className="input-style" />
        <input name="businessRegNumber" type="text" placeholder="N° enregistrement" onChange={handleChange} className="input-style" />
        <input name="businessType" type="text" placeholder="Type d’entreprise" onChange={handleChange} className="input-style" />
        <input name="website" type="text" placeholder="Site web" onChange={handleChange} className="input-style" />
        <input name="bankDetails" type="text" placeholder="Compte bancaire" onChange={handleChange} className="input-style" />
        <input name="paymentMethod" type="text" placeholder="Paiement préféré" onChange={handleChange} className="input-style" />
        <input name="productCategories" type="text" placeholder="Catégories de produits" onChange={handleChange} className="input-style" />
        <textarea name="productDescription" placeholder="Description des produits" onChange={handleChange} className="input-style col-span-full" />
        <textarea name="returnPolicy" placeholder="Politique de retour" onChange={handleChange} className="input-style col-span-full" />
        <textarea name="shippingInfo" placeholder="Infos livraison" onChange={handleChange} className="input-style col-span-full" />
      </div>
    )}

    <label className="flex items-center gap-2 text-sm text-gray-700">
      <input type="checkbox" name="termsAccepted" onChange={handleChange} required className="accent-green-600" />
      J’accepte les <a href="/terms" className="text-green-600 underline">Conditions Générales</a>
    </label>

    <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition">
      S'inscrire
    </button>
  </form>
</div>

  );
}
