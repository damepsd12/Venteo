'use client';
import AdminSidebar from '../components/sidebar/AdminSidebar';
import SellerSidebar from '../components/sidebar/SellerSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role?: 'admin' | 'seller';
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  return (
    <div className='p-0 min-h-screen flex flex-col'>
      <div className="flex min-h-screen">
        {role === 'admin' && <AdminSidebar />}
        {role === 'seller' && <SellerSidebar />}
        <main className="flex-1 p-9 bg-gray-200">{children}</main>
      </div>
    </div>
  );
}

