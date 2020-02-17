import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import Grid from "@material-ui/core/Grid"
import { Button, Box } from "@material-ui/core"
import { toast } from "react-toastify"

const useStyles = makeStyles(theme => ({
  root: {
    "& > input": {
      margin: theme.spacing(1)
    }
  }
}))

const NewUserForm = ({ isAdmin, onClose, onDone }) => {
  const classes = useStyles()
  const title = isAdmin ? "Nuevo administrador" : "Nuevo usuario"
  const initialState = {
    name: "",
    lastname: "",
    username: "",
    password: ""
  }
  const [data, setData] = useState(initialState)
  const handleGenericChange = (key, newData) => {
    setData(data => {
      return {
        ...data,
        [key]: newData
      }
    })
  }
  const handleNameChange = e => {
    handleGenericChange("name", e.target.value)
  }
  const handleLastnameChange = e => {
    handleGenericChange("lastname", e.target.value)
  }
  const handleUsernameChange = e => {
    handleGenericChange("username", e.target.value)
  }
  const handlePasswordChange = e => {
    handleGenericChange("password", e.target.value)
  }
  const createUser = async () => {
    try {
      await fetch("/api/users", {
        method: "POST",
        body: { ...data, isAdmin }
      })
      toast.success("Usuario creado con éxito.")
      onDone()
    } catch (err) {}
  }

  return (
    <form className={classes.root} autoComplete="off">
      <h2>{title}</h2>
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
      <Box mt={4}>
        <Button variant="contained" color="primary" onClick={createUser}>
          Crear
        </Button>
        <Button
          style={{ marginLeft: "1rem" }}
          color="default"
          onClick={onClose}
        >
          Cancelar
        </Button>
      </Box>
    </form>
  )
}

export { NewUserForm }
