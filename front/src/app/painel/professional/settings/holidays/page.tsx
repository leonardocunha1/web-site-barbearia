"use client";

import { HolidaysSection } from "@/features/dashboard/professional/components/settings/holidays/components/holidays-section";
import { PageHeader } from "@/shared/components/ui/page-header";
import { motion } from "framer-motion";
import { UmbrellaIcon } from "@phosphor-icons/react";

export default function HolidaysPage() {
  return (
    <div className="h-full space-y-8 p-6">
      <PageHeader
        icon={UmbrellaIcon}
        kicker="Configurações · Folgas"
        title="Feriados e folgas"
        description="Gerencie suas folgas, feriados e dias de ausência."
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <HolidaysSection />
      </motion.div>
    </div>
  );
}
