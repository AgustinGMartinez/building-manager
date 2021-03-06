import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { toast } from 'react-toastify'
import { usePassiveFetch } from 'hooks/usePassiveFetch'
import Box from '@material-ui/core/Box'
import LinearProgress from '@material-ui/core/LinearProgress'
import { FormControlLabel, Checkbox } from '@material-ui/core'
import { useCheckFormErrors } from 'hooks/useCheckFormErrors'

const useStyles = makeStyles(theme => ({
  root: {
    '& > input': {
      margin: theme.spacing(1),
    },
  },
}))

const rules = {
  name: [],
  lastname: [],
  username: [],
  password: [{ validate: password => password.length >= 6, message: 'Al menos 6 caracteres.' }],
}

const initialState = {
  name: '',
  lastname: '',
  username: '',
  password: '',
}

const NewUserForm = ({ isAdmin, onClose, onDone }) => {
  const classes = useStyles()

  const [data, setData] = useState(initialState)
  const [isSuperadmin, setIsSuperadmin] = useState(false)

  const [fetch, isFetching] = usePassiveFetch()

  const handleGenericChange = (key, newData) => {
    setData(data => {
      return {
        ...data,
        [key]: newData,
      }
    })
  }

  const handleNameChange = e => {
    handleGenericChange('name', e.target.value)
  }

  const handleLastnameChange = e => {
    handleGenericChange('lastname', e.target.value)
  }

  const handleUsernameChange = e => {
    handleGenericChange('username', e.target.value)
  }

  const handlePasswordChange = e => {
    handleGenericChange('password', e.target.value)
  }

  const createUser = async () => {
    try {
      await fetch(isAdmin ? '/admins' : '/users', {
        method: 'POST',
        body: { ...data, isSuperadmin: isAdmin ? isSuperadmin : undefined },
      })
      toast.success('Usuario creado con éxito.')
      onDone()
    } catch (err) {
      toast.error('No se pudo crear usuario. Intente de nuevo.')
    }
  }

  const { errors, isAnyFieldEmpty, hasErrors } = useCheckFormErrors(data, rules)
  const isSubmitButtonDisabled = hasErrors || isAnyFieldEmpty || isFetching

  return (
    <form className={classes.root} autoComplete="off">
      <h2>{isAdmin ? 'Nuevo administrador' : 'Nuevo usuario'}</h2>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Nombres"
            required
            value={data.name}
            onChange={handleNameChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Apellidos"
            required
            value={data.lastname}
            onChange={handleLastnameChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Usuario"
            required
            value={data.username}
            onChange={handleUsernameChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Contraseña"
            required
            value={data.password}
            onChange={handlePasswordChange}
            error={errors.password.hasError}
            helperText={errors.password.message}
          />
        </Grid>
        {isAdmin && (
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isSuperadmin}
                  onChange={(_, value) => setIsSuperadmin(value)}
                  color="primary"
                />
              }
              label="¿Es superadmin?"
            />
          </Grid>
        )}
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
          onClick={createUser}
          disabled={isSubmitButtonDisabled}
        >
          Crear
        </Button>
        <Button style={{ marginLeft: '1rem' }} color="default" onClick={onClose}>
          Cancelar
        </Button>
      </Box>
    </form>
  )
}

export { NewUserForm }
