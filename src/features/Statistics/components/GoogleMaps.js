import React, { useState } from 'react'
import { withGoogleMap, GoogleMap } from 'react-google-maps'
import MarkerWithLabel from 'react-google-maps/lib/components/addons/MarkerWithLabel'

const GoogleMaps = withGoogleMap(({ buildings }) => {
  const [hoveringInfoWindows, setHoveringInfoWindows] = useState(null)

  return (
    <GoogleMap
      defaultZoom={14.6}
      defaultCenter={{ lat: -34.58578, lng: -58.532624 }}
      options={{
        disableDefaultUI: true,
      }}
    >
      {buildings.map((building, index) => (
        <MarkerWithLabel
          key={index}
          // fake url so no icon is loaded
          icon={{ url: 'dsad' }}
          // original icons where actual markers, not colors like it is right now
          /* icon={{ url: building.marker }} */
          position={{ lat: building.lat, lng: building.lng }}
          // eslint-disable-next-line
          anchor={new google.maps.Point(0, 0)}
          onMouseOver={() => setHoveringInfoWindows(index)}
          onMouseOut={() => setHoveringInfoWindows(null)}
          onClick={() => setHoveringInfoWindows(index)}
          // eslint-disable-next-line
          labelAnchor={new google.maps.Point(14, 30)}
          labelStyle={{
            backgroundColor: building.marker,
            color: 'white',
            fontSize: 10,
            padding: '12px 6px',
            border: '2px solid black',
            fontWeight: 600,
          }}
          zIndex={hoveringInfoWindows === index ? 9999999999999 : 1}
        >
          <>
            {/* only to be user with regular marker */}
            {/* hoveringInfoWindows === index && (
              <InfoWindow onCloseClick={() => setHoveringInfoWindows(null)}>
                <div style={{ color: 'black' }}>
                  <span style={{ display: 'block' }}>
                    {building.street} {building.house_number}
                  </span>
                  <span>Timbres: {building.doorbell_count}</span>
                </div>
              </InfoWindow>
            ) */}
            {
              <span>
                {building.doorbell_count}{' '}
                {hoveringInfoWindows === index &&
                  ` timbres. ${building.street} ${building.house_number}. Territorio ${building.territory}`}
              </span>
            }
          </>
        </MarkerWithLabel>
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
