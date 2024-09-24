import { api } from '@/lib/axios'
import { ResponseUser, User } from '@/models/UserModel'

export async function getAllUser(page: number): Promise<User[]> {
  const response = await api.get<ResponseUser[]>(
    `users?_page=${page}&_per_page=10`,
  )

  return response.data
}

export async function createUser(formData: User) {
  const response = await api.post<ResponseUser>(`users`, formData, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return response.data
}

export async function deleteUser(userId: string) {
  const response = await api.delete(`users/${userId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return response.data
}

export async function updateUser(userId: string, user: User): Promise<User> {
  const response = await api.patch(`users/${userId}`, user, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return response.data
}
