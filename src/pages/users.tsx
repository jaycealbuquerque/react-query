import { Loader2, PencilLine, Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useSearchParams } from 'react-router-dom'

import { createUser, deleteUser, getAllUser } from '@/api/users'
import { EditModalUser } from '@/components/edit-modal-user'
import { Pagination } from '@/components/pagination'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { User } from '@/models/UserModel'

export function Users() {
  const [searchParams] = useSearchParams()

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1

  // const { data, isError, isLoading } = useQuery('user-list', getAllUser)
  const {
    data: usersResponse,
    isError,
    isLoading,
    isFetching,
  } = useQuery(['users-list', page], () => getAllUser(page), {
    keepPreviousData: true,
  })

  const [isOpen, setIsOpen] = useState(false)

  const [formData, setFormData] = useState({})

  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const queryClient = useQueryClient()

  const mutation = useMutation(createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users-list')
      setIsOpen(false)
      setFormData({})
    },
  })

  const handleChange = (e) => {
    setFormData((prevStat) => ({
      ...prevStat,
      [e.target.name]: e.target.value,
    }))
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()

    const formDataWithTimestamp = {
      ...formData,
      createdAt: new Date().toISOString(), // Gera o timestamp ao submeter
    }

    mutation.mutate(formDataWithTimestamp)
  }

  const mutationDelete = useMutation(deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users-list')
    },
  })

  const handleDelete = (id) => {
    mutationDelete.mutate(id)
  }

  return (
    <div>
      {isLoading && (
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="size-32 animate-spin text-zinc-500" />
        </div>
      )}
      <div className="space-y-8 py-10">
        {isError && (
          <div className="flex h-screen flex-col items-center justify-center bg-white text-center">
            <h1 className="mb-4 text-5xl font-bold text-zinc-950">404</h1>
            <p className="mb-6 text-xl text-zinc-700">
              Oops! A página que você está procurando não foi encontrada.
            </p>
          </div>
        )}
        <div></div>
        <main className="mx-auto max-w-6xl space-y-5">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">Users</h1>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger>
                <Button variant="default" onClick={() => setIsOpen(true)}>
                  <Plus className="size-3" />
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar usuario</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleFormSubmit} className="w-full space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Phone</Label>
                    <Input
                      id="name"
                      name="phone"
                      type="text"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Adress</Label>
                    <Input
                      id="name"
                      name="adress"
                      type="text"
                      value={formData.adress}
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
                    <Button type="submit">Save</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {isFetching && (
              <Loader2 className="size-4 animate-spin text-zinc-800" />
            )}
          </div>

          {/* <div className="flex items-center justify-between"></div> */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Adress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersResponse?.data.map((users) => {
                return (
                  <TableRow key={users.id}>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{users.id}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-zinc-500">
                          {users.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-zinc-500">
                          {users.phone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-zinc-500">
                          {users.adress}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="space-x-1.5 text-right">
                      <Button
                        size="icon"
                        variant={'link'}
                        onClick={() => setSelectedUser(users)}
                      >
                        <PencilLine className="size-4" />
                      </Button>
                      {selectedUser && (
                        <EditModalUser
                          data={selectedUser}
                          show={!!selectedUser}
                          handleClose={() => setSelectedUser(null)}
                        />
                      )}

                      <Button
                        size="icon"
                        variant={'link'}
                        onClick={() => handleDelete(users.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {usersResponse && (
            <Pagination
              pages={usersResponse.pages}
              items={usersResponse.items}
              page={page}
            />
          )}
        </main>
      </div>
    </div>
  )
}
