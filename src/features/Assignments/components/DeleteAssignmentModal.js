import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import { usePassiveFetch } from 'hooks/usePassiveFetch'
import { toast } from 'react-toastify'
import { Box, LinearProgress } from '@material-ui/core'

const DeleteAssignmentModal = ({ onClose, onDone, assignment }) => {
  const [fetch, isFetching] = usePassiveFetch()

  const onDelete = async () => {
    try {
      await fetch(`/assignments/${assignment.id}`, {
        method: 'DELETE',
      })
      toast.success('Asignación eliminada con éxito.')
      onDone()
    } catch (err) {
      toast.error('No se pudo eliminar asignación. Intente de nuevo.')
    }
  }
  console.log({ assignment })

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>
        ¿Está seguro que desea eliminar esta asignación de {assignment.user_name}{' '}
        {assignment.user_lastname}?
        {isFetching && (
          <Box mt={3}>
            <LinearProgress />
          </Box>
        )}
      </DialogTitle>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button variant="contained" onClick={onDelete} color="primary" autoFocus>
          Borrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export { DeleteAssignmentModal }
