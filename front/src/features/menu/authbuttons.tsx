import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInIcon } from "@phosphor-icons/react";
import { GetUsersMe200 } from "@/api";

export function AuthButtons({
  user,
}: {
  user: GetUsersMe200 | null | undefined;
}) {
  console.log("AuthButtons user:", user);
  if (user === undefined) return null;

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Link href="/login">
          <Button
            variant="default"
            size="sm"
            className="text-principal-100 border-principal-900 cursor-pointer border"
          >
            Entrar
            <SignInIcon className="size-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <Link href="/conta">
      <Button
        variant="default"
        size="sm"
        className="text-principal-100 border-principal-900 cursor-pointer border"
      >
        Minha conta
      </Button>
    </Link>
  );
}
