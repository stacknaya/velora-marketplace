"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    href: "/host/dashboard",
    label: "Host Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M9 21v-6h6v6" />
      </svg>
    )
  },
  {
    href: "/host/listings",
    label: "Listings",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <path d="M4 6h16M4 12h16M4 18h16" />
        <circle cx="8" cy="6" r="1" />
        <circle cx="16" cy="12" r="1" />
        <circle cx="10" cy="18" r="1" />
      </svg>
    )
  },
  {
    href: "/host/reservations",
    label: "Reservations",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <path d="M8 3v4M16 3v4M8 11h8M8 15h5" />
      </svg>
    )
  },
  {
    href: "/host/calendar",
    label: "Calendar",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </svg>
    )
  },
  {
    href: "/host/earnings",
    label: "Earnings",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <path d="M12 2v20M17 6.5c0-1.9-1.8-3.5-5-3.5s-5 1.6-5 3.5S8.8 10 12 10s5 1.6 5 3.5S15.2 17 12 17s-5-1.6-5-3.5" />
      </svg>
    )
  },
  {
    href: "/messages",
    label: "Messages",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <path d="M4 5h16v12H8l-4 4V5Z" />
      </svg>
    )
  },
  {
    href: "/host/reviews",
    label: "Reviews",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2 7.5 14 3 9.6l6.2-.9L12 3Z" />
      </svg>
    )
  },
  {
    href: "/host/settings",
    label: "Settings",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21h-4v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H3v-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V3h4v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9A1.7 1.7 0 0 0 21 10h.1v4H21a1.7 1.7 0 0 0-1.6 1Z" />
      </svg>
    )
  }
];

export default function HostSidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-full">
      <div className="space-y-1.5">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                active
                  ? "flex items-center gap-3 rounded-[12px] bg-[#f4ead8] px-3.5 py-3 text-[14px] font-semibold text-[#172033]"
                  : "flex items-center gap-3 rounded-[12px] px-3.5 py-3 text-[14px] font-medium text-[#172033]/72 transition hover:bg-[#f7f3ec] hover:text-[#172033]"
              }
            >
              <span className="shrink-0">
                {link.icon}
              </span>

              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
