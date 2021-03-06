import React, { useState, useEffect } from 'react'
import { mapFilters, statisticColors } from 'const'

const styles = {
  red: {
    fontWeight: 500,
    margin: '0 0.5rem',
    display: 'inline-block',
    color: statisticColors.neverDone,
  },
  yellow: {
    fontWeight: 500,
    margin: '0 0.5rem',
    display: 'inline-block',
    color: statisticColors.unassigned,
  },
  blue: {
    fontWeight: 500,
    margin: '0 0.5rem',
    display: 'inline-block',
    color: statisticColors.assigned,
  },
  green: {
    fontWeight: 500,
    margin: '0 0.5rem',
    display: 'inline-block',
    color: statisticColors.done,
  },
}

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
      if (building.marker === statisticColors.neverDone) return red++
      if (building.marker === statisticColors.unassigned) return yellow++
      if (building.marker === statisticColors.assigned) return blue++
      if (building.marker === statisticColors.done) return green++
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
          <span style={styles.red}>{getPercentageLabel(redPercentage)} Nunca hecho</span>
          <span style={styles.yellow}>
            {getPercentageLabel(yellowPercentage)} 2+ meses sin hacer
          </span>
          <span style={styles.blue}>{getPercentageLabel(bluePercentage)} Asignado</span>
          <span style={styles.green}>
            {getPercentageLabel(greenPercentage)} Hecho en últimos 2 meses (al menos 1 timbre)
          </span>
        </>
      )}
      {type === mapFilters.currentMonth && (
        <>
          <span style={styles.yellow}>{getPercentageLabel(yellowPercentage)} No Asignado</span>
          <span style={styles.blue}>{getPercentageLabel(bluePercentage)} Asignado</span>
          <span style={styles.green}>
            {getPercentageLabel(greenPercentage)} Hecho (al menos 50%)
          </span>
        </>
      )}
      {type === mapFilters.previousMonth && (
        <>
          <span style={styles.red}>{getPercentageLabel(redPercentage)} No hecho</span>
          <span style={styles.green}>
            {getPercentageLabel(greenPercentage)} Hecho (al menos 50%)
          </span>
        </>
      )}
      {type === mapFilters.campaign && (
        <>
          <span style={styles.yellow}>{getPercentageLabel(yellowPercentage)} No Asignado</span>
          <span style={styles.blue}>{getPercentageLabel(bluePercentage)} Asignado</span>
          <span style={styles.green}>
            {getPercentageLabel(greenPercentage)} Hecho (al menos 90%)
          </span>
        </>
      )}
    </div>
  )
}

export { References }
