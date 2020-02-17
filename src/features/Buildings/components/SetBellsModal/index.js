import React, { useState, useMemo } from 'react'
import { Modal } from 'components/modal'
import { Button, Grid, List, ListItem, Box } from '@material-ui/core'
import { toast } from 'react-toastify'

function getInitialState(bells) {
  const floors = []
  bells.forEach(bell => {
    const floor = floors.find(f => f.number === bell.floor)
    if (floor) {
      floor.bells.push(bell.identifier)
      return
    }
    floors.push({
      number: bell.floor,
      bells: [bell.identifier],
    })
  })
  return floors
}

function numberToLetter(n) {
  return (n + 9).toString(36).toUpperCase()
}

const SetBellsModal = ({ onClose, initialBells, buildingId }) => {
  const initialData = useMemo(() => getInitialState(initialBells), [initialBells])
  const [selectedFloor, setSelectedFloor] = useState(null)
  const [floorsAndDoorbells, setFloorsAndDoorbellsMap] = useState(initialData)

  const addFloor = () => {
    const newFloorNumber = floorsAndDoorbells.length
    setFloorsAndDoorbellsMap([...floorsAndDoorbells, { number: newFloorNumber, bells: [] }])
    setSelectedFloor(newFloorNumber)
  }

  const toggleBell = val => {
    if (selectedFloor === null) return
    const value = val.toString()
    setFloorsAndDoorbellsMap(
      floorsAndDoorbells.map(floor => {
        floor = { ...floor, bells: [...floor.bells] }
        if (selectedFloor === floor.number) {
          if (floor.bells.includes(value)) {
            floor.bells = floor.bells.filter(v => v !== value)
          } else {
            floor.bells.push(value)
          }
        }
        return floor
      }),
    )
  }

  const removeFloor = () => {
    const floorsNew = floorsAndDoorbells
      .filter(floor => floor.number !== selectedFloor)
      .map(floor => {
        if (floor.number < selectedFloor) return floor
        // this part applies only if a floor in the middle was deleted, but that shouldn't happen
        floor.number -= 1
        return floor
      })
    setFloorsAndDoorbellsMap(floorsNew)
    setSelectedFloor(null)
  }

  const selectedFloorBells =
    selectedFloor !== null
      ? floorsAndDoorbells.find(floor => floor.number === selectedFloor).bells
      : []

  const isSubmitDisabled =
    floorsAndDoorbells.length === 0 || floorsAndDoorbells.some(floor => floor.bells.length === 0)

  const onSubmit = async () => {
    let doorbells = []
    floorsAndDoorbells.forEach(floor => {
      floor.bells.forEach(identifier => {
        doorbells.push({ floor: floor.number, identifier })
      })
    })
    try {
      await fetch('/api/doorbells', {
        method: 'POST',
        body: {
          buildingId,
          doorbells,
        },
      })
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <Modal open close={onClose} noBackdrop>
      <h2>Editar timbres</h2>
      <Box mb={2}>
        <Button variant="contained" color="primary" onClick={addFloor}>
          Agregar piso
        </Button>
        {selectedFloor !== null && selectedFloor + 1 === floorsAndDoorbells.length && (
          <Box ml={1} display="inline-block">
            <Button variant="outlined" color="primary" onClick={removeFloor}>
              Quitar piso
            </Button>
          </Box>
        )}
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {Array(8)
            .fill(1)
            .map((_, i) => {
              const value = numberToLetter(i + 1)
              const inSelection = selectedFloorBells.includes(value.toString())
              return (
                <Button
                  onClick={() => toggleBell(value)}
                  size="small"
                  color={inSelection ? 'secondary' : undefined}
                  variant={inSelection ? 'contained' : undefined}
                >
                  {value}
                </Button>
              )
            })}
          {Array(8)
            .fill(1)
            .map((_, i) => {
              const value = i + 1
              const inSelection = selectedFloorBells.includes(value.toString())
              return (
                <Button
                  onClick={() => toggleBell(value)}
                  size="small"
                  color={inSelection ? 'secondary' : undefined}
                  variant={inSelection ? 'contained' : undefined}
                >
                  {value}
                </Button>
              )
            })}
        </Grid>
      </Grid>
      <Box mb={2} />
      <List>
        {floorsAndDoorbells.map(floor => (
          <ListItem
            key={floor.number}
            dense
            style={{
              background: selectedFloor === floor.number ? '#eee' : '#fff',
            }}
            onClick={() => setSelectedFloor(floor.number)}
          >
            {floor.number === 0 ? 'PB' : floor.number} - {floor.bells.join(' ')}
          </ListItem>
        ))}
      </List>
      <Button variant="contained" color="primary" disabled={isSubmitDisabled} onClick={onSubmit}>
        Guardar
      </Button>
      <Box ml={1} display="inline-block">
        <Button onClick={onClose}>Cancelar</Button>
      </Box>
    </Modal>
  )
}

export { SetBellsModal }
