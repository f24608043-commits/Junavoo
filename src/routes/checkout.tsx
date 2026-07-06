import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "checkout — My Store" }] }),
  component: () => (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-2xl font-semibold capitalize">checkout</h1>
      <p className="mt-2 text-sm text-muted-foreground">Storefront checkout page coming in Phase 3–4.</p>
    </div>
  ),
});
