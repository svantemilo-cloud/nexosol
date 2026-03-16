import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ALLOWED_ORIGINS = [
  "https://nexoadmin.se",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  "http://localhost:3002",
  "http://127.0.0.1:3002",
];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (!path.startsWith("/api/")) return NextResponse.next();

  const origin = request.headers.get("origin");
  const allowOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : null;

  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: allowOrigin ? corsHeaders(allowOrigin) : {},
    });
  }

  const res = NextResponse.next();
  if (allowOrigin) {
    Object.entries(corsHeaders(allowOrigin)).forEach(([k, v]) => res.headers.set(k, v));
  }
  return res;
}

function corsHeaders(allowOrigin: string): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400",
  };
}

export const config = { matcher: "/api/:path*" };
