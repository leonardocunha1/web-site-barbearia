import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import {
  CalendarIcon,
  UserPlusIcon,
  UserXIcon,
  UsersIcon,
  StarIcon,
  AlertCircleIcon,
} from "lucide-react";

export function OverviewSection() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:px-0 lg:grid-cols-4">
      <Card className="w-full rounded-2xl shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Profissionais</CardTitle>
          <UsersIcon className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">18</div>
          <p className="text-muted-foreground text-xs">Ativos no sistema</p>
        </CardContent>
      </Card>

      <Card className="w-full rounded-2xl shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Novos Cadastros</CardTitle>
          <UserPlusIcon className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">4</div>
          <p className="text-muted-foreground text-xs">este mês</p>
        </CardContent>
      </Card>

      <Card className="w-full rounded-2xl shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Agendamentos Hoje
          </CardTitle>
          <CalendarIcon className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">27</div>
          <p className="text-muted-foreground text-xs">
            distribuídos entre 6 profissionais
          </p>
        </CardContent>
      </Card>

      <Card className="w-full rounded-2xl shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Cancelamentos</CardTitle>
          <UserXIcon className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5</div>
          <p className="text-muted-foreground text-xs">nas últimas 24h</p>
        </CardContent>
      </Card>

      <div className="col-span-full">
        <Card className="w-full rounded-2xl shadow">
          <CardHeader>
            <CardTitle>Top Profissionais do Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span>João Pedro</span>
                <span className="text-muted-foreground text-sm">
                  22 atendimentos
                </span>
              </li>
              <li className="flex justify-between">
                <span>Amanda Souza</span>
                <span className="text-muted-foreground text-sm">
                  19 atendimentos
                </span>
              </li>
              <li className="flex justify-between">
                <span>Carlos Mendes</span>
                <span className="text-muted-foreground text-sm">
                  16 atendimentos
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-full">
        <Card className="w-full rounded-2xl shadow">
          <CardHeader>
            <CardTitle>Serviços Mais Agendados</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span>Corte Masculino</span>
                <span className="text-muted-foreground text-sm">
                  38 agendamentos
                </span>
              </li>
              <li className="flex justify-between">
                <span>Barba</span>
                <span className="text-muted-foreground text-sm">
                  21 agendamentos
                </span>
              </li>
              <li className="flex justify-between">
                <span>Coloração</span>
                <span className="text-muted-foreground text-sm">
                  15 agendamentos
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-full">
        <Card className="w-full rounded-2xl shadow">
          <CardHeader>
            <CardTitle>Avaliações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="border-b pb-2">
                <p className="font-medium">Lucas</p>
                <p className="text-muted-foreground text-sm">
                  Excelente atendimento!
                </p>
                <div className="mt-1 flex items-center gap-1 text-sm text-yellow-500">
                  <StarIcon className="h-4 w-4" /> 5 estrelas
                </div>
              </li>
              <li className="border-b pb-2">
                <p className="font-medium">Fernanda</p>
                <p className="text-muted-foreground text-sm">
                  Corte muito bom.
                </p>
                <div className="mt-1 flex items-center gap-1 text-sm text-yellow-500">
                  <StarIcon className="h-4 w-4" /> 4 estrelas
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-full">
        <Card className="w-full rounded-2xl shadow">
          <CardHeader>
            <CardTitle>Resumo Financeiro - Agosto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-black">R$ 8.900,00</p>
                <p>Faturamento Total</p>
              </div>
              <div>
                <p className="text-sm font-medium text-black">135</p>
                <p>Serviços Realizados</p>
              </div>
              <div>
                <p className="text-sm font-medium text-black">R$ 65,93</p>
                <p>Ticket Médio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-full">
        <Card className="w-full rounded-2xl shadow">
          <CardHeader>
            <CardTitle>Alertas do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <AlertCircleIcon className="h-4 w-4 text-orange-500" />
                Login do admin às 10:23
              </li>
              <li className="flex items-center gap-2">
                <AlertCircleIcon className="h-4 w-4 text-red-500" />
                Erro na API de serviços ontem às 18:41
              </li>
              <li className="flex items-center gap-2">
                <AlertCircleIcon className="h-4 w-4 text-yellow-500" />
                Serviço Coloração desativado manualmente
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

