import React from 'react'
import { UsersTable } from 'components/UsersTable'
import { useFetch } from 'hooks/useFetch'

const Admins = () => {
  const [admins, loading, fetchAdmins] = useFetch({ url: '/admins' })

  return (
    <UsersTable
      isAdmin
      data={admins}
      loading={loading}
      onCreateUser={fetchAdmins}
      onDeleteUser={fetchAdmins}
    />
  )
}

export { Admins }
