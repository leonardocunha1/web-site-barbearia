"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { ChevronDown, Menu } from "lucide-react";
import { SignOutIcon } from "@phosphor-icons/react";
import { useLogoutUser } from "@/api";
import { useUser } from "@/contexts/user";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { toast } from "sonner";

interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface DashboardLayoutProps {
  title: string;
  iconGroup?: React.ReactNode;
  tabs: TabItem[];
  defaultTab?: string;
  currentTab?: string;
  onTabChange?: (tab: string) => void;
}

export function DashboardLayout({
  title,
  iconGroup,
  tabs,
  defaultTab = "overview",
  currentTab,
  onTabChange,
}: DashboardLayoutProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const activeTab = currentTab || searchParams.get("tab") || defaultTab;

  const { setUser } = useUser();
  const { mutateAsync: logout } = useLogoutUser();

  const handleTabChange = (newTab: string) => {
    if (onTabChange) {
      onTabChange(newTab);
    } else {
      const params = new URLSearchParams(searchParams);
      params.set("tab", newTab);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  const handleLogout = async () => {
    try {
      await logout(undefined, {
        onSuccess: () => {
          toast.success("Logout realizado com sucesso");
          setUser(null);
          router.push("/");
        },
      });
    } catch {
      // logout error handled silently
    }
  };

  return (
    <div className="w-full flex-1 space-y-8 px-4 lg:px-0">
      {/* Header editorial */}
      <header className="border-foreground/15 flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="bg-foreground/60 h-px w-8" aria-hidden />
            <span className="text-foreground/70 font-mono text-[10px] tracking-[0.25em] uppercase">
              Painel · El Bigodón
            </span>
          </div>
          <h1 className="font-display text-foreground text-3xl leading-tight font-medium tracking-tight sm:text-4xl">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {iconGroup}
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <SignOutIcon className="h-4 w-4" weight="bold" />
            Sair
          </Button>
        </div>
      </header>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-6"
      >
        <div className="flex items-center gap-2">
          {/* Tabs desktop */}
          <ScrollArea className="hidden w-full md:block">
            <TabsList className="bg-transparent inline-flex flex-nowrap gap-0 border-b border-foreground/10 p-0 h-auto rounded-none">
              {tabs.map((tabItem) => (
                <TabsTrigger
                  key={tabItem.value}
                  value={tabItem.value}
                  className="relative cursor-pointer rounded-none border-0 bg-transparent px-4 py-2.5 font-mono text-[11px] tracking-[0.18em] uppercase text-foreground/60 hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none after:absolute after:inset-x-0 after:-bottom-px after:h-[2px] after:bg-cobre-600 after:scale-x-0 after:origin-left after:transition-transform data-[state=active]:after:scale-x-100"
                >
                  {tabItem.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>

          {/* Dropdown mobile */}
          <div className="w-full md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center">
                    <Menu className="mr-2 h-4 w-4" />
                    {tabs.find((t) => t.value === activeTab)?.label}
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-full">
                {tabs.map((tabItem) => (
                  <DropdownMenuItem
                    key={tabItem.value}
                    onClick={() => handleTabChange(tabItem.value)}
                  >
                    {tabItem.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {tabs.map((tabItem) => (
          <TabsContent key={tabItem.value} value={tabItem.value}>
            {tabItem.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
