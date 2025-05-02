'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log('Réponse login :', data);

      if (!res.ok) throw new Error(data.message || 'Erreur de connexion');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      const decoded = jwtDecode(data.token);
      console.log('Token décodé :', decoded);

      const userRole = data.user.role;

      if (userRole === 'admin') {
        router.push('/DashboardAdmin');
      } else if (userRole === 'seller') {
        if (data.user.pending) {
          alert("Votre compte vendeur est en attente de validation par l'administrateur.");
          return;
        }
        router.push('/DashboardSeller');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      alert(err.message || "Une erreur s'est produite");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-10 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Se connecter</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="exemple@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        {/* Mot de passe */}
        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        {/* Bouton */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}


//   const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   try {
//     const res = await fetch("http://localhost:5000/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(formData),
//     });

//     const data = await res.json();
//     console.log("Réponse login :", data);

//     if (!res.ok) throw new Error(data.message || "Erreur de connexion");

//     localStorage.setItem("token", data.token);
//     alert("Connexion réussie");

//     // Redirection selon le rôle et le statut "pending"
//     if (data.user.role === "admin") {
//       router.push("/DashboardAdmin");
//     } else if (data.user.role === "seller") {
//       if (data.user.pending) {
//         alert("Votre compte vendeur est en attente d'approbation par l'administrateur.");
//         return;
//       }
//       router.push("/DashboardSeller");
//     } else {
//       router.push("/");
//     }
//   } catch (err: any) {
//     alert(err.message || "Une erreur s'est produite");
//   }
// };

// 'use client'

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { jwtDecode } from "jwt-decode";

// export default function LoginForm() {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const router = useRouter()

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

// const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
  
//     try {
//       const res = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });
  
//       const data = await res.json();
//       console.log("Réponse login :", data);
  
//       if (!res.ok) throw new Error(data.message || "Erreur de connexion");
  
//       // Stocker le token
//       localStorage.setItem("token", data.token);
  
//       // Décoder le token (optionnel ici)
//       const decoded = jwtDecode(data.token);
//       console.log("Token décodé :", decoded);

//       if (!res.ok) throw new Error(data.message || "Erreur de connexion");

//     localStorage.setItem("token", data.token);
//     localStorage.setItem("user", JSON.stringify(data.user)); // <- ajoute ceci
  
//       // Redirection selon le rôle
//       const userRole = data.user.role;
  
//       if (userRole === "admin") {
//         router.push("/DashboardAdmin");
//       } else if (userRole === "seller") {
//         if (data.user.pending) {
//           alert("Votre compte vendeur est en attente de validation par l'administrateur.");
//           return;
//         }
//         router.push("/DashboardSeller");
//       } else {
//         router.push("/");
//       }
//     } catch (err: any) {
//       alert(err.message || "Une erreur s'est produite");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto bg-white p-15 rounded-lg shadow-lg border border-gray-200">
//       <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Se connecter</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Email */}
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="email">Email</label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             placeholder="exemple@mail.com"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
//           />
//         </div>
//         {/* Mot de passe */}
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="password">Mot de passe</label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             placeholder="••••••••"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
//           />
//         </div>
//         {/* Bouton */}
//         <button
//           type="submit"
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md"
//         >
//           Se connecter
//         </button>
//       </form>
//     </div>
//   )
// }


// //   const handleSubmit = async (e: React.FormEvent) => {
// //   e.preventDefault();

// //   try {
// //     const res = await fetch("http://localhost:5000/api/auth/login", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify(formData),
// //     });

// //     const data = await res.json();
// //     console.log("Réponse login :", data);

// //     if (!res.ok) throw new Error(data.message || "Erreur de connexion");

// //     localStorage.setItem("token", data.token);
// //     alert("Connexion réussie");

// //     // Redirection selon le rôle et le statut "pending"
// //     if (data.user.role === "admin") {
// //       router.push("/DashboardAdmin");
// //     } else if (data.user.role === "seller") {
// //       if (data.user.pending) {
// //         alert("Votre compte vendeur est en attente d'approbation par l'administrateur.");
// //         return;
// //       }
// //       router.push("/DashboardSeller");
// //     } else {
// //       router.push("/");
// //     }
// //   } catch (err: any) {
// //     alert(err.message || "Une erreur s'est produite");
// //   }
// // };