import Container from "@/components/ui/container";
import { Faq } from "@/features/home/faq";
import Hero from "@/features/home/hero";
import { MarqueeDetails } from "@/features/home/marquee";
import SejaUmBigodon from "@/features/home/seja-um-bigodon";
import Servicos from "@/features/home/servicos";

export default function Page() {
  return (
    <div className="from-principal-50 to-principal-100 mt-[-104px] flex flex-1 flex-col items-center overflow-x-hidden bg-gradient-to-br pt-[104px]">
      <Container>
        <Hero />
      </Container>

      <MarqueeDetails />

      <Container>
        <SejaUmBigodon />
        <Servicos />
        <Faq />
      </Container>
    </div>
  );
}
