"use client";

import { useOverlay } from "@/shared/hooks/useOverlay";
import { CouponFormModal } from "../components/coupon-form-modal";
import type { CouponFormValues } from "../schemas/coupon-form-schema";

type Option = { value: string; label: string };

type OpenCouponFormModalProps = {
  mode: "create" | "edit";
  initialValues?: Partial<CouponFormValues>;
  onSubmit: (values: CouponFormValues) => Promise<void>;
  isSaving?: boolean;
  services: Option[];
  professionals: Option[];
};

export function useCouponFormModal() {
  const { open, close } = useOverlay();

  const openCouponForm = ({
    mode,
    initialValues,
    onSubmit,
    isSaving,
    services,
    professionals,
  }: OpenCouponFormModalProps) => {
    open(
      <CouponFormModal
        mode={mode}
        initialValues={initialValues}
        onSubmit={onSubmit}
        isSaving={isSaving}
        onClose={close}
        services={services}
        professionals={professionals}
      />,
      {
        type: "modal",
        title: mode === "create" ? "Novo cupom" : "Editar cupom",
        size: "lg",
      },
    );
  };

  return { openCouponForm };
}
