import Image from "next/image";
import logo from "../../frontend/lovable-dump/2026-02-27-signup-page/logo.png";

interface LogoBadgeProps {
  size?: "sm" | "md";
}

export function LogoBadge({ size = "md" }: LogoBadgeProps) {
  const classes =
    size === "sm"
      ? "h-9 w-9"
      : "h-12 w-12";

  return (
    <div
      className={`overflow-hidden rounded-full border border-[#1f275d]/20 bg-white ${classes}`}
      aria-label="Pariksha Samachar logo"
      title="Pariksha Samachar"
    >
      <Image
        src={logo}
        alt="Pariksha Samachar logo"
        className="h-full w-full scale-[1.7] object-cover object-center"
        priority={size === "md"}
      />
    </div>
  );
}
