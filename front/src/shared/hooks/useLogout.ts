import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLogoutUser } from "@/api";
import { useUser } from "@/contexts/user";

export function useLogout() {
  const { setUser } = useUser();
  const router = useRouter();
  const { mutateAsync: logoutMutation } = useLogoutUser();

  const logout = useCallback(async () => {
    try {
      await logoutMutation(undefined, {
        onSuccess: () => {
          toast.success("Logout realizado com sucesso");
          setUser(null);
          router.push("/");
        },
      });
    } catch {
      toast.error("Erro ao fazer logout");
    }
  }, [logoutMutation, setUser, router]);

  return { logout };
}
