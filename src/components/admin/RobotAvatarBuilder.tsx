"use client";

import { useMemo, useState } from "react";
import type { RobotAvatarConfig, RobotProfile } from "@/lib/store";
import { RobotAvatar } from "./RobotAvatar";

const HEADS: RobotAvatarConfig["head"][] = ["round", "square", "hex"];
const BODIES: RobotAvatarConfig["body"][] = ["box", "tank", "hover"];
const EYES: RobotAvatarConfig["eyes"][] = ["dots", "visor", "happy", "mono"];
const MOUTHS: RobotAvatarConfig["mouth"][] = ["smile", "grill", "zigzag", "neutral"];
const ACCESSORIES: RobotAvatarConfig["accessory"][] = ["none", "solarPanel", "antenna", "wrench", "leaf"];
const POSES: RobotAvatarConfig["pose"][] = ["idle", "wave", "handsUp"];

function btn(active: boolean) {
  return (
    "px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors " +
    (active
      ? "bg-emerald-600 text-white border-emerald-500"
      : "bg-zinc-900 text-zinc-200 border-zinc-700 hover:bg-zinc-800")
  );
}

function clampQuotes(quotes: string[]): string[] {
  const cleaned = quotes.map((q) => q.trim()).filter(Boolean).slice(0, 5);
  while (cleaned.length < 3) cleaned.push("");
  return cleaned.slice(0, 5);
}

export function RobotAvatarBuilder({
  initial,
  saving,
  error,
  onSave,
}: {
  initial: RobotProfile;
  saving: boolean;
  error: string;
  onSave: (profile: RobotProfile) => void;
}) {
  const [avatar, setAvatar] = useState<RobotAvatarConfig>(initial.avatar);
  const [quotes, setQuotes] = useState<string[]>(() => clampQuotes(initial.quotes));

  const cleanedQuotes = useMemo(
    () => quotes.map((q) => q.trim()).filter(Boolean).slice(0, 5),
    [quotes]
  );
  const canSave = cleanedQuotes.length >= 3 && cleanedQuotes.length <= 5;

  const patch = (p: Partial<RobotAvatarConfig>) => setAvatar((a) => ({ ...a, ...p }));
  const patchColors = (p: Partial<RobotAvatarConfig["colors"]>) =>
    setAvatar((a) => ({ ...a, colors: { ...a.colors, ...p } }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-2xl bg-zinc-950/40 border border-zinc-800 p-4">
            <RobotAvatar config={avatar} size="lg" title="Förhandsvisning robot-avatar" />
          </div>
          <div className="flex gap-3">
            <label className="text-xs text-zinc-400">
              Primär
              <input
                type="color"
                value={avatar.colors.primary}
                onChange={(e) => patchColors({ primary: e.target.value })}
                className="ml-2 h-8 w-12 rounded border border-zinc-700 bg-zinc-900"
              />
            </label>
            <label className="text-xs text-zinc-400">
              Sekundär
              <input
                type="color"
                value={avatar.colors.secondary}
                onChange={(e) => patchColors({ secondary: e.target.value })}
                className="ml-2 h-8 w-12 rounded border border-zinc-700 bg-zinc-900"
              />
            </label>
            <label className="text-xs text-zinc-400">
              Accent
              <input
                type="color"
                value={avatar.colors.accent}
                onChange={(e) => patchColors({ accent: e.target.value })}
                className="ml-2 h-8 w-12 rounded border border-zinc-700 bg-zinc-900"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Bygg din robot</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-zinc-400 mb-1">Huvud</p>
              <div className="flex flex-wrap gap-2">
                {HEADS.map((v) => (
                  <button key={v} type="button" className={btn(avatar.head === v)} onClick={() => patch({ head: v })}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-zinc-400 mb-1">Kropp</p>
              <div className="flex flex-wrap gap-2">
                {BODIES.map((v) => (
                  <button key={v} type="button" className={btn(avatar.body === v)} onClick={() => patch({ body: v })}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-zinc-400 mb-1">Ögon</p>
              <div className="flex flex-wrap gap-2">
                {EYES.map((v) => (
                  <button key={v} type="button" className={btn(avatar.eyes === v)} onClick={() => patch({ eyes: v })}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-zinc-400 mb-1">Mun</p>
              <div className="flex flex-wrap gap-2">
                {MOUTHS.map((v) => (
                  <button key={v} type="button" className={btn(avatar.mouth === v)} onClick={() => patch({ mouth: v })}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-zinc-400 mb-1">Accessoar</p>
              <div className="flex flex-wrap gap-2">
                {ACCESSORIES.map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={btn(avatar.accessory === v)}
                    onClick={() => patch({ accessory: v })}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-zinc-400 mb-1">Pose</p>
              <div className="flex flex-wrap gap-2">
                {POSES.map((v) => (
                  <button key={v} type="button" className={btn(avatar.pose === v)} onClick={() => patch({ pose: v })}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
          <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
            <h3 className="text-sm font-semibold text-white">Mina citat</h3>
            <p className="text-xs text-zinc-500">Skriv 3–5 korta citat som roboten kan säga.</p>
          </div>
          <div className="space-y-2">
            {quotes.slice(0, 5).map((q, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <input
                  value={q}
                  onChange={(e) =>
                    setQuotes((prev) => {
                      const next = [...prev];
                      next[idx] = e.target.value;
                      return next;
                    })
                  }
                  placeholder={`Citat ${idx + 1}`}
                  className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                />
                <button
                  type="button"
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
                  disabled={quotes.length <= 3}
                  onClick={() =>
                    setQuotes((prev) => {
                      const next = [...prev];
                      next.splice(idx, 1);
                      return clampQuotes(next);
                    })
                  }
                  title="Ta bort"
                >
                  Ta bort
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
            <button
              type="button"
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
              disabled={quotes.filter((x) => x.trim()).length >= 5}
              onClick={() => setQuotes((prev) => clampQuotes([...prev, ""]))}
            >
              + Lägg till citat
            </button>
            <div className="flex items-center gap-2">
              {error ? <span className="text-xs text-red-400">{error}</span> : null}
              <button
                type="button"
                disabled={!canSave || saving}
                onClick={() => onSave({ avatar, quotes: cleanedQuotes })}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
              >
                {saving ? "Sparar…" : "Spara"}
              </button>
            </div>
          </div>
          {!canSave ? (
            <p className="mt-2 text-xs text-zinc-500">Fyll i minst 3 citat (max 5) för att spara.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

