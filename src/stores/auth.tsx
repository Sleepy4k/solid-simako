import { createContext, useContext, onCleanup, onMount, type JSX } from "solid-js";
import { setCurrentUser, userStore } from "~/stores/user";
import { getCurrentUser } from "~/server/actions/auth";
import type { AuthUser } from "~/types";

interface AuthContextValue {
  user:     () => AuthUser | null;
  isLoaded: () => boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user:     () => null,
  isLoaded: () => false,
});

export function AuthProvider(props: { children: JSX.Element }) {
  let active = true;

  onMount(() => {
    getCurrentUser()
      .then((user) => {
        if (active) setCurrentUser(user);
      })
      .catch(() => {
        if (active) setCurrentUser(null);
      });
  });

  onCleanup(() => {
    active = false;
  });

  return (
    <AuthContext.Provider
      value={{
        user:     () => userStore.user,
        isLoaded: () => userStore.loaded,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
