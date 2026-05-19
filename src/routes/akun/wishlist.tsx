import { createSignal, For } from 'solid-js';
import { Heart, MapPin, Star } from 'lucide-solid';
import { TenantLayout } from '~/layouts/TenantLayout';
import { SEO } from '~/components/shared/SEO';
import { Badge } from '~/components/ui/Badge';
import { ButtonLink } from '~/components/ui/Button';
import { EmptyState } from '~/components/ui/EmptyState';
import { ROUTES } from '~/constants/routes';

interface WishlistItem {
  id: string;
  nama: string;
  kota: string;
  harga: string;
  jenis: 'Putra' | 'Putri' | 'Campur';
  rating: string;
  ulasan: number;
  fasilitas: string[];
}

const ITEMS: WishlistItem[] = [
  { id: 'ananda-1', nama: 'Kost Ananda Residence', kota: 'Yogyakarta', harga: 'Rp 900.000', jenis: 'Campur', rating: '4.8', ulasan: 23, fasilitas: ['WiFi', 'AC', 'KM Dalam'] },
  { id: 'melati-2', nama: 'Kost Melati Premium', kota: 'Yogyakarta', harga: 'Rp 1.200.000', jenis: 'Putri', rating: '4.9', ulasan: 41, fasilitas: ['WiFi', 'AC', 'KM Dalam', 'Laundry'] },
  { id: 'berlian-3', nama: 'Kost Berlian Semarang', kota: 'Semarang', harga: 'Rp 550.000', jenis: 'Putra', rating: '4.5', ulasan: 12, fasilitas: ['WiFi', 'Parkir'] },
];

const JENIS_VARIANT: Record<string, 'navy' | 'info' | 'default'> = {
  Putra: 'navy',
  Putri: 'info',
  Campur: 'default',
};

export default function WishlistPage() {
  const [items, setItems] = createSignal(ITEMS);

  function hapus(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <TenantLayout userName="Dewi Ananda">
      <SEO title="Wishlist Saya" noIndex />

      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-xl font-bold text-ink">Wishlist Saya</h1>
        <span class="text-sm text-slate-500">{items().length} kost disimpan</span>
      </div>

      {items().length === 0
        ? (
          <EmptyState
            title="Wishlist kosong"
            description="Simpan kost favoritmu dengan menekan ikon hati di halaman detail kost."
            action={<ButtonLink href={ROUTES.CARI_KOST} size="sm">Cari Kost</ButtonLink>}
          />
        )
        : (
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <For each={items()}>
              {(item) => (
                <div class="overflow-hidden rounded-2xl border border-slate-100 bg-white transition hover:shadow-md">
                  {/* Cover */}
                  <div class="relative aspect-[16/9] bg-gradient-to-br from-slate-200 to-slate-300">
                    <button
                      type="button"
                      class="absolute right-2.5 top-2.5 flex size-8 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-110"
                      onClick={() => hapus(item.id)}
                      title="Hapus dari wishlist"
                    >
                      <Heart class="size-4 fill-primary text-primary" />
                    </button>
                    <div class="absolute bottom-2 left-2">
                      <Badge variant={JENIS_VARIANT[item.jenis]} class="text-[9px]">{item.jenis}</Badge>
                    </div>
                  </div>

                  <div class="p-3">
                    <p class="font-semibold text-ink">{item.nama}</p>
                    <div class="mt-1 flex items-center gap-1 text-xs text-slate-400">
                      <MapPin class="size-3" /> {item.kota}
                    </div>

                    <div class="mt-2 flex flex-wrap gap-1">
                      {item.fasilitas.slice(0, 3).map((f) => (
                        <span class="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">{f}</span>
                      ))}
                    </div>

                    <div class="mt-3 flex items-center justify-between">
                      <div>
                        <span class="font-bold text-ink">{item.harga}</span>
                        <span class="text-xs text-slate-400">/bln</span>
                      </div>
                      <div class="flex items-center gap-1 text-xs text-slate-500">
                        <Star class="size-3 fill-warn text-warn" /> {item.rating} ({item.ulasan})
                      </div>
                    </div>

                    <ButtonLink
                      href={ROUTES.DETAIL_KOST(item.id)}
                      size="sm"
                      class="mt-3 w-full text-center"
                    >
                      Lihat Detail
                    </ButtonLink>
                  </div>
                </div>
              )}
            </For>
          </div>
        )
      }
    </TenantLayout>
  );
}
