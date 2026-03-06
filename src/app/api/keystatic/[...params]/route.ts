import { makeRouteHandler } from "@keystatic/next/route-handler";
import { NextResponse } from "next/server";
import config from "../../../../../keystatic.config";

export const dynamic = "force-dynamic";

// In production GitHub mode, Keystatic needs env vars that won't exist during build.
const isProd = process.env.NODE_ENV === "production";
const hasGitHubCreds =
  process.env.KEYSTATIC_GITHUB_CLIENT_ID &&
  process.env.KEYSTATIC_GITHUB_CLIENT_SECRET &&
  process.env.KEYSTATIC_SECRET;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let handler: { GET: any; POST: any };

if (!isProd || hasGitHubCreds) {
  handler = makeRouteHandler({ config });
} else {
  const fallback = () =>
    NextResponse.json(
      { error: "Keystatic not configured. Set GitHub env vars." },
      { status: 503 }
    );
  handler = { GET: fallback, POST: fallback };
}

export const { GET, POST } = handler;
