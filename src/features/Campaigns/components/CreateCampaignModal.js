import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import { Button, Box, LinearProgress } from '@material-ui/core'
import { useCheckFormErrors } from 'hooks/useCheckFormErrors'
import { toast } from 'react-toastify'
import { usePassiveFetch } from 'hooks/usePassiveFetch'
import { Modal } from 'components/modal'

const rules = {
  name: [],
}

const useStyles = makeStyles(theme => ({
  root: {
    '& > input': {
      margin: theme.spacing(1),
    },
  },
}))

const CreateCampaignModal = ({ onClose, onDone }) => {
  const classes = useStyles()

  const [fetch, isFetching] = usePassiveFetch()
  const [name, setName] = useState('')

  const handleNameChange = e => {
    setName(e.target.value)
  }

  const createCampaign = async () => {
    try {
      await fetch('/campaigns', {
        method: 'POST',
        body: {
          name,
        },
      })
      toast.success('Campaña creada con éxito.')
      onDone()
    } catch (err) {
      toast.error('No se pudo crear campaña. Intente de nuevo.')
    }
  }

  const dataToCheck = { name }
  const { isAnyFieldEmpty, hasErrors } = useCheckFormErrors(dataToCheck, rules)
  const disabled = isAnyFieldEmpty || hasErrors || isFetching

  return (
    <Modal open close={onClose}>
      <form className={classes.root} autoComplete="off">
        <h2>Nueva campaña</h2>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField fullWidth label="Nombre" value={name} onChange={handleNameChange} />
          </Grid>
        </Grid>
        {isFetching && (
          <Box mt={3}>
            <LinearProgress />
          </Box>
        )}
        <Box mt={4}>
          <Button variant="contained" color="primary" onClick={createCampaign} disabled={disabled}>
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

export { CreateCampaignModal }
