"use client";

import { useOverlay } from "@/shared/hooks/useOverlay";
import { HolidayFormModal } from "../components/holiday-form-modal";
import type { HolidayFormValues } from "../schemas/holiday-form-schema";

type OpenHolidayModalProps = {
  onSubmit: (values: HolidayFormValues) => Promise<void>;
  isSaving?: boolean;
};

export function useHolidayModal() {
  const { open, close } = useOverlay();

  const openHolidayModal = ({ onSubmit, isSaving }: OpenHolidayModalProps) => {
    open(
      <HolidayFormModal
        onSubmit={onSubmit}
        onClose={close}
        isSaving={isSaving}
      />,
      {
        type: "modal",
        title: "Novo feriado",
        size: "sm",
      },
    );
  };

  return { openHolidayModal };
}
