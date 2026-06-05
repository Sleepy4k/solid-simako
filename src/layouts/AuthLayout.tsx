import type { JSX } from "solid-js";
import { A } from "@solidjs/router";
import ChevronLeft from "lucide-solid/icons/chevron-left";
import { SITE } from "~/config/site";

interface AuthLayoutProps {
  children:    JSX.Element;
  title:       string;
  subtitle?:   string;
  backHref?:   string;
  backLabel?:  string;
}

export function AuthLayout(props: AuthLayoutProps) {
  return (
    <div class="min-h-screen bg-[#F4F7FA] flex flex-col">
      <div class="flex-1 flex items-center justify-center p-4 py-12">
        <div class="w-full max-w-md">
          <div class="text-center mb-8">
            <A href="/" class="inline-flex items-center gap-2.5 mb-6 group">
              <div class="w-10 h-10 bg-navy rounded-xl flex items-center justify-center font-black text-white text-sm shadow group-hover:bg-navy-dark transition-colors">
                SK
              </div>
              <span class="font-black text-xl text-navy">{SITE.name}</span>
            </A>
            <h1 class="text-2xl font-black text-navy">{props.title}</h1>
            {props.subtitle && (
              <p class="text-navy/50 text-sm mt-1">{props.subtitle}</p>
            )}
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-[#E6F0FA] p-7">
            {props.children}
          </div>

          <div class="mt-4 text-center">
            <A
              href={props.backHref ?? "/"}
              class="text-sm text-navy/40 hover:text-navy transition-colors inline-flex items-center justify-center gap-1"
            >
              <ChevronLeft class="w-4 h-4" />
              {props.backLabel ?? "Kembali ke Beranda"}
            </A>
          </div>
        </div>
      </div>
    </div>
  );
}
