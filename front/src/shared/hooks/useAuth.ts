"use client";

import { useEffect } from "react";
import { useLogoutUser } from "@/api";
import userGet from "@/app/api/actions/user";
import type { GetUserProfile200 } from "@/api";

export const useAuthValidation = (
  user: GetUserProfile200 | null | undefined,
  setUser: React.Dispatch<
    React.SetStateAction<GetUserProfile200 | null | undefined>
  >,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const { mutateAsync: logout } = useLogoutUser();

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
            !prevUser || prevUser.user.id !== data.user.id ? data : prevUser,
          );
        }
      } catch {
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
  }, [logout, setUser, setIsLoading]);
};
