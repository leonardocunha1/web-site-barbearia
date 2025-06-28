import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ShineBorder } from "@/components/magicui/shine-border";

interface FaqItemProps {
  value: string;
  title: string;
  children: React.ReactNode;
}

export function FaqItem({ value, title, children }: FaqItemProps) {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="px-6 py-4 transition-colors duration-200 hover:bg-stone-800">
        <span className="text-principal-400 text-base font-medium md:text-lg">
          {title}
        </span>
      </AccordionTrigger>

      {/* Container relativo para permitir ShineBorder absoluto */}
      <AccordionContent className="bg-principal-100 relative overflow-hidden px-6 py-4">
        <ShineBorder
          shineColor={["#000000", "#111111", "#222222"]}
          className="pointer-events-none" // para o efeito não interferir na interação
        />
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}
