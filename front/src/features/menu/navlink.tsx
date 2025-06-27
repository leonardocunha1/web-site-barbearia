"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={clsx(
        "relative px-1 py-1 transition-all duration-300",
        "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[2px] after:origin-left after:scale-x-0 after:bg-amber-700 after:transition-transform after:duration-300 hover:after:scale-x-100",
        isActive && "after:scale-x-100",
      )}
    >
      {children}
    </Link>
  );
}
