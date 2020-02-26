import React, { useState, useEffect } from 'react'
import { mapFilters } from 'const'
import redBuilding from '../../../assets/images/building-red.svg'
import yellowBuilding from '../../../assets/images/building-yellow.svg'
import blueBuilding from '../../../assets/images/building-blue.svg'
import greenBuilding from '../../../assets/images/building-green.svg'

const References = ({ type, buildings }) => {
  const [redPercentage, setRedPercentage] = useState(0)
  const [yellowPercentage, setYellowPercentage] = useState(0)
  const [bluePercentage, setBluePercentage] = useState(0)
  const [greenPercentage, setGreenPercentage] = useState(0)

  useEffect(() => {
    let red = 0,
      yellow = 0,
      blue = 0,
      green = 0,
      total = buildings.length || 1
    buildings.forEach(building => {
      if (building.marker === redBuilding) return red++
      if (building.marker === yellowBuilding) return yellow++
      if (building.marker === blueBuilding) return blue++
      if (building.marker === greenBuilding) return green++
    })
    setRedPercentage(red / total)
    setYellowPercentage(yellow / total)
    setBluePercentage(blue / total)
    setGreenPercentage(green / total)
  }, [type, buildings])

  const getPercentageLabel = color => `(${color.toFixed(2) * 100}%)`

  return (
    <div
      style={{
        position: 'absolute',
        width: '85%',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'white',
        border: '1px solid #ccc',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-around',
      }}
    >
      {type === mapFilters.general && (
        <>
          <span style={{ fontWeight: 500, color: 'red' }}>
            {getPercentageLabel(redPercentage)} Nunca hecho
          </span>
          <span style={{ fontWeight: 500, color: 'olive', background: 'white' }}>
            {getPercentageLabel(yellowPercentage)} Hecho hace más de 2 meses
          </span>
          <span style={{ fontWeight: 500, color: 'blue' }}>
            {getPercentageLabel(bluePercentage)} Asignado
          </span>
          <span style={{ fontWeight: 500, color: 'darkgreen' }}>
            {getPercentageLabel(greenPercentage)} Hecho en los últimos 2 meses
          </span>
        </>
      )}
      {type === mapFilters.currentMonth && (
        <>
          <span style={{ fontWeight: 500, color: 'olive', background: 'white' }}>
            {getPercentageLabel(yellowPercentage)} No Asignado
          </span>
          <span style={{ fontWeight: 500, color: 'blue' }}>
            {getPercentageLabel(bluePercentage)} Asignado
          </span>
          <span style={{ fontWeight: 500, color: 'darkgreen' }}>
            {getPercentageLabel(greenPercentage)} Hecho
          </span>
        </>
      )}
      {type === mapFilters.previousMonth && (
        <>
          <span style={{ fontWeight: 500, color: 'red' }}>
            {getPercentageLabel(redPercentage)} No hecho
          </span>
          <span style={{ fontWeight: 500, color: 'darkgreen' }}>
            {getPercentageLabel(greenPercentage)} Hecho
          </span>
        </>
      )}
      {type === mapFilters.campaign && (
        <>
          <span style={{ fontWeight: 500, color: 'olive', background: 'white' }}>
            {getPercentageLabel(yellowPercentage)} No Asignado
          </span>
          <span style={{ fontWeight: 500, color: 'blue' }}>
            {getPercentageLabel(bluePercentage)} Asignado
          </span>
          <span style={{ fontWeight: 500, color: 'darkgreen' }}>
            {getPercentageLabel(greenPercentage)} Hecho
          </span>
        </>
      )}
    </div>
  )
}

export { References }
