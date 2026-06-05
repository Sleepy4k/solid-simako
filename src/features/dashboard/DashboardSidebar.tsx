import { createSignal, For } from "solid-js";
import { A, useLocation, useNavigate } from "@solidjs/router";
import LogOut from "lucide-solid/icons/log-out";
import type { AuthUser } from "~/types";
import type { IconName } from "~/lib/client/icons";
import { ICON_MAP } from "~/lib/client/icons";
import { ROLE_SIDEBAR_ITEMS, ROLE_LABELS } from "~/constants/roles";
import { ConfirmModal } from "~/components/ConfirmModal";
import { logoutAction } from "~/server/actions/auth";
import { SITE } from "~/config/site";

interface DashboardSidebarProps {
  user: AuthUser;
}

export function DashboardSidebar(props: DashboardSidebarProps) {
  const location = useLocation();
  const [logoutOpen, setLogoutOpen] = createSignal(false);
  const [loggingOut, setLoggingOut] = createSignal(false);

  const navItems = () => ROLE_SIDEBAR_ITEMS[props.user.role] ?? [];

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const navigate = useNavigate();

  const doLogout = async () => {
    setLoggingOut(true);
    await logoutAction();
    window.location.href = "/";
  };

  const initials = props.user.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <>
      <aside class="w-60 bg-navy flex-shrink-0 flex flex-col overflow-hidden">
        <div class="px-5 py-4 border-b border-white/10">
          <A href="/" class="flex items-center gap-2.5">
            <div class="w-8 h-8 bg-accent rounded-lg flex items-center justify-center font-black text-white text-xs select-none">SK</div>
            <div>
              <div class="font-black text-white text-sm leading-tight">{SITE.name}</div>
              <div class="text-[10px] text-white/35 leading-tight">{ROLE_LABELS[props.user.role]}</div>
            </div>
          </A>
        </div>

        <nav class="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-0.5">
          <For each={navItems()}>
            {(item) => {
              const IconComp = ICON_MAP[item.icon as IconName];
              return (
                <A
                  href={item.path}
                  class={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive(item.path)
                      ? "bg-accent text-white shadow-sm"
                      : "text-white/55 hover:text-white hover:bg-white/8"
                  }`}
                >
                  <IconComp class="w-[18px] h-[18px] flex-shrink-0" />
                  <span class="flex-1 truncate">{item.label}</span>
                </A>
              );
            }}
          </For>
        </nav>

        <div class="px-4 py-4 border-t border-white/10">
          <div class="flex items-center gap-2.5 mb-3">
            <div class="w-9 h-9 bg-accent/20 rounded-full flex items-center justify-center text-xs font-black text-accent border border-accent/25 flex-shrink-0 select-none">
              {initials}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-white truncate">{props.user.name}</p>
              <p class="text-[11px] text-white/35 truncate">{props.user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            class="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white/45 hover:text-white/80 hover:bg-white/8 transition-colors"
          >
            <LogOut class="w-4 h-4" />
            Keluar
          </button>
        </div>
      </aside>

      <ConfirmModal
        open={logoutOpen()}
        onClose={() => setLogoutOpen(false)}
        onConfirm={doLogout}
        title="Konfirmasi Keluar"
        description="Apakah Anda yakin ingin keluar dari akun SimaKos?"
        confirmLabel="Ya, Keluar"
        confirmVariant="danger"
        loading={loggingOut()}
      />
    </>
  );
}
