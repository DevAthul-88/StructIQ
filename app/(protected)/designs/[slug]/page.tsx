
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import Details from "@/components/Design/Details";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { getCurrentUser } from "@/lib/session";
export const metadata = constructMetadata({
  title: "Design – StructIQ",
  description: "Create and manage design.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();
 const subscription = await getUserSubscriptionPlan(user?.id);
  return (
    <>

      <div className="flex justify-between flex-wrap items-center">
        <DashboardHeader
          heading="Design"
        />
        <div>
          <Link href={"/designs/"}>
            <Button>
              <ArrowLeft /> Back
            </Button>
          </Link>
        </div>
      </div>

      <Details subscription={subscription} />
    </>
  );
}
