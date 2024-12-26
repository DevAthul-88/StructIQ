
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { Plus } from "lucide-react";
import Link from "next/link";
import { DesignProjectsTable } from "@/components/Design/DesignProjectsTable";
export const metadata = constructMetadata({
  title: "Designs – StructIQ",
  description: "Create and manage design.",
});

export default async function DashboardPage() {

  return (
    <>

      <div className="flex justify-between flex-wrap items-center">
        <DashboardHeader
          heading="Designs"
        />
        <div>
          <Link href={"/designs/create"}>
            <Button>
              <Plus /> Start a New Design
            </Button>
          </Link>
        </div>
      </div>

      <div>
        <DesignProjectsTable />
      </div>


    </>
  );
}
