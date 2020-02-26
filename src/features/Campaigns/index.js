import React from 'react'
import { useFetch } from '../../hooks/useFetch'
import { DefaultTable } from 'components/DefaultTable'
import { CreateCampaignModal, DeleteCampaignModal } from './components'
import { useState } from 'react'

const columns = [
  {
    title: 'Nombre',
    field: 'name',
  },
]

const Campaigns = () => {
  const [assingments, isLoading, fetchCampaigns] = useFetch({ url: '/campaigns' })

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [campaignToDelete, setCampaignToDelete] = useState(null)

  const openCreateModal = () => setIsCreateModalOpen(true)

  const closeCreateModal = () => setIsCreateModalOpen(false)

  const onCreateDone = () => {
    fetchCampaigns()
    closeCreateModal()
  }

  const closeDeleteModal = () => {
    setDeleteModalOpen(false)
    setCampaignToDelete(null)
  }

  const onDeleteDone = async () => {
    fetchCampaigns()
    closeDeleteModal()
  }

  const actions = [
    {
      icon: 'add',
      tooltip: 'Crear campaña',
      isFreeAction: true,
      onClick: openCreateModal,
    },
    {
      icon: 'delete',
      tooltip: 'Eliminar campaña',
      onClick: (_, row) => {
        setCampaignToDelete(row)
        setDeleteModalOpen(true)
      },
    },
  ]

  return (
    <>
      <DefaultTable
        title="Campañas"
        columns={columns}
        data={assingments}
        isLoading={isLoading}
        actions={actions}
      />
      {isCreateModalOpen && (
        <CreateCampaignModal onClose={closeCreateModal} onDone={onCreateDone} />
      )}
      {deleteModalOpen && campaignToDelete && (
        <DeleteCampaignModal
          onClose={closeDeleteModal}
          onDone={onDeleteDone}
          campaign={campaignToDelete}
        />
      )}
    </>
  )
}

export { Campaigns }
