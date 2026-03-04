// NOTE: Socket.io doesn't work natively with Next.js App Router.
// This file provides the WebSocket endpoint via a custom server.
// See server.ts in the root for the custom server setup.
//
// For the App Router, we use a simple polling fallback via this route:

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'Socket.io runs on custom server port 3001' });
}
