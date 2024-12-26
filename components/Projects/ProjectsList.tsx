"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Info } from 'lucide-react'
import { useSession } from "next-auth/react"
import axios from "axios"
import { Spinner } from "../ui/spinner"
import { toast } from "sonner"
import Link from "next/link"
import { create } from "zustand"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export type Project = {
  id: string
  projectName: string
  type: string
  status: 'Planning' | 'In Progress' | 'Completed'
  manager: string
  startDate: string
  endDate: string
  budget: number
  isActive: boolean
}

const userCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 }))
}))

export const columns: ColumnDef<Project>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "projectName",
    header: "Project Name",
    cell: ({ row }) => {
      const project = row.original;
      return (

        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="capitalize">
              <Link href={`/projects/${project?.id}`}>{row.getValue("projectName")}</Link>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
              {project?.description}
          </HoverCardContent>
        </HoverCard>


      )
    },
  },
  {
    accessorKey: "projectType",
    header: "Type",
    cell: ({ row }) => <div className="capitalize">{row.getValue("projectType")}</div>,
  },
  {
    accessorKey: "projectStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("projectStatus") as string;
      const getStatusColor = (status: string) => {
        switch (status) {
          case 'Planning':
            return 'bg-yellow-500';
          case 'In Progress':
            return 'bg-blue-500';
          case 'Completed':
            return 'bg-green-500';
          default:
            return 'bg-gray-500';
        }
      };
      return (
        <Badge className={`${getStatusColor(status)} text-white`}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "manager",  // This refers to the manager object
    header: "Manager",
    cell: ({ row }) => {
      const manager = row.getValue("manager");
      return <div>{manager?.name || "No Manager"}</div>;  // Safely access the name
    },
  },
  {
    accessorKey: "startDate",
    header: "Timeline",
    cell: ({ row }) => {
      const startDate = row.original.startDate;
      const endDate = row.original.endDate;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <Info className="h-4 w-4" />
                <span className="sr-only">Project timeline</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Start: {new Date(startDate).toLocaleDateString()}</p>
              <p>End: {new Date(endDate).toLocaleDateString()}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "budget",
    header: () => <div className="text-right">Budget</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("budget"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const project = row.original;
      const [isOpen, setIsOpen] = React.useState(false);
      const [isDeleting, setIsDeleting] = React.useState(false);
      const { increment } = userCounterStore();

      const handleDeleteProject = async (projectId: string) => {
        setIsDeleting(true);
        try {
          // Replace with actual API call for project deletion
          await fetch(`/api/projects/delete/${projectId}`, {
            method: "DELETE",
          });
          toast.success("Project deleted successfully!");
          setIsDeleting(false);
          setIsOpen(false);
          increment();
        } catch (error) {
          console.error("Error deleting project:", error);
          toast.error("Failed to delete project.");
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(project.id);
                toast.success("Project ID copied to clipboard!");
              }}
            >
              Copy project ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/projects/${project?.id}`}>
                View details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/projects/edit/${project?.id}`}>
                Edit project
              </Link>
            </DropdownMenuItem>
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-destructive focus:text-destructive"
                >
                  Delete project
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    project and remove all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setIsOpen(false)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteProject(project.id)}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Delete Project"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  },
];



export function ProjectsDataTable() {
  const [projects, setProjects] = React.useState([]);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const { count } = userCounterStore();

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const { data: session } = useSession();
  const user = session?.user;

  const table = useReactTable({
    data: projects,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {

      const response = await axios.get(
        `/api/projects/list/${user?.id}`
      );
      setProjects(response.data.data);
      console.log(response.data);

    } catch (err) {
      setError(
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
  }, [user, count]);


  return (

    <>
      {loading == true ? <div className=" pt-40"><Spinner /></div> : <>
        <div className="w-full">
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter projects..."
              value={(table.getColumn("projectName")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("projectName")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No projects found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </>}
    </>

  )
}

