import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// Lazily initialize the handler at request time, not at build/module-eval time.
// This avoids the build error when GitHub env vars aren't set yet,
// while still letting Keystatic's setup flow work at runtime.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedHandler: { GET: any; POST: any } | null = null;

async function getHandler() {
  if (!cachedHandler) {
    const { makeRouteHandler } = await import(
      "@keystatic/next/route-handler"
    );
    const { default: config } = await import(
      "../../../../../keystatic.config"
    );
    cachedHandler = makeRouteHandler({ config });
  }
  return cachedHandler;
}

export async function GET(req: NextRequest) {
  const handler = await getHandler();
  return handler.GET(req);
}

export async function POST(req: NextRequest) {
  const handler = await getHandler();
  return handler.POST(req);
}
