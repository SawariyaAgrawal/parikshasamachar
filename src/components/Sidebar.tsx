"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  examSlug: string;
}

export default function Sidebar({ examSlug }: SidebarProps) {
  const pathname = usePathname();

  const links = [
    {
      href: `/community/${examSlug}`,
      label: "Community"
    },
    {
      href: `/notifications/${examSlug}`,
      label: "Previous Examination Notifications"
    }
  ];

  return (
    <aside className="card h-fit w-full min-w-0 md:min-w-64 p-4 order-2 md:order-1">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-600">
        Navigation
      </h3>
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-md px-3 py-2 text-sm ${
              pathname === link.href
                ? "bg-[#1f275d] !text-white hover:!text-white"
                : "border border-neutral-300 hover:bg-neutral-100"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
