"use client";

import { HolidaysSection } from "@/features/dashboard/professional/components/settings/holidays/components/holidays-section";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

export default function HolidaysPage() {
  return (
    <div className="h-full space-y-6 p-6">
      <div>
        <div className="flex items-center gap-2">
          <Briefcase className="h-8 w-8 text-stone-600" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-stone-900">
              Feriados e Folgas
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              Gerencie suas folgas, feriados e dias de ausência
            </p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <HolidaysSection />
      </motion.div>
    </div>
  );
}
