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
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { toast } from "sonner";
import {
  getGetProfessionalDashboardQueryKey,
  type UpdateProfessionalBody,
  useGetProfessionalDashboard,
  useUpdateProfessional,
  useUpdateUserPassword,
} from "@/api";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { PageHeader } from "@/shared/components/ui/page-header";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { User, Lock } from "lucide-react";

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

const optionalString = (schema: z.ZodString) =>
  z.preprocess((value) => (value === "" ? undefined : value), schema.optional());

const profileSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Informe um email válido"),
  phone: optionalString(
    z.string().regex(/^\+?[\d\s()-]{10,20}$/, "Informe um telefone válido")
  ),
  specialty: optionalString(
    z.string().min(3, "Especialidade deve ter pelo menos 3 caracteres")
  ),
  bio: optionalString(
    z.string().max(500, "Bio não pode exceder 500 caracteres")
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

function ProfileCard() {
  const { data, isLoading } = useGetProfessionalDashboard({ range: "week" });
  const updateProfessional = useUpdateProfessional();
  const queryClient = useQueryClient();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      specialty: "",
      bio: "",
      document: "",
      registration: "",
      avatarUrl: "",
    },
  });

  useEffect(() => {
    if (data?.professional) {
      const prof = data.professional;
      form.reset({
        name: prof.name || "",
        email: prof.email || "",
        phone: prof.phone ? formatPhone(prof.phone) : "",
        specialty: prof.specialty || "",
        bio: prof.bio || "",
        document: prof.document || "",
        registration: "",
        avatarUrl: prof.avatarUrl || "",
      });
    }
  }, [data, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!data?.professional?.id) {
      toast.error("Erro ao identificar profissional");
      return;
    }

    try {
      const payload: UpdateProfessionalPayload = {
        name: values.name,
        email: values.email,
        phone: values.phone ? values.phone.replace(/\D/g, "") : null,
        specialty: values.specialty,
        bio: values.bio,
        document: values.document,
        avatarUrl: values.avatarUrl,
      };

      await updateProfessional.mutateAsync({
        id: data.professional.id,
        data: payload,
      });

      toast.success("Perfil atualizado com sucesso!");

      queryClient.invalidateQueries({
        queryKey: getGetProfessionalDashboardQueryKey({ range: "week" }),
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Erro ao atualizar perfil");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-stone-600" />
          <CardTitle>Informações do Perfil</CardTitle>
        </div>
        <CardDescription>
          Atualize suas informações pessoais e profissionais
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
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome" {...field} />
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
                        placeholder="seu@email.com"
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
                      <Input
                        placeholder="(11) 99999-9999"
                        {...field}
                        onChange={(e) => {
                          const formatted = formatPhone(e.target.value);
                          field.onChange(formatted);
                        }}
                      />
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
                        placeholder="Ex: Barbeiro, Cabeleireira"
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
                    <FormLabel>CPF/CNPJ</FormLabel>
                    <FormControl>
                      <Input placeholder="000.000.000-00" {...field} />
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
                    <FormLabel>Registro Profissional</FormLabel>
                    <FormControl>
                      <Input placeholder="Número do registro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do Avatar</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://exemplo.com/avatar.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Link da imagem do seu perfil
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Conte um pouco sobre você..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Máximo de 500 caracteres
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={updateProfessional.isPending}
              className="w-full md:w-auto"
            >
              {updateProfessional.isPending
                ? "Salvando..."
                : "Salvar Alterações"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

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
    } catch (error) {
      console.log("Error updating password:", error);
      toast.error("Erro ao alterar senha. Verifique a senha atual.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-stone-600" />
          <CardTitle>Alterar Senha</CardTitle>
        </div>
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
                  <FormDescription>
                    Mínimo de 6 caracteres
                  </FormDescription>
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

            <Button
              type="submit"
              disabled={updatePassword.isPending}
              className="w-full md:w-auto"
            >
              {updatePassword.isPending ? "Alterando..." : "Alterar Senha"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function ProfileSettingsPage() {
  return (
    <div className="h-full space-y-6 p-6">
      <PageHeader
        title="Configurações de Perfil"
        description="Gerencie suas informações pessoais e de segurança"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <ProfileCard />
        <PasswordChangeCard />
      </motion.div>
    </div>
  );
}
