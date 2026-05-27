"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { LoadingState } from "@/shared/components/ui/loading-state";
import { ErrorState } from "@/shared/components/ui/error-state";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  useGetUserProfile,
  useUpdateUserProfile,
  useUpdateUserPassword,
} from "@/api";
import { useAnonymizeUser } from "@/api";
import { toast } from "sonner";

const PASSWORD_MIN_LENGTH = 6;

const formatPhone = (phone: string) => {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }

  return phone;
};

const sectionLabelClass =
  "text-foreground/70 font-mono text-[10px] tracking-widest uppercase";

const fieldLabelClass =
  "text-foreground/70 font-mono text-[10px] tracking-widest uppercase";

export function ProfileSection() {
  const { data, isLoading, isError } = useGetUserProfile();
  const updateProfile = useUpdateUserProfile();
  const updatePassword = useUpdateUserPassword();
  const anonymizeUser = useAnonymizeUser();

  const [name, setName] = useState("");

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isAnonymizeOpen, setIsAnonymizeOpen] = useState(false);

  const userId = data?.user?.id ?? "";

  useEffect(() => {
    if (!data?.user) return;
    setName(data.user.name ?? "");
  }, [data]);

  const isProfileDirty = useMemo(() => {
    if (!data?.user) return false;
    return name !== (data.user.name ?? "");
  }, [data, name]);

  const canSubmitPassword =
    passwordForm.currentPassword.length >= PASSWORD_MIN_LENGTH &&
    passwordForm.newPassword.length >= PASSWORD_MIN_LENGTH &&
    passwordForm.newPassword === passwordForm.confirmPassword;

  const handleProfileSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isProfileDirty) {
      toast.info("Nenhuma alteracao para salvar.");
      return;
    }

    updateProfile.mutate(
      {
        data: {
          name: name || undefined,
        },
      },
      {
        onSuccess: () => toast.success("Nome atualizado com sucesso."),
        onError: () => toast.error("Nao foi possivel atualizar o nome."),
      },
    );
  };

  const handlePasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmitPassword) {
      toast.error("Verifique os campos de senha.");
      return;
    }

    updatePassword.mutate(
      {
        data: {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
      },
      {
        onSuccess: () => {
          toast.success("Senha atualizada.");
          setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        },
        onError: () => toast.error("Nao foi possivel atualizar a senha."),
      },
    );
  };

  const handleAnonymize = () => {
    if (!userId) return;

    anonymizeUser.mutate(
      { userId },
      {
        onSuccess: () => {
          toast.success("Conta anonimizada com sucesso.");
          setIsAnonymizeOpen(false);
        },
        onError: () => toast.error("Nao foi possivel apagar a conta."),
      },
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className={sectionLabelClass}>Meus dados</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingState message="Carregando dados..." size="sm" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !data?.user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className={sectionLabelClass}>Meus dados</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorState
            type="error"
            message="Nao foi possivel carregar seus dados."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className={sectionLabelClass}>Meus dados</CardTitle>
          <CardDescription className="font-display text-foreground text-xl font-medium tracking-tight">
            Suas informações pessoais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleProfileSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className={fieldLabelClass}>
                  Nome completo
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className={fieldLabelClass}>
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={data.user.email ?? ""}
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className={fieldLabelClass}>
                  Telefone
                </Label>
                <Input
                  id="phone"
                  value={formatPhone(data.user.phone ?? "")}
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
              </div>
            </div>

            <div className="border-foreground/10 flex justify-end border-t pt-4">
              <Button
                type="submit"
                variant="editorial"
                size="sm"
                disabled={!isProfileDirty || updateProfile.isPending}
              >
                {updateProfile.isPending ? "Salvando..." : "Salvar nome"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className={sectionLabelClass}>Segurança</CardTitle>
          <CardDescription className="font-display text-foreground text-xl font-medium tracking-tight">
            Alterar senha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handlePasswordSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className={fieldLabelClass}>
                  Senha atual
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(event) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: event.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className={fieldLabelClass}>
                  Nova senha
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(event) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: event.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className={fieldLabelClass}>
                  Confirmar senha
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(event) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: event.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="border-foreground/10 flex justify-end border-t pt-4">
              <Button
                type="submit"
                variant="editorial"
                size="sm"
                disabled={!canSubmitPassword || updatePassword.isPending}
              >
                {updatePassword.isPending
                  ? "Atualizando..."
                  : "Atualizar senha"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive font-mono text-[10px] tracking-widest uppercase">
            Zona de risco
          </CardTitle>
          <CardDescription className="font-display text-foreground text-xl font-medium tracking-tight">
            Apagar conta
          </CardDescription>
          <p className="text-foreground/60 mt-1 text-sm">
            Sua conta será anonimizada e desativada para manter os registros.
          </p>
        </CardHeader>
        <CardContent>
          <Dialog open={isAnonymizeOpen} onOpenChange={setIsAnonymizeOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Apagar conta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <span className="bg-destructive/60 h-px w-8" aria-hidden />
                  <span className="text-destructive/80 font-mono text-[10px] tracking-[0.25em] uppercase">
                    Confirmação
                  </span>
                </div>
                <DialogTitle className="font-display text-foreground text-2xl font-medium tracking-tight">
                  Apagar conta
                </DialogTitle>
                <DialogDescription>
                  Esta ação irá remover seus dados pessoais e desativar a conta.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setIsAnonymizeOpen(false)}
                  className="font-mono text-xs tracking-widest uppercase"
                >
                  Voltar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleAnonymize}
                  disabled={anonymizeUser.isPending}
                >
                  {anonymizeUser.isPending ? "Processando..." : "Confirmar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
