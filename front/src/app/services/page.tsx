"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useUser } from "@/contexts/user";
import { BookingFormWizard } from "@/features/bookings";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { User } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Page() {
  const { user } = useUser();

  return (
    <section className="min-h-[calc(100vh-96px)] px-4 pt-[124px] pb-16 sm:px-6 lg:px-10">
      <motion.div
        className="mx-auto flex w-full flex-col gap-8"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div className="space-y-6" variants={fadeInUp}>
          {!user && (
            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="border-principal-200 from-principal-50 bg-gradient-to-r to-white shadow-lg">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-principal-100 rounded-full p-2">
                      <User className="text-principal-600 h-4 w-4" />
                    </div>
                    <p className="text-sm font-medium text-stone-700">
                      Para finalizar o agendamento, voce precisa estar logado.
                    </p>
                  </div>
                  <Button
                    asChild
                    className="from-principal-600 to-principal-500 hover:from-principal-700 hover:to-principal-600 w-full bg-gradient-to-r"
                  >
                    <Link href="/login">Entrar ou criar conta</Link>
                  </Button>
                  <p className="text-muted-foreground animate-pulse text-center text-xs">
                    Seus dados preenchidos ficam salvos.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          variants={fadeInUp}
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card className="overflow-hidden border-stone-200 bg-white shadow-2xl">
            <div className="from-principal-400 to-principal-600 h-2 w-full bg-gradient-to-r" />
            <CardContent className="space-y-6 p-6 sm:p-8">
              <motion.div
                className="space-y-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-stone-900 sm:text-2xl">
                  Preencha seu agendamento
                </h2>
                <p className="text-muted-foreground text-sm">
                  Siga os passos para confirmar sua reserva.
                </p>
              </motion.div>
              <BookingFormWizard className="w-full" />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
}
