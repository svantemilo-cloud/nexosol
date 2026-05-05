import { NextRequest, NextResponse } from "next/server";
import {
  getAdminUserIdFromRequest,
  isAdminAuthenticated,
  isLegacyAdmin,
} from "@/lib/admin-auth";
import { store } from "@/lib/store";
import type { AdminUserId, RobotAvatarConfig, RobotProfile } from "@/lib/store";

const VALID_IDS: AdminUserId[] = ["leon", "vincent", "wilmer"];

function isHexColor(s: unknown): s is string {
  return typeof s === "string" && /^#[0-9a-fA-F]{6}$/.test(s.trim());
}

function clampQuotes(raw: unknown): string[] | null {
  if (!Array.isArray(raw)) return null;
  const cleaned = raw
    .map((q) => (typeof q === "string" ? q.trim() : ""))
    .filter((q) => q.length > 0)
    .slice(0, 5);
  if (cleaned.length < 3) return null;
  return cleaned;
}

function validateAvatar(raw: unknown): RobotAvatarConfig | null {
  if (!raw || typeof raw !== "object") return null;
  const a = raw as Partial<RobotAvatarConfig>;
  const head = a.head;
  const body = a.body;
  const eyes = a.eyes;
  const mouth = a.mouth;
  const accessory = a.accessory;
  const pose = a.pose;

  const colors = a.colors as RobotAvatarConfig["colors"] | undefined;
  if (
    head == null ||
    body == null ||
    eyes == null ||
    mouth == null ||
    accessory == null ||
    pose == null ||
    !colors ||
    !isHexColor(colors.primary) ||
    !isHexColor(colors.secondary) ||
    !isHexColor(colors.accent)
  ) {
    return null;
  }

  const headOk = ["round", "square", "hex"].includes(String(head));
  const bodyOk = ["box", "tank", "hover"].includes(String(body));
  const eyesOk = ["dots", "visor", "happy", "mono"].includes(String(eyes));
  const mouthOk = ["smile", "grill", "zigzag", "neutral"].includes(String(mouth));
  const accessoryOk = ["none", "solarPanel", "antenna", "wrench", "leaf"].includes(String(accessory));
  const poseOk = ["idle", "wave", "handsUp"].includes(String(pose));
  if (!headOk || !bodyOk || !eyesOk || !mouthOk || !accessoryOk || !poseOk) return null;

  return {
    head: head as RobotAvatarConfig["head"],
    body: body as RobotAvatarConfig["body"],
    eyes: eyes as RobotAvatarConfig["eyes"],
    mouth: mouth as RobotAvatarConfig["mouth"],
    accessory: accessory as RobotAvatarConfig["accessory"],
    pose: pose as RobotAvatarConfig["pose"],
    colors: {
      primary: colors.primary.trim(),
      secondary: colors.secondary.trim(),
      accent: colors.accent.trim(),
    },
  };
}

function resolveTargetUserId(
  request: NextRequest,
  bodyUserId: unknown
): { ok: true; userId: AdminUserId } | { ok: false; res: NextResponse } {
  const cookie = request.headers.get("cookie");
  const auth = request.headers.get("authorization");
  const legacy = isLegacyAdmin(cookie, auth);
  const reqUserId = getAdminUserIdFromRequest(cookie, auth);

  if (legacy) {
    const id = typeof bodyUserId === "string" ? bodyUserId : "";
    if (!VALID_IDS.includes(id as AdminUserId)) {
      return {
        ok: false,
        res: NextResponse.json({ error: "Ogiltig användare" }, { status: 400 }),
      };
    }
    return { ok: true, userId: id as AdminUserId };
  }

  // Pod user login
  if (!reqUserId || reqUserId === "true" || reqUserId === "legacy") {
    return {
      ok: false,
      res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  const user = store.getAdminUserById(reqUserId);
  const pod = user?.pod;
  if (!pod || !VALID_IDS.includes(pod)) {
    return {
      ok: false,
      res: NextResponse.json({ error: "Konto saknar pod" }, { status: 403 }),
    };
  }
  return { ok: true, userId: pod };
}

export async function GET(request: NextRequest) {
  const cookie = request.headers.get("cookie");
  const auth = request.headers.get("authorization");
  if (!isAdminAuthenticated(cookie, auth)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(store.getRobotProfiles());
}

export async function PATCH(request: NextRequest) {
  const cookie = request.headers.get("cookie");
  const auth = request.headers.get("authorization");
  if (!isAdminAuthenticated(cookie, auth)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const target = resolveTargetUserId(request, body.userId);
    if (!target.ok) return target.res;

    const avatar = validateAvatar(body.avatar);
    const quotes = clampQuotes(body.quotes);
    if (!avatar || !quotes) {
      return NextResponse.json(
        { error: "Ogiltig avatar eller citat (kräver 3–5 citat)" },
        { status: 400 }
      );
    }

    const profile: RobotProfile = { avatar, quotes };
    store.setRobotProfile(target.userId, profile);
    return NextResponse.json(store.getRobotProfiles());
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ogiltig begäran";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

