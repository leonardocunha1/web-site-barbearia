"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarNav,
  SidebarNavItem,
  SidebarNavGroup,
  NavHrefsProvider,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/components/ui/sheet";
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { NavIcon } from "@/shared/components/ui/sidebar";

export interface NavItem {
  href: string;
  icon: NavIcon;
  label: string;
  badge?: string | number;
}

export interface NavGroup {
  label: string;
  icon?: NavIcon;
  items: NavItem[];
}

interface DashboardShellProps {
  children: React.ReactNode;
  navigation: (NavItem | NavGroup)[];
  user: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
  onLogout: () => void;
}

function SidebarToggle() {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <Button
      onClick={toggleSidebar}
      variant="ghost"
      size="icon"
      className="hidden md:flex"
    >
      {isCollapsed ? (
        <ChevronRight className="h-4 w-4" />
      ) : (
        <ChevronLeft className="h-4 w-4" />
      )}
    </Button>
  );
}

function SidebarLogo() {
  const { isCollapsed } = useSidebar();

  return (
    <Link href="/" className="flex items-center gap-3">
      <Image
        src="/logo-sem-escrita.png"
        alt="Logo"
        width={32}
        height={32}
        className="h-9 w-9"
      />
      {!isCollapsed && (
        <div className="flex flex-col leading-tight">
          <span className="font-display text-foreground text-base font-medium tracking-tight">
            El Bigodón
          </span>
          <span className="text-foreground/60 font-mono text-[9px] tracking-[0.25em] uppercase">
            Painel
          </span>
        </div>
      )}
    </Link>
  );
}

function UserMenu({
  user,
  onLogout,
}: {
  user: DashboardShellProps["user"];
  onLogout: () => void;
}) {
  const { isCollapsed } = useSidebar();
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (isCollapsed) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-0.5">
              <p className="text-foreground text-sm font-medium">{user.name}</p>
              <p className="text-foreground/60 font-mono text-[10px] tracking-widest uppercase">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/" className="cursor-pointer">
              <Home className="mr-2 h-4 w-4" />
              Ir para o site
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="hover:bg-foreground/5 w-full justify-start gap-3 px-2"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col items-start text-left">
            <span className="text-foreground text-sm font-medium">
              {user.name}
            </span>
            <span className="text-foreground/60 font-mono text-[9px] tracking-widest uppercase">
              {user.role}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel className="text-foreground/60 font-mono text-[10px] tracking-widest uppercase">
          {user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/" className="cursor-pointer">
            <Home className="mr-2 h-4 w-4" />
            Ir para o site
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileSidebar({
  navigation,
  user,
  onLogout,
}: {
  navigation: DashboardShellProps["navigation"];
  user: DashboardShellProps["user"];
  onLogout: () => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex h-full flex-col">
          <div className="border-foreground/15 flex items-center justify-between border-b p-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo-sem-escrita.png"
                alt="Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <div className="flex flex-col leading-tight">
                <span className="font-display text-foreground text-base font-medium tracking-tight">
                  El Bigodón
                </span>
                <span className="text-foreground/60 font-mono text-[9px] tracking-[0.25em] uppercase">
                  Painel
                </span>
              </div>
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            <SidebarNav>
              {navigation.map((item, index) => {
                if ("items" in item) {
                  return (
                    <SidebarNavGroup
                      key={index}
                      label={item.label}
                      icon={item.icon}
                      defaultOpen
                    >
                      {item.items.map((subItem) => (
                        <SidebarNavItem
                          key={subItem.href}
                          href={subItem.href}
                          icon={subItem.icon}
                          label={subItem.label}
                          badge={subItem.badge}
                        />
                      ))}
                    </SidebarNavGroup>
                  );
                }
                return (
                  <SidebarNavItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    badge={item.badge}
                  />
                );
              })}
            </SidebarNav>
          </div>

          <div className="border-foreground/15 border-t p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col">
                <span className="text-foreground text-sm font-medium">
                  {user.name}
                </span>
                <span className="text-foreground/60 font-mono text-[9px] tracking-widest uppercase">
                  {user.role}
                </span>
              </div>
              <Button
                onClick={onLogout}
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function DesktopSidebar({
  navigation,
  user,
  onLogout,
}: {
  navigation: DashboardShellProps["navigation"];
  user: DashboardShellProps["user"];
  onLogout: () => void;
}) {
  return (
    <Sidebar className="hidden md:flex">
      <SidebarHeader>
        <SidebarLogo />
        <div className="ml-auto">
          <SidebarToggle />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarNav>
          {navigation.map((item, index) => {
            if ("items" in item) {
              return (
                <SidebarNavGroup
                  key={index}
                  label={item.label}
                  icon={item.icon}
                  defaultOpen
                >
                  {item.items.map((subItem) => (
                    <SidebarNavItem
                      key={subItem.href}
                      href={subItem.href}
                      icon={subItem.icon}
                      label={subItem.label}
                      badge={subItem.badge}
                    />
                  ))}
                </SidebarNavGroup>
              );
            }
            return (
              <SidebarNavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                badge={item.badge}
              />
            );
          })}
        </SidebarNav>
      </SidebarContent>

      <SidebarFooter>
        <UserMenu user={user} onLogout={onLogout} />
      </SidebarFooter>
    </Sidebar>
  );
}

function collectNavHrefs(navigation: (NavItem | NavGroup)[]): string[] {
  return navigation.flatMap((item) =>
    "items" in item ? item.items.map((sub) => sub.href) : [item.href],
  );
}

export function DashboardShell({
  children,
  navigation,
  user,
  onLogout,
}: DashboardShellProps) {
  const navHrefs = React.useMemo(() => collectNavHrefs(navigation), [navigation]);

  return (
    <SidebarProvider>
      <NavHrefsProvider hrefs={navHrefs}>
      <div className="bg-background flex h-screen w-full overflow-hidden">
        {/* Desktop Sidebar */}
        <DesktopSidebar navigation={navigation} user={user} onLogout={onLogout} />

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Mobile Header */}
          <header className="border-foreground/15 bg-card flex items-center gap-2 border-b p-4 md:hidden">
            <MobileSidebar navigation={navigation} user={user} onLogout={onLogout} />
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo-sem-escrita.png"
                alt="Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="font-display text-foreground text-base font-medium tracking-tight">
                El Bigodón
              </span>
            </Link>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
      </NavHrefsProvider>
    </SidebarProvider>
  );
}
