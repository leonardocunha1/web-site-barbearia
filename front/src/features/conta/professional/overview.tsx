import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarIcon,
  DollarSignIcon,
  UserCheckIcon,
  UserXIcon,
} from "lucide-react";
import { RecentServices } from "./recent-services";

export function OverviewSection() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:px-0 lg:grid-cols-4">
      {/* Próximo Agendamento */}
      <Card className="w-full rounded-2xl shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Próximo Agendamento
          </CardTitle>
          <CalendarIcon className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">15 Jul, 10:00</div>
          <p className="text-muted-foreground text-xs">
            João Silva - Corte Social
          </p>
        </CardContent>
      </Card>

      {/* Faturamento Hoje */}
      <Card className="w-full rounded-2xl shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Faturamento Hoje
          </CardTitle>
          <DollarSignIcon className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ 420,00</div>
          <p className="text-muted-foreground text-xs">5 serviços realizados</p>
        </CardContent>
      </Card>

      {/* Clientes Atendidos */}
      <Card className="w-full rounded-2xl shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Clientes Atendidos
          </CardTitle>
          <UserCheckIcon className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-muted-foreground text-xs">+3 que ontem</p>
        </CardContent>
      </Card>

      {/* Cancelamentos */}
      <Card className="w-full rounded-2xl shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Cancelamentos</CardTitle>
          <UserXIcon className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2</div>
          <p className="text-muted-foreground text-xs">este mês</p>
        </CardContent>
      </Card>

      {/* Agenda do Dia */}
      <div className="col-span-full">
        <Card className="w-full rounded-2xl shadow">
          <CardHeader>
            <CardTitle>Agenda de Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentServices />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
