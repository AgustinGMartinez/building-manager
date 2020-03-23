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
import { statisticColors } from 'const'

// original icons
/* const assignedImage = blueBuilding
const unassignedImage = yellowBuilding
const neverDoneImage = redBuilding
const doneImage = greenBuilding */

const lastMonthFirstDay = moment()
  .startOf('month')
  .format('YYYY-MM-DD hh:mm')
const lastMonthLastDay = moment()
  .endOf('month')
  .format('YYYY-MM-DD hh:mm')

// TODO: fix campaign filters showing wrong assignments; make them complete only if 90%+ is done
function handleFilter(type, buildings, assignments, lastMonthHistory) {
  if (type === mapFilters.general) {
    return buildings.map(building => {
      let currentlyAssigned = false
      assignments.forEach(assignment => {
        assignment.buildings.forEach(b => {
          if (b.id === building.id) currentlyAssigned = true
        })
      })
      if (currentlyAssigned) {
        building.marker = statisticColors.assigned
        return building
      }

      const neverDone = !building.last_done
      if (neverDone) {
        building.marker = statisticColors.neverDone
        return building
      }

      const doneInPreviousTwoMonths = moment(building.last_done).isAfter(
        moment().subtract(2, 'months'),
      )
      if (doneInPreviousTwoMonths) {
        building.marker = statisticColors.done
        return building
      }

      building.marker = statisticColors.unassigned
      return building
    })
  } else if (type === mapFilters.currentMonth) {
    return buildings.map(building => {
      let isBuildingAssigned = false
      // this building can be assigned in multiple assignments,
      // lets let's push the state of doorbells in each assignment and calculate an average later
      const doorbellsStateInThisAssignmentForThisBuilding = []
      assignments.forEach(assignment => {
        assignment.buildings.forEach(b => {
          if (b.id === building.id) isBuildingAssigned = true
        })
        if (isBuildingAssigned) {
          assignment.doorbells.forEach(d => {
            if (d.building_id === building.id) {
              doorbellsStateInThisAssignmentForThisBuilding.push(d.completed)
            }
          })
        }
      })
      if (isBuildingAssigned) {
        // set done if 50%+ is done
        const averageDone =
          doorbellsStateInThisAssignmentForThisBuilding.filter(Boolean).length /
          doorbellsStateInThisAssignmentForThisBuilding.length

        if (averageDone >= 0.5) {
          building.marker = statisticColors.done
          return building
        }

        // else
        building.marker = statisticColors.assigned
        return building
      }

      building.marker = statisticColors.unassigned
      return building
    })
  } else if (type === mapFilters.previousMonth) {
    return buildings.map(building => {
      const ammountDone = lastMonthHistory.filter(h => h.building_id === building.id).length
      const donePreviousMonth = ammountDone / (Number(building.doorbell_count) || 1) >= 0.5
      if (donePreviousMonth) {
        building.marker = statisticColors.done
      } else {
        building.marker = statisticColors.neverDone
      }
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
        building.marker = done ? statisticColors.done : statisticColors.assigned
        return building
      }

      building.marker = statisticColors.unassigned
      return building
    })
  } else throw new Error('Tipo de filtro no entra en las categorias manejables.')
}

const Statistics = () => {
  const [buildings] = useFetch({ url: '/buildings' })
  const [assignments] = useFetch({ url: '/assignments' })
  const [lastMonthHistory] = useFetch({
    url: `/history?from=${lastMonthFirstDay}&to=${lastMonthLastDay}`,
  })
  const [filter, setFilter] = useState({ type: mapFilters.general })
  const [filteredBuildings, setFilteredBuildings] = useState([])

  useEffect(() => {
    const doFilter = async () => {
      let assignmentsToFilter = assignments
      if (filter.type === mapFilters.campaign) {
        assignmentsToFilter = await fetch('/assignments?campaign_id=' + filter.id)
      }
      const result = handleFilter(filter.type, buildings, assignmentsToFilter, lastMonthHistory)
      setFilteredBuildings(result)
    }
    doFilter()
  }, [filter, buildings, assignments, lastMonthHistory])

  return (
    <div style={{ position: 'relative' }}>
      <GoogleMaps buildings={filteredBuildings} />
      <Filters onSelect={setFilter} />
      <References type={filter.type} buildings={filteredBuildings} />
    </div>
  )
}

export { Statistics }
