"use client";

import ServicesSection from "@/features/dashboard/admin/services/components/services-section";
import { PageHeader } from "@/shared/components/ui/page-header";
import { motion } from "framer-motion";
import { Scissors } from "lucide-react";

export default function ServicesPage() {
  return (
    <div className="h-full space-y-6 p-6">
      <PageHeader
        icon={Scissors}
        title="Serviços"
        description="Cadastre e gerencie os serviços oferecidos"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ServicesSection />
      </motion.div>
    </div>
  );
}
