import { useEffect, useState } from 'react'

const useGetUsers = (isAdmin, newUserTriggerId) => {
  const [users, updateUsers] = useState([])
  const [loading, updateLoading] = useState(false)
  useEffect(() => {
    updateLoading(true)
    ;(async () => {
      const users = await fetch(`/users${isAdmin ? '?admin=1' : ''}`)
      updateUsers(users)
      updateLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newUserTriggerId])
  return [users, loading]
}

export { useGetUsers }
