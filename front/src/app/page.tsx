import Hero from "@/components/home/hero";
import { MarqueeDetails } from "@/components/home/marquee";

export default function Page() {
  return (
    <div className="from-principal-50 to-principal-100 mt-[-104px] flex flex-1 flex-col items-center overflow-x-hidden bg-gradient-to-br pt-[104px]">
      <div className="w-full max-w-7xl">
        <Hero />
      </div>
      <MarqueeDetails />
    </div>
  );
}
