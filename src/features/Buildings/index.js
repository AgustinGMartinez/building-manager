import React, { useState } from "react"
import { DefaultTable } from "components/DefaultTable"
import { useFetchBuildings } from "hooks/useFetchBuildings"
import { Modal } from "components/modal"
import { NewBuildingForm } from "./components/NewBuildingForm"
import { toast } from "react-toastify"
import { DeleteBuildingConfirmDialog, SetBellsModal } from "./components"
import BellIcon from "@material-ui/icons/Notifications"

const columns = [
  { title: "Territorio", field: "territory", defaultSort: "asc" },
  { title: "Calle", render: row => `${row.street} ${row.house_number}` },
  { title: "Timbres", field: "doorbell_count" },
  { title: "Notas del administrador", field: "admin_note" }
]

const Buildings = () => {
  const [newBuildingTriggerId, setNewBuildingTriggerId] = useState(0)
  const [buildings, loading] = useFetchBuildings(newBuildingTriggerId)
  // create
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const closeCreateModal = () => setCreateModalOpen(false)
  const onCreateBuilding = async building => {
    try {
      await fetch("/api/buildings", {
        method: "POST",
        body: building
      })
      toast.success("Edificio creado con éxito.")
      setNewBuildingTriggerId(val => ++val)
      closeCreateModal()
    } catch (err) {
      return Promise.reject()
    }
  }
  // delete
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState(null)
  const [idToDelete, setIdToDelete] = useState(null)
  const closeDeleteModal = () => {
    setDeleteModalOpen(false)
    setAddressToDelete(null)
    setIdToDelete(null)
  }
  const onDeleteBuilding = async () => {
    try {
      await fetch(`/api/buildings?id=${idToDelete}`, {
        method: "DELETE"
      })
      toast.success("Edificio eliminado con éxito.")
      setNewBuildingTriggerId(val => ++val)
      closeDeleteModal()
    } catch (err) {
      return Promise.reject()
    }
  }

  // bells
  const [isBellsModalOpen, setIsBellsModalOpen] = useState(false)
  const [buildingBell, setBuildingBell] = useState(null)
  const closeBellsModal = () => {
    setIsBellsModalOpen(false)
    setBuildingBell(null)
  }

  return (
    <>
      <DefaultTable
        title="Edificios"
        columns={columns}
        data={buildings}
        isLoading={loading}
        actions={[
          {
            icon: "add",
            tooltip: "Crear edificio",
            isFreeAction: true,
            onClick: () => setCreateModalOpen(true)
          },
          {
            icon: "delete",
            tooltip: "Borrar edificio",
            onClick: (_, row) => {
              setAddressToDelete(`${row.street} ${row.house_number}`)
              setIdToDelete(row.id)
              setDeleteModalOpen(true)
            }
          },
          {
            icon: () => <BellIcon />,
            tooltip: "Editar timbres",
            onClick: (_, row) => {
              setIsBellsModalOpen(true)
              setBuildingBell(row)
            }
          }
        ]}
      />
      {createModalOpen && (
        <Modal open close={closeCreateModal}>
          <NewBuildingForm
            onClose={closeCreateModal}
            onCreateBuilding={onCreateBuilding}
          />
        </Modal>
      )}
      {deleteModalOpen && addressToDelete && (
        <DeleteBuildingConfirmDialog
          open
          onClose={closeDeleteModal}
          onDeleteBuilding={onDeleteBuilding}
          address={addressToDelete}
        />
      )}
      {isBellsModalOpen && buildingBell && (
        <SetBellsModal
          open
          onClose={closeBellsModal}
          initialBells={buildingBell.doorbells}
          buildingId={buildingBell.id}
        />
      )}
    </>
  )
}

export { Buildings }
