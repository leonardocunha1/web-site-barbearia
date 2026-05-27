"use client";

import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
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
import { PlusIcon } from "@phosphor-icons/react";

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("pt-BR").format(new Date(value));
};

const toIsoDateTime = (value?: string) => {
  if (!value) return undefined;
  // Se já é uma data ISO válida, retorna como está
  if (value.includes("T")) return value;
  // Se é YYYY-MM-DD, converte para ISO
  const date = new Date(`${value}T00:00:00.000Z`);
  if (isNaN(date.getTime())) return undefined;
  return date.toISOString();
};

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
      onError: (error) =>
        toast.error(error.message || "Nao foi possivel criar o cupom."),
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
      onError: (error) =>
        toast.error(error.message || "Nao foi possivel atualizar o cupom."),
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
      onError: (error) =>
        toast.error(error.message || "Nao foi possivel remover o cupom."),
    },
  });

  const toggleStatus = useToggleCouponStatus({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getListCouponsQueryKey(listParams),
        });
        toast.success("Cupom atualizado com sucesso.");
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
        period: `${formatDate((coupon.startDate as string | null | undefined) ?? undefined)} - ${formatDate(
          (coupon.endDate as string | null | undefined) ?? undefined,
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
            expirationType: values.expirationType,
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
        type: source.type as "PERCENTAGE" | "FIXED" | "FREE",
        value: source.value as number,
        scope: source.scope as "GLOBAL" | "SERVICE" | "PROFESSIONAL",
        expirationType: source.expirationType as "DATE" | "QUANTITY",
        description: source.description ?? undefined,
        maxUses: source.maxUses ?? undefined,
        startDate: source.startDate as string | undefined,
        endDate: source.endDate as string | undefined,
        minBookingValue: source.minBookingValue ?? undefined,
        serviceId: source.service?.id ?? undefined,
        professionalId: source.professional?.id ?? undefined,
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
            expirationType: values.expirationType,
            description: values.description || undefined,
            maxUses:
              values.expirationType === "DATE"
                ? null
                : (values.maxUses ?? null),
            startDate: toIsoDateTime(values.startDate),
            endDate:
              values.expirationType === "QUANTITY"
                ? null
                : toIsoDateTime(values.endDate),
            minBookingValue: values.minBookingValue ?? null,
            serviceId:
              values.scope === "SERVICE" ? (values.serviceId ?? null) : null,
            professionalId:
              values.scope === "PROFESSIONAL"
                ? (values.professionalId ?? null)
                : null,
            active: values.active,
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
      <div className="space-y-1">
        <p className="text-foreground/70 font-mono text-[10px] tracking-widest uppercase">
          Promoções
        </p>
        <h2 className="font-display text-foreground text-2xl font-medium tracking-tight">
          Cupons cadastrados
        </h2>
      </div>
      <Card className="space-y-5 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
              value={params.filters.type || "all"}
              options={[
                { value: "all", label: "Todos" },
                { value: "PERCENTAGE", label: "Percentual" },
                { value: "FIXED", label: "Fixo" },
                { value: "FREE", label: "Gratis" },
              ]}
              onChange={(value) =>
                updateParams({
                  page: 1,
                  filters: {
                    ...params.filters,
                    type: value === "all" ? "" : value,
                  },
                })
              }
            />
            <SelectFilter
              label="Escopo"
              value={params.filters.scope || "all"}
              options={[
                { value: "all", label: "Todos" },
                { value: "GLOBAL", label: "Global" },
                { value: "SERVICE", label: "Servico" },
                { value: "PROFESSIONAL", label: "Profissional" },
              ]}
              onChange={(value) =>
                updateParams({
                  page: 1,
                  filters: {
                    ...params.filters,
                    scope: value === "all" ? "" : value,
                  },
                })
              }
            />
            <SelectFilter
              label="Status"
              value={params.filters.active || "all"}
              options={[
                { value: "all", label: "Todos" },
                { value: "true", label: "Ativo" },
                { value: "false", label: "Inativo" },
              ]}
              onChange={(value) =>
                updateParams({
                  page: 1,
                  filters: {
                    ...params.filters,
                    active: value === "all" ? "" : value,
                  },
                })
              }
            />
          </div>
          <Button
            onClick={handleCreate}
            variant="editorial"
            size="sm"
            className="h-10 shrink-0 gap-2"
          >
            <PlusIcon weight="bold" className="h-4 w-4" />
            Novo cupom
          </Button>
        </div>

        <GenericTable
          data={rows}
          columns={columns}
          isLoading={listQuery.isLoading}
          emptyMessage="Nenhum cupom encontrado"
          rowKey="id"
          totalItems={listQuery.data?.total ?? 0}
          showPagination
          className="border-foreground/15 border"
          headerClassName="bg-foreground/[0.04]"
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
                className="text-destructive hover:text-destructive"
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

const filterLabelClass =
  "text-foreground/70 font-mono text-[10px] tracking-widest uppercase";

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
    <div className="space-y-2">
      <Label className={filterLabelClass}>{label}</Label>
      <Input
        className="h-10"
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
    <div className="space-y-2">
      <Label className={filterLabelClass}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-10 w-full">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
