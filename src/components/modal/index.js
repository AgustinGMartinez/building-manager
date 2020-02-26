import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import MaterialModal from '@material-ui/core/Modal'

function getModalStyle({ width }) {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    width,
    overflow: 'auto',
    maxHeight: '90vh',
  }
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))

const Modal = ({ open, handleClose, close, children, width, noBackdrop }) => {
  const classes = useStyles()
  const modalStyle = getModalStyle({
    width,
  })

  return (
    <div>
      <MaterialModal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
        onBackdropClick={noBackdrop ? undefined : close}
      >
        <div style={modalStyle} className={classes.paper}>
          {children}
        </div>
      </MaterialModal>
    </div>
  )
}

Modal.defaultProps = {
  handleClose: () => {},
  width: 600,
  noBackdrop: false,
}

export { Modal }
