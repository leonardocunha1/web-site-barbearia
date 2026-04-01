"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  profileFormSchema,
  ProfileFormValues,
} from "../schemas/profile-form-schema";
import { DEFAULT_WORKING_HOURS } from "../constants/profile-constants";

// TODO: Substituir por dados reais da API quando disponível
const MOCK_INITIAL_DATA: ProfileFormValues = {
  name: "Profissional Exemplo",
  email: "profissional@exemplo.com",
  phone: "(11) 99999-9999",
  specialty: "Barbeiro",
  bio: "Especialista em cortes clássicos e barbas bem feitas. Mais de 10 anos de experiência no mercado.",
  services: ["Corte de Cabelo", "Barba", "Tratamentos Capilares"],
  workingHours: DEFAULT_WORKING_HOURS,
};

export function useProfileForm() {
  // TODO: Integrar com API
  // const { data: profileData, isLoading } = useGetProfessionalProfile();
  // const updateProfile = useUpdateProfessionalProfile();

  const methods = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: MOCK_INITIAL_DATA,
    mode: "onChange",
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = methods;

  const services = watch("services");
  const workingHours = watch("workingHours");

  const addService = (newService: string) => {
    const trimmed = newService.trim();
    if (!trimmed) {
      toast.error("Digite o nome do serviço");
      return false;
    }

    if (services.includes(trimmed)) {
      toast.error("Este serviço já foi adicionado");
      return false;
    }

    setValue("services", [...services, trimmed], {
      shouldValidate: true,
      shouldDirty: true,
    });
    return true;
  };

  const removeService = (serviceToRemove: string) => {
    setValue(
      "services",
      services.filter((s) => s !== serviceToRemove),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  };

  const updateWorkingHours = (
    day: keyof ProfileFormValues["workingHours"],
    index: 0 | 1,
    value: string,
  ) => {
    const currentHours = workingHours[day];
    const newHours = [...currentHours];
    newHours[index] = value;

    setValue(
      "workingHours",
      {
        ...workingHours,
        [day]: newHours,
      },
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  };

  const toggleSundayWork = () => {
    const currentSunday = workingHours.sunday;
    setValue(
      "workingHours",
      {
        ...workingHours,
        sunday: currentSunday.length === 0 ? ["09:00", "13:00"] : [],
      },
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  };

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      // TODO: Integrar com API
      // await updateProfile.mutateAsync(data);
      toast.success("Perfil atualizado com sucesso!");

      // Simula delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      toast.error("Erro ao atualizar perfil. Tente novamente.");
      throw error;
    }
  };

  return {
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
    onSubmit: handleSubmit(onSubmit),
  };
}
