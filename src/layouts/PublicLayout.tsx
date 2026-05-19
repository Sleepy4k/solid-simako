import { JSX } from 'solid-js';
import { PublicNavbar } from '~/components/shared/PublicNavbar';
import { PublicFooter } from '~/components/shared/PublicFooter';

interface PublicLayoutProps {
  children: JSX.Element;
  hideFooter?: boolean;
}

export function PublicLayout(props: PublicLayoutProps) {
  return (
    <div class="flex min-h-dvh flex-col">
      <PublicNavbar />
      <main class="flex-1">{props.children}</main>
      {!props.hideFooter && <PublicFooter />}
    </div>
  );
}
