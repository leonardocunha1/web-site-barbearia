import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { SignInIcon, UserCircleIcon } from "@phosphor-icons/react";
import { GetUserProfile200User } from "@/api";

export function AuthButtons({
  user,
}: {
  user: GetUserProfile200User | null | undefined;
}) {
  if (!user) {
    return (
      <Link href="/login">
        <Button variant="editorial" size="sm" className="gap-2">
          <SignInIcon className="size-4" weight="bold" />
          Entrar
        </Button>
      </Link>
    );
  }

  const dashboardUrl =
    user.role === "PROFESSIONAL"
      ? "/painel/professional"
      : user.role === "ADMIN"
        ? "/painel/admin"
        : "/cliente";

  return (
    <Link href={dashboardUrl}>
      <Button variant="outline" size="sm" className="gap-2">
        <UserCircleIcon className="size-4" weight="bold" />
        Minha conta
      </Button>
    </Link>
  );
}
