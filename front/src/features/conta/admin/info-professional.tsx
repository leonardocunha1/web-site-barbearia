"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Column, GenericTable } from "@/components/table/generic-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

type Profissional = {
  id: string;
  nome: string;
  email: string;
  funcao: string;
};

const profissionaisMock: Profissional[] = [
  {
    id: "1",
    nome: "João Pedro",
    email: "joao@example.com",
    funcao: "Cabeleireiro",
  },
  {
    id: "2",
    nome: "Amanda Lima",
    email: "amanda@example.com",
    funcao: "Manicure",
  },
];

export function InfoProfissionalSection() {
  const [profissionais, setProfissionais] =
    useState<Profissional[]>(profissionaisMock);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", funcao: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const novo = {
      id: crypto.randomUUID(),
      ...form,
    };
    setProfissionais((prev) => [...prev, novo]);
    setForm({ nome: "", email: "", funcao: "" });
    setOpen(false);
  };

  const columns: Column<Profissional>[] = [
    { header: "Nome", accessor: "nome" },
    { header: "Email", accessor: "email" },
    { header: "Função", accessor: "funcao" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Profissionais</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Cadastrar Profissional</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Profissional</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="funcao">Função</Label>
                <Input
                  id="funcao"
                  value={form.funcao}
                  onChange={(e) => setForm({ ...form, funcao: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="mt-4 w-full">
                Cadastrar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-5 shadow">
        <GenericTable
          data={profissionais}
          columns={columns}
          emptyMessage="Nenhum profissional cadastrado"
          rowKey="id"
          className="rounded-lg border"
          headerClassName="bg-gray-50"
        />
      </Card>
    </div>
  );
}
