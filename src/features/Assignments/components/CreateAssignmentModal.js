import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import { Button, Box, LinearProgress, FormControlLabel } from '@material-ui/core'
import FormHelperText from '@material-ui/core/FormHelperText'
import { useCheckFormErrors } from 'hooks/useCheckFormErrors'
import { toast } from 'react-toastify'
import { usePassiveFetch } from 'hooks/usePassiveFetch'
import { Modal } from 'components/modal'
import { AsyncAutocomplete } from 'components/AsyncAutocomplete'
import { StringUtils } from 'utils'
import { DatePicker } from '@material-ui/pickers'
import Checkbox from '@material-ui/core/Checkbox'
import moment from 'moment'

const nextMonthFirstDay = moment()
  .add(1, 'month')
  .startOf('month')

const rules = {
  user: [],
  buildings: [
    {
      checkEmpty: buildings => buildings.length === 0,
    },
  ],
  doorbells: [
    {
      validate: (doorbells, data) => {
        const numberOfBuildings = data.buildings.length
        const buildingsAccordingsToDoorbells = new Set()
        doorbells.forEach(doorbellArray => {
          doorbellArray.forEach(doorbell =>
            buildingsAccordingsToDoorbells.add(doorbell.building_id),
          )
        })
        return numberOfBuildings === buildingsAccordingsToDoorbells.size
      },
      message: 'Todos los edificios deben tener al menos 1 timbre seleccionado.',
      checkEmpty: doorbells => doorbells.length === 0,
    },
  ],
}

const useStyles = makeStyles(theme => ({
  root: {
    '& > input': {
      margin: theme.spacing(1),
    },
  },
}))

const removeDuplicatedDoorbells = doorbells =>
  doorbells.reduce((a, b) => {
    if (!b) return a
    const duplicated = a.find(doorbell => doorbell.id === b.id)
    if (duplicated) return a
    return a.concat(b)
  }, [])

