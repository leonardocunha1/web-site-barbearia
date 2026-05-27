"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { useRouter } from "next/navigation";
import { SignInIcon, SparkleIcon, ArrowRightIcon } from "@phosphor-icons/react";

interface LoginRequiredDialogProps {
  open: boolean;
  onClose: () => void;
  returnUrl?: string;
}

export function LoginRequiredDialog({
  open,
  onClose,
  returnUrl,
}: LoginRequiredDialogProps) {
  const router = useRouter();

  const handleLogin = () => {
    onClose();
    const loginUrl = returnUrl
      ? `/login?returnUrl=${encodeURIComponent(returnUrl)}`
      : "/login";
    router.push(loginUrl);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="bg-foreground/60 h-px w-8" aria-hidden />
            <span className="text-foreground/70 font-mono text-[10px] tracking-[0.25em] uppercase">
              Login necessário
            </span>
          </div>
          <DialogTitle className="font-display text-foreground text-2xl leading-tight font-medium tracking-tight">
            Falta só o <span className="text-cobre-700 italic">login</span>.
          </DialogTitle>
          <DialogDescription className="text-foreground/70 pt-1">
            Para confirmar a reserva, você precisa estar autenticado.
          </DialogDescription>
        </DialogHeader>

        <div className="border-cobre-600 border-l-2 px-4 py-3">
          <div className="flex items-start gap-3">
            <SparkleIcon
              weight="duotone"
              className="text-cobre-600 mt-0.5 h-4 w-4 shrink-0"
            />
            <p className="text-foreground/70 text-sm">
              <span className="text-foreground font-medium">
                Seus dados estão salvos.
              </span>{" "}
              As informações preenchidas ficam guardadas até você voltar.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            className="font-mono text-xs tracking-widest uppercase w-full sm:w-auto"
          >
            Continuar vendo
          </Button>
          <Button
            variant="editorial"
            onClick={handleLogin}
            className="group w-full gap-2 sm:w-auto"
          >
            <SignInIcon weight="bold" className="h-4 w-4" />
            Ir para login
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
