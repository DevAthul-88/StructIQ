
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ReportsList } from "@/components/reports/ReportsList";
 
export const metadata = constructMetadata({
  title: "Reports – StructIQ",
  description: "Create and manage reports.",
});

export default async function DashboardPage() {

  return (
    <>

      <div className="flex justify-between flex-wrap items-center">
        <DashboardHeader
          heading="Reports"
        />
        <div>
          <Link href={"/reports/create"}>
            <Button>
              <Plus /> Generate a New Report
            </Button>
          </Link>
        </div>
      </div>

       <ReportsList />
 
    </>
  );
}
