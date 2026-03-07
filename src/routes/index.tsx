import { createFileRoute, redirect } from "@tanstack/react-router";
import { ComponentExample } from "@/components/component-example";
import { getSession } from "@/lib/session";
import { ROUTES } from "routes";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const session = await getSession();
    if (session) {
      throw redirect({ to: ROUTES.WORKSPACE });
    }
  },
  component: App,
});

function App() {
  return <ComponentExample />;
}
