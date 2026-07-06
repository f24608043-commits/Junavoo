import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({ meta: [{ title: "My Account — My Store" }] }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-semibold">My Account</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Order history and profile editing coming in Phase 5.
      </p>
    </div>
  ),
});