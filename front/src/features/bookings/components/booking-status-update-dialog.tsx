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
          <DialogTitle>Atualizar Status</DialogTitle>
          <DialogDescription>
            Altere o status do agendamento de {booking?.client}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm text-stone-600">
              <strong>Cliente:</strong> {booking?.client}
            </p>
            <p className="text-sm text-stone-600">
              <strong>Serviço:</strong> {booking?.service}
            </p>
            <p className="text-sm text-stone-600">
              <strong>Data/Hora:</strong> {booking?.date} às {booking?.time}
            </p>
            <p className="text-sm text-stone-600">
              <strong>Status Atual:</strong> {booking?.status}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Novo Status</label>
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onConfirm} disabled={!newStatus || isUpdating}>
            {isUpdating ? "Atualizando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