const CreateAssignmentModal = ({ onClose, onDone }) => {
  const classes = useStyles()

  const [fetch, isFetching] = usePassiveFetch()

  const [user, setUser] = useState(null)
  const [note, setNote] = useState('')
  const [campaign, setCampaign] = useState(null)
  const [buildings, setBuildings] = useState([])
  const [doorbells, setDoorbells] = useState([])
  const [expiryDate, setExpiryDate] = useState(null)
  const [noExpiration, setNoExpiration] = useState(true)
  const [expiresThisMonth, setExpiresThisMonth] = useState(false)

  const handleExpiresThisMonthCheckChange = event => {
    const checked = event.target.checked
    setExpiresThisMonth(checked)
  }

  const handleNoExpirationChange = e => {
    const checked = e.target.checked
    setNoExpiration(checked)
    if (checked) setExpiresThisMonth(false)
  }

  const handleDateChange = newDate => {
    setExpiryDate(newDate)
  }

  const handleAdminNoteChange = e => {
    setNote(e.target.value)
  }

  const handleChangeCampaign = newCampaign => {
    setCampaign(newCampaign.id)
  }

  const handleChangeBuildings = newBuildings => {
    let missingIndex
    buildings.forEach((oldBuilding, index) => {
      const found = newBuildings.find(newBuilding => newBuilding.id === oldBuilding.id)
      if (!found) missingIndex = index
    })
    if (missingIndex) {
      delete doorbells[missingIndex]
    }
    setBuildings(newBuildings)
  }

  const handleDoorbellsSelected = (newDoorbells, index) => {
    const isNew = !doorbells[index]
    if (!isNew)
      return setDoorbells(
        doorbells.map((bDoorbells, i) => {
          if (i !== index) return bDoorbells
          return newDoorbells
        }),
      )
    doorbells[index] = newDoorbells
    setDoorbells(doorbells.slice())
  }

  const createAssignment = async () => {
    const dblls = removeDuplicatedDoorbells(doorbells).map(doorbell => {
      const { id, building_id, special_id } = doorbell
      return { id, building_id, special_id }
    })
    try {
      await fetch('/assignments', {
        method: 'POST',
        body: {
          user_id: user.id,
          note,
          doorbells: dblls,
          campaign_id: campaign,
          expiry_date: noExpiration ? null : expiresThisMonth ? nextMonthFirstDay : expiryDate,
        },
      })
      toast.success('Asignación creada con éxito.')
      onDone()
    } catch (err) {
      toast.error('No se pudo crear asignación. Intente de nuevo.')
    }
  }

  const dataToCheck = { user, buildings, doorbells }
  const { errors, isAnyFieldEmpty, hasErrors } = useCheckFormErrors(dataToCheck, rules)
  const hasPickedValidDate = noExpiration || expiresThisMonth || expiryDate
  const disabled = isAnyFieldEmpty || hasErrors || isFetching || !hasPickedValidDate

  return (
    <Modal open close={onClose}>
      <form className={classes.root} autoComplete="off">
        <h2>Nueva asignación</h2>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <AsyncAutocomplete
              request={{ url: '/users' }}
              getOptionSelected={(option, value) => option.username === value.username}
              getOptionLabel={option => option.fullname}
              textFieldProps={{ label: 'Publicador' }}
              rememberOptions
              onChange={setUser}
            />
          </Grid>
          <Grid item xs={12}>
            <AsyncAutocomplete
              request={{ url: '/campaigns' }}
              getOptionSelected={(option, value) => option.id === value.id}
              getOptionLabel={option => option.name}
              rememberOptions
              onChange={handleChangeCampaign}
              textFieldProps={{
                label: 'Campaña (opcional)',
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <AsyncAutocomplete
              request={{ url: '/buildings' }}
              sort={(a, b) => b.territory - a.territory}
              getOptionSelected={(option, value) => option.id === value.id}
              getOptionLabel={option =>
                `${StringUtils.getBuildingFullAddress(option)} (${option.territory})`
              }
              rememberOptions
              onChange={handleChangeBuildings}
              multiple
              textFieldProps={{
                label: 'Edificios',
                helperText: errors.buildings.message,
              }}
            />
          </Grid>
          {buildings.map((building, index) => (
            <Grid item xs={12} key={building.id}>
              <AsyncAutocomplete
                request={{ url: `/buildings/${building.id}/doorbells` }}
                getOptionSelected={(option, value) => option.id === value.id}
                getOptionLabel={option => `${option.floor} - ${option.identifier}`}
                rememberOptions
                onChange={newValue => handleDoorbellsSelected(newValue, index)}
                multiple
                textFieldProps={{
                  label: `Timbres de ${StringUtils.getBuildingFullAddress(building)}`,
                  helperText: 'Todos los edificios deben tener al menos 1 timbre.',
                }}
                enableSelectAll
              />
            </Grid>
          ))}
          <Grid item xs={12} sm={3}>
            <DatePicker
              value={noExpiration ? null : expiresThisMonth ? nextMonthFirstDay : expiryDate}
              onChange={handleDateChange}
              autoOk
              disablePast
              format={StringUtils.DATE_FORMAT}
              initialFocusedDate={new Date()}
              disabled={expiresThisMonth || noExpiration}
              style={{ width: '100%' }}
              label="Vencimiento"
            />
          </Grid>
          <Grid item xs={12} sm={5} style={{ display: 'flex', alignItems: 'flex-end' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={expiresThisMonth}
                  onChange={handleExpiresThisMonthCheckChange}
                  color="secondary"
                  disabled={noExpiration}
                />
              }
              label="¿Vence a fin de mes?"
            />
          </Grid>
          <Grid item xs={12} sm={4} style={{ display: 'flex', alignItems: 'flex-end' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={noExpiration}
                  onChange={handleNoExpirationChange}
                  color="secondary"
                />
              }
              label="No vence"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nota del admin"
              multiline
              value={note}
              onChange={handleAdminNoteChange}
            />
            <FormHelperText>
              Esta nota sirve para dar al publicador información extra sobre esta asignación. Ej.:
              "Dar prioridad al edificio de Espora".
            </FormHelperText>
          </Grid>
        </Grid>
        {isFetching && (
          <Box mt={3}>
            <LinearProgress />
          </Box>
        )}
        <Box mt={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={createAssignment}
            disabled={disabled}
          >
            Crear
          </Button>
          <Button style={{ marginLeft: '1rem' }} color="default" onClick={onClose}>
            Cancelar
          </Button>
        </Box>
      </form>
    </Modal>
  )
}

export { CreateAssignmentModal }
