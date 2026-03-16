import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { store } from "@/lib/store";
import type { AdminUserId } from "@/lib/store";

const VALID_IDS: AdminUserId[] = ["leon", "vincent", "wilmer"];

export async function GET(request: NextRequest) {
  const cookie = request.headers.get("cookie");
  const auth = request.headers.get("authorization");
  if (!isAdminAuthenticated(cookie, auth)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const pictures = store.getProfilePictures();
  return NextResponse.json(pictures);
}

export async function PATCH(request: NextRequest) {
  const cookie = request.headers.get("cookie");
  const auth = request.headers.get("authorization");
  if (!isAdminAuthenticated(cookie, auth)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const userId = body.userId as string;
    const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl : "";
    if (!VALID_IDS.includes(userId as AdminUserId)) {
      return NextResponse.json({ error: "Ogiltig användare" }, { status: 400 });
    }
    store.setProfilePicture(userId as AdminUserId, imageUrl);
    return NextResponse.json(store.getProfilePictures());
  } catch (e) {
    return NextResponse.json({ error: "Ogiltig begäran" }, { status: 400 });
  }
}
