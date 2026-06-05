export function DashboardSkeleton() {
  return (
    <div class="flex h-screen bg-[#F4F7FA] overflow-hidden">
      <div class="w-64 bg-navy flex-shrink-0 hidden lg:flex flex-col">
        <div class="h-16 border-b border-white/10 flex items-center px-5 gap-3">
          <div class="w-9 h-9 bg-white/10 rounded-xl animate-pulse" />
          <div class="flex-1">
            <div class="h-3 bg-white/10 rounded-full animate-pulse mb-1.5 w-20" />
            <div class="h-2 bg-white/10 rounded-full animate-pulse w-14" />
          </div>
        </div>
        <div class="flex-1 p-3 space-y-1">
          {[1, 2, 3, 4].map(() => (
            <div class="h-10 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>

      <div class="flex-1 flex flex-col overflow-hidden">
        <div class="h-16 bg-white border-b border-[#E6F0FA] flex items-center px-6 gap-4">
          <div class="h-5 w-40 bg-[#E6F0FA] rounded-full animate-pulse" />
          <div class="flex-1" />
          <div class="w-8 h-8 bg-[#E6F0FA] rounded-full animate-pulse" />
          <div class="w-8 h-8 bg-[#E6F0FA] rounded-full animate-pulse" />
        </div>

        <div class="flex-1 p-6 md:p-8 overflow-y-auto">
          <div class="h-7 w-52 bg-[#E6F0FA] rounded-xl animate-pulse mb-6" />
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
            {[1, 2, 3].map(() => (
              <div class="h-28 bg-white rounded-2xl border border-[#E6F0FA] animate-pulse" />
            ))}
          </div>
          <div class="h-64 bg-white rounded-2xl border border-[#E6F0FA] animate-pulse" />
        </div>
      </div>
    </div>
  );
}
