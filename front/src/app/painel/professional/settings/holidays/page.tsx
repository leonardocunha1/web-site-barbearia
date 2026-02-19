"use client";

import { HolidaysSection } from "@/features/dashboard/professional/components/settings/holidays/components/holidays-section";
import { PageHeader } from "@/shared/components/ui/page-header";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

export default function HolidaysPage() {
  return (
    <div className="h-full space-y-6 p-6">
      <PageHeader
        icon={Briefcase}
        title="Feriados e Folgas"
        description="Gerencie suas folgas, feriados e dias de ausência"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <HolidaysSection />
      </motion.div>
    </div>
  );
}
