"use client"

import * as React from "react"
import { AlertCircle, Eye, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Spinner } from "../ui/spinner"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { useParams } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"

interface Design {
  id: string
  datetime: string
  version: number
}

export function DesignHistoryTable() {
  const [designs, setDesigns] = React.useState<Design[]>([])
  const [viewDesign, setViewDesign] = React.useState<Design | null>(null)
  const [deleteDesign, setDeleteDesign] = React.useState<Design | null>(null)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string | null>(null)
  const params = useParams();
 
  

  React.useEffect(() => {
    const fetchDesigns = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/design/history?projectId=${params?.id}`)
        if (!res.ok) {
          throw new Error('Failed to fetch designs')
        }
        const data = await res.json()
        setDesigns(data)
      } catch (err) {
        setError('Failed to load designs')
      } finally {
        setLoading(false)
      }
    }

    fetchDesigns()
  }, [params])

  const handleView = (design: Design) => {
    setViewDesign(design)
  }

  const handleDelete = (design: Design) => {
    setDeleteDesign(design)
  }

  const confirmDelete = async () => {
    if (deleteDesign) {
      try {
        setLoading(true)
        const res = await fetch(`/api/design/delete`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: deleteDesign.id }),
        })

        if (!res.ok) {
          throw new Error('Failed to delete design')
        }

        // Remove the design from the list after successful deletion
        setDesigns((prevDesigns) => prevDesigns.filter((design) => design.id !== deleteDesign.id))
        setDeleteDesign(null)
        toast.success("Design deleted successfully");
      } catch (err) {
        toast.error('Failed to delete design');
      } finally {
        setLoading(false)
      }
    }
  }


  if (loading) {
    return <div className="p-4 text-center pt-40">
      <Spinner />
    </div>;
  }

  if (error) {
    return (
      <div className="pt-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Something went wrong, please try agian later
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const generateVersionNumber = (index: number): string => {
    const majorVersion = Math.floor(index / 20) + 1  // Major version increments every 20 designs
    const minorVersion = (index % 20) + 1  // Minor version resets every time the major version increases
    return `v${majorVersion}.${minorVersion}`
  }
  

  return (
    <div className="w-full rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Version</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {designs.length > 0 ? (
            designs.map((design, index) => (
              <TableRow key={design.id}>
                <TableCell>{new Date(design.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(design.createdAt).toLocaleTimeString()}</TableCell>
                <TableCell>{generateVersionNumber(index)}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/designs/${design?.id}`}>
                  <Button variant="outline" size="sm" className="mr-2">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View design</span>
                  </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(design)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete design</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">No designs found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* View Design Dialog */}
      <Dialog open={!!viewDesign} onOpenChange={() => setViewDesign(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>View Design</DialogTitle>
            <DialogDescription>
              {viewDesign && (
                <>
                  <p>Date: {new Date(viewDesign.datetime).toLocaleDateString()}</p>
                  <p>Time: {new Date(viewDesign.datetime).toLocaleTimeString()}</p>
                  <p>Version: {viewDesign.version}</p>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Delete Design Alert */}
      <AlertDialog open={!!deleteDesign} onOpenChange={() => setDeleteDesign(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this design?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the design.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
