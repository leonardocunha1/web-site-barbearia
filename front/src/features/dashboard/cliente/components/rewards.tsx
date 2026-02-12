import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

export function RewardsSection() {
  const rewards = [
    { points: 50, reward: "Café grátis na próxima visita" },
    { points: 100, reward: "10% de desconto" },
    { points: 200, reward: "Corte grátis" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Meus Pontos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold">150</span>
              </div>
            </div>
          </div>
          <div className="text-muted-foreground text-center text-sm">
            Você está a 50 pontos do próximo nível
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prêmios Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rewards.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <div className="font-medium">{item.reward}</div>
                  <div className="text-muted-foreground text-sm">
                    {item.points} pontos
                  </div>
                </div>
                <Button
                  variant={item.points <= 150 ? "default" : "secondary"}
                  disabled={item.points > 150}
                >
                  Resgatar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

