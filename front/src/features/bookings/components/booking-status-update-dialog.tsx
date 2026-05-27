import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { UpdateBookingStatusBodyStatus } from "@/api";

export type BookingRow = {
  id: string;
  date: string;
  time: string;
  service: string;
  client: string;
  status: string;
  statusValue: "PENDING" | "CONFIRMED" | "CANCELED" | "COMPLETED";
  startDateTime: string;
  totalAmount: number;
  endDateTime: string;
};

type StatusOption = {
  value: UpdateBookingStatusBodyStatus;
  label: string;
};

interface BookingStatusUpdateDialogProps {
  booking: BookingRow | null;
  newStatus: UpdateBookingStatusBodyStatus | "";
  availableStatusOptions: StatusOption[];
  isUpdating: boolean;
  onStatusChange: (status: UpdateBookingStatusBodyStatus) => void;
  onConfirm: () => void;
  onClose: () => void;
}

const labelClass =
  "text-foreground/70 font-mono text-[10px] tracking-widest uppercase";

export function BookingStatusUpdateDialog({
  booking,
  newStatus,
  availableStatusOptions,
  isUpdating,
  onStatusChange,
  onConfirm,
  onClose,
}: BookingStatusUpdateDialogProps) {
  return (
    <Dialog open={!!booking} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="bg-foreground/60 h-px w-8" aria-hidden />
            <span className="text-foreground/70 font-mono text-[10px] tracking-[0.25em] uppercase">
              Atualizar status
            </span>
          </div>
          <DialogTitle className="font-display text-foreground text-2xl font-medium tracking-tight">
            Alterar status
          </DialogTitle>
          <DialogDescription>
            Status do agendamento de {booking?.client}.
          </DialogDescription>
        </DialogHeader>

        <dl className="border-foreground/15 border-l-2 px-4 py-3 space-y-2 text-sm">
          <div className="flex items-center gap-3">
            <dt className={`${labelClass} w-20 shrink-0`}>Cliente</dt>
            <dd className="text-foreground font-medium">{booking?.client}</dd>
          </div>
          <div className="flex items-center gap-3">
            <dt className={`${labelClass} w-20 shrink-0`}>Serviço</dt>
            <dd className="text-foreground">{booking?.service}</dd>
          </div>
          <div className="flex items-center gap-3">
            <dt className={`${labelClass} w-20 shrink-0`}>Data</dt>
            <dd className="text-foreground font-mono">
              {booking?.date} · {booking?.time}
            </dd>
          </div>
          <div className="flex items-center gap-3">
            <dt className={`${labelClass} w-20 shrink-0`}>Atual</dt>
            <dd className="text-foreground">{booking?.status}</dd>
          </div>
        </dl>

        <div className="space-y-2">
          <label className={labelClass}>Novo status</label>
          <Select
            value={newStatus}
            onValueChange={(value) =>
              onStatusChange(value as UpdateBookingStatusBodyStatus)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o novo status" />
            </SelectTrigger>
            <SelectContent>
              {availableStatusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={onClose}
            className="font-mono text-xs tracking-widest uppercase"
          >
            Cancelar
          </Button>
          <Button
            variant="editorial"
            onClick={onConfirm}
            disabled={!newStatus || isUpdating}
          >
            {isUpdating ? "Atualizando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
