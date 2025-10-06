"use client";

import { useEffect } from "react";
import { GetUsersMe200, useLogoutUser } from "@/api";
import userGet from "@/app/api/actions/user";
import { usePathname } from "next/navigation";

export const useAuthValidation = (
  user: GetUsersMe200 | null | undefined,
  setUser: React.Dispatch<React.SetStateAction<GetUsersMe200 | null | undefined>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { mutateAsync: logout } = useLogoutUser();
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true;

    const validateAuth = async () => {
      try {
        const { ok, data } = await userGet();

        if (!ok || !data) {
          if (isMounted) {
            await logout();
            setUser(null);
          }
          return;
        }

        if (isMounted) {
          setUser((prevUser) =>
            !prevUser || prevUser.user.id !== data.user.id ? data : prevUser
          );
        }
      } catch (error) {
        console.error("Erro inesperado na validação:", error);
        if (isMounted) {
          await logout();
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    validateAuth();

    return () => {
      isMounted = false;
    };
  }, [logout, setUser, setIsLoading, pathname]); 
};
