import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import { Button, Box } from '@material-ui/core'
import { Modal } from 'components/modal'
import { StringUtils } from 'utils'
import moment from 'moment'

const useStyles = makeStyles(theme => ({
  root: {
    '& > input': {
      margin: theme.spacing(1),
    },
  },
}))

const PreviewModal = ({ onClose, assignment }) => {
  const classes = useStyles()

  return (
    <Modal open close={onClose}>
      <form className={classes.root} autoComplete="off">
        <h2>Asignación de {assignment.user_name}</h2>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Publicador asignado"
              value={`${assignment.user_name} ${assignment.user_lastname}`}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="Campaña" value={assignment.campaign_name || 'Ninguna'} />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Fecha de creación"
              value={moment(assignment.created_at).format(StringUtils.DATE_FORMAT)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField fullWidth label="Finalizada" value={assignment.completed ? 'Sí' : 'No'} />
          </Grid>
          <Grid item xs={3}>
            <TextField fullWidth label="Territorios" value={assignment.territories.join(', ')} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Nota del admin" multiline value={assignment.admin_note} />
          </Grid>
          <Grid item xs={12}>
            {assignment.buildings.map(building => (
              <div
                key={building.id}
                style={{
                  background: '#eee',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 20px',
                  flexWrap: 'wrap',
                }}
              >
                <h4 style={{ margin: '0 1rem 0 0' }}>
                  {building.street} {building.house_number}
                </h4>
                {assignment.doorbells.map(doorbell => {
                  if (doorbell.building_id !== building.id) return null
                  return (
                    <span
                      key={doorbell.id}
                      style={{
                        marginRight: '0.5rem',
                        background: 'white',
                        borderRadius: 10,
                        padding: 10,
                        marginBottom: 5,
                      }}
                    >
                      {doorbell.floor || 'PB'}-{doorbell.identifier}
                    </span>
                  )
                })}
              </div>
            ))}
          </Grid>
        </Grid>
        <Box mt={4}>
          <Button variant="contained" color="primary" onClick={onClose}>
            Cerrar
          </Button>
        </Box>
      </form>
    </Modal>
  )
}

export { PreviewModal }
