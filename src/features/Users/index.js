import React from 'react'
import { UsersTable } from 'components/UsersTable'
import { useFetch } from 'hooks/useFetch'

const Users = () => {
  const [users, loading, fetchUsers] = useFetch({ url: '/users' })

  return (
    <>
      <UsersTable
        isAdmin={false}
        data={users}
        loading={loading}
        onCreateUser={fetchUsers}
        onDeleteUser={fetchUsers}
      />
    </>
  )
}

export { Users }
