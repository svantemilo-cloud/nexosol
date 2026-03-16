import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated, getAdminUserIdFromRequest } from "@/lib/admin-auth";
import { store } from "@/lib/store";

export async function GET(request: NextRequest) {
  const cookie = request.headers.get("cookie");
  const auth = request.headers.get("authorization");
  if (!isAdminAuthenticated(cookie, auth)) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  const userId = getAdminUserIdFromRequest(cookie, auth);
  if (userId === "true" || userId === "legacy" || !userId) {
    return NextResponse.json({ user: null, isLegacyAdmin: true });
  }
  const user = store.getAdminUserById(userId);
  if (!user) return NextResponse.json({ user: null });
  let pod = user.pod;
  if (!pod && ["leon", "vincent", "wilmer"].includes(user.username)) {
    pod = user.username as "leon" | "vincent" | "wilmer";
  }
  return NextResponse.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      pod,
    },
    isLegacyAdmin: false,
  });
}
