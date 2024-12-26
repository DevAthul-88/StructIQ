import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { NewProjectForm } from "@/components/Projects/CreateForm";

export const metadata = constructMetadata({
  title: "Project Create – StructIQ",
  description: "Create and manage projects.",
});

export default async function DashboardPage() {

  return (
    <>

      <div className="flex justify-between flex-wrap items-center">
        <DashboardHeader
          heading="Projects Create"
        />
        <div>
          <Link href={"/projects/"}>
            <Button>
              <ArrowLeft /> Back
            </Button>
          </Link>
        </div>
      </div>

      <NewProjectForm />

    </>
  );
}
