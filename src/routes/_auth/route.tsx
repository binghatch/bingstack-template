import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { ROUTES } from "routes";
import { getSession } from "@/lib/session";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async () => {
    const session = await getSession();
    if (session) {
      throw redirect({ to: ROUTES.WORKSPACE });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <Outlet />
    </div>
  )
}
