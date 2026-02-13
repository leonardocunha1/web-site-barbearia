"use client";

import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Column, GenericTable } from "@/shared/components/table/generic-table";
import { StatusBadge } from "@/shared/components/table/status-badge";
import { useTableParams } from "@/shared/hooks/useTableParams";
import {
  getListCouponsQueryKey,
  ListCouponsScope,
  ListCouponsType,
  useCreateCoupon,
  useDeleteCoupon,
  useListCoupons,
  useListOrSearchProfessionals,
  useListServices,
  useToggleCouponStatus,
  useUpdateCoupon,
} from "@/api";
import { useCouponFormModal } from "../hooks/use-coupon-form-modal";
import type { CouponFormValues } from "../schemas/coupon-form-schema";

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("pt-BR").format(new Date(value));
};

const toIsoDateTime = (value?: string) =>
  value ? new Date(`${value}T00:00:00`).toISOString() : undefined;

type CouponRow = {
  id: string;
  code: string;
  type: string;
  scope: string;
  value: string;
  active: boolean;
  uses: number;
  period: string;
};

export default function CouponsSection() {
  const { params, updateParams } = useTableParams();
  const queryClient = useQueryClient();
  const { openCouponForm } = useCouponFormModal();

  const listParams = {
    page: params.page,
    limit: params.limit,
    code: params.filters.code || undefined,
    type: params.filters.type
      ? (params.filters.type as ListCouponsType)
      : undefined,
    scope: params.filters.scope
      ? (params.filters.scope as ListCouponsScope)
      : undefined,
    active:
      params.filters.active === "true"
        ? true
        : params.filters.active === "false"
          ? false
          : undefined,
  };

  const listQuery = useListCoupons(listParams);

  const servicesQuery = useListServices({ page: 1, limit: 100 });
  const professionalsQuery = useListOrSearchProfessionals({
    page: 1,
    limit: 100,
  });

  const serviceOptions = useMemo(
    () =>
      servicesQuery.data?.services?.map((service) => ({
        value: service.id,
        label: service.name,
      })) ?? [],
    [servicesQuery.data],
  );

  const professionalOptions = useMemo(
    () =>
      professionalsQuery.data?.professionals?.map((professional) => ({
        value: professional.id,
        label: professional.user.name,
      })) ?? [],
    [professionalsQuery.data],
  );

  const createCoupon = useCreateCoupon({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getListCouponsQueryKey(listParams),
        });
        toast.success("Cupom criado com sucesso.");
      },
      onError: () => toast.error("Nao foi possivel criar o cupom."),
    },
  });

  const updateCoupon = useUpdateCoupon({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getListCouponsQueryKey(listParams),
        });
        toast.success("Cupom atualizado com sucesso.");
      },
      onError: () => toast.error("Nao foi possivel atualizar o cupom."),
    },
  });

  const deleteCoupon = useDeleteCoupon({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getListCouponsQueryKey(listParams),
        });
        toast.success("Cupom removido.");
      },
      onError: () => toast.error("Nao foi possivel remover o cupom."),
    },
  });

  const toggleStatus = useToggleCouponStatus({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getListCouponsQueryKey(listParams),
        });
      },
    },
  });

  const rows = useMemo<CouponRow[]>(() => {
    return (
      listQuery.data?.coupons?.map((coupon) => ({
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        scope: coupon.scope,
        value:
          coupon.type === "PERCENTAGE"
            ? `${coupon.value}%`
            : `R$ ${coupon.value}`,
        active: coupon.active,
        uses: coupon.uses,
        period: `${formatDate(coupon.startDate)} - ${formatDate(
          coupon.endDate,
        )}`,
      })) ?? []
    );
  }, [listQuery.data]);

  const columns: Column<CouponRow>[] = [
    { header: "Codigo", accessor: "code" },
    { header: "Tipo", accessor: "type" },
    { header: "Escopo", accessor: "scope" },
    { header: "Valor", accessor: "value" },
    { header: "Usos", accessor: "uses" },
    { header: "Periodo", accessor: "period" },
    {
      header: "Status",
      accessor: "active",
      render: (value) => <StatusBadge status={value ? "Ativo" : "Inativo"} />,
      align: "center",
    },
  ];

  const handleCreate = () => {
    openCouponForm({
      mode: "create",
      onSubmit: async (values: CouponFormValues) => {
        const normalizedValue = values.type === "FREE" ? 0 : values.value;
        await createCoupon.mutateAsync({
          data: {
            code: values.code,
            type: values.type,
            value: normalizedValue,
            scope: values.scope,
            description: values.description || undefined,
            maxUses: values.maxUses,
            startDate: toIsoDateTime(values.startDate),
            endDate: toIsoDateTime(values.endDate),
            minBookingValue: values.minBookingValue,
            serviceId:
              values.scope === "SERVICE" ? values.serviceId : undefined,
            professionalId:
              values.scope === "PROFESSIONAL"
                ? values.professionalId
                : undefined,
          },
        });
      },
      isSaving: createCoupon.isPending,
      services: serviceOptions,
      professionals: professionalOptions,
    });
  };

  const handleEdit = (row: CouponRow) => {
    const source = listQuery.data?.coupons?.find((item) => item.id === row.id);
    if (!source) return;

    openCouponForm({
      mode: "edit",
      initialValues: {
        code: source.code,
        type: source.type,
        value: source.value,
        scope: source.scope,
        description: source.description ?? "",
        maxUses: source.maxUses ?? undefined,
        startDate: source.startDate?.slice(0, 10) ?? "",
        endDate: source.endDate?.slice(0, 10) ?? "",
        minBookingValue: source.minBookingValue ?? undefined,
        serviceId: source.service?.id ?? "",
        professionalId: source.professional?.id ?? "",
        active: source.active,
      },
      onSubmit: async (values: CouponFormValues) => {
        const normalizedValue = values.type === "FREE" ? 0 : values.value;
        await updateCoupon.mutateAsync({
          couponId: source.id,
          data: {
            code: values.code,
            type: values.type,
            value: normalizedValue,
            scope: values.scope,
            description: values.description || undefined,
            maxUses: values.maxUses,
            startDate: toIsoDateTime(values.startDate),
            endDate: values.endDate ? toIsoDateTime(values.endDate) : null,
            minBookingValue: values.minBookingValue ?? null,
            serviceId:
              values.scope === "SERVICE" ? (values.serviceId ?? null) : null,
            professionalId:
              values.scope === "PROFESSIONAL"
                ? (values.professionalId ?? null)
                : null,
            active: values.active ?? source.active,
          },
        });
      },
      isSaving: updateCoupon.isPending,
      services: serviceOptions,
      professionals: professionalOptions,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-stone-50 p-5 shadow">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            <InputFilter
              label="Codigo"
              value={params.filters.code || ""}
              onChange={(value) =>
                updateParams({
                  page: 1,
                  filters: { ...params.filters, code: value },
                })
              }
            />
            <SelectFilter
              label="Tipo"
              value={params.filters.type || ""}
              options={[
                { value: "", label: "Todos" },
                { value: "PERCENTAGE", label: "Percentual" },
                { value: "FIXED", label: "Fixo" },
                { value: "FREE", label: "Gratis" },
              ]}
              onChange={(value) =>
                updateParams({
                  page: 1,
                  filters: { ...params.filters, type: value },
                })
              }
            />
            <SelectFilter
              label="Escopo"
              value={params.filters.scope || ""}
              options={[
                { value: "", label: "Todos" },
                { value: "GLOBAL", label: "Global" },
                { value: "SERVICE", label: "Servico" },
                { value: "PROFESSIONAL", label: "Profissional" },
              ]}
              onChange={(value) =>
                updateParams({
                  page: 1,
                  filters: { ...params.filters, scope: value },
                })
              }
            />
            <SelectFilter
              label="Status"
              value={params.filters.active || ""}
              options={[
                { value: "", label: "Todos" },
                { value: "true", label: "Ativo" },
                { value: "false", label: "Inativo" },
              ]}
              onChange={(value) =>
                updateParams({
                  page: 1,
                  filters: { ...params.filters, active: value },
                })
              }
            />
          </div>
          <Button onClick={handleCreate}>Novo cupom</Button>
        </div>

        <GenericTable
          data={rows}
          columns={columns}
          isLoading={listQuery.isLoading}
          emptyMessage="Nenhum cupom encontrado"
          rowKey="id"
          totalItems={listQuery.data?.total ?? 0}
          showPagination
          actions={(row) => (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(row)}
              >
                Editar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleStatus.mutate({ couponId: row.id })}
              >
                {row.active ? "Desativar" : "Ativar"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600"
                onClick={() => deleteCoupon.mutate({ couponId: row.id })}
              >
                Remover
              </Button>
            </div>
          )}
        />
      </Card>
    </div>
  );
}

function InputFilter({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      <Input
        className="h-9"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function SelectFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="border-input h-9 rounded-md border bg-transparent px-3 text-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
