import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { CalendarIcon, HeartIcon, StarIcon, UserIcon } from "lucide-react";
import { RecentAppointments } from "./recent-appoinments";
import { useGetBonusBalance } from "@/api";
import {
  formatBookingDateTime,
  formatBookingServices,
} from "@/features/bookings/utils/booking-formatters";
import { useNextBooking, useUserBookings } from "../hooks/use-user-bookings";

export function OverviewSection() {
  const { data: bonus } = useGetBonusBalance();
  const { data: bookingsData } = useUserBookings(10);
  const nextBooking = useNextBooking();

  const nextDateTime = formatBookingDateTime(nextBooking?.startDateTime);
  const nextServices = formatBookingServices(nextBooking?.items);
  const totalBookings = bookingsData?.total ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:px-0 lg:grid-cols-4">
      <Card className="w-full rounded-2xl shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Próximo Agendamento
          </CardTitle>
          <CalendarIcon className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {nextBooking ? `${nextDateTime.date}, ${nextDateTime.time}` : "-"}
          </div>
          <p className="text-muted-foreground text-xs">
            {nextBooking ? nextServices : "Sem agendamento"}
          </p>
        </CardContent>
      </Card>

      <Card className="w-full rounded-2xl shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Pontos Acumulados
          </CardTitle>
          <StarIcon className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {bonus?.points?.totalPoints ?? 0}
          </div>
          <p className="text-muted-foreground text-xs">Total de pontos</p>
        </CardContent>
      </Card>

      <Card className="w-full rounded-2xl shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Visitas Totais</CardTitle>
          <UserIcon className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBookings}</div>
          <p className="text-muted-foreground text-xs">
            Agendamentos realizados
          </p>
        </CardContent>
      </Card>

      <Card className="w-full rounded-2xl shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Fidelidade</CardTitle>
          <HeartIcon className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {bonus?.points?.loyaltyPoints ?? 0}
          </div>
          <p className="text-muted-foreground text-xs">Pontos de fidelidade</p>
        </CardContent>
      </Card>

      <div className="col-span-full">
        <Card className="w-full rounded-2xl shadow">
          <CardHeader>
            <CardTitle>Histórico Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentAppointments />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
