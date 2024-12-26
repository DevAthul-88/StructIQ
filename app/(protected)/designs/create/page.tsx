
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import NewDesignForm from "@/components/Design/NewDesignForm";
export const metadata = constructMetadata({
  title: "Designs – StructIQ",
  description: "Create and manage designs.",
});

export default async function DashboardPage() {

  return (
    <>

      <div className="flex justify-between flex-wrap items-center">
        <DashboardHeader
          heading="Designs Create"
        />
        <div>
          <Link href={"/designs/"}>
            <Button>
              <ArrowLeft /> Back
            </Button>
          </Link>
        </div>
      </div>

      <NewDesignForm />

    </>
  );
}
