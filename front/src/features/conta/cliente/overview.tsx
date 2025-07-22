import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, HeartIcon, StarIcon, UserIcon } from "lucide-react";
import { RecentAppointments } from "./recent-appoinments";

export function OverviewSection() {
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
          <div className="text-2xl font-bold">15 Jul, 10:00</div>
          <p className="text-muted-foreground text-xs">Corte + Barba</p>
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
          <div className="text-2xl font-bold">150</div>
          <p className="text-muted-foreground text-xs">
            +10 pontos na próxima visita
          </p>
        </CardContent>
      </Card>

      <Card className="w-full rounded-2xl shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Visitas Totais</CardTitle>
          <UserIcon className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8</div>
          <p className="text-muted-foreground text-xs">+2 desde o último mês</p>
        </CardContent>
      </Card>

      <Card className="w-full rounded-2xl shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Fidelidade</CardTitle>
          <HeartIcon className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Ouro</div>
          <p className="text-muted-foreground text-xs">Nível atual</p>
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
