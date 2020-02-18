import React from 'react'

const UserContext = React.createContext({
  admin: undefined,
  setAdmin: () => {},
})

export { UserContext }
