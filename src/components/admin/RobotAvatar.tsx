"use client";

import type { RobotAvatarConfig } from "@/lib/store";

type Size = "sm" | "md" | "lg";

const SIZE: Record<Size, { w: number; h: number; stroke: number }> = {
  sm: { w: 52, h: 52, stroke: 2 },
  md: { w: 72, h: 72, stroke: 2.2 },
  lg: { w: 120, h: 120, stroke: 2.6 },
};

function HeadShape({ head }: { head: RobotAvatarConfig["head"] }) {
  if (head === "square") return <rect x="22" y="14" width="56" height="46" rx="10" />;
  if (head === "hex")
    return (
      <path d="M50 12 L70 22 L78 40 L70 58 L50 68 L30 58 L22 40 L30 22 Z" />
    );
  return <rect x="22" y="14" width="56" height="46" rx="22" />;
}

function BodyShape({ body }: { body: RobotAvatarConfig["body"] }) {
  if (body === "tank") return <rect x="26" y="62" width="48" height="34" rx="10" />;
  if (body === "hover")
    return (
      <>
        <rect x="28" y="62" width="44" height="30" rx="12" />
        <path d="M30 95 C40 105 60 105 70 95" />
      </>
    );
  return <rect x="26" y="60" width="48" height="38" rx="12" />;
}

function Eyes({ eyes }: { eyes: RobotAvatarConfig["eyes"] }) {
  if (eyes === "visor") return <rect x="30" y="30" width="40" height="16" rx="8" />;
  if (eyes === "happy")
    return (
      <>
        <path d="M34 40 C38 34 44 34 48 40" />
        <path d="M52 40 C56 34 62 34 66 40" />
      </>
    );
  if (eyes === "mono") return <rect x="34" y="34" width="32" height="10" rx="5" />;
  return (
    <>
      <circle cx="40" cy="38" r="4" />
      <circle cx="60" cy="38" r="4" />
    </>
  );
}

function Mouth({ mouth }: { mouth: RobotAvatarConfig["mouth"] }) {
  if (mouth === "grill")
    return (
      <>
        <rect x="40" y="48" width="20" height="8" rx="4" />
        <path d="M44 48 V56 M48 48 V56 M52 48 V56 M56 48 V56" />
      </>
    );
  if (mouth === "zigzag") return <path d="M40 52 L44 48 L48 52 L52 48 L56 52 L60 48" />;
  if (mouth === "neutral") return <path d="M40 52 H60" />;
  return <path d="M40 52 C45 58 55 58 60 52" />;
}

function Accessory({ accessory }: { accessory: RobotAvatarConfig["accessory"] }) {
  if (accessory === "antenna")
    return (
      <>
        <path d="M50 6 V14" />
        <circle cx="50" cy="6" r="3" />
      </>
    );
  if (accessory === "solarPanel")
    return (
      <>
        <rect x="70" y="66" width="18" height="22" rx="3" />
        <path d="M70 72 H88 M70 78 H88 M70 84 H88 M76 66 V88 M82 66 V88" />
      </>
    );
  if (accessory === "wrench")
    return <path d="M18 78 C22 72 30 72 32 78 L28 82 L34 88 L30 92 L24 86 L20 90 C16 88 14 82 18 78 Z" />;
  if (accessory === "leaf")
    return <path d="M16 68 C22 62 34 62 38 72 C28 76 22 80 20 90 C14 84 12 74 16 68 Z" />;
  return null;
}

export function RobotAvatar({
  config,
  size = "md",
  className,
  title,
}: {
  config: RobotAvatarConfig;
  size?: Size;
  className?: string;
  title?: string;
}) {
  const { w, h, stroke } = SIZE[size];
  const c = config.colors;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 100 110"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}

      {/* Outline base */}
      <g fill="none" stroke={c.secondary} strokeWidth={stroke} strokeLinejoin="round" strokeLinecap="round">
        <Accessory accessory={config.accessory} />
      </g>

      <g fill={c.primary} stroke={c.secondary} strokeWidth={stroke} strokeLinejoin="round">
        <HeadShape head={config.head} />
        <BodyShape body={config.body} />
      </g>

      {/* Arms */}
      <g fill="none" stroke={c.secondary} strokeWidth={stroke} strokeLinecap="round">
        {config.pose === "handsUp" ? (
          <>
            <path d="M26 70 C18 56 18 40 30 34" />
            <path d="M74 70 C82 56 82 40 70 34" />
          </>
        ) : config.pose === "wave" ? (
          <>
            <path d="M26 70 C18 62 18 52 26 46" />
            <path d="M74 70 C82 62 84 52 78 44" />
            <path d="M80 36 C86 38 86 46 80 48" />
          </>
        ) : (
          <>
            <path d="M26 72 C18 74 18 84 26 86" />
            <path d="M74 72 C82 74 82 84 74 86" />
          </>
        )}
      </g>

      {/* Face */}
      <g fill={c.accent} stroke={c.accent} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
        <Eyes eyes={config.eyes} />
      </g>
      <g fill="none" stroke={c.accent} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
        <Mouth mouth={config.mouth} />
      </g>

      {/* Chest badge */}
      <g>
        <rect x="44" y="74" width="12" height="12" rx="4" fill={c.accent} opacity="0.9" />
        <circle cx="50" cy="80" r="2.2" fill="#0b0f0e" opacity="0.35" />
      </g>
    </svg>
  );
}

