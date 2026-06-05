import { createStore } from "solid-js/store";
import type { AuthUser } from "~/types";

export interface UserState {
  user: AuthUser | null;
  loaded: boolean;
}

export const [userStore, setUserStore] = createStore<UserState>({
  user:   null,
  loaded: false,
});

export function setCurrentUser(user: AuthUser | null) {
  setUserStore({ user, loaded: true });
}

export function clearCurrentUser() {
  setUserStore({ user: null, loaded: true });
}
