import React from 'react'
import { Button, Box } from '@material-ui/core'
import { Modal } from 'components/modal'
import { Assignment } from 'components/Assignment'

const PreviewModal = ({ onClose, assignment }) => {
  return (
    <Modal open close={onClose} width={1000}>
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
