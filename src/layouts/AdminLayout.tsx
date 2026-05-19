import { JSX } from 'solid-js';
import { AdminSidebar } from '~/components/shared/AdminSidebar';
import { DashboardTopbar } from '~/components/shared/DashboardTopbar';

interface AdminLayoutProps {
  children: JSX.Element;
  userName?: string;
}

export function AdminLayout(props: AdminLayoutProps) {
  return (
    <div class="flex h-dvh overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <AdminSidebar userName={props.userName ?? 'Riska Handayani'} />

      {/* Main */}
      <div class="flex flex-1 flex-col overflow-hidden">
        <DashboardTopbar
          userName={props.userName ?? 'Riska Handayani'}
          userRole="Super Admin"
          roleLabel="ADMIN"
          searchPlaceholder="Cari user, properti, transaksi..."
        />
        <main class="flex-1 overflow-y-auto p-6">{props.children}</main>
      </div>
    </div>
  );
}
