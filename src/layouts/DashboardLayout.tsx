import type { JSX } from "solid-js";
import { DashboardSidebar } from "~/features/dashboard/DashboardSidebar";
import { DashboardTopBar } from "~/features/dashboard/DashboardTopBar";
import type { AuthUser } from "~/types";

interface DashboardLayoutProps {
  user:        AuthUser;
  children:    JSX.Element;
  title:       string;
  breadcrumb?: string;
}

export function DashboardLayout(props: DashboardLayoutProps) {
  return (
    <div class="flex h-screen overflow-hidden bg-[#F4F7FA]">
      <DashboardSidebar user={props.user} />
      <div class="flex-1 flex flex-col overflow-hidden">
        <DashboardTopBar
          user={props.user}
          title={props.title}
          breadcrumb={props.breadcrumb}
        />
        <main class="flex-1 overflow-y-auto px-6 py-6">
          {props.children}
        </main>
      </div>
    </div>
  );
}
