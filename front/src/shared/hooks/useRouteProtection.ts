import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@/contexts/user";

type Role = "ADMIN" | "PROFESSIONAL" | "CLIENT";

export function useRouteProtection(allowedRoles: Role[]) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (user === null) {
      // Redireciona sem mostrar toast (pode ser logout voluntário)
      router.push("/");
      return;
    }

    if (user && !allowedRoles.includes(user.user.role as Role)) {
      toast.error("Acesso negado!");
      router.push("/");
    }
  }, [user, isLoading, router, allowedRoles]);

  const isAuthorized = !!user && allowedRoles.includes(user.user.role as Role);
  return { user, isAuthorized, isLoading };
}
