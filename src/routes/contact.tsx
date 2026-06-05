import { Title, Meta } from "@solidjs/meta";
import { createSignal } from "solid-js";
import { LandingLayout } from "~/layouts/LandingLayout";
import { SITE } from "~/config/site";

export default function ContactPage() {
  const [submitted, setSubmitted] = createSignal(false);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Title>Hubungi Kami - {SITE.name}</Title>
      <Meta name="description" content={`Hubungi tim ${SITE.name} untuk pertanyaan, saran, atau bantuan seputar pencarian kos di ${SITE.city}.`} />

      <LandingLayout>
        <div class="bg-[#F4F7FA] min-h-screen pt-16">
          <div class="bg-navy py-12 px-5 text-white">
            <div class="max-w-4xl mx-auto">
              <p class="text-white/50 text-xs mb-2 uppercase tracking-wider">{SITE.name}</p>
              <h1 class="text-3xl font-black mb-2">Hubungi Kami</h1>
              <p class="text-white/60 text-sm">Ada pertanyaan? Kami siap membantu Anda.</p>
            </div>
          </div>

          <div class="max-w-4xl mx-auto px-5 py-10">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-5">
                <div class="bg-white rounded-2xl border border-[#E6F0FA] p-6">
                  <h2 class="font-black text-navy text-lg mb-5">Informasi Kontak</h2>

                  <div class="space-y-4">
                    <div class="flex items-start gap-4">
                      <div class="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p class="font-bold text-navy text-sm">Alamat</p>
                        <p class="text-sm text-navy/60 mt-0.5">
                          {SITE.city}, {SITE.province}<br />
                          {SITE.country}
                        </p>
                      </div>
                    </div>

                    <div class="flex items-start gap-4">
                      <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p class="font-bold text-navy text-sm">WhatsApp</p>
                        <a href={`https://wa.me/${SITE.contact.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" class="text-sm text-accent hover:underline mt-0.5 block">
                          {SITE.contact.whatsapp}
                        </a>
                      </div>
                    </div>

                    <div class="flex items-start gap-4">
                      <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p class="font-bold text-navy text-sm">Email</p>
                        <a href={`mailto:${SITE.contact.email}`} class="text-sm text-accent hover:underline mt-0.5 block">
                          {SITE.contact.email}
                        </a>
                      </div>
                    </div>

                    <div class="flex items-start gap-4">
                      <div class="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                        </svg>
                      </div>
                      <div>
                        <p class="font-bold text-navy text-sm">Instagram</p>
                        <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" class="text-sm text-accent hover:underline mt-0.5 block">
                          @simakos
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-white rounded-2xl border border-[#E6F0FA] overflow-hidden">
                  <div class="h-48 bg-gradient-to-br from-[#E6F0FA] to-[#F4F7FA] flex flex-col items-center justify-center text-navy/30">
                    <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <p class="text-sm font-semibold">Lokasi kami di Purwokerto</p>
                    <p class="text-xs mt-1">{SITE.city}, {SITE.province}</p>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-2xl border border-[#E6F0FA] p-6">
                <h2 class="font-black text-navy text-lg mb-5">Kirim Pesan</h2>

                {submitted() ? (
                  <div class="text-center py-10">
                    <div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 class="font-black text-navy text-lg mb-2">Pesan Terkirim!</h3>
                    <p class="text-sm text-navy/50">Kami akan menghubungi Anda dalam 1x24 jam.</p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      class="mt-4 text-sm text-accent hover:underline"
                    >
                      Kirim pesan lain
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} class="space-y-4">
                    <div>
                      <label class="block text-xs font-bold text-navy/50 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                      <input
                        type="text"
                        required
                        placeholder="Masukkan nama Anda"
                        class="w-full px-3.5 py-2.5 rounded-xl border border-[#E6F0FA] text-sm text-navy bg-white outline-none focus:border-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-navy/50 uppercase tracking-wider mb-1.5">Email</label>
                      <input
                        type="email"
                        required
                        placeholder="email@contoh.com"
                        class="w-full px-3.5 py-2.5 rounded-xl border border-[#E6F0FA] text-sm text-navy bg-white outline-none focus:border-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-navy/50 uppercase tracking-wider mb-1.5">Subjek</label>
                      <input
                        type="text"
                        required
                        placeholder="Perihal pesan Anda"
                        class="w-full px-3.5 py-2.5 rounded-xl border border-[#E6F0FA] text-sm text-navy bg-white outline-none focus:border-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-navy/50 uppercase tracking-wider mb-1.5">Pesan</label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Tulis pesan Anda di sini..."
                        class="w-full px-3.5 py-2.5 rounded-xl border border-[#E6F0FA] text-sm text-navy bg-white outline-none focus:border-accent transition-colors resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      class="w-full bg-accent hover:bg-accent-dark text-white font-black py-3 rounded-xl transition-colors"
                    >
                      Kirim Pesan
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </LandingLayout>
    </>
  );
}
