"use client";

import { BusinessHoursSection } from "@/features/dashboard/professional/components/settings/business-hours/components/business-hours-section";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

export default function BusinessHoursPage() {
  return (
    <div className="h-full space-y-6 p-6">
      <div>
        <div className="flex items-center gap-2">
          <Clock className="h-8 w-8 text-stone-600" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-stone-900">
              Horários de Atendimento
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              Configure seus horários de funcionamento durante a semana
            </p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <BusinessHoursSection />
      </motion.div>
    </div>
  );
}
