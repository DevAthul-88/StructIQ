
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { DesignHistoryTable } from "@/components/Design/DesignHistoryTable";

export const metadata = constructMetadata({
    title: "Designs History – StructIQ",
    description: "Create and manage design.",
});

export default async function DashboardPage() {

    return (
        <>

            <div className="flex justify-between flex-wrap items-center">
                <DashboardHeader
                    heading="Designs History"
                />
                <div>
                    <Link href={"/designs/"}>
                        <Button>
                            <ArrowLeft /> Back
                        </Button>
                    </Link>
                </div>
            </div>


            <DesignHistoryTable />

        </>
    );
}
