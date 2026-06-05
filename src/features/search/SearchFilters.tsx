import { useSearchParams } from "@solidjs/router";
import { KOST_TYPE_LABELS, GENDER_TYPE_LABELS, PURWOKERTO_DISTRICTS } from "~/config/site";
import { CustomSelect, SearchableSelect, type SelectOption } from "~/components/ui/Select";

const TYPE_OPTIONS: SelectOption[]    = Object.entries(KOST_TYPE_LABELS).map(([k, v]) => ({ value: k, label: v }));
const GENDER_OPTIONS: SelectOption[]  = Object.entries(GENDER_TYPE_LABELS).map(([k, v]) => ({ value: k, label: v }));
const DISTRICT_OPTIONS: SelectOption[] = [...PURWOKERTO_DISTRICTS].map((d) => ({ value: d, label: d }));

export function SearchFilters() {
  const [sp, setSp] = useSearchParams();

  const valueOf = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] ?? "" : value ?? "";

  const set = (key: string, value: string) =>
    setSp({ [key]: value || undefined, page: "1" });

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-[#E6F0FA] text-sm text-navy bg-white outline-none focus:border-accent transition-colors";

  return (
    <div class="bg-white border border-[#E6F0FA] rounded-2xl p-4 mb-4 flex flex-wrap items-end gap-3">
      <div class="flex-1 min-w-[140px]">
        <label class="block text-[11px] font-bold text-navy/50 uppercase tracking-wider mb-1.5">Tipe</label>
        <CustomSelect
          value={valueOf(sp.type)}
          onChange={(v) => set("type", v)}
          options={TYPE_OPTIONS}
          placeholder="Semua Tipe"
        />
      </div>

      <div class="flex-1 min-w-[140px]">
        <label class="block text-[11px] font-bold text-navy/50 uppercase tracking-wider mb-1.5">Penghuni</label>
        <CustomSelect
          value={valueOf(sp.gender)}
          onChange={(v) => set("gender", v)}
          options={GENDER_OPTIONS}
          placeholder="Semua Penghuni"
        />
      </div>

      <div class="flex-1 min-w-[160px]">
        <label class="block text-[11px] font-bold text-navy/50 uppercase tracking-wider mb-1.5">Area</label>
        <SearchableSelect
          value={valueOf(sp.city)}
          onChange={(v) => set("city", v)}
          options={DISTRICT_OPTIONS}
          placeholder="Semua Area"
          searchPlaceholder="Cari kecamatan..."
        />
      </div>

      <div class="flex-1 min-w-[200px]">
        <label class="block text-[11px] font-bold text-navy/50 uppercase tracking-wider mb-1.5">Harga / Bulan</label>
        <div class="flex gap-2 items-center">
          <div class="relative flex-1">
            <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-navy/40 pointer-events-none">Rp</span>
            <input
              type="number"
              placeholder="Min"
              value={valueOf(sp.minPrice)}
              onBlur={(e) => set("minPrice", e.currentTarget.value)}
              class={`${inputCls} pl-7 text-xs`}
              min="0"
              step="50000"
            />
          </div>
          <span class="text-navy/30 text-xs flex-shrink-0">–</span>
          <div class="relative flex-1">
            <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-navy/40 pointer-events-none">Rp</span>
            <input
              type="number"
              placeholder="Maks"
              value={valueOf(sp.maxPrice)}
              onBlur={(e) => set("maxPrice", e.currentTarget.value)}
              class={`${inputCls} pl-7 text-xs`}
              min="0"
              step="50000"
            />
          </div>
        </div>
      </div>

      <div class="flex-shrink-0">
        <button
          type="button"
          onClick={() => setSp({ q: valueOf(sp.q) || undefined })}
          class="px-4 py-2.5 rounded-xl text-xs font-semibold border border-[#E6F0FA] text-navy/50 hover:border-accent/40 hover:text-accent transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
