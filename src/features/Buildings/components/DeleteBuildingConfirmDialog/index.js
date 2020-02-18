import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import { usePassiveFetch } from 'hooks/usePassiveFetch'
import { toast } from 'react-toastify'
import { Box, LinearProgress } from '@material-ui/core'

const DeleteBuildingConfirmDialog = ({ onClose, onDeleteBuilding, open, address, idToDelete }) => {
  const [fetch, isFetching] = usePassiveFetch()

  const onDelete = async () => {
    try {
      await fetch(`/buildings/${idToDelete}`, {
        method: 'DELETE',
      })
      toast.success('Edificio eliminado con éxito.')
      onDeleteBuilding()
    } catch (err) {
      toast.error('No se pudo eliminar edificio. Intente de nuevo.')
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        ¿Está seguro que desea eliminar el edificio de {address}{' '}
        <b style={{ textTransform: 'uppercase' }}>junto con todos sus timbres</b>?
      </DialogTitle>
      {isFetching && (
        <Box mt={3}>
          <LinearProgress />
        </Box>
      )}
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

export { DeleteBuildingConfirmDialog }
