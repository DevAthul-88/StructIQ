
import Changelog from "@/components/Changelog";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Changelog – StructIQ",
  description: "Explore our subscription plans.",
});

export default async function PricingPage() {

  return (
    <div className="flex w-full flex-col gap-16 py-8 md:py-8">
     <Changelog />
 
  
    </div>
  );
}
