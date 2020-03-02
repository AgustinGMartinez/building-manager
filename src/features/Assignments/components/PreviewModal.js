import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Box } from '@material-ui/core'
import { Modal } from 'components/modal'
import { Assignment } from 'components/Assignment'

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
      <Assignment assignment={assignment} />
      <Box mt={4}>
        <Button variant="contained" color="primary" onClick={onClose}>
          Cerrar
        </Button>
      </Box>
    </Modal>
  )
}

export { PreviewModal }
