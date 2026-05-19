import { JSX } from 'solid-js';
import { MitraSidebar } from '~/components/shared/MitraSidebar';
import { DashboardTopbar } from '~/components/shared/DashboardTopbar';

interface MitraLayoutProps {
  children: JSX.Element;
  userName?: string;
  propertiCount?: number;
}

export function MitraLayout(props: MitraLayoutProps) {
  return (
    <div class="flex h-dvh overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <MitraSidebar
        userName={props.userName ?? 'Pak Slamet'}
        propertiCount={props.propertiCount ?? 3}
      />

      {/* Main */}
      <div class="flex flex-1 flex-col overflow-hidden">
        <DashboardTopbar
          userName={props.userName ?? 'Pak Slamet'}
          userRole="Owner · 3 properti"
          roleLabel="OWNER"
          searchPlaceholder="Cari penyewa, kamar, tagihan..."
        />
        <main class="flex-1 overflow-y-auto p-6">{props.children}</main>
      </div>
    </div>
  );
}
