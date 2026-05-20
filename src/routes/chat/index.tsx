import {
  createAsync,
  useAction,
  useSearchParams,
  type RouteDefinition,
} from '@solidjs/router';
import { createEffect, createSignal, For, Show, Suspense } from 'solid-js';
import { Send, Search } from 'lucide-solid';
import { TenantLayout } from '~/layouts/TenantLayout';
import { SEO } from '~/components/shared/SEO';
import { Avatar } from '~/components/ui/Avatar';
import { Skeleton } from '~/components/ui/Skeleton';
import { EmptyState } from '~/components/ui/EmptyState';
import {
  chatRoomsQuery,
  chatMessagesQuery,
  sendChatAction,
} from '~/server/actions/penyewa';
import { currentUserQuery } from '~/server/actions/auth';

export const route = {
  preload() {
    currentUserQuery();
    chatRoomsQuery();
  },
} satisfies RouteDefinition;

function timeShort(d: Date | string) {
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatPage() {
  const [params, setParams] = useSearchParams();
  const user = createAsync(() => currentUserQuery());
  const rooms = createAsync(() => chatRoomsQuery());
  const [activeId, setActiveId] = createSignal<string | null>(null);

  // sync from query string
  createEffect(() => {
    const q = typeof params.room === 'string' ? params.room : undefined;
    if (q) setActiveId(q);
  });

  // pick first room by default
  createEffect(() => {
    if (!activeId() && rooms() && rooms()!.length > 0) {
      setActiveId(rooms()![0].id);
    }
  });

  const messages = createAsync(() =>
    activeId() ? chatMessagesQuery(activeId()!) : Promise.resolve([]),
  );

  const sendMsg = useAction(sendChatAction);
  const [text, setText] = createSignal('');

  async function handleSend(e: SubmitEvent) {
    e.preventDefault();
    const rid = activeId();
    if (!rid || !text().trim()) return;
    const fd = new FormData();
    fd.append('chatRoomId', rid);
    fd.append('konten', text());
    setText('');
    await sendMsg(fd);
  }

  function selectRoom(id: string) {
    setActiveId(id);
    setParams({ room: id });
  }

  const activeRoom = () => rooms()?.find((r) => r.id === activeId());

  return (
    <TenantLayout userName={user()?.namaLengkap ?? undefined}>
      <SEO title="Pesan" noIndex />

      <Suspense fallback={<Skeleton class="h-[calc(100vh-13rem)]" />}>
        <Show
          when={rooms() && rooms()!.length > 0}
          fallback={
            <EmptyState
              title="Belum ada percakapan"
              description="Mulai chat dari halaman detail kost ketika kamu tertarik menyewa."
            />
          }
        >
          <div class="flex h-[calc(100vh-13rem)] overflow-hidden rounded-2xl border border-slate-100 bg-white">
            {/* Sidebar */}
            <div class="flex w-64 flex-shrink-0 flex-col border-r border-slate-100">
              <div class="border-b border-slate-100 p-3">
                <div class="relative">
                  <Search class="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    placeholder="Cari percakapan..."
                    class="h-8 w-full rounded-lg border border-slate-200 pl-8 pr-3 text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
              <div class="flex-1 overflow-y-auto">
                <For each={rooms()}>
                  {(r) => (
                    <button
                      type="button"
                      class={[
                        'flex w-full items-start gap-2.5 border-b border-slate-50 px-3 py-3 text-left transition last:border-0',
                        activeId() === r.id ? 'bg-primary-light/30' : 'hover:bg-slate-50',
                      ].join(' ')}
                      onClick={() => selectRoom(r.id)}
                    >
                      <Avatar name={r.lawanNama} size="sm" src={r.lawanAvatar ?? undefined} />
                      <div class="min-w-0 flex-1">
                        <div class="flex items-center justify-between gap-1">
                          <p class="truncate text-xs font-semibold text-ink">{r.lawanNama}</p>
                          <span class="flex-shrink-0 text-[10px] text-slate-400">
                            {timeShort(r.lastMessageAt)}
                          </span>
                        </div>
                        <p class="text-[10px] text-slate-400">
                          {r.lawanRole} · {r.kostNama}
                        </p>
                        <Show when={r.lastMessage}>
                          <p class="mt-0.5 truncate text-[11px] text-slate-500">
                            {r.lastMessage}
                          </p>
                        </Show>
                      </div>
                      <Show when={r.unread > 0}>
                        <span class="flex size-4 flex-shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
                          {r.unread}
                        </span>
                      </Show>
                    </button>
                  )}
                </For>
              </div>
            </div>

            {/* Chat area */}
            <div class="flex flex-1 flex-col">
              <Show
                when={activeRoom()}
                fallback={
                  <div class="flex flex-1 items-center justify-center text-sm text-slate-400">
                    Pilih percakapan untuk mulai
                  </div>
                }
              >
                {(room) => (
                  <>
                    <div class="flex items-center gap-2.5 border-b border-slate-100 px-4 py-3">
                      <Avatar name={room().lawanNama} size="sm" src={room().lawanAvatar ?? undefined} />
                      <div>
                        <p class="text-sm font-semibold text-ink">{room().lawanNama}</p>
                        <p class="text-[10px] text-slate-400">
                          {room().lawanRole} · {room().kostNama}
                        </p>
                      </div>
                    </div>

                    <div class="flex-1 space-y-3 overflow-y-auto p-4">
                      <Suspense
                        fallback={
                          <div class="space-y-2">
                            <Skeleton class="h-10 w-1/2" />
                            <Skeleton class="ml-auto h-10 w-1/2" />
                          </div>
                        }
                      >
                        <For each={messages()}>
                          {(msg) => {
                            const isSelf = msg.senderId === user()?.id;
                            return (
                              <div class={`flex gap-2 ${isSelf ? 'flex-row-reverse' : ''}`}>
                                <Avatar
                                  name={isSelf ? user()?.namaLengkap ?? 'Saya' : room().lawanNama}
                                  size="sm"
                                  src={isSelf ? user()?.avatarUrl ?? undefined : room().lawanAvatar ?? undefined}
                                />
                                <div
                                  class={`flex flex-col gap-0.5 ${isSelf ? 'items-end' : 'items-start'}`}
                                  style={{ 'max-width': '65%' }}
                                >
                                  <div
                                    class={`rounded-2xl px-3 py-2 text-sm ${
                                      isSelf
                                        ? 'bg-primary text-white rounded-tr-none'
                                        : 'bg-slate-100 text-ink rounded-tl-none'
                                    }`}
                                  >
                                    {msg.konten}
                                  </div>
                                  <p class="text-[10px] text-slate-400">
                                    {timeShort(msg.createdAt)}
                                  </p>
                                </div>
                              </div>
                            );
                          }}
                        </For>
                      </Suspense>
                    </div>

                    <form
                      onSubmit={handleSend}
                      class="flex gap-2 border-t border-slate-100 p-3"
                    >
                      <input
                        type="text"
                        placeholder="Tulis pesan..."
                        class="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={text()}
                        onInput={(e) => setText(e.currentTarget.value)}
                      />
                      <button
                        type="submit"
                        class="flex size-9 items-center justify-center rounded-xl bg-primary text-white transition hover:bg-primary-2"
                      >
                        <Send class="size-4" />
                      </button>
                    </form>
                  </>
                )}
              </Show>
            </div>
          </div>
        </Show>
      </Suspense>
    </TenantLayout>
  );
}
