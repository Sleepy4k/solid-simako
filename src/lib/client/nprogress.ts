import NProgress from "nprogress";
import { createEffect, onCleanup, onMount } from "solid-js";
import { useIsRouting } from "@solidjs/router";

NProgress.configure({
  showSpinner: false,
  minimum:     0.1,
  speed:       300,
  trickleSpeed: 200,
});

export function NProgressBar() {
  const isRouting = useIsRouting();

  createEffect(() => {
    if (isRouting()) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  });

  onCleanup(() => NProgress.done());

  return null;
}

export function startProgress() {
  NProgress.start();
}
export function doneProgress() {
  NProgress.done();
}
