# GitHub Copilot Instructions — Simako (SolidStart v2)

Simako adalah aplikasi manajemen kost berbasis SolidStart v2 + Bun + MariaDB.
Seluruh teks UI, pesan error, dan URL routing menggunakan **Bahasa Indonesia**.

---

## Stack & Teknologi

| Layer | Teknologi |
|-------|-----------|
| Framework | SolidStart 1.x (Vinxi/Vite/Nitro) |
| Reaktivitas | SolidJS 1.x (fine-grained, NO virtual DOM) |
| Runtime | Bun |
| Bahasa | TypeScript |
| Database | MariaDB via Prisma ORM |
| Styling | Tailwind CSS v3/v4 |
| Validasi | Zod |
| Icon | lucide-solid |
| Password | @node-rs/argon2 |

---

## Aturan Wajib SolidJS JSX

### WAJIB: Gunakan Komponen Control Flow

**JANGAN PERNAH** gunakan `.map()`, `.filter()`, atau method array lain di dalam JSX template.
**SELALU** gunakan komponen bawaan SolidJS:

```tsx
// ❌ SALAH — React pattern, recreates ALL DOM nodes
{items.map((item) => <li>{item.name}</li>)}

// ✅ BENAR — SolidJS native, DOM surgical update
import { For } from 'solid-js';
<For each={items()}>
  {(item) => <li>{item.name}</li>}
</For>
```

```tsx
// ❌ SALAH — ternary bypass reactivity optimization
{isLoggedIn() ? <Dashboard /> : <Login />}

// ✅ BENAR
import { Show } from 'solid-js';
<Show when={isLoggedIn()} fallback={<Login />}>
  <Dashboard />
</Show>
```

```tsx
// ❌ SALAH — switch/case in component body (runs once, never updates)
switch (status()) {
  case 'active': return <ActiveBadge />;
  case 'suspended': return <SuspendedBadge />;
}

// ✅ BENAR
import { Switch, Match } from 'solid-js';
<Switch>
  <Match when={status() === 'active'}><ActiveBadge /></Match>
  <Match when={status() === 'suspended'}><SuspendedBadge /></Match>
</Switch>
```

### Tabel Pilihan Komponen

| Situasi | Gunakan | Alasan |
|---------|---------|--------|
| Array of objects | `<For each={items()}>` | Keyed by reference |
| Array primitives (string/number) | `<Index each={items()}>` | Keyed by index |
| Kondisional | `<Show when={cond} fallback={...}>` | Fine-grained DOM update |
| Multi-cabang | `<Switch><Match when={...}>` | Mutual exclusivity |
| Async loading | `<Suspense fallback={<Skeleton />}>` | Streaming SSR support |

### Perbedaan `<For>` vs `<Index>` — callback signature BERBEDA

```tsx
// <For> — item adalah VALUE, index adalah SIGNAL
<For each={users()}>
  {(user, index) => <p>{index() + 1}. {user.nama}</p>}
</For>

// <Index> — item adalah SIGNAL, index adalah NUMBER
<Index each={names()}>
  {(name, i) => <input value={name()} />}
</Index>
```

---

## Aturan Wajib Reaktivitas SolidJS

### Props — JANGAN Destructure

```tsx
// ❌ SALAH — nilai membeku, tidak pernah update
function Kartu({ judul }: { judul: string }) {
  return <h2>{judul}</h2>;
}

// ✅ BENAR — akses props langsung
function Kartu(props: { judul: string }) {
  return <h2>{props.judul}</h2>;
}

// ✅ BENAR — gunakan splitProps jika perlu memisahkan
function Kartu(props: { judul: string; class?: string }) {
  const [local, rest] = splitProps(props, ['judul']);
  return <h2 {...rest}>{local.judul}</h2>;
}
```

### Signal — JANGAN Simpan Nilai di Variabel

```tsx
// ❌ SALAH — snapshot frozen, tidak reaktif
const [harga, setHarga] = createSignal(0);
const nilaiHarga = harga(); // frozen!
return <p>{nilaiHarga}</p>;

// ✅ BENAR — panggil getter di dalam JSX
return <p>{harga()}</p>;
```

### Effect — JANGAN Gunakan Dependency Array

