import React, { useState } from "react"
import { UsersTable } from "components/UsersTable"
import { useGetUsers } from "../../hooks/useGetUsers"

const Admins = () => {
  const [newUserTrigger, setNewUserTrigger] = useState(0)
  const [admins, loading] = useGetUsers(true, newUserTrigger)
  const onCreateUser = () => {
    setNewUserTrigger(val => ++val)
  }

  return (
    <UsersTable
      isAdmin
      data={admins}
      loading={loading}
      onCreateUser={onCreateUser}
    />
  )
}

export { Admins }
