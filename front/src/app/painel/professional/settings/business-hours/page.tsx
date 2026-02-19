"use client";

import { BusinessHoursSection } from "@/features/dashboard/professional/components/settings/business-hours/components/business-hours-section";
import { PageHeader } from "@/shared/components/ui/page-header";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

export default function BusinessHoursPage() {
  return (
    <div className="h-full space-y-6 p-6">
      <PageHeader
        icon={Clock}
        title="Horários de Atendimento"
        description="Configure seus horários de funcionamento durante a semana"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <BusinessHoursSection />
      </motion.div>
    </div>
  );
}
