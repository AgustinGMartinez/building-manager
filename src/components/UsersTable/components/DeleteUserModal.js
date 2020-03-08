import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import { usePassiveFetch } from 'hooks/usePassiveFetch'
import { toast } from 'react-toastify'
import { Box, LinearProgress } from '@material-ui/core'

const DeleteUserModal = ({ isAdmin, onClose, onDone, user }) => {
  const [fetch, isFetching] = usePassiveFetch()

  const onDelete = async () => {
    try {
      await fetch(`/${isAdmin ? 'admins' : 'users'}/${user.id}`, {
        method: 'DELETE',
      })
      toast.success('Usuario eliminado con éxito.')
      onDone()
    } catch (err) {
      toast.error('No se pudo eliminar usuario. Intente de nuevo.')
    }
  }

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>
        ¿Está seguro que desea eliminar al {isAdmin ? 'admin' : 'usuario'} {user.fullname}?
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
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export { DeleteUserModal }
