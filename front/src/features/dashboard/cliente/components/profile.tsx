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

export function ProfileSection() {
  const { data, isLoading, isError } = useGetUserProfile();
  const updateProfile = useUpdateUserProfile();
  const updatePassword = useUpdateUserPassword();
  const anonymizeUser = useAnonymizeUser();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isAnonymizeOpen, setIsAnonymizeOpen] = useState(false);

  const userId = data?.user?.id ?? "";

  useEffect(() => {
    if (!data?.user) return;
    setProfile({
      name: data.user.name ?? "",
      email: data.user.email ?? "",
      phone: data.user.phone ?? "",
    });
  }, [data]);

  const isProfileDirty = useMemo(() => {
    if (!data?.user) return false;
    return (
      profile.name !== (data.user.name ?? "") ||
      profile.email !== (data.user.email ?? "") ||
      profile.phone !== (data.user.phone ?? "")
    );
  }, [data, profile]);

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
          name: profile.name || undefined,
          email: profile.email || undefined,
          phone: profile.phone || undefined,
        },
      },
      {
        onSuccess: () => toast.success("Dados atualizados com sucesso."),
        onError: () => toast.error("Nao foi possivel atualizar os dados."),
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
          <CardTitle>Meus Dados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Carregando dados...</p>
        </CardContent>
      </Card>
    );
  }

  if (isError || !data?.user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meus Dados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600">
            Nao foi possivel carregar seus dados.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Meus Dados</CardTitle>
          <CardDescription>Atualize suas informacoes pessoais</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleProfileSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(event) =>
                    setProfile({ ...profile, name: event.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(event) =>
                    setProfile({ ...profile, email: event.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(event) =>
                    setProfile({ ...profile, phone: event.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() =>
                  setProfile({
                    name: data.user.name ?? "",
                    email: data.user.email ?? "",
                    phone: data.user.phone ?? "",
                  })
                }
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!isProfileDirty || updateProfile.isPending}
              >
                {updateProfile.isPending ? "Salvando..." : "Salvar Alteracoes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alterar Senha</CardTitle>
          <CardDescription>
            Defina uma nova senha para sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handlePasswordSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha atual</Label>
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
                <Label htmlFor="newPassword">Nova senha</Label>
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
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
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

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!canSubmitPassword || updatePassword.isPending}
              >
                {updatePassword.isPending
                  ? "Atualizando..."
                  : "Atualizar Senha"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle>Apagar Conta</CardTitle>
          <CardDescription>
            Sua conta sera anonimizada e desativada para manter os registros.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isAnonymizeOpen} onOpenChange={setIsAnonymizeOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">Apagar conta</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar exclusao</DialogTitle>
                <DialogDescription>
                  Esta acao ira remover seus dados pessoais e desativar a conta.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAnonymizeOpen(false)}
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
