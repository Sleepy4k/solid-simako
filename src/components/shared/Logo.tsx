import { A } from '@solidjs/router';

interface LogoProps {
  variant?: 'default' | 'white';
  showTagline?: boolean;
  class?: string;
}

export function Logo(props: LogoProps) {
  const isWhite = () => props.variant === 'white';

  return (
    <A href="/" class={`inline-flex items-center gap-2 ${props.class ?? ''}`}>
      {/* Icon mark */}
      <div class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary">
        <span class="text-sm font-black tracking-tight text-white">S</span>
      </div>
      <div class="flex flex-col leading-none">
        <span class={`text-base font-black tracking-tight ${isWhite() ? 'text-white' : 'text-ink'}`}>
          simako
        </span>
        {props.showTagline && (
          <span class={`text-[10px] font-medium ${isWhite() ? 'text-white/70' : 'text-slate-400'}`}>
            Purwokerto
          </span>
        )}
      </div>
    </A>
  );
}
