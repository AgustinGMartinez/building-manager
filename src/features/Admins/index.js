import React from 'react'
import { UsersTable } from 'components/UsersTable'
import { useFetch } from 'hooks/useFetch'

const Admins = () => {
  const [admins, loading, fetchAdmins] = useFetch({ url: '/users?admin=1' })
  const onCreateUser = () => {
    fetchAdmins()
  }

  return <UsersTable isAdmin data={admins} loading={loading} onCreateUser={onCreateUser} />
}

export { Admins }
