import Container from "@/shared/components/ui/container";
import Reviews from "@/features/marketing/home/reviews";
import Hero from "@/features/marketing/home/hero";
import Location from "@/features/marketing/home/location";
import { MarqueeDetails } from "@/features/marketing/home/marquee";
import BecomeBigodon from "@/features/marketing/home/become-bigodon";
import Services from "@/features/marketing/home/services";
import { WhatsAppFloat } from "@/features/marketing/home/whatsapp-float";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col items-center overflow-x-hidden bg-gradient-to-br from-stone-100 to-stone-200 pt-[104px]">
      <Container>
        <Hero />
      </Container>

      <MarqueeDetails />

      <BecomeBigodon />

      <Container>
        <Services />
      </Container>

      <Location />

      <Container>
        <Reviews />
      </Container>

      <WhatsAppFloat />
    </div>
  );
}

