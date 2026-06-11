import { A } from "@solidjs/router";
import { Instagram, Mail } from "lucide-solid";
import { SITE } from "~/config/site";

const QUICK_LINKS = [
  { label: "Cari Kos",      href: "/search" },
  { label: "Kos Putra",     href: "/search?gender=male" },
  { label: "Kos Putri",     href: "/search?gender=female" },
  { label: "Guest House",   href: "/search?type=guest_house" },
  { label: "Daftar Tenant", href: "/auth/register-tenant" },
];

const AREA_LINKS = [
  { label: "Purwokerto Utara",  href: "/search?city=Purwokerto+Utara" },
  { label: "Purwokerto Selatan",href: "/search?city=Purwokerto+Selatan" },
  { label: "Purwokerto Timur",  href: "/search?city=Purwokerto+Timur" },
  { label: "Grendeng",          href: "/search?city=Grendeng" },
  { label: "Sokanegara",        href: "/search?city=Sokanegara" },
];

const COMPANY_LINKS = [
  { label: "Tentang Simako",   href: "/about" },
  { label: "Cara Kerja",        href: "/how-it-works" },
  { label: "Kebijakan Privasi", href: "/privacy" },
  { label: "Syarat & Ketentuan",href: "/terms" },
  { label: "Kontak",            href: "/contact" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer class="bg-navy text-white mt-auto">
      <div class="max-w-7xl mx-auto px-6 pt-14 pb-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div class="col-span-2 md:col-span-1">
            <div class="flex items-center gap-2.5 mb-4">
              <div class="w-10 h-10 bg-accent rounded-xl flex items-center justify-center font-black text-sm select-none">SK</div>
              <div>
                <div class="font-black text-lg leading-tight">{SITE.name}</div>
                <div class="text-xs text-white/40 leading-tight">{SITE.city}, {SITE.province}</div>
              </div>
            </div>
            <p class="text-sm text-white/55 leading-relaxed mb-4">{SITE.description}</p>
            <div class="flex items-center gap-3">
              <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" class="w-9 h-9 bg-white/10 hover:bg-accent rounded-lg flex items-center justify-center transition-colors" aria-label="Instagram">
                <Instagram class="w-4 h-4" />
              </a>
              <a href={`mailto:${SITE.contact.email}`} class="w-9 h-9 bg-white/10 hover:bg-accent rounded-lg flex items-center justify-center transition-colors" aria-label="Email">
                <Mail class="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-bold text-white mb-4 uppercase tracking-wider">Layanan</h3>
            <ul class="space-y-2">
              {QUICK_LINKS.map((l) => <li><A href={l.href} class="text-sm text-white/55 hover:text-white transition-colors">{l.label}</A></li>)}
            </ul>
          </div>

          <div>
            <h3 class="text-sm font-bold text-white mb-4 uppercase tracking-wider">Kawasan</h3>
            <ul class="space-y-2">
              {AREA_LINKS.map((l) => <li><A href={l.href} class="text-sm text-white/55 hover:text-white transition-colors">{l.label}</A></li>)}
            </ul>
          </div>

          <div>
            <h3 class="text-sm font-bold text-white mb-4 uppercase tracking-wider">Perusahaan</h3>
            <ul class="space-y-2">
              {COMPANY_LINKS.map((l) => <li><A href={l.href} class="text-sm text-white/55 hover:text-white transition-colors">{l.label}</A></li>)}
            </ul>
          </div>
        </div>

        <div class="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/35">
          <p>© {year} {SITE.name}. Hak cipta dilindungi undang-undang.</p>
          <p>Khusus wilayah {SITE.city}, {SITE.province}</p>
        </div>
      </div>
    </footer>
  );
}
