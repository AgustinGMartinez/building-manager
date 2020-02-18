import React, { useState, useContext } from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import LinearProgress from '@material-ui/core/LinearProgress'
import { Redirect } from 'react-router'

import { useCheckFormErrors } from '../../hooks/useCheckFormErrors'
import { register as registerFetch } from '../../utils'
import { UserContext } from '../../contexts'

import { useStyles } from './styles'
import { toast } from 'react-toastify'

const rules = {
  username: [],
  password: [{ validate: password => password.length >= 6 }],
}

const Login = () => {
  const classes = useStyles()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { admin, setAdmin } = useContext(UserContext)

  const handleChangeUsername = e => {
    setUsername(e.target.value)
  }
  const handleChangePassword = e => {
    setPassword(e.target.value)
  }

  const data = { username, password }
  const { errors, isAnyFieldEmpty, hasErrors } = useCheckFormErrors(data, rules)
  const isSubmitButtonDisabled = hasErrors || isAnyFieldEmpty || isLoading

  const handleKeyDown = e => {
    if (hasErrors) return
    const enterKeyCode = 13
    if (e.keyCode === enterKeyCode) {
      onSubmit()
    }
  }

  const onSubmit = async () => {
    if (hasErrors) return
    setIsLoading(true)
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        body: {
          username,
          password,
        },
      })

      const { token, user } = response
      registerFetch(token)
      setAdmin(user)
      localStorage.setItem('token', token)
      localStorage.setItem('admin', JSON.stringify(user))
    } catch (err) {
      toast.error('Usuario o contraseña incorrectos.')
      setIsLoading(false)
    }
  }

  if (admin) return <Redirect to="/users" />

  return (
    <div className={classes.container}>
      <div className={classes.cardContainer}>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h5" component="h2">
              Ingresar
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              Ingresá con tu usuario
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Usuario"
                  fullWidth
                  required
                  value={username}
                  onChange={handleChangeUsername}
                  error={errors.username.hasError}
                  helperText={errors.username.message}
                  onKeyDown={handleKeyDown}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Contraseña"
                  fullWidth
                  type="password"
                  required
                  value={password}
                  onChange={handleChangePassword}
                  error={errors.password.hasError}
                  helperText={errors.password.message}
                  onKeyDown={handleKeyDown}
                />
              </Grid>
            </Grid>
            {isLoading && (
              <Box mt={3}>
                <LinearProgress />
              </Box>
            )}
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              disabled={isSubmitButtonDisabled}
              onClick={onSubmit}
            >
              Ingresar
            </Button>
          </CardActions>
        </Card>
      </div>
    </div>
  )
}

export { Login }
