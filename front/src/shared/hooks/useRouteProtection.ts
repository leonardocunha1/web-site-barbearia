import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@/contexts/user";

type Role = "ADMIN" | "PROFESSIONAL" | "CLIENT";

export function useRouteProtection(allowedRoles: Role[]) {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      toast.error("Você precisa estar logado para acessar esta área.");
      router.push("/");
      return;
    }

    if (user && !allowedRoles.includes(user.user.role as Role)) {
      toast.error("Acesso negado!");
      router.push("/");
    }
  }, [user, router, allowedRoles]);

  return { user, isAuthorized: user && allowedRoles.includes(user.user.role as Role) };
}
