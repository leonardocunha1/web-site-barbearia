"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AssignBonusToUserBodyType, useAssignBonusToUser } from "@/api";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { SparkleIcon } from "@phosphor-icons/react";

const bonusTypeOptions = [
  {
    value: AssignBonusToUserBodyType.BOOKING_POINTS,
    label: "Pontos do agendamento",
  },
  { value: AssignBonusToUserBodyType.LOYALTY, label: "Fidelidade" },
] as const;

const labelClass =
  "text-foreground/70 font-mono text-[10px] tracking-widest uppercase";

type BonusAssignDialogProps = {
  bookingId: string;
  userId: string;
  clientName?: string | null;
};

export function BonusAssignDialog({
  bookingId,
  userId,
  clientName,
}: BonusAssignDialogProps) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<AssignBonusToUserBodyType>(
    AssignBonusToUserBodyType.BOOKING_POINTS,
  );
  const [description, setDescription] = useState("");

  const assignBonus = useAssignBonusToUser({
    mutation: {
      onSuccess: () => {
        toast.success("Bônus atribuído com sucesso.");
        setOpen(false);
        setDescription("");
      },
      onError: () => toast.error("Não foi possível atribuir o bônus."),
    },
  });

  const isDisabled = !userId || assignBonus.isPending;

  const summary = useMemo(() => {
    if (!clientName) return null;
    return clientName;
  }, [clientName]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userId) return;

    assignBonus.mutate({
      data: {
        userId,
        bookingId,
        type,
        description: description.trim() || undefined,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={!userId}
          className="gap-2"
        >
          <SparkleIcon weight="duotone" className="text-cobre-700 h-4 w-4" />
          Bônus
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="bg-foreground/60 h-px w-8" aria-hidden />
            <span className="text-foreground/70 font-mono text-[10px] tracking-[0.25em] uppercase">
              Atribuir bônus
            </span>
          </div>
          <DialogTitle className="font-display text-foreground text-2xl font-medium tracking-tight">
            Vincular pontos
          </DialogTitle>
          <DialogDescription>
            Pontos atrelados a este agendamento.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {summary && (
            <div className="border-cobre-600 border-l-2 px-4 py-2">
              <p className={labelClass}>Cliente</p>
              <p className="text-foreground mt-0.5 text-sm font-medium">
                {summary}
              </p>
            </div>
          )}
          <div className="space-y-2">
            <Label className={labelClass}>Tipo de bônus</Label>
            <Select
              value={type}
              onValueChange={(value) =>
                setType(value as AssignBonusToUserBodyType)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {bonusTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className={labelClass}>Descrição (opcional)</Label>
            <Input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Ex: bônus por fidelidade"
            />
          </div>
          <DialogFooter className="border-foreground/10 border-t pt-4">
            <Button
              type="submit"
              variant="editorial"
              size="sm"
              disabled={isDisabled}
            >
              {assignBonus.isPending ? "Salvando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
