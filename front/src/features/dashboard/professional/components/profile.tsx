"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useState } from "react";
import { Badge } from "@/shared/components/ui/badge";

export function ProfileSection() {
  const [profile, setProfile] = useState({
    name: "Profissional Exemplo",
    email: "profissional@exemplo.com",
    phone: "(11) 99999-9999",
    specialty: "Barbeiro",
    bio: "Especialista em cortes clássicos e barbas bem feitas. Mais de 10 anos de experiência no mercado.",
    services: ["Corte de Cabelo", "Barba", "Tratamentos Capilares"],
    workingHours: {
      monday: ["09:00", "18:00"],
      tuesday: ["09:00", "18:00"],
      wednesday: ["09:00", "18:00"],
      thursday: ["09:00", "18:00"],
      friday: ["09:00", "18:00"],
      saturday: ["10:00", "15:00"],
      sunday: [],
    },
  });

  const [newService, setNewService] = useState("");

  const addService = () => {
    if (newService.trim() && !profile.services.includes(newService.trim())) {
      setProfile({
        ...profile,
        services: [...profile.services, newService.trim()],
      });
      setNewService("");
    }
  };

  const removeService = (serviceToRemove: string) => {
    setProfile({
      ...profile,
      services: profile.services.filter(
        (service) => service !== serviceToRemove,
      ),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meus Dados Profissionais</CardTitle>
        <CardDescription>
          Atualize suas informações e preferências de trabalho
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(event) =>
                  setProfile({ ...profile, name: event.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(event) =>
                  setProfile({ ...profile, email: event.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(event) =>
                  setProfile({ ...profile, phone: event.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialty">Especialidade</Label>
              <Select
                value={profile.specialty}
                onValueChange={(value) =>
                  setProfile({ ...profile, specialty: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione sua especialidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Barbeiro">Barbeiro</SelectItem>
                  <SelectItem value="Cabeleireiro">Cabeleireiro</SelectItem>
                  <SelectItem value="Esteticista">Esteticista</SelectItem>
                  <SelectItem value="Manicure">Manicure</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Biografia</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(event) =>
                setProfile({ ...profile, bio: event.target.value })
              }
              rows={3}
              placeholder="Fale um pouco sobre sua experiência e especialidades..."
            />
          </div>

          <div className="space-y-2">
            <Label>Serviços Oferecidos</Label>
            <div className="flex flex-wrap gap-2">
              {profile.services.map((service) => (
                <Badge
                  key={service}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  {service}
                  <button
                    type="button"
                    onClick={() => removeService(service)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <Input
                value={newService}
                onChange={(event) => setNewService(event.target.value)}
                placeholder="Adicionar novo serviço"
              />
              <Button type="button" variant="outline" onClick={addService}>
                Adicionar
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Horário de Trabalho</Label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(profile.workingHours).map(([day, hours]) => (
                <div key={day} className="space-y-2">
                  <Label className="capitalize">{day}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="time"
                      value={hours[0] || ""}
                      onChange={(event) => {
                        const newHours = [...hours];
                        newHours[0] = event.target.value;
                        setProfile({
                          ...profile,
                          workingHours: {
                            ...profile.workingHours,
                            [day]: newHours,
                          },
                        });
                      }}
                      disabled={day === "sunday" && hours.length === 0}
                    />
                    <Input
                      type="time"
                      value={hours[1] || ""}
                      onChange={(event) => {
                        const newHours = [...hours];
                        newHours[1] = event.target.value;
                        setProfile({
                          ...profile,
                          workingHours: {
                            ...profile.workingHours,
                            [day]: newHours,
                          },
                        });
                      }}
                      disabled={day === "sunday" && hours.length === 0}
                    />
                    {day === "sunday" && (
                      <Button
                        type="button"
                        variant={hours.length === 0 ? "outline" : "destructive"}
                        size="sm"
                        onClick={() => {
                          setProfile({
                            ...profile,
                            workingHours: {
                              ...profile.workingHours,
                              sunday:
                                hours.length === 0 ? ["09:00", "13:00"] : [],
                            },
                          });
                        }}
                      >
                        {hours.length === 0 ? "Trabalha?" : "Não trabalha"}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline">Cancelar</Button>
            <Button type="submit">Salvar Alterações</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

