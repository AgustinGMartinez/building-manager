import { useEffect, useState } from "react"

const useFetchBuildings = newBuildingTriggerId => {
  const [buildings, setBuildings] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    ;(async () => {
      const buildings = await fetch(`/api/buildings`)
      setBuildings(buildings)
      setLoading(false)
    })()
  }, [newBuildingTriggerId])
  return [buildings, loading]
}

export { useFetchBuildings }
