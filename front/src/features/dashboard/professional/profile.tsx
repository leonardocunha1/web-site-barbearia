"use client";

import { useState } from "react";
import { FormProvider, Controller } from "react-hook-form";
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
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";
import { useProfileForm } from "./hooks/use-profile-form";
import {
  SPECIALTY_OPTIONS,
  WEEKDAY_LABELS,
} from "./constants/profile-constants";
import type { ProfileFormValues } from "./schemas/profile-form-schema";

export function ProfileSection() {
  const {
    methods,
    services,
    workingHours,
    errors,
    isSubmitting,
    isDirty,
    addService,
    removeService,
    updateWorkingHours,
    toggleSundayWork,
    onSubmit,
  } = useProfileForm();

  const [newService, setNewService] = useState("");

  const handleAddService = () => {
    if (addService(newService)) {
      setNewService("");
    }
  };

  const { register, control } = methods;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meus Dados Profissionais</CardTitle>
        <CardDescription>
          Atualize suas informações e preferências de trabalho
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  {...register("name")}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p className="text-destructive text-sm">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="text-destructive text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Telefone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="(11) 99999-9999"
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && (
                  <p className="text-destructive text-sm">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Especialidade */}
              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidade</Label>
                <Controller
                  control={control}
                  name="specialty"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger aria-invalid={!!errors.specialty}>
                        <SelectValue placeholder="Selecione sua especialidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {SPECIALTY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.specialty && (
                  <p className="text-destructive text-sm">
                    {errors.specialty.message}
                  </p>
                )}
              </div>
            </div>

            {/* Biografia */}
            <div className="space-y-2">
              <Label htmlFor="bio">Biografia</Label>
              <Textarea
                id="bio"
                {...register("bio")}
                rows={3}
                placeholder="Fale um pouco sobre sua experiência e especialidades..."
                aria-invalid={!!errors.bio}
              />
              {errors.bio && (
                <p className="text-destructive text-sm">{errors.bio.message}</p>
              )}
            </div>

            {/* Serviços */}
            <div className="space-y-2">
              <Label>Serviços Oferecidos</Label>
              <div className="flex flex-wrap gap-2">
                {services.map((service) => (
                  <Badge
                    key={service}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    {service}
                    <button
                      type="button"
                      onClick={() => removeService(service)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label={`Remover ${service}`}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <Input
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  placeholder="Adicionar novo serviço"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddService();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddService}
                >
                  Adicionar
                </Button>
              </div>
              {errors.services && (
                <p className="text-destructive text-sm">
                  {errors.services.message}
                </p>
              )}
            </div>

            {/* Horário de Trabalho */}
            <div className="space-y-4">
              <Label>Horário de Trabalho</Label>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(workingHours).map(([day, hours]) => (
                  <div key={day} className="space-y-2">
                    <Label className="capitalize">
                      {WEEKDAY_LABELS[day] || day}
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="time"
                        value={hours[0] || ""}
                        onChange={(e) =>
                          updateWorkingHours(
                            day as keyof ProfileFormValues["workingHours"],
                            0,
                            e.target.value,
                          )
                        }
                        disabled={day === "sunday" && hours.length === 0}
                        aria-label={`${WEEKDAY_LABELS[day]} - Horário de abertura`}
                      />
                      <Input
                        type="time"
                        value={hours[1] || ""}
                        onChange={(e) =>
                          updateWorkingHours(
                            day as keyof ProfileFormValues["workingHours"],
                            1,
                            e.target.value,
                          )
                        }
                        disabled={day === "sunday" && hours.length === 0}
                        aria-label={`${WEEKDAY_LABELS[day]} - Horário de fechamento`}
                      />
                      {day === "sunday" && (
                        <Button
                          type="button"
                          variant={
                            hours.length === 0 ? "outline" : "destructive"
                          }
                          size="sm"
                          onClick={toggleSundayWork}
                        >
                          {hours.length === 0 ? "Trabalha?" : "Não trabalha"}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {errors.workingHours && (
                <p className="text-destructive text-sm">
                  {errors.workingHours.message}
                </p>
              )}
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => methods.reset()}
                disabled={!isDirty || isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
