"use client";

import { BusinessHoursSection } from "@/features/dashboard/professional/components/settings/business-hours/components/business-hours-section";
import { PageHeader } from "@/shared/components/ui/page-header";
import { motion } from "framer-motion";
import { ClockIcon } from "@phosphor-icons/react";

export default function BusinessHoursPage() {
  return (
    <div className="h-full space-y-8 p-6">
      <PageHeader
        icon={ClockIcon}
        kicker="Configurações · Horários"
        title="Horários de atendimento"
        description="Configure seus horários de funcionamento durante a semana."
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <BusinessHoursSection />
      </motion.div>
    </div>
  );
}
