import { X } from 'lucide-react'
import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'

import { updateUser } from '@/api/users'
import { User } from '@/models/UserModel'

import { Button } from './ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'

interface Props {
  show: boolean
  data: User
  handleClose: () => void
}

export function EditModalUser({ show, handleClose, data }: Props) {
  const [user, setUsers] = useState<User | null>(data)

  const queryClient = useQueryClient()

  const { isLoading, mutate } = useMutation(() => updateUser(user!.id, user!), {
    onSuccess: () => {
      queryClient.invalidateQueries('users-list')
      handleClose()
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsers((prevUser) => {
      // Verifique se prevUser não é null
      if (!prevUser) return prevUser

      return {
        ...prevUser,
        [e.target.name]: e.target.value,
      }
    })
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // mutation.mutate()
    mutate()
  }

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atualizar usuario</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="w-full space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={user.name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="text"
              value={user.phone}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Adress</Label>
            <Input
              id="adress"
              name="adress"
              type="text"
              value={user.adress}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-end gap-4">
            <DialogClose>
              <Button variant="outline">
                <X className="size-3" />
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">
              {/* <Button onClick={() => mutate()}> */}
              {isLoading ? 'Carregando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
