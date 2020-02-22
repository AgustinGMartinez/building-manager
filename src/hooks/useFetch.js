import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const useFetch = ({ url, options = {}, initialData = [] }) => {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(false)

  let request = async () => {
    setLoading(true)
    const data = await fetch(url, options)
    setData(data)
    setLoading(false)
  }

  useEffect(() => {
    try {
      request()
    } catch (err) {
      console.error(err)
      toast.error(err.message)
      setLoading(false)
    }
    // eslint-disable-next-line
  }, [])
  return [data, loading, request]
}

export { useFetch }
