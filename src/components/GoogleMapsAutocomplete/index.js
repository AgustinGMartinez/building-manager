import React from "react"
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-google-places-autocomplete"
import "react-google-places-autocomplete/dist/assets/index.css"
import { TextField } from "@material-ui/core"

const GoogleMapsAutocomplete = ({ onSelect, ...restProps }) => {
  const handleSelect = async result => {
    geocodeByAddress(result.description)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        const street = result.terms[0].value
          .slice()
          .replace(/(\d){3,}/g, "")
          .trim()
        let house_number = result.terms[0].value
          .slice()
          .replace(street, "")
          .replace(/[^\d+]/g, "")
          .trim()
        if (!house_number)
          house_number = result.terms[1].value
            .slice()
            .replace(street, "")
            .replace(/[^\d+]/g, "")
            .trim()
        const returningValue = {
          lat,
          lng,
          street,
          house_number
        }
        onSelect(returningValue)
      })
  }

  return (
    <div>
      <GooglePlacesAutocomplete
        autocompletionRequest={{
          componentRestrictions: {
            country: "AR"
          },
          location: { lat: -34.585343, lng: -58.539906 },
          radius: 4000
        }}
        loader="Cargando..."
        onSelect={handleSelect}
        renderInput={props => (
          <TextField fullWidth label="Buscar dirección" {...props} />
        )}
        placeholder=""
        {...restProps}
      />
    </div>
  )
}

export { GoogleMapsAutocomplete }
