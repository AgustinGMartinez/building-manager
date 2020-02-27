import React, { useState } from 'react'
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps'

const GoogleMaps = withGoogleMap(({ buildings }) => {
  const [hoveringInfoWindows, setHoveringInfoWindows] = useState(null)

  return (
    <GoogleMap defaultZoom={14.6} defaultCenter={{ lat: -34.58578, lng: -58.532624 }}>
      {buildings.map((building, index) => (
        <Marker
          key={index}
          icon={{ url: building.marker }}
          position={{ lat: building.lat, lng: building.lng }}
          // eslint-disable-next-line
          anchor={new google.maps.Point(0, 0)}
          onMouseOver={() => setHoveringInfoWindows(index)}
          onMouseOut={() => setHoveringInfoWindows(null)}
        >
          {hoveringInfoWindows === index && (
            <InfoWindow>
              <div style={{ color: 'black' }}>
                <span style={{ display: 'block' }}>
                  {building.street} {building.house_number}
                </span>
                <span>Timbres: {building.doorbell_count}</span>
              </div>
            </InfoWindow>
          )}
        </Marker>
      ))}
    </GoogleMap>
  )
})

GoogleMaps.defaultProps = {
  loadingElement: <div style={{ height: `100%` }} />,
  containerElement: <div style={{ height: `calc(100vh - 60px)`, margin: '-24px' }} />,
  mapElement: <div style={{ height: `100%` }} />,
}

export { GoogleMaps }
