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
import { useLocation, useHistory } from 'react-router'

import { useCheckFormErrors } from '../../hooks/useCheckFormErrors'
import { register as registerFetch } from '../../utils'
import { UserContext } from '../../contexts'

import { useStyles } from './styles'
import { toast } from 'react-toastify'

const rules = {
  username: [],
  password: [{ validate: password => password.length >= 6 }],
}

const INITIAL_PAGE = { admin: '/users', user: '/my-active-assignments' } // must be other than /login and / or else will trigger an infinte lopp

const Login = () => {
  const { user, setUser } = useContext(UserContext)

  const classes = useStyles()
  let history = useHistory()
  let location = useLocation()
  let { from } = location.state || {
    from: { pathname: user && user.is_admin ? INITIAL_PAGE.admin : INITIAL_PAGE.user },
  }

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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
      setUser(user)
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    } catch (err) {
      console.error(err.message)
      toast.error('Usuario o contraseña incorrectos.')
      setIsLoading(false)
    }
  }

  if (user) {
    history.replace(from)
    return null
  }

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
