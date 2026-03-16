import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated, getAdminPassword, isLegacyAdmin } from "@/lib/admin-auth";
import { store } from "@/lib/store";

function hashPassword(password: string): string {
  return createHash("sha256").update(password, "utf8").digest("hex");
}

const DEFAULT_USERS = [
  { username: "leon", email: "leon@nexogroup.se", displayName: "Leon", pod: "leon" as const },
  { username: "vincent", email: "vincent@nexogroup.se", displayName: "Vincent", pod: "vincent" as const },
  { username: "wilmer", email: "wilmer@nexogroup.se", displayName: "Wilmer", pod: "wilmer" as const },
];

function seedDefaultAdminUsersIfEmpty(): void {
  const users = store.getAdminUsers();
  if (users.length > 0) return;
  const defaultPassword = getAdminPassword();
  const hash = hashPassword(defaultPassword);
  DEFAULT_USERS.forEach((d) => {
    try {
      store.addAdminUser({
        username: d.username,
        email: d.email,
        passwordHash: hash,
        displayName: d.displayName,
        pod: d.pod,
      });
    } catch {
      // redan tillagd
    }
  });
}

export async function GET(request: NextRequest) {
  const cookie = request.headers.get("cookie");
  const auth = request.headers.get("authorization");
  if (!isAdminAuthenticated(cookie, auth)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  seedDefaultAdminUsersIfEmpty();
  const users = store.getAdminUsers();
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const cookie = request.headers.get("cookie");
  const auth = request.headers.get("authorization");
  if (!isAdminAuthenticated(cookie, auth)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isLegacyAdmin(cookie, auth)) {
    return NextResponse.json(
      { error: "Endast admin kan lägga till användare." },
      { status: 403 }
    );
  }
  try {
    const body = await request.json();
    const username = body.username?.trim();
    const email = body.email?.trim();
    const password = body.password;
    const displayName = body.displayName?.trim() || undefined;
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Användarnamn, e-post och lösenord krävs" },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Lösenordet måste vara minst 6 tecken" },
        { status: 400 }
      );
    }
    const user = store.addAdminUser({
      username,
      email,
      passwordHash: hashPassword(password),
      displayName,
    });
    return NextResponse.json({
      id: user.id,
      createdAt: user.createdAt,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ogiltig begäran";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
