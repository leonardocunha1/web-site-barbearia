"use client";

import CouponsSection from "@/features/dashboard/admin/coupons/components/coupons-section";
import { PageHeader } from "@/shared/components/ui/page-header";
import { motion } from "framer-motion";
import { Ticket } from "lucide-react";

export default function CouponsPage() {
  return (
    <div className="h-full space-y-6 p-6">
      <PageHeader
        icon={Ticket}
        title="Cupons de Desconto"
        description="Crie e gerencie cupons promocionais"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <CouponsSection />
      </motion.div>
    </div>
  );
}
