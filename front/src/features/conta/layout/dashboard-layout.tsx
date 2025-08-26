"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, Menu } from "lucide-react";
import { useLogoutUser } from "@/api";
import { useUser } from "@/contexts/user";
import { useRouter } from "next/navigation";
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
}

export function DashboardLayout({
  title,
  iconGroup,
  tabs,
  defaultTab = "overview",
}: DashboardLayoutProps) {
  const router = useRouter();
  const [tab, setTab] = useState(defaultTab);
  const { setUser } = useUser();
  const { mutateAsync: logout } = useLogoutUser();

  const handleLogout = async () => {
    try {
      await logout(undefined, {
        onSuccess: () => {
          toast.success("Logout realizado com sucesso");
          setUser(null);
          router.push("/");
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full flex-1 space-y-4 px-4 lg:px-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{title}</h1>
        <div className="flex items-center gap-4">
          {iconGroup}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="cursor-pointer"
          >
            Sair
          </Button>
        </div>
      </div>

      {/* Tabs controladas */}
      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <div className="flex items-center gap-2">
          {/* Tabs desktop */}
          <ScrollArea className="hidden w-full md:block">
            <TabsList className="inline-flex flex-nowrap bg-stone-200">
              {tabs.map((tabItem) => (
                <TabsTrigger key={tabItem.value} value={tabItem.value}>
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
                    {tabs.find((t) => t.value === tab)?.label}
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-full">
                {tabs.map((tabItem) => (
                  <DropdownMenuItem
                    key={tabItem.value}
                    onClick={() => setTab(tabItem.value)}
                  >
                    {tabItem.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Conteúdo das abas */}
        {tabs.map((tabItem) => (
          <TabsContent key={tabItem.value} value={tabItem.value}>
            {tabItem.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
