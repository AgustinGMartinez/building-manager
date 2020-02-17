import React from "react"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"

const DeleteBuildingConfirmDialog = ({
  onClose,
  onDeleteBuilding,
  open,
  address
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        ¿Está seguro que desea eliminar el edificio de {address}{" "}
        <b style={{ textTransform: "uppercase" }}>
          junto con todos sus timbres
        </b>
        ?
      </DialogTitle>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={onDeleteBuilding}
          color="primary"
          autoFocus
        >
          Borrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export { DeleteBuildingConfirmDialog }
