'use client'

import { useState } from 'react'
import axios from 'axios'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Manager } from '../data/managers'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

type EditNameDialogProps = {
  manager: Manager
  onClose: () => void
  onUpdate: (id: string, newName: string) => Promise<void>
  setCount: (count: number) => void
  count: number
}

export function EditNameDialog({ manager, onClose, onUpdate, setCount, count }: EditNameDialogProps) {
  const [name, setName] = useState(manager.name)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await axios.put('/api/projects/managers/edit', { id: manager.id, newName: name })
      setCount(count + 1)
      onClose()
      toast.success('Manager successfully edited')
    } catch (err) {
      setError('Failed to update manager name. Please try again.')
      toast.error('Failed to update manager name. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Manager</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="animate-spin" />} Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
