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
import { LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
  badge?: string | number;
}

export interface NavGroup {
  label: string;
  icon?: LucideIcon;
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
        className="h-8 w-8 rounded-full"
      />
      {!isCollapsed && (
        <span className="font-bold text-stone-900">El Bigódon</span>
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
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-stone-500">{user.email}</p>
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
          <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-600">
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
          className="w-full justify-start gap-3 px-2 hover:bg-stone-100"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col items-start text-left">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs text-stone-500">{user.role}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/" className="cursor-pointer">
            <Home className="mr-2 h-4 w-4" />
            Ir para o site
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-600">
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
          <div className="flex items-center justify-between border-b border-stone-200 p-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo-sem-escrita.png"
                alt="Logo"
                width={32}
                height={32}
                className="h-8 w-8 rounded-full"
              />
              <span className="font-bold text-stone-900">El Bigódon</span>
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

          <div className="border-t border-stone-200 p-4">
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
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-stone-500">{user.role}</span>
              </div>
              <Button
                onClick={onLogout}
                variant="ghost"
                size="icon"
                className="text-red-600"
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

export function DashboardShell({
  children,
  navigation,
  user,
  onLogout,
}: DashboardShellProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-stone-50 w-full">
        {/* Desktop Sidebar */}
        <DesktopSidebar navigation={navigation} user={user} onLogout={onLogout} />

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Mobile Header */}
          <header className="flex items-center gap-2 border-b border-stone-200 bg-white p-4 md:hidden">
            <MobileSidebar navigation={navigation} user={user} onLogout={onLogout} />
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo-sem-escrita.png"
                alt="Logo"
                width={32}
                height={32}
                className="h-8 w-8 rounded-full"
              />
              <span className="font-bold text-stone-900">El Bigódon</span>
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
    </SidebarProvider>
  );
}
