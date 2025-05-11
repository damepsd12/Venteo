// types/index.ts
export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  cloudinary_public_id?: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  seller?: {
    _id: string;
    name: string;
    email?: string;
  };
  // Ajoutez d’autres champs si nécessaire
}