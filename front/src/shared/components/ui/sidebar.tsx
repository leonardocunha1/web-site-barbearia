"use client";

import * as React from "react";
import { cn } from "@/shared/utils/utils";
import { Button } from "./button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";
import { CaretRightIcon } from "@phosphor-icons/react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavIcon = PhosphorIcon;

interface SidebarContextValue {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(
  undefined,
);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

const NavHrefsContext = React.createContext<readonly string[]>([]);

export function NavHrefsProvider({
  hrefs,
  children,
}: {
  hrefs: readonly string[];
  children: React.ReactNode;
}) {
  return (
    <NavHrefsContext.Provider value={hrefs}>{children}</NavHrefsContext.Provider>
  );
}

function useIsNavItemActive(href: string): boolean {
  const pathname = usePathname();
  const allHrefs = React.useContext(NavHrefsContext);

  if (pathname === href) return true;
  if (!pathname.startsWith(href + "/")) return false;

  const hasMoreSpecificMatch = allHrefs.some(
    (other) =>
      other !== href &&
      other.startsWith(href + "/") &&
      (pathname === other || pathname.startsWith(other + "/")),
  );
  return !hasMoreSpecificMatch;
}

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}

export function SidebarProvider({
  children,
  defaultCollapsed = false,
}: SidebarProviderProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  const toggleSidebar = React.useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Sidebar({ children, className, ...props }: SidebarProps) {
  const { isCollapsed } = useSidebar();

  return (
    <aside
      className={cn(
        "border-foreground/15 bg-card relative flex h-full flex-col border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className,
      )}
      {...props}
    >
      {children}
    </aside>
  );
}

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function SidebarHeader({
  children,
  className,
  ...props
}: SidebarHeaderProps) {
  return (
    <div
      className={cn(
        "border-foreground/15 flex items-center gap-2 border-b p-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function SidebarContent({
  children,
  className,
  ...props
}: SidebarContentProps) {
  return (
    <div
      className={cn("flex-1 overflow-y-auto p-3", className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function SidebarFooter({
  children,
  className,
  ...props
}: SidebarFooterProps) {
  return (
    <div
      className={cn("border-foreground/15 border-t p-3", className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface SidebarNavProps {
  children: React.ReactNode;
}

export function SidebarNav({ children }: SidebarNavProps) {
  return <nav className="space-y-0.5">{children}</nav>;
}

interface SidebarNavItemProps {
  href: string;
  icon?: NavIcon;
  label: string;
  badge?: string | number;
}

export function SidebarNavItem({
  href,
  icon: IconComponent,
  label,
  badge,
}: SidebarNavItemProps) {
  const { isCollapsed } = useSidebar();
  const isActive = useIsNavItemActive(href);

  return (
    <Link href={href} className="block">
      <div
        className={cn(
          "group relative flex items-center gap-3 px-3 py-2 transition-colors",
          isActive
            ? "bg-foreground/[0.04] text-foreground"
            : "text-foreground/70 hover:text-foreground hover:bg-foreground/[0.03]",
          isCollapsed && "justify-center px-2",
        )}
      >
        {isActive && (
          <span
            className="bg-cobre-600 absolute inset-y-1 left-0 w-0.5"
            aria-hidden
          />
        )}
        {IconComponent && (
          <IconComponent
            weight={isActive ? "duotone" : "regular"}
            className={cn(
              "h-4 w-4 shrink-0 transition-colors",
              isActive && "text-cobre-700",
            )}
          />
        )}
        {!isCollapsed && (
          <>
            <span
              className={cn(
                "flex-1 truncate text-left text-sm",
                isActive ? "font-medium" : "font-normal",
              )}
            >
              {label}
            </span>
            {badge !== undefined && (
              <span className="bg-foreground text-background px-1.5 py-0.5 font-mono text-[10px] tracking-widest uppercase">
                {badge}
              </span>
            )}
          </>
        )}
      </div>
    </Link>
  );
}

interface SidebarNavGroupProps {
  icon?: NavIcon;
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function SidebarNavGroup({
  icon: IconComponent,
  label,
  children,
  defaultOpen = false,
}: SidebarNavGroupProps) {
  const { isCollapsed } = useSidebar();
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  if (isCollapsed) {
    return <>{children}</>;
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="text-foreground/70 hover:text-foreground hover:bg-foreground/[0.03] w-full justify-start gap-3 rounded-none px-3 py-2 transition-colors"
        >
          {IconComponent && (
            <IconComponent
              weight="regular"
              className="h-4 w-4 shrink-0"
            />
          )}
          <span className="flex-1 truncate text-left text-sm font-normal">
            {label}
          </span>
          <CaretRightIcon
            weight="bold"
            className={cn(
              "h-3 w-3 shrink-0 transition-transform duration-200",
              isOpen && "rotate-90",
            )}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-0.5 pl-3 pt-0.5">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

interface SidebarSeparatorProps {
  label?: string;
}

export function SidebarSeparator({ label }: SidebarSeparatorProps) {
  const { isCollapsed } = useSidebar();

  if (isCollapsed) {
    return <div className="bg-foreground/15 my-2 h-px" />;
  }

  return (
    <div className="my-3 flex items-center gap-3 px-3">
      <div className="bg-foreground/15 h-px flex-1" />
      {label && (
        <span className="text-foreground/60 font-mono text-[9px] tracking-[0.25em] uppercase">
          {label}
        </span>
      )}
      <div className="bg-foreground/15 h-px flex-1" />
    </div>
  );
}
