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
        "text-foreground/80 hover:text-foreground relative font-mono text-[11px] tracking-widest uppercase transition-colors duration-300",
        "after:bg-cobre-600 after:absolute after:inset-x-0 after:-bottom-1.5 after:h-[2px] after:origin-left after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100",
        isActive && "text-foreground after:scale-x-100",
      )}
    >
      {children}
    </Link>
  );
}
