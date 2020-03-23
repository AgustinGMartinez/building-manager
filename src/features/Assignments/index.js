import React from 'react'
import { useFetch } from '../../hooks/useFetch'
import { DefaultTable } from 'components/DefaultTable'
import moment from 'moment'
import { StringUtils } from 'utils'
import DetailsIcon from '@material-ui/icons/Apps'
import { CreateAssignmentModal, DeleteAssignmentModal, PreviewModal } from './components'
import { useState } from 'react'

const columns = [
  {
    title: 'Publicador',
    render: row => `${row.user_name} ${row.user_lastname}`,
  },
  {
    title: 'Finalizado',
    render: row =>
      row.completed && row.completed_at
        ? moment(row.completed_at).format(StringUtils.DATE_FORMAT)
        : 'No',
  },
  {
    title: 'Vencimiento',
    render: row => (row.expiry_date ? moment(row.expiry_date).format(StringUtils.DATE_FORMAT) : ''),
  },
  {
    title: 'Territorios',
    render: row => row.territories.join(', '),
  },
  {
    title: 'Edificios',
    render: row => row.buildings.length,
  },
  {
    title: 'Timbres',
    render: row => row.doorbells.length,
  },
  { title: 'Campaña', field: 'campaign_name' },
]

const Assignments = () => {
  const [assingments, isLoading, fetchAssignments] = useFetch({ url: '/assignments' })

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [assignmentToDelete, setAssignmentToDelete] = useState(null)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [assignmentToPreview, setAssignmentToPreview] = useState(null)

  const openCreateModal = () => setIsCreateModalOpen(true)

  const closeCreateModal = () => setIsCreateModalOpen(false)

  const onCreateDone = () => {
    fetchAssignments()
    closeCreateModal()
  }

  const closeDeleteModal = () => {
    setDeleteModalOpen(false)
    setAssignmentToDelete(null)
  }

  const onDeleteDone = async () => {
    fetchAssignments()
    closeDeleteModal()
  }

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false)
    setAssignmentToPreview(null)
  }

  const actions = [
    {
      icon: 'add',
      tooltip: 'Crear asignación',
      isFreeAction: true,
      onClick: openCreateModal,
    },
    {
      icon: () => <DetailsIcon />,
      tooltip: 'Ver detalles',
      onClick: (_, row) => {
        setAssignmentToPreview(row)
        setIsPreviewModalOpen(true)
      },
    },
    {
      icon: 'delete',
      tooltip: 'Eliminar asignación',
      onClick: (_, row) => {
        setAssignmentToDelete(row)
        setDeleteModalOpen(true)
      },
    },
  ]

  return (
    <>
      <p>Nota: Los usuarios no verán la fecha de vencimiento de sus asignaciones.</p>
      <DefaultTable
        title="Asignaciones"
        columns={columns}
        data={assingments}
        isLoading={isLoading}
        actions={actions}
      />
      {isCreateModalOpen && (
        <CreateAssignmentModal onClose={closeCreateModal} onDone={onCreateDone} />
      )}
      {deleteModalOpen && assignmentToDelete && (
        <DeleteAssignmentModal
          onClose={closeDeleteModal}
          onDone={onDeleteDone}
          assignment={assignmentToDelete}
        />
      )}
      {isPreviewModalOpen && assignmentToPreview && (
        <PreviewModal onClose={closePreviewModal} assignment={assignmentToPreview} />
      )}
    </>
  )
}

export { Assignments }
