"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { LoadingState } from "@/shared/components/ui/loading-state";
import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { BusinessHoursSection } from "./settings/business-hours/components/business-hours-section";
import { toast } from "sonner";
import {
  getGetProfessionalDashboardQueryKey,
  type UpdateProfessionalBody,
  useGetProfessionalDashboard,
  useUpdateProfessional,
  useUpdateUserPassword,
} from "@/api";
import { useQueryClient } from "@tanstack/react-query";

const formatPhone = (phone: string) => {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 11) {
    // (11) 99000-0205
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    // (11) 9000-0205
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }

  return phone;
};

const optionalString = (schema: z.ZodString) =>
  z.preprocess(
    (value) => (value === "" ? undefined : value),
    schema.optional(),
  );

const profileSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Informe um email valido"),
  phone: optionalString(
    z.string().regex(/^\+?[\d\s()-]{10,20}$/, "Informe um telefone valido"),
  ),
  specialty: optionalString(
    z.string().min(3, "Especialidade deve ter pelo menos 3 caracteres"),
  ),
  bio: optionalString(
    z.string().max(500, "Bio não pode exceder 500 caracteres"),
  ),
  document: optionalString(z.string()),
  registration: optionalString(z.string()),
  avatarUrl: optionalString(z.string().url("Informe uma URL válida")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Senha atual deve ter pelo menos 6 caracteres"),
    newPassword: z
      .string()
      .min(6, "Nova senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

type UpdateProfessionalPayload = UpdateProfessionalBody & {
  name?: string;
  email?: string;
  phone?: string | null;
};

function PasswordChangeCard() {
  const updatePassword = useUpdateUserPassword();

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onPasswordSubmit = async (values: PasswordFormValues) => {
    try {
      await updatePassword.mutateAsync({
        data: {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
      });

      toast.success("Senha alterada com sucesso!");
      passwordForm.reset();
    } catch {
      toast.error("Erro ao alterar senha. Verifique a senha atual.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alterar Senha</CardTitle>
        <CardDescription>
          Atualize sua senha para manter sua conta segura
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-4"
          >
            <FormField
              control={passwordForm.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha Atual</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormDescription>Mínimo de 6 caracteres</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Nova Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={updatePassword.isPending}>
              {updatePassword.isPending ? "Alterando..." : "Alterar Senha"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export function SettingsSection() {
  const dashboardParams = { range: "week" } as const;
  const { data, isLoading } = useGetProfessionalDashboard(dashboardParams, {});
  const updateProfessional = useUpdateProfessional();
  const queryClient = useQueryClient();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: data?.professional?.name ?? "",
      email: data?.professional?.email ?? "",
      phone: formatPhone(data?.professional?.phone ?? ""),
      specialty: data?.professional?.specialty ?? "",
      bio: "",
      document: "",
      registration: "",
      avatarUrl: data?.professional?.avatarUrl ?? "",
    },
  });

  useEffect(() => {
    if (!data?.professional) return;
    form.reset({
      name: data.professional.name ?? "",
      email: data.professional.email ?? "",
      phone: formatPhone(data.professional.phone ?? ""),
      specialty: data.professional.specialty ?? "",
      bio: "",
      document: "",
      registration: "",
      avatarUrl: data.professional.avatarUrl ?? "",
    });
  }, [data?.professional, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    const professionalId = data?.professional?.id;

    if (!professionalId) {
      toast.error("Nao foi possivel identificar o profissional");
      return;
    }

    const payload: UpdateProfessionalPayload = {
      name: values.name,
      email: values.email,
      phone: values.phone ?? null,
      specialty: values.specialty,
      bio: values.bio ?? null,
      document: values.document ?? null,
      registration: values.registration ?? null,
      avatarUrl: values.avatarUrl ?? null,
    };

    try {
      await updateProfessional.mutateAsync({
        id: professionalId,
        data: payload,
      });
      toast.success("Perfil atualizado com sucesso!");
      queryClient.invalidateQueries({
        queryKey: getGetProfessionalDashboardQueryKey(dashboardParams),
      });
    } catch {
      toast.error("Erro ao atualizar perfil");
    }
  };

  if (isLoading) {
    return <LoadingState message="Carregando configuracoes..." size="sm" />;
  }

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Perfil</CardTitle>
          <CardDescription>
            Atualize suas informações profissionais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="email@exemplo.com"
                          {...field}
                          disabled
                        />
                      </FormControl>
                      <FormDescription>
                        O email não pode ser alterado
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="(11) 99999-9999"
                          {...field}
                          disabled
                        />
                      </FormControl>
                      <FormDescription>
                        O telefone não pode ser alterado
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specialty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Especialidade</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Barba e Alinhamento"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="document"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Documento</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Documento profissional"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="registration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registro</FormLabel>
                      <FormControl>
                        <Input placeholder="Registro profissional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="avatarUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avatar (URL)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva-se e sua experiência"
                        className="resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Máximo 500 caracteres</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={updateProfessional.isPending}>
                {updateProfessional.isPending
                  ? "Salvando..."
                  : "Salvar Alterações"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Password Change Section */}
      <PasswordChangeCard />

      <BusinessHoursSection professionalId={data?.professional?.id} />

      {/* Notification Settings */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
          <CardDescription>
            Gerencie suas preferências de notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notificações de Novo Agendamento</p>
              <p className="text-sm text-stone-500">
                Receva alertas quando novos agendamentos forem feitos
              </p>
            </div>
            <input type="checkbox" defaultChecked className="h-5 w-5" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email de Confirmação</p>
              <p className="text-sm text-stone-500">
                Receba confirmações por email
              </p>
            </div>
            <input type="checkbox" defaultChecked className="h-5 w-5" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Lembretes antes do Atendimento</p>
              <p className="text-sm text-stone-500">
                Receba lembretes 1 hora antes de cada agendamento
              </p>
            </div>
            <input type="checkbox" defaultChecked className="h-5 w-5" />
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
