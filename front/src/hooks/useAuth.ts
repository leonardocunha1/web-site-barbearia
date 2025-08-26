import { useEffect } from "react";
import { GetUsersMe200, useLogoutUser } from "@/api";
import userGet from "@/app/api/actions/user-get";

export const useAuthValidation = (
  _user: GetUsersMe200 | null | undefined,
  setUser: React.Dispatch<React.SetStateAction<GetUsersMe200 | null | undefined>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { mutateAsync: logout } = useLogoutUser();

  useEffect(() => {
    let isMounted = true;

    const validateAuth = async () => {
      try {
        const { ok, data } = await userGet();
        console.log("Dados do usuário:", data);

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
