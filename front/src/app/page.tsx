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
    <div className="bg-background text-foreground relative flex flex-1 flex-col items-center overflow-x-hidden pt-[104px]">
      {/* subtle paper grain */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)",
          backgroundSize: "3px 3px",
        }}
      />

      <div className="relative z-10 flex w-full flex-col items-center">
        <Container>
          <Hero />
        </Container>

        <MarqueeDetails />

        <Container>
          <Services />
        </Container>

        <BecomeBigodon />

        <Location />

        <Container>
          <Reviews />
        </Container>

        <WhatsAppFloat />
      </div>
    </div>
  );
}
