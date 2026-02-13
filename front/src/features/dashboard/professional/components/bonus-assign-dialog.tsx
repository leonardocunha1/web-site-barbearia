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

const bonusTypeOptions = [
  {
    value: AssignBonusToUserBodyType.BOOKING_POINTS,
    label: "Pontos do agendamento",
  },
  { value: AssignBonusToUserBodyType.LOYALTY, label: "Fidelidade" },
] as const;

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
        toast.success("Bonus atribuido com sucesso.");
        setOpen(false);
        setDescription("");
      },
      onError: () => toast.error("Nao foi possivel atribuir o bonus."),
    },
  });

  const isDisabled = !userId || assignBonus.isPending;

  const summary = useMemo(() => {
    if (!clientName) return "";
    return `Cliente: ${clientName}`;
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
        <Button variant="outline" size="sm" disabled={!userId}>
          Bonus
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atribuir bonus</DialogTitle>
          <DialogDescription>
            Vincule pontos ao cliente referente a este agendamento.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {summary && (
            <p className="text-muted-foreground text-sm">{summary}</p>
          )}
          <div className="space-y-2">
            <Label>Tipo de bonus</Label>
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
            <Label>Descricao (opcional)</Label>
            <Input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Ex: bonus por fidelidade"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isDisabled}>
              {assignBonus.isPending ? "Salvando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
