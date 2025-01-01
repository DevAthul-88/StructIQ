'use client'

import { useEffect, useState } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'


import { EditNameDialog } from './edit-name-dialog'
import { DeleteConfirmationDialog } from './delete-confirmation-dialog'
import axios from 'axios'
import { toast } from 'sonner'
import { Badge } from '../ui/badge'
import { AddManagerModal } from '../Projects/AddManagerModal'
import { Spinner } from '../ui/spinner'

export function ManagersDataTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [managers, setManagers] = useState<Manager[]>([])
  const [editingManager, setEditingManager] = useState<Manager | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [managerToDelete, setManagerToDelete] = useState<Manager | null>(null)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAddManagerModalOpen, setIsAddManagerModalOpen] = useState(false)
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [count , setCount] = useState(0);

  async function deleteManager(id: string) {
    // In a real application, you would delete the manager from your database here
    console.log(`Deleting manager with id: ${id}`)
    // For this example, we'll just return a success message
    return { success: true, message: `Manager with id ${id} deleted successfully` }
  }




  const columns: ColumnDef<Manager>[] = [
    {
      id: 'select',
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
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => <div>
        <Badge>Manager</Badge>
      </div>,
    },

    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const manager = row.original

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
              <DropdownMenuItem onClick={() => setEditingManager(manager)}>
                Edit name
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDelete(manager)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: managers,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  const handleDelete = async (manager: Manager) => {
    setManagerToDelete(manager)
    setDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (managerToDelete) {
      await deleteManager(managerToDelete.id)
      setManagers(managers.filter(m => m.id !== managerToDelete.id))
      setDeleteConfirmOpen(false)
      setManagerToDelete(null)
    }
  }

  const handleNameUpdate = (id: string, newName: string) => {
    setManagers(managers.map(manager =>
      manager.id === id ? { ...manager, name: newName } : manager
    ))
    setEditingManager(null)
  }

  const handleAddManager = async (managerName) => {
    setLoading1(true)
    setError(null)

    try {

      await axios.post('/api/projects/managers/create', { managerName })

      const response = await axios.get('/api/projects/managers')
      setManagers(response.data)

      toast.info(`${managerName} has been added to the list of project managers.`)
      setIsAddManagerModalOpen(false);
      setCount(count+1)
      setLoading(false)
      setLoading1(false)

    } catch (error) {
      toast(`Failed to add manager. Please try again later.`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        setLoading2(true)
        const response = await axios.get('/api/projects/managers');
        setManagers(response.data);
      } catch (err) {
        setError('Failed to fetch managers');
        toast.info(`We're still working on the search.`)
      } finally {
        setLoading2(false);
      }
    };

    fetchManagers();
  }, [count]);

  if(loading2){
    return <div className='pt-40'>
      <Spinner />
    </div>
  }

  return (
    <div className="w-full">

      <AddManagerModal
        isOpen={isAddManagerModalOpen}
        onClose={() => setIsAddManagerModalOpen(false)}
        onAddManager={handleAddManager}
        loading={loading1}
      />

      <div className="flex items-center py-4">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <Button className="ml-auto"  onClick={() => setIsAddManagerModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Manager
        </Button>

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
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No managers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
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
      {editingManager && (
        <EditNameDialog
          manager={editingManager}
          onClose={() => setEditingManager(null)}
          onUpdate={handleNameUpdate}
          setCount={setCount}
          count={count}
        />
      )}
      {managerToDelete && (
        <DeleteConfirmationDialog
          isOpen={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
          managerName={managerToDelete.name}
          managerId={managerToDelete}
          setCount={setCount}
          count={count}
        />
      )}
    </div>
  )
}

