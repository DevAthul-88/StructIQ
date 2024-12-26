import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { NewProjectForm } from "@/components/Projects/CreateForm";
import ProjectPage from "@/components/Projects/Details/DetailsMain";
import { EditProjectForm } from "@/components/Projects/EditForm";
import EditMain from "@/components/Projects/EditMain";

export const metadata = constructMetadata({
  title: "Project Edit – StructIQ",
  description: "Create and manage projects.",
});

export default async function Slug() {

  return (
    <>

      <div className="flex justify-between flex-wrap items-center">
        <DashboardHeader
          heading="Project Edit"
        />
        <div>
          <Link href={"/projects/"}>
            <Button>
              <ArrowLeft /> Back
            </Button>
          </Link>
        </div>
      </div>

      <EditMain />

    </>
  );
}