```tsx
// ❌ SALAH — React pattern, tidak valid di SolidJS
createEffect(() => {
  console.log(nilai());
}, [nilai]); // ← dependency array menyebabkan bug

// ✅ BENAR — tracking otomatis, tanpa dependency array
createEffect(() => {
  console.log(nilai());
});
```

### Effect Cleanup — Gunakan `onCleanup`

```tsx
// ❌ SALAH — React pattern, return fungsi dari effect
createEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id); // ← tidak berfungsi di SolidJS
});

// ✅ BENAR
createEffect(() => {
  const id = setInterval(tick, 1000);
  onCleanup(() => clearInterval(id));
});
```

---

## Pola SolidStart — Data Fetching

### Query + createAsync (WAJIB untuk semua data server)

```tsx
// src/server/actions/contoh.ts
import { query } from '@solidjs/router';
export const daftarKostQuery = query(async () => {
  'use server';
  return db.kost.findMany();
}, 'daftarKost');

// src/routes/contoh.tsx
import { createAsync } from '@solidjs/router';
import { Suspense, For } from 'solid-js';
import { Skeleton } from '~/components/ui/Skeleton';

export default function HalamanContoh() {
  const kostList = createAsync(() => daftarKostQuery());
  return (
    <Suspense fallback={<Skeleton class="h-64" />}>
      <For each={kostList()}>
        {(kost) => <KostCard kost={kost} />}
      </For>
    </Suspense>
  );
}
```

### Action — SELALU `throw redirect()`, bukan `return`

```tsx
// ❌ SALAH
return redirect('/dasbor');

// ✅ BENAR
throw redirect('/dasbor');
throw reload({ revalidate: daftarKostQuery.key });
```

### Session — Import dari `@solidjs/start/http`

```tsx
// ❌ SALAH
import { useSession } from '@solidjs/start/server';

// ✅ BENAR
import { useSession } from '@solidjs/start/http';
```

---

## Anti-Pattern yang Dilarang (Lengkap)

| ID | Pattern | Severity |
|----|---------|----------|
| AP-001 | Destructuring props | CRITICAL |
| AP-002 | Signal value di variabel luar JSX | CRITICAL |
| AP-003 | `useState` (React) | CRITICAL |
| AP-004 | `useEffect` / dependency array | CRITICAL |
| AP-011 | `Array.map()` di JSX | HIGH |
| AP-012 | Ternary `cond ? <A/> : <B/>` | MEDIUM |
| AP-013 | `switch/case` di component body | HIGH |
| AP-018 | `return () => cleanup` dari effect | CRITICAL |
| AP-019 | `useRouter` (Next.js/React Router) | HIGH |
| AP-020 | `fetch` di dalam `useEffect` | HIGH |
| AP-022 | `getServerSideProps` pattern | HIGH |

---

## Konvensi Proyek Simako

- **URL Bahasa Indonesia**: `/masuk`, `/daftar`, `/dasbor`, `/pengaturan`, `/cari-kost`
- **Skeleton loader** di dalam `<Suspense>` — jangan spinner
- **Toast**: respons setiap aksi (sukses/peringatan/error)
- **Mobile-first**: gunakan `md:`, `lg:` prefix Tailwind
- **Scrollbar**: terlihat di desktop (tipis/modern), tersembunyi di mobile
- **Validasi**: Zod di semua form input dan server actions
- **Keamanan**: argon2 untuk password, httpOnly cookie untuk session
- **Zero client-side fetch**: semua data dari `query()` + `createAsync()`

---

## Import yang Benar

```tsx
// Reaktivitas
import { createSignal, createEffect, createMemo, onCleanup } from 'solid-js';
// Control flow
import { Show, For, Index, Switch, Match, Suspense } from 'solid-js';
// Props utilities
import { splitProps, mergeProps, children } from 'solid-js';
// Store
import { createStore, produce, reconcile } from 'solid-js/store';
// Router
import { createAsync, query, action, useAction, useSubmission } from '@solidjs/router';
import { redirect, reload, revalidate } from '@solidjs/router';
// SolidStart session
import { useSession } from '@solidjs/start/http';
// Rendering (SSR/hydration only)
import { isServer } from 'solid-js/web';
```
