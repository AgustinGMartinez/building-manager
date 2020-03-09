import React from 'react'
import { useFetch } from 'hooks/useFetch'
import { useState } from 'react'
/* import redBuilding from '../../assets/images/building-red.svg'
import yellowBuilding from '../../assets/images/building-yellow.svg'
import blueBuilding from '../../assets/images/building-blue.svg'
import greenBuilding from '../../assets/images/building-green.svg' */
import { Filters, References, GoogleMaps } from './components'
import { mapFilters } from 'const'
import { useEffect } from 'react'
import moment from 'moment'

// original icons
/* const assignedImage = blueBuilding
const unassignedImage = yellowBuilding
const neverDoneImage = redBuilding
const doneImage = greenBuilding */

const assignedImage = 'blue'
const unassignedImage = 'olive'
const neverDoneImage = 'red'
const doneImage = 'darkgreen'

// TODO: fix campaign filters showing wrong assignments; make them complete only if 90%+ is done
function handleFilter(type, buildings, assignments) {
  if (type === mapFilters.general) {
    return buildings.map(building => {
      let currentlyAssigned = false
      assignments.forEach(assignment => {
        assignment.buildings.forEach(b => {
          if (b.id === building.id) currentlyAssigned = true
        })
      })
      if (currentlyAssigned) {
        building.marker = assignedImage
        return building
      }

      const neverDone = !building.last_done
      if (neverDone) {
        building.marker = neverDoneImage
        return building
      }

      const doneInPreviousTwoMonths = moment(building.last_done).isAfter(
        moment().subtract(2, 'months'),
      )
      if (doneInPreviousTwoMonths) {
        building.marker = doneImage
        return building
      }

      building.marker = unassignedImage
      return building
    })
  } else if (type === mapFilters.currentMonth) {
    return buildings.map(building => {
      let currentlyAssigned = false
      assignments.forEach(assignment => {
        assignment.buildings.forEach(b => {
          if (b.id === building.id) currentlyAssigned = true
        })
      })
      if (currentlyAssigned) {
        building.marker = assignedImage
        return building
      }

      const doneThisMonth = moment(building.last_done).isSame(new Date(), 'month')
      if (doneThisMonth) {
        building.marker = doneImage
        return building
      }

      building.marker = unassignedImage
      return building
    })
  } else if (type === mapFilters.previousMonth) {
    return buildings.map(building => {
      const donePreviousMonth = moment(building.last_done).isSame(
        moment().subtract(1, 'month'),
        'month',
      )
      if (donePreviousMonth) {
        building.marker = doneImage
        return building
      }

      building.marker = neverDoneImage
      return building
    })
  } else if (type === mapFilters.campaign) {
    // here we expect to already receive assignments filtered by campaign
    return buildings.map(building => {
      let currentlyAssigned = false
      let done = false
      assignments.forEach(assignment => {
        assignment.buildings.forEach(b => {
          if (b.id === building.id) {
            currentlyAssigned = true
            done = assignment.completed
          }
        })
      })
      if (currentlyAssigned) {
        building.marker = done ? doneImage : assignedImage
        return building
      }

      building.marker = unassignedImage
      return building
    })
  } else throw new Error('Tipo de filtro no entra en las categorias manejables.')
}

const Statistics = () => {
  const [buildings] = useFetch({ url: '/buildings' })
  const [assignments] = useFetch({ url: '/assignments' })
  const [filter, setFilter] = useState({ type: mapFilters.general })
  const [filteredBuildings, setFilteredBuildings] = useState([])

  useEffect(() => {
    const doFilter = async () => {
      let assignmentsToFilter = assignments
      if (filter.type === mapFilters.campaign) {
        assignmentsToFilter = await fetch('/assignments?campaign=' + filter.id)
      }
      const result = handleFilter(filter.type, buildings, assignmentsToFilter)
      setFilteredBuildings(result)
    }
    doFilter()
  }, [filter, buildings, assignments])

  return (
    <div style={{ position: 'relative' }}>
      <GoogleMaps buildings={filteredBuildings} />
      <Filters onSelect={setFilter} />
      <References type={filter.type} buildings={filteredBuildings} />
    </div>
  )
}

export { Statistics }
