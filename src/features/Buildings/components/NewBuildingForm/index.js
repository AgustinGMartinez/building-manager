import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import Grid from "@material-ui/core/Grid"
import { Button, Box } from "@material-ui/core"
import FormHelperText from "@material-ui/core/FormHelperText"
import { GoogleMapsAutocomplete } from "../../../../components/GoogleMapsAutocomplete"
import { useCheckFormErrors } from "hooks/useCheckFormErrors"

const rules = {
  territory: [],
  street: [],
  house_number: [],
  lat: [],
  lng: []
}

const useStyles = makeStyles(theme => ({
  root: {
    "& > input": {
      margin: theme.spacing(1)
    }
  }
}))

const NewBuildingForm = ({ onClose, onCreateBuilding }) => {
  const classes = useStyles()
  const initialState = {
    territory: "",
    street: "",
    house_number: "",
    admin_note: "",
    lat: "",
    lng: ""
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
  const handleTerritoryChange = e => {
    handleGenericChange("territory", e.target.value)
  }
  const handleAdminNoteChange = e => {
    handleGenericChange("admin_note", e.target.value)
  }
  const onSelectPlace = place => {
    Object.keys(place).forEach(key => {
      handleGenericChange(key, place[key])
    })
  }
  const createBuilding = async () => {
    await onCreateBuilding(data)
    setData(initialState)
  }

  const { isAnyFieldEmpty, hasErrors } = useCheckFormErrors(data, rules)
  const disabled = isAnyFieldEmpty || hasErrors

  return (
    <form className={classes.root} autoComplete="off">
      <h2>Nuevo edificio</h2>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <GoogleMapsAutocomplete onSelect={onSelectPlace} />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Territorio"
            required
            value={data.territory}
            onChange={handleTerritoryChange}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            label="Calle"
            required
            value={data.street}
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Numero de casa"
            required
            value={data.house_number}
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nota del admin"
            multiline
            value={data.admin_note}
            onChange={handleAdminNoteChange}
          />
          <FormHelperText>
            Esta nota sirve para dar a los usuarios información extra sobre este
            edificio. Ej.: "Cuidado con el encargado".
          </FormHelperText>
        </Grid>
      </Grid>
      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={createBuilding}
          disabled={disabled}
        >
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

export { NewBuildingForm }
