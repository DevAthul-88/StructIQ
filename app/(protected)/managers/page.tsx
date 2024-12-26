
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { Plus } from "lucide-react";
import Link from "next/link";
import { DesignProjectsTable } from "@/components/Design/DesignProjectsTable";
import { ManagersDataTable } from "@/components/managers/managers-data-table";
export const metadata = constructMetadata({
  title: "Managers – StructIQ",
  description: "Create and manage managers.",
});

export default async function DashboardPage() {

  return (
    <>

      <div className="flex justify-between flex-wrap items-center">
        <DashboardHeader
          heading="Managers"
        />
        <div>
        </div>
      </div>

      <div>
         <ManagersDataTable />
      </div>


    </>
  );
}
