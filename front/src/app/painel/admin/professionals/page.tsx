"use client";

import { ProfessionalSection } from "@/features/dashboard/admin/professionals/components/professional-section";
import { PageHeader } from "@/shared/components/ui/page-header";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

export default function ProfessionalsPage() {
  return (
    <div className="h-full space-y-6 p-6">
      <PageHeader
        icon={Users}
        title="Funcionários"
        description="Gerencie todos os profissionais e suas informações"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ProfessionalSection />
      </motion.div>
    </div>
  );
}
