import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("/api/contact", async ({ request }) => {
    // simulate latency
    await new Promise((r) => setTimeout(r, 600));
    // 20% random failure
    if (Math.random() < 0.2) {
      return HttpResponse.json({ error: "Temporary failure" }, { status: 503 });
    }
    const body = await request.json() as Record<string, unknown>;
    return new Response(JSON.stringify({ status: "queued", id: crypto.randomUUID(), ...body }), { status: 202 });
  }),
];
