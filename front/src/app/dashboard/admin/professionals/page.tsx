"use client";

import { ProfessionalSection } from "@/features/dashboard/admin/professionals/components/professional-section";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

export default function ProfessionalsPage() {
  return (
    <div className="h-full space-y-6 p-6">
      <div>
        <div className="flex items-center gap-2">
          <Users className="h-8 w-8 text-stone-600" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-stone-900">
              Funcionários
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              Gerencie todos os profissionais e suas informações
            </p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ProfessionalSection />
      </motion.div>
    </div>
  );
}
