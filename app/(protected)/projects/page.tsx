
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ProjectsDataTable } from "@/components/Projects/ProjectsList";

export const metadata = constructMetadata({
  title: "Projects – StructIQ",
  description: "Create and manage projects.",
});

export default async function DashboardPage() {

  return (
    <>

      <div className="flex justify-between flex-wrap items-center">
        <DashboardHeader
          heading="Projects"
        />
        <div>
          <Link href={"/projects/create"}>
            <Button>
              <Plus /> Start a New Project
            </Button>
          </Link>
        </div>
      </div>

      <ProjectsDataTable />

    </>
  );
}
