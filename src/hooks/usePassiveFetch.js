import { useState } from 'react'

const usePassiveFetch = () => {
  const [loading, setLoading] = useState(false)

  let request = async (url, options) => {
    setLoading(true)
    try {
      const data = await fetch(url, options)
      setLoading(false)
      return data
    } catch (err) {
      console.error(err)
      setLoading(false)
      throw err
    }
  }

  return [request, loading]
}

export { usePassiveFetch }
