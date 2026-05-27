"use client";

import React from "react";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion } from "framer-motion";
import {
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  ArrowUpRightIcon,
} from "@phosphor-icons/react";

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const infoBlocks = [
  {
    label: "Endereço",
    value: "Rua Exemplo, 123",
    detail: "Centro · Poços de Caldas — MG",
    Icon: MapPinIcon,
  },
  {
    label: "Horário",
    value: "Ter — Sáb · 09h às 19h",
    detail: "Domingo e segunda fechado",
    Icon: ClockIcon,
  },
  {
    label: "Contato",
    value: "(35) 9 9999-9999",
    detail: "WhatsApp e telefone",
    Icon: PhoneIcon,
  },
];

export default function Location() {
  const position: [number, number] = [-20.5398626, -47.4012536];

  return (
    <section className="bg-background text-foreground border-foreground/15 relative w-full border-t border-b py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mx-auto max-w-7xl px-6 sm:px-8"
      >
        {/* Header */}
        <header className="grid grid-cols-12 gap-x-4 gap-y-6 md:gap-x-8">
          <div className="col-span-12 flex items-center gap-3 md:col-span-4">
            <span className="bg-foreground h-px w-8" aria-hidden />
            <span className="text-foreground/70 font-mono text-[10px] tracking-[0.3em] uppercase">
              Endereço · Cap. 04
            </span>
          </div>
          <h2 className="font-display text-foreground col-span-12 text-5xl leading-[0.95] font-medium tracking-tight md:col-span-8 md:text-7xl lg:text-[5.5rem]">
            No coração da{" "}
            <span className="text-cobre-700 italic">cidade</span>.
          </h2>
        </header>

        {/* Split postcard */}
        <div className="border-foreground/15 mt-16 grid grid-cols-12 border md:mt-20">
          {/* Left — info */}
          <div className="border-foreground/15 col-span-12 flex flex-col gap-12 p-8 md:col-span-5 md:border-r md:p-10 lg:p-12">
            <p className="text-foreground/75 max-w-[42ch] text-base md:text-lg">
              Café forte, conversa boa, ambiente sem pressa. Venha conhecer o
              ateliê — a porta está sempre aberta para um café.
            </p>

            <ul className="divide-foreground/15 divide-y">
              {infoBlocks.map(({ label, value, detail, Icon }) => (
                <li
                  key={label}
                  className="flex items-start gap-5 py-5 first:pt-0 last:pb-0"
                >
                  <Icon
                    weight="duotone"
                    className="text-cobre-700 size-6 shrink-0"
                  />
                  <div className="flex flex-col gap-1">
                    <span className="text-foreground/55 font-mono text-[10px] tracking-[0.25em] uppercase">
                      {label}
                    </span>
                    <span className="text-foreground font-display text-lg font-medium tracking-tight">
                      {value}
                    </span>
                    <span className="text-foreground/60 text-sm">
                      {detail}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${position[0]},${position[1]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group border-foreground inline-flex w-fit items-center gap-2 border-b pb-1 font-mono text-xs tracking-[0.25em] uppercase"
            >
              traçar rota
              <ArrowUpRightIcon
                weight="bold"
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>

          {/* Right — map */}
          <div className="bg-foreground relative col-span-12 h-[420px] overflow-hidden md:col-span-7 md:h-auto md:min-h-[560px]">
            <MapContainer
              center={position}
              zoom={16}
              scrollWheelZoom={false}
              className="h-full w-full"
              style={{ zIndex: 0 }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position}>
                <Popup>
                  El Bigodón Barber Shop — venha tomar um café.
                </Popup>
              </Marker>
            </MapContainer>

            {/* corner stamp */}
            <div className="bg-background/95 border-foreground/15 pointer-events-none absolute top-4 left-4 z-10 flex items-baseline gap-2 border px-3 py-1.5 backdrop-blur-sm">
              <span className="text-foreground/55 font-mono text-[9px] tracking-[0.25em] uppercase">
                Lat
              </span>
              <span className="font-display text-foreground text-sm font-medium tracking-tight">
                -20.539
              </span>
              <span className="text-foreground/30">·</span>
              <span className="text-foreground/55 font-mono text-[9px] tracking-[0.25em] uppercase">
                Lng
              </span>
              <span className="font-display text-foreground text-sm font-medium tracking-tight">
                -47.401
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
