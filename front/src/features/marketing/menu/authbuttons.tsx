import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { SignInIcon } from "@phosphor-icons/react";
import { GetUserProfile200User } from "@/api";

export function AuthButtons({
  user,
}: {
  user: GetUserProfile200User | null | undefined;
}) {
  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Link href="/login">
          <Button
            variant="default"
            size="sm"
            className="border-principal-500 hover:bg-principal-500 cursor-pointer border text-stone-100 duration-200"
          >
            Entrar
            <SignInIcon className="size-4" />
          </Button>
        </Link>
      </div>
    );
  }
  // Se user existe, mostra botão de ir para conta
  const dashboardUrl =
    user.role === "PROFESSIONAL"
      ? "/painel/professional"
      : user.role === "ADMIN"
        ? "/painel/admin"
        : "/cliente";

  return (
    <div className="flex items-center space-x-2">
      <Link href={dashboardUrl}>
        <Button
          variant="default"
          size="sm"
          className="border-principal-500 hover:bg-principal-600 cursor-pointer border text-stone-200 duration-300"
        >
          Minha conta
        </Button>
      </Link>
    </div>
  );
}
