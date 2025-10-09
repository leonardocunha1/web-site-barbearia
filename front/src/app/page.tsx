import Container from "@/components/ui/container";
import Feedbacks from "@/features/home/feedbacks";
import Hero from "@/features/home/hero";
import Localizacao from "@/features/home/localizacao";
import { MarqueeDetails } from "@/features/home/marquee";
import SejaUmBigodon from "@/features/home/seja-um-bigodon";
import Servicos from "@/features/home/servicos";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col items-center overflow-x-hidden bg-gradient-to-br from-stone-100 to-stone-200 pt-[104px]">
      <Container>
        <Hero />
      </Container>

      <MarqueeDetails />

      <SejaUmBigodon />

      <Container>
        <Servicos />
      </Container>

      <Localizacao />

      <Container>
        <Feedbacks />
      </Container>
    </div>
  );
}
