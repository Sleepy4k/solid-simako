import { JSX, splitProps } from 'solid-js';

interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const PADDING = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export function Card(rawProps: CardProps) {
  const [local, rest] = splitProps(rawProps, ['padding', 'class', 'children']);
  const p = () => PADDING[local.padding ?? 'md'];

  return (
    <div
      {...rest}
      class={[
        'rounded-2xl border border-slate-100 bg-white shadow-sm',
        p(),
        local.class ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {local.children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  trend?: string;
  trendUp?: boolean;
  icon?: JSX.Element;
  class?: string;
}

export function StatCard(props: StatCardProps) {
  return (
    <Card class={props.class}>
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <p class="text-xs font-medium uppercase tracking-wide text-slate-500">{props.label}</p>
          <p class="mt-1 text-2xl font-bold text-ink">{props.value}</p>
          {props.sub && <p class="mt-0.5 text-xs text-slate-400">{props.sub}</p>}
          {props.trend && (
            <p class={`mt-1 text-xs font-medium ${props.trendUp ? 'text-success' : 'text-danger'}`}>
              {props.trendUp ? '▲' : '▼'} {props.trend}
            </p>
          )}
        </div>
        {props.icon && (
          <div class="shrink-0 rounded-xl bg-primary-light p-2.5 text-primary">{props.icon}</div>
        )}
      </div>
    </Card>
  );
}
