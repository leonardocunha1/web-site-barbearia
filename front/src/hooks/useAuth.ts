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

        if (!ok || !data) throw new Error("Não autenticado");

        if (isMounted) {
          setUser((prevUser) => {
            if (!prevUser || prevUser.user.id !== data.user.id) {
              return data;
            }
            return prevUser;
          });
        }
      } catch (error) {
        console.error("Falha na validação:", error);
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

