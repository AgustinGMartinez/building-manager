import React from 'react'
import { UsersTable } from 'components/UsersTable'
import { useFetch } from 'hooks/useFetch'

const Users = () => {
  const [users, loading, fetchUsers] = useFetch({ url: '/users' })
  const onCreateUser = () => {
    fetchUsers()
  }

  return <UsersTable isAdmin={false} data={users} loading={loading} onCreateUser={onCreateUser} />
}

export { Users }
