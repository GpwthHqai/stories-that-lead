import { NextResponse } from "next/server";

// TEMPORARY diagnostic: reports only whether BLOB_READ_WRITE_TOKEN is present
// in the running function's environment. No secret value is exposed.
export async function GET() {
  return NextResponse.json({
    blobConfigured: !!process.env.BLOB_READ_WRITE_TOKEN,
  });
}
