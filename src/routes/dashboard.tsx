import { useNavigate } from "@solidjs/router";
import { createEffect } from "solid-js";
import { useAuth } from "~/stores/auth";
import { ROLE_DASHBOARD_PATH } from "~/constants/roles";
import { DashboardSkeleton } from "~/components/ui/DashboardSkeleton";

export default function DashboardRedirect() {
  const navigate = useNavigate();
  const { user, isLoaded } = useAuth();

  createEffect(() => {
    if (!isLoaded()) return;
    const u = user();
    navigate(u ? ROLE_DASHBOARD_PATH[u.role] : "/auth/login", { replace: true });
  });

  return <DashboardSkeleton />;
}
