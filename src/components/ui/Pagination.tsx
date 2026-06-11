import { For, Show } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { ChevronLeft, ChevronRight } from "lucide-solid";
import { CustomSelect, type SelectOption } from "~/components/ui/Select";

interface PaginationProps {
  page:            number;
  totalPages:      number;
  perPage?:        number;
  perPageOptions?: number[];
  total?:          number;
  baseUrl?:        string;
}

function getPageNumbers(page: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [];
  const add = (n: number | "...") => { if (pages[pages.length - 1] !== n) pages.push(n); };

  for (let i = 1; i <= Math.min(2, total); i++) add(i);
  if (page > 4) add("...");
  for (let i = Math.max(3, page - 1); i <= Math.min(total - 2, page + 1); i++) add(i);
  if (page < total - 3) add("...");
  for (let i = Math.max(total - 1, 3); i <= total; i++) add(i);

  return pages;
}

export function Pagination(props: PaginationProps) {
  const [, setSearchParams] = useSearchParams();
  const pages = () => getPageNumbers(props.page, props.totalPages);

  const goTo = (p: number) => {
    if (p < 1 || p > props.totalPages) return;
    setSearchParams({ page: String(p) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (props.totalPages <= 1 && !props.perPage) return null;

  const perPageOptions = (): SelectOption[] =>
    (props.perPageOptions ?? [6, 12, 24, 48]).map((n) => ({
      value: String(n),
      label: `${n} per halaman`,
    }));

  return (
    <div class="mt-8 space-y-4">
      <Show when={props.total !== undefined && props.perPage}>
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p class="text-sm text-navy/55">
            Menampilkan{" "}
            <strong class="text-navy">
              {Math.min((props.page - 1) * (props.perPage ?? 12) + 1, props.total ?? 0)}-{Math.min(props.page * (props.perPage ?? 12), props.total ?? 0)}
            </strong>{" "}
            dari <strong class="text-navy">{props.total}</strong> hasil
          </p>
          <CustomSelect
            value={String(props.perPage)}
            onChange={(v) => { setSearchParams({ perPage: v, page: "1" }); }}
            options={perPageOptions()}
            class="w-44"
          />
        </div>
      </Show>

      <Show when={props.totalPages > 1}>
        <div class="flex items-center justify-center">
          <nav class="inline-flex items-center gap-1 bg-white border border-[#E6F0FA] rounded-2xl p-1.5 shadow-sm" aria-label="Navigasi halaman">
            <button
              type="button"
              onClick={() => goTo(1)}
              disabled={props.page <= 1}
              aria-label="Halaman pertama"
              class={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors ${
                props.page <= 1
                  ? "text-navy/20 cursor-not-allowed"
                  : "text-navy/50 hover:bg-[#F4F7FA] hover:text-navy"
              }`}
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => goTo(props.page - 1)}
              disabled={props.page <= 1}
              aria-label="Halaman sebelumnya"
              class={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors ${
                props.page <= 1
                  ? "text-navy/20 cursor-not-allowed"
                  : "text-navy/50 hover:bg-[#F4F7FA] hover:text-navy"
              }`}
            >
              <ChevronLeft class="w-4 h-4" />
            </button>

            <div class="flex items-center gap-1 mx-1">
              <For each={pages()}>
                {(p) => (
                  <Show
                    when={p !== "..."}
                    fallback={
                      <span class="w-8 h-8 flex items-center justify-center text-navy/30 text-sm select-none">
                        …
                      </span>
                    }
                  >
                    <button
                      type="button"
                      onClick={() => goTo(p as number)}
                      aria-current={(p as number) === props.page ? "page" : undefined}
                      class={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-all ${
                        (p as number) === props.page
                          ? "bg-accent text-white shadow-sm shadow-accent/30 scale-105"
                          : "text-navy/60 hover:bg-[#F4F7FA] hover:text-navy"
                      }`}
                    >
                      {p}
                    </button>
                  </Show>
                )}
              </For>
            </div>

            <button
              type="button"
              onClick={() => goTo(props.page + 1)}
              disabled={props.page >= props.totalPages}
              aria-label="Halaman berikutnya"
              class={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors ${
                props.page >= props.totalPages
                  ? "text-navy/20 cursor-not-allowed"
                  : "text-navy/50 hover:bg-[#F4F7FA] hover:text-navy"
              }`}
            >
              <ChevronRight class="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => goTo(props.totalPages)}
              disabled={props.page >= props.totalPages}
              aria-label="Halaman terakhir"
              class={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors ${
                props.page >= props.totalPages
                  ? "text-navy/20 cursor-not-allowed"
                  : "text-navy/50 hover:bg-[#F4F7FA] hover:text-navy"
              }`}
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        </div>

        <p class="text-center text-xs text-navy/35">
          Halaman {props.page} dari {props.totalPages}
        </p>
      </Show>
    </div>
  );
}

