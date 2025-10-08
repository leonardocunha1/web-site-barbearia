"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Correção do ícone padrão do Leaflet (Next.js + Webpack precisa disso)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export default function Localizacao() {
  // Coordenadas da empresa
  const position: [number, number] = [-23.55052, -46.633308]; // exemplo: São Paulo, SP

  return (
    <section className="w-full bg-stone-900 px-8 py-16">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="font-calistoga text-4xl font-bold text-stone-100 sm:text-5xl">
          Encontre-nos
        </h2>
        <p className="mt-4 text-stone-300">
          Nossa barbearia está localizada no coração da cidade. Venha nos
          visitar e experimente o melhor atendimento.
        </p>
      </div>

      <div className="mt-12 mx-auto max-w-5xl h-[500px] rounded-2xl overflow-hidden shadow-lg">
        <MapContainer
          center={position}
          zoom={16}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              Aqui está a nossa barbearia! <br /> Venha nos visitar.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </section>
  );
}
