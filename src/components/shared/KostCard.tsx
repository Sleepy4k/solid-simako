import { A } from '@solidjs/router';
import { Show } from 'solid-js';
import { MapPin, Star, Heart, BadgeCheck } from 'lucide-solid';
import { ROUTES } from '~/constants/routes';

interface KostCardProps {
  slug: string;
  nama: string;
  lokasi: string;
  kampus?: string;
  jarak?: string;
  harga: number;
  rating?: number;
  isVerified?: boolean;
  jenis?: string;
  foto?: string;
  isWishlisted?: boolean;
  onWishlistToggle?: () => void;
}

function formatRp(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
    .format(n)
    .replace('IDR', 'Rp');
}

export function KostCard(props: KostCardProps) {
  return (
    <A
      href={ROUTES.DETAIL_KOST(props.slug)}
      class="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
    >
      {/* Image */}
      <div class="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Show
          when={props.foto}
          fallback={
            <div class="flex size-full items-center justify-center bg-gradient-to-br from-primary-light to-red-100">
              <span class="text-2xl font-black text-primary/30">{props.nama[0]}</span>
            </div>
          }
        >
          <img
            src={props.foto}
            alt={props.nama}
            class="size-full object-cover transition group-hover:scale-105"
            loading="lazy"
          />
        </Show>

        {/* Verified badge */}
        <Show when={props.isVerified}>
          <div class="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-success backdrop-blur-sm">
            <BadgeCheck class="size-3.5" />
            VERIFIED
          </div>
        </Show>

        {/* Jenis */}
        <Show when={props.jenis}>
          <div class="absolute right-2.5 top-2.5 rounded-full bg-navy/80 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
            {props.jenis}
          </div>
        </Show>

        {/* Wishlist */}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); props.onWishlistToggle?.(); }}
          class={[
            'absolute bottom-2.5 right-2.5 flex size-7 items-center justify-center rounded-full transition',
            props.isWishlisted
              ? 'bg-primary text-white'
              : 'bg-white/90 text-slate-400 hover:text-primary',
          ].join(' ')}
        >
          <Heart class="size-3.5" fill={props.isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Content */}
      <div class="flex flex-1 flex-col gap-1 p-3">
        <div class="flex items-start justify-between gap-2">
          <h3 class="line-clamp-1 text-sm font-semibold text-ink">{props.nama}</h3>
          <Show when={props.rating}>
            <div class="flex shrink-0 items-center gap-1 text-xs text-amber-500">
              <Star class="size-3" fill="currentColor" />
              <span class="font-medium">{props.rating?.toFixed(1)}</span>
            </div>
          </Show>
        </div>

        <div class="flex items-center gap-1 text-xs text-slate-500">
          <MapPin class="size-3 shrink-0" />
          <span class="line-clamp-1">{props.lokasi}</span>
        </div>
        <Show when={props.kampus && props.jarak}>
          <p class="text-[10px] text-slate-400">
            {props.jarak} dari {props.kampus}
          </p>
        </Show>

        <div class="mt-auto pt-2">
          <span class="text-base font-bold text-ink">{formatRp(props.harga)}</span>
          <span class="text-xs text-slate-400">/bulan</span>
        </div>
      </div>
    </A>
  );
}
