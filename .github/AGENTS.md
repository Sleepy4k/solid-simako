# AGENTS.md — Simako (SolidStart v2)

Instruksi untuk AI coding agents (GitHub Copilot, OpenAI Codex, dsb.) saat bekerja di repo ini.

## Konteks Proyek

Simako adalah platform manajemen kost di Purwokerto. Stack: **SolidStart 1.x**, **Bun**, **MariaDB/Prisma**, **Tailwind CSS**, **TypeScript**. Semua UI dan routing menggunakan **Bahasa Indonesia**.

---

## Aturan Kritis — Wajib Diikuti

### 1. SolidJS Control Flow — BUKAN JavaScript Array Methods

SolidJS mengkompilasi JSX menjadi DOM calls langsung (bukan virtual DOM). Komponen hanya berjalan **sekali** saat inisialisasi. Oleh karena itu:

**DILARANG** menggunakan `.map()`, `.filter()`, `.reduce()` atau method array apapun untuk merender elemen di dalam JSX.

**WAJIB** menggunakan komponen control flow dari `solid-js`:

```tsx
// ❌ DILARANG
{items.map(item => <div>{item.name}</div>)}
{condition ? <A /> : <B />}

// ✅ WAJIB
import { For, Show } from 'solid-js';
<For each={items()}>{(item) => <div>{item.name}</div>}</For>
<Show when={condition()} fallback={<B />}><A /></Show>
```

### 2. Props — Jangan Pernah Destructure

```tsx
// ❌ DILARANG — nilai membeku selamanya
function Komponen({ nama }: Props) { return <p>{nama}</p> }
const { nama } = props; // snapshot frozen

// ✅ WAJIB — akses props langsung
function Komponen(props: Props) { return <p>{props.nama}</p> }
```

### 3. Signal — Panggil Getter, Jangan Simpan Nilai

```tsx
// ❌ DILARANG
const nilai = count(); // frozen snapshot
// ✅ WAJIB
return <p>{count()}</p>; // reaktif
```

### 4. Data Fetching — query() + createAsync() SAJA

```tsx
// ❌ DILARANG — fetch di client
useEffect(() => { fetch('/api/data').then(...) }, []);

// ✅ WAJIB — server query
const getData = query(async () => { 'use server'; return db.find(); }, 'key');
const data = createAsync(() => getData());
```

### 5. Actions — SELALU throw, JANGAN return

```tsx
// ❌ return redirect('/path');
// ✅ throw redirect('/path');
// ✅ throw reload({ revalidate: myQuery.key });
```

### 6. Session Import

```tsx
// ❌ import { useSession } from '@solidjs/start/server';
// ✅ import { useSession } from '@solidjs/start/http';
```

---

## Konvensi Kode

| Aturan | Nilai |
|--------|-------|
| Indentasi | 2 spaces |
| Quote | Single quotes (`'`) |
| Semicolon | Wajib |
| Formatter | Prettier + prettier-plugin-tailwindcss |
| Linter | ESLint |

## Struktur File

```
src/
  routes/          # File-based routing (Bahasa Indonesia URL)
  components/
    ui/            # Komponen stateless: Button, Card, Skeleton
    shared/        # Komponen global: Navbar, Sidebar, Toast
    form/          # Form dengan validasi Zod
  layouts/         # Layout wrapper
  server/
    actions/       # query() + action() dengan "use server"
    services/      # Business logic layer
    db/            # Prisma client instance
  lib/
    server/        # Crypto, session helpers (server-only)
    shared/        # Utilities universal
  constants/       # Routes, messages
```

## Komponen Control Flow — Referensi Cepat

| Komponen | Import | Kegunaan |
|----------|--------|----------|
| `<For>` | `solid-js` | Array of objects, keyed by reference |
| `<Index>` | `solid-js` | Array of primitives, keyed by index |
| `<Show>` | `solid-js` | Kondisional, dengan/tanpa fallback |
| `<Switch>/<Match>` | `solid-js` | Multi-branch conditional |
| `<Suspense>` | `solid-js` | Async boundary dengan fallback skeleton |
| `<ErrorBoundary>` | `solid-js` | Error handling UI |

## Perbedaan Kritis For vs Index

```tsx
// <For> — item=VALUE, index=SIGNAL (panggil index())
<For each={objs()}>
  {(obj, idx) => <p>{idx() + 1}. {obj.nama}</p>}
</For>

// <Index> — item=SIGNAL (panggil item()), index=NUMBER
<Index each={strings()}>
  {(str, i) => <input value={str()} />}
</Index>
```

## Testing

- Unit test: `bun test` (Bun native test runner)
- Komponen test: `@solidjs/testing-library`
- Gunakan `render()` dari `@solidjs/testing-library`, bukan ReactDOM
- `screen.getByText()`, `fireEvent.click()` — Testing Library API

## Security

- Password: `@node-rs/argon2` (server-only)
- Session: `useSession` dari `@solidjs/start/http`, cookie httpOnly
- Validasi input: Zod di semua form dan server action
- Variabel server (`DATABASE_URL`, JWT secret): TIDAK BOLEH expose ke client
- Variabel client: prefix `VITE_` saja

---

*Instruksi ini adalah sumber kebenaran untuk semua AI agents di repo ini.*
*Update jika ada perubahan arsitektur atau konvensi baru.*
