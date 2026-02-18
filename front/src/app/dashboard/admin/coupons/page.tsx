"use client";

import CouponsSection from "@/features/dashboard/admin/coupons/components/coupons-section";
import { motion } from "framer-motion";
import { Ticket } from "lucide-react";

export default function CouponsPage() {
  return (
    <div className="h-full space-y-6 p-6">
      <div>
        <div className="flex items-center gap-2">
          <Ticket className="h-8 w-8 text-stone-600" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-stone-900">
              Cupons de Desconto
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              Crie e gerencie cupons promocionais
            </p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <CouponsSection />
      </motion.div>
    </div>
  );
}
