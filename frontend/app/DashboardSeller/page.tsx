import DashboardLayout from '../(dashboard)/dashboard-layout';

export default function DashboardSellerPage() {
  return (
    <DashboardLayout role="seller">
      <div className='pl-59 p-15'>
        <div className='p-20 max-w-4xl mx-auto'>
          <h1 className="text-2xl font-bold">Bienvenue Vendeur</h1>
          <p>Voici vos produits, ventes et statistiques.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
