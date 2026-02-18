"use client";

import * as React from "react";
import { cn } from "@/shared/utils/utils";
import { Button } from "./button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible";
import { ChevronRight, LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarContextValue {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(
  undefined
);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
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
        "relative flex  h-full flex-col border-r border-stone-200 bg-white transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
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
      className={cn("flex items-center gap-2 border-b border-stone-200 p-4", className)}
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
    <div className={cn("flex-1 overflow-y-auto p-2", className)} {...props}>
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
      className={cn("border-t border-stone-200 p-4", className)}
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
  return <nav className="space-y-1">{children}</nav>;
}

interface SidebarNavItemProps {
  href: string;
  icon?: LucideIcon;
  label: string;
  badge?: string | number;
}

export function SidebarNavItem({
  href,
  icon: Icon,
  label,
  badge,
}: SidebarNavItemProps) {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link href={href} className="block">
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start gap-3 transition-colors",
          isActive && "bg-stone-100 font-medium text-stone-900",
          isCollapsed && "justify-center px-2"
        )}
      >
        {Icon && <Icon className="h-4 w-4 shrink-0" />}
        {!isCollapsed && (
          <>
            <span className="flex-1 truncate text-left">{label}</span>
            {badge !== undefined && (
              <span className="rounded-full bg-stone-900 px-2 py-0.5 text-xs text-white">
                {badge}
              </span>
            )}
          </>
        )}
      </Button>
    </Link>
  );
}

interface SidebarNavGroupProps {
  icon?: LucideIcon;
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function SidebarNavGroup({
  icon: Icon,
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
          className="w-full justify-start gap-3 transition-colors"
        >
          {Icon && <Icon className="h-4 w-4 shrink-0" />}
          <span className="flex-1 truncate text-left">{label}</span>
          <ChevronRight
            className={cn(
              "h-4 w-4 shrink-0 transition-transform duration-200",
              isOpen && "rotate-90"
            )}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 pl-4 pt-1">
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
    return <div className="my-2 h-px bg-stone-200" />;
  }

  return (
    <div className="my-2 flex items-center gap-2">
      <div className="h-px flex-1 bg-stone-200" />
      {label && (
        <span className="text-xs font-medium text-stone-500">{label}</span>
      )}
      <div className="h-px flex-1 bg-stone-200" />
    </div>
  );
}
