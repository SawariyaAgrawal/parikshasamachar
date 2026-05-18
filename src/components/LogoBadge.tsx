import Image from "next/image";

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
      className={`flex items-center justify-center ${classes}`}
      aria-label="Pariksha Samachar logo"
      title="Pariksha Samachar"
    >
      <Image
        src="/logo.png"
        alt="Pariksha Samachar logo"
        width={64}
        height={64}
        className="h-full w-full object-contain"
        priority={size === "md"}
      />
    </div>
  );
}
