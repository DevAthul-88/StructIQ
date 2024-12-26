'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'

interface AddManagerModalProps {
  isOpen: boolean
  onClose: () => void
  onAddManager: (managerName: string) => void,
  loading: boolean
}

export function AddManagerModal({ isOpen, onClose, onAddManager,loading }: AddManagerModalProps) {
  const [newManager, setNewManager] = useState('')

  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newManager.trim()) {
      onAddManager(newManager.trim());
      setNewManager('')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Manager</DialogTitle>
          <DialogDescription>
            Enter the name of the new project manager to add to the list.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input
                id="name"
                value={newManager}
                onChange={(e) => setNewManager(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="animate-spin" />}
              Add Manager</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

