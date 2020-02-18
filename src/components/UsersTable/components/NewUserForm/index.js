import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { toast } from 'react-toastify'
import { usePassiveFetch } from 'hooks/usePassiveFetch'
import Box from '@material-ui/core/Box'
import LinearProgress from '@material-ui/core/LinearProgress'

const useStyles = makeStyles(theme => ({
  root: {
    '& > input': {
      margin: theme.spacing(1),
    },
  },
}))

const initialState = {
  name: '',
  lastname: '',
  username: '',
  password: '',
}

const NewUserForm = ({ isAdmin, onClose, onDone }) => {
  const classes = useStyles()

  const [data, setData] = useState(initialState)

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
      await fetch('/users', {
        method: 'POST',
        body: { ...data, isAdmin },
      })
      toast.success('Usuario creado con éxito.')
      onDone()
    } catch (err) {
      toast.error('No se pudo crear usuario. Intente de nuevo.')
    }
  }

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
          />
        </Grid>
      </Grid>
      {isFetching && (
        <Box mt={3}>
          <LinearProgress />
        </Box>
      )}
      <Box mt={4}>
        <Button variant="contained" color="primary" onClick={createUser}>
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
