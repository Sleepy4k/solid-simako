import NProgress from 'nprogress';
import { useBeforeLeave, useIsRouting } from '@solidjs/router';
import { createEffect, onCleanup } from 'solid-js';

NProgress.configure({ showSpinner: false, trickleSpeed: 200 });

export function NProgressBar() {
  const isRouting = useIsRouting();

  createEffect(() => {
    if (isRouting()) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  });

  useBeforeLeave(() => {
    NProgress.start();
  });

  onCleanup(() => {
    NProgress.done();
  });

  return null;
}
