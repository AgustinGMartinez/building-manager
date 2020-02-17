import React, { useState } from "react"
import { UsersTable } from "components/UsersTable"
import { useGetUsers } from "../../hooks/useGetUsers"

const Users = () => {
  const [newUserTrigger, setNewUserTrigger] = useState(0)
  const [users, loading] = useGetUsers(false, newUserTrigger)
  const onCreateUser = () => {
    setNewUserTrigger(val => ++val)
  }

  return (
    <UsersTable
      isAdmin={false}
      data={users}
      loading={loading}
      onCreateUser={onCreateUser}
    />
  )
}

export { Users }
