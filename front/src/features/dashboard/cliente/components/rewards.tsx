import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useGetBonusBalance } from "@/api";

const formatCurrency = (value?: number) => {
  if (value == null) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export function RewardsSection() {
  const { data, isLoading, isError } = useGetBonusBalance();

  const points = data?.points;
  const monetaryValue = data?.monetaryValue;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Meus Pontos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <p className="text-muted-foreground text-sm">
              Carregando pontos...
            </p>
          ) : isError ? (
            <p className="text-sm text-red-600">
              Nao foi possivel carregar seus pontos.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border p-4 text-center">
                <p className="text-muted-foreground text-sm">Total</p>
                <p className="text-4xl font-bold">{points?.totalPoints ?? 0}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border p-3">
                  <p className="text-muted-foreground text-xs">Agendamentos</p>
                  <p className="text-lg font-semibold">
                    {points?.bookingPoints ?? 0}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-muted-foreground text-xs">Fidelidade</p>
                  <p className="text-lg font-semibold">
                    {points?.loyaltyPoints ?? 0}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Valor em Bonus</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <p className="text-muted-foreground text-sm">
              Carregando valores...
            </p>
          ) : isError ? (
            <p className="text-sm text-red-600">
              Nao foi possivel carregar os valores.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border p-4 text-center">
                <p className="text-muted-foreground text-sm">Total</p>
                <p className="text-3xl font-bold">
                  {formatCurrency(monetaryValue?.totalValue)}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border p-3">
                  <p className="text-muted-foreground text-xs">Agendamentos</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(monetaryValue?.bookingValue)}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-muted-foreground text-xs">Fidelidade</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(monetaryValue?.loyaltyValue)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
