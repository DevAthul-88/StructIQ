// Frontend: report-form.tsx
"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { generateReport } from "./actions"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "next-auth/react"
import axios from "axios"
import { Skeleton } from "../ui/skeleton"
import { useRouter } from "next/navigation"


const formSchema = z.object({
    project: z.string({
        required_error: "Please select a project.",
    }),
    command: z.string().optional(),
})

export function GenerateReportForm() {

    const [projects, setProjects] = React.useState([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error1, setError1] = React.useState<string | null>(null);
    const { data: session } = useSession();
    const user = session?.user;
    const router = useRouter()

    const [isLoading, setIsLoading] = React.useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            project: "",
            command: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            const response = await axios.post('/api/reports', values, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            toast.success("Report Generated", {
                description: "Your report has been successfully generated.",
            })

            form.reset()

            console.log(response);
            

            if (response.data?.report?.id) {
                // Add a small delay to allow the success toast to be visible
                setTimeout(() => {
                  router.push(`/reports/${response.data.report.id}`)
                }, 1000)
              } else {
                throw new Error("No report ID received")
              }
        

        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error("Error", {
                    description: error.response?.data?.error || "There was a problem generating your report.",
                })
            } else {
                toast.error("Error", {
                    description: "There was a problem generating your report.",
                })
            }
        } finally {
            setIsLoading(false)
        }
    }


    const fetchProjects = async () => {
        setLoading(true);
        setError1(null);
        try {

            const response = await axios.get(
                `/api/projects/list/${user?.id}`
            );
            setProjects(response.data.data);
        } catch (err) {
            setError1(
                err.response?.data?.error ||
                'An unexpected error occurred while fetching projects'
            );
            setProjects([]);
        } finally {
            setLoading(false);
        }
    };

    // Initial and filtered fetch
    React.useEffect(() => {
        if (user) {
            fetchProjects();
        }
    }, [user]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="project"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Project</FormLabel>
                            {loading ? <Skeleton className="h-[45px] w-full rounded-xl" /> : <>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a project" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {projects.map((project) => (
                                            <SelectItem key={project.id} value={project.id}>
                                                {project.projectName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </>}
                            <FormDescription>
                                Select the project for which you want to generate a report.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="command"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Custom Command (Optional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter your custom command here..."
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Optionally enter a custom command to generate your report.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={isLoading} type="submit">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate Report
                </Button>
            </form>
        </Form>
    )
}