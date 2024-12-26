
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { GenerateReportForm } from "@/components/reports/GenerateReportForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


export const metadata = constructMetadata({
  title: "Report Create – StructIQ",
  description: "Create and manage reports.",
});

export default async function DashboardPage() {

  return (
    <>

      <div className="flex justify-between flex-wrap items-center">
        <DashboardHeader
          heading="Report Create"
        />
        <div>
          <Link href={"/reports/"}>
            <Button>
              <ArrowLeft /> Back
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>Generate Report</CardHeader>
        <CardContent>
          <GenerateReportForm />
        </CardContent>
      </Card>

    </>
  );
}
