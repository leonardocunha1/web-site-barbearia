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
import { LogIn, Sparkles, ArrowRight } from "lucide-react";

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
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="bg-principal-100 rounded-full p-2">
              <LogIn className="text-principal-600 h-5 w-5" />
            </div>
            Login necessário
          </DialogTitle>
          <DialogDescription className="pt-2 text-base">
            Para finalizar seu agendamento, você precisa estar logado.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg bg-stone-50 p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="text-principal-600 mt-0.5 h-4 w-4" />
            <p className="text-sm text-stone-600">
              <span className="font-medium text-stone-900">
                Seus dados estão salvos!
              </span>
              <br />
              Não se preocupe, as informações que você preencheu foram
              guardadas.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Continuar vendo
          </Button>
          <Button
            onClick={handleLogin}
            className="group bg-principal-600 hover:bg-principal-700 w-full gap-2 sm:w-auto"
          >
            Ir para login
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
