import { createSignal, Show, For } from "solid-js";
import { createAsync } from "@solidjs/router";
import Bell from "lucide-solid/icons/bell";
import X from "lucide-solid/icons/x";
import type { AuthUser } from "~/types";
import { getNotifications, markNotificationsRead } from "~/server/actions/user";
import { Modal } from "~/components/ui/Modal";

interface DashboardTopBarProps {
  user:        AuthUser;
  title:       string;
  breadcrumb?: string;
}

export function DashboardTopBar(props: DashboardTopBarProps) {
  const [notifOpen, setNotifOpen] = createSignal(false);
  const notifications = createAsync(() => getNotifications());

  const unreadCount = () => (notifications() ?? []).filter((n) => !n.isRead).length;

  const openNotif = async () => {
    setNotifOpen(true);
    if (unreadCount() > 0) await markNotificationsRead();
  };

  const initials = props.user.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <>
      <header class="bg-white border-b border-[#E6F0FA] px-6 py-3.5 flex items-center justify-between gap-4 flex-shrink-0 shadow-sm z-10">
        <div>
          <Show when={props.breadcrumb}>
            <p class="text-[11px] text-navy/35 mb-0.5">{props.breadcrumb}</p>
          </Show>
          <h1 class="text-lg font-black text-navy">{props.title}</h1>
        </div>

        <div class="flex items-center gap-3">
          <span class="text-xs text-navy/40 hidden md:block">{today}</span>

          <button type="button" onClick={openNotif} class="relative p-2.5 rounded-xl hover:bg-[#F4F7FA] transition-colors" aria-label="Notifikasi">
            <Bell class="w-5 h-5 text-navy/60" />
            <Show when={unreadCount() > 0}>
              <span class="absolute top-1.5 right-1.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-0.5">
                {unreadCount() > 9 ? "9+" : unreadCount()}
              </span>
            </Show>
          </button>

          <div class="flex items-center gap-2 pl-3 border-l border-[#E6F0FA]">
            <div class="w-8 h-8 bg-[#E6F0FA] rounded-full flex items-center justify-center text-xs font-black text-accent select-none">
              {initials}
            </div>
            <div class="hidden sm:block">
              <p class="text-sm font-semibold text-navy leading-tight">{props.user.name}</p>
              <p class="text-[10px] text-navy/40 leading-tight">{props.user.email}</p>
            </div>
          </div>
        </div>
      </header>

      <Modal open={notifOpen()} onClose={() => setNotifOpen(false)} title="Notifikasi" size="md">
        <div class="max-h-96 overflow-y-auto">
          <Show
            when={(notifications() ?? []).length > 0}
            fallback={
              <div class="p-8 text-center text-navy/40">
                <Bell class="w-12 h-12 mx-auto mb-3 text-navy/15" />
                <p class="text-sm">Belum ada notifikasi</p>
              </div>
            }
          >
            <ul class="divide-y divide-[#F4F7FA]">
              <For each={notifications()}>
                {(n) => (
                  <li class={`px-5 py-4 ${!n.isRead ? "bg-[#F4F7FA]" : ""}`}>
                    <div class="flex items-start gap-3">
                      <div class={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.isRead ? "bg-accent" : "bg-transparent"}`} />
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-navy">{n.title}</p>
                        <p class="text-xs text-navy/55 mt-0.5 leading-relaxed">{n.body}</p>
                        <p class="text-[10px] text-navy/30 mt-1.5">
                          {n.createdAt.toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  </li>
                )}
              </For>
            </ul>
          </Show>
        </div>
      </Modal>
    </>
  );
}
