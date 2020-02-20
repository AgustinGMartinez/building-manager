import React, { useState } from 'react'
import { DefaultTable } from 'components/DefaultTable'
import { Modal } from 'components/modal'
import { NewBuildingForm } from './components/NewBuildingForm'
import { DeleteBuildingConfirmDialog, SetBellsModal } from './components'
import BellIcon from '@material-ui/icons/Notifications'
import { useFetch } from 'hooks/useFetch'

const columns = [
  { title: 'Territorio', field: 'territory', defaultSort: 'asc' },
  { title: 'Calle', render: row => `${row.street} ${row.house_number}` },
  { title: 'Timbres', field: 'doorbell_count' },
  { title: 'Notas del administrador', field: 'admin_note' },
]

const Buildings = () => {
  const [buildings, isLoading, fetchBuildings] = useFetch({ url: '/buildings' })

  // create
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const closeCreateModal = () => setCreateModalOpen(false)

  const onCreateBuilding = async () => {
    fetchBuildings()
    closeCreateModal()
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
    fetchBuildings()
    closeDeleteModal()
  }

  // bells
  const [isBellsModalOpen, setIsBellsModalOpen] = useState(false)
  const [buildingBell, setBuildingBell] = useState(null)

  const closeBellsModal = () => {
    setIsBellsModalOpen(false)
    setBuildingBell(null)
  }

  const onBellsDone = () => {
    fetchBuildings()
    closeBellsModal()
  }

  return (
    <>
      <DefaultTable
        title="Edificios"
        columns={columns}
        data={buildings}
        isLoading={isLoading}
        actions={[
          {
            icon: 'add',
            tooltip: 'Crear edificio',
            isFreeAction: true,
            onClick: () => setCreateModalOpen(true),
          },
          {
            icon: () => <BellIcon />,
            tooltip: 'Editar timbres',
            onClick: (_, row) => {
              setIsBellsModalOpen(true)
              setBuildingBell(row)
            },
          },
          {
            icon: 'delete',
            tooltip: 'Borrar edificio',
            onClick: (_, row) => {
              setAddressToDelete(`${row.street} ${row.house_number}`)
              setIdToDelete(row.id)
              setDeleteModalOpen(true)
            },
          },
        ]}
      />
      {createModalOpen && (
        <Modal open close={closeCreateModal}>
          <NewBuildingForm onClose={closeCreateModal} onCreateBuilding={onCreateBuilding} />
        </Modal>
      )}
      {deleteModalOpen && addressToDelete && (
        <DeleteBuildingConfirmDialog
          open
          onClose={closeDeleteModal}
          onDeleteBuilding={onDeleteBuilding}
          address={addressToDelete}
          idToDelete={idToDelete}
        />
      )}
      {isBellsModalOpen && buildingBell && (
        <SetBellsModal
          onClose={closeBellsModal}
          initialBells={buildingBell.doorbells}
          buildingId={buildingBell.id}
          onDone={onBellsDone}
        />
      )}
    </>
  )
}

export { Buildings }
