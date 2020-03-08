import React, { useContext, useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import { StringUtils, NumberUtils } from 'utils'
import moment from 'moment'
import { UserContext } from 'contexts'
import { toast } from 'react-toastify'
import { usePassiveFetch } from 'hooks/usePassiveFetch'

const useStyles = makeStyles(theme => ({
  root: {
    '& > input': {
      margin: theme.spacing(1),
    },
  },
  buildingWrapper: {
    margin: '0.5rem',
  },
  buildingTitle: {},
  buildingContainer: {
    display: 'inline-block',
    padding: '0.5rem',
  },
  buildingFloorContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  buildingFloorNumber: {
    marginRight: '1rem',
    fontSize: '12px',
    display: 'inline-block',
    width: '10px',
  },
  buildingDoorbellsContainer: {
    display: 'inline-flex',
  },
  buildingFloorDoorbell: {
    width: '40px',
    height: '30px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5px',
  },
}))

const Assignment = ({ assignment: initialAssignment }) => {
  const { user } = useContext(UserContext)
  const isAdmin = Boolean(user.is_admin)
  const [fetch, isLoading] = usePassiveFetch()
  const [assignment, setAssignment] = useState(initialAssignment)

  const classes = useStyles()

  const toggleAssignmet = async (assignmentId, buildingId, specialId) => {
    try {
      await fetch(`/assignments/${assignmentId}`, {
        method: 'PUT',
        body: {
          buildingId,
          specialId,
        },
      })
      const newAssignment = {
        ...assignment,
        doorbells: assignment.doorbells.map(d => {
          if (d.special_id === specialId)
            return {
              ...d,
              completed: 1 - d.completed,
            }
          return d
        }),
      }
      const completed = newAssignment.doorbells.every(d => d.completed)
      if (completed) newAssignment.completed = 1
      setAssignment(newAssignment)
      if (completed) toast.success('¡Asignación completada!')
      else toast.success('Timbre actualizado con éxito.')
    } catch (err) {
      console.error(err)
      toast.error('No se pudo actualizar timbre. Intente de nuevo.')
    }
  }

  const renderBuilding = (building, doorbells) => {
    // eslint-disable-next-line
    const { sortedFloors, maxLength, completedDoorBells } = useMemo(() => {
      const completedDoorBells = []
      const byFloor = doorbells.reduce((acc, doorbell) => {
        if (doorbell.building_id !== building.id) return acc
        if (doorbell.completed) completedDoorBells.push(doorbell.special_id)
        const floor = acc.find(floor => floor.number === doorbell.floor)
        if (!floor) {
          return acc.concat({
            number: doorbell.floor,
            doorbells: [doorbell.identifier],
          })
        }
        floor.doorbells.push(doorbell.identifier)
        return acc
      }, [])
      let maxLength = 0
      byFloor.forEach(floor => {
        floor.doorbells.sort()
        if (floor.doorbells.length > maxLength) maxLength = floor.doorbells.length
      })
      byFloor.sort((a, b) => b.number - a.number)
      return { sortedFloors: byFloor, maxLength, completedDoorBells }
      // eslint-disable-next-line
    }, [JSON.stringify(doorbells)])

    return (
      <Grid key={building.id} item xs={12} sm={6}>
        <div className={classes.buildingWrapper}>
          <h4 className={classes.buildingTitle}>
            {building.street} {building.house_number}
          </h4>
          <div className={classes.buildingContainer}>
            {sortedFloors.map(floor => {
              let currentDoorbellNumber = 1
              let withEmptySpaces = []
              let maxSurpassed = false
              floor.doorbells.forEach(bell => {
                const number = NumberUtils.letterToNumber(bell)
                if (number !== currentDoorbellNumber && !maxSurpassed) {
                  const exceedingMaxLength = number > maxLength
                  if (exceedingMaxLength) maxSurpassed = true
                  const diff = !exceedingMaxLength
                    ? number - currentDoorbellNumber
                    : maxLength + 1 - currentDoorbellNumber
                  Array(diff)
                    .fill(1)
                    .forEach(() => withEmptySpaces.push('_'))
                }
                withEmptySpaces.push(bell)
                currentDoorbellNumber = number + 1
              })
              return (
                <div key={floor.number} className={classes.buildingFloorContainer}>
                  <span className={classes.buildingFloorNumber}>{floor.number || 'PB'}</span>
                  <span key={floor.number} className={classes.buildingDoorbellsContainer}>
                    {withEmptySpaces.map((identifier, i) => {
                      const isEmpty = !floor.doorbells.includes(identifier)
                      const value = isEmpty ? '' : identifier
                      const specialId = `${building.id}${floor.number}${identifier}`
                      return (
                        <span
                          key={i}
                          className={classes.buildingFloorDoorbell}
                          style={{
                            background: completedDoorBells.includes(specialId)
                              ? 'lightgreen'
                              : '#eee',
                          }}
                          onClick={
                            isEmpty || assignment.completed
                              ? undefined
                              : () => toggleAssignmet(assignment.id, building.id, specialId)
                          }
                        >
                          {value}
                        </span>
                      )
                    })}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </Grid>
    )
  }

  return (
    <form className={classes.root} autoComplete="off" style={{ opacity: isLoading ? 0.5 : 1 }}>
      {isAdmin && <h2>Asignación de {assignment.user_name}</h2>}
      <Grid container spacing={3}>
        {isAdmin && (
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Publicador asignado"
              value={`${assignment.user_name} ${assignment.user_lastname}`}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Campaña" value={assignment.campaign_name || 'Ninguna'} />
        </Grid>
        {isAdmin && (
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fecha de creación"
              value={moment(assignment.created_at).format(StringUtils.DATE_FORMAT)}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={3}>
          <TextField fullWidth label="Finalizada" value={assignment.completed ? 'Sí' : 'No'} />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField fullWidth label="Territorio/s" value={assignment.territories.join(', ')} />
        </Grid>
        {(isAdmin || assignment.admin_note) && (
          <Grid item xs={12}>
            <TextField fullWidth label="Nota" multiline value={assignment.admin_note} />
          </Grid>
        )}
        {assignment.buildings.map(building => renderBuilding(building, assignment.doorbells))}
      </Grid>
    </form>
  )
}

export { Assignment }
