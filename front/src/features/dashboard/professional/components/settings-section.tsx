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
import { BusinessHoursSection } from "@/features/business-hours/components/business-hours-section";
import { toast } from "sonner";
import {
  getGetProfessionalDashboardQueryKey,
  type UpdateProfessionalBody,
  useGetProfessionalDashboard,
  useUpdateProfessional,
} from "@/api";
import { useQueryClient } from "@tanstack/react-query";

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
type UpdateProfessionalPayload = UpdateProfessionalBody & {
  name?: string;
  email?: string;
  phone?: string | null;
};

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
      phone: data?.professional?.phone ?? "",
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
      phone: data.professional.phone ?? "",
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
    return (
      <div className="text-sm text-stone-500">Carregando configurações...</div>
    );
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
                        />
                      </FormControl>
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
                        <Input placeholder="(11) 99999-9999" {...field} />
                      </FormControl>
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
