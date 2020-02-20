import React from 'react'
import { useFetch } from '../../hooks/useFetch'
import { DefaultTable } from 'components/DefaultTable'
import moment from 'moment'
import { StringUtils } from 'utils'
import DetailsIcon from '@material-ui/icons/Apps'
import { CreateAssignmentModal } from './components'
import { useState } from 'react'

const columns = [
  {
    title: 'Publicador',
    render: row => `${row.user_name} ${row.user_lastname}`,
  },
  { title: 'Creado', render: row => moment(row.created_at).format(StringUtils.DATE_FORMAT) },
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
  { title: 'Nota', field: 'admin_note' },
]

const Assignments = () => {
  /* const [assingments, isLoading, fetchAssignments] = useFetch({ url: '/assignments' }) */
  const [assingments, isLoading, fetchAssignments] = [[], false]

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const openCreateModal = () => setIsCreateModalOpen(true)

  const closeCreateModal = () => setIsCreateModalOpen(false)

  const onCreateDone = () => {
    fetchAssignments()
    closeCreateModal()
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
      onClick: () => {},
    },
    {
      icon: 'delete',
      tooltip: 'Eliminar asignación',
      onClick: () => {},
    },
  ]

  return (
    <>
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
    </>
  )
}

export { Assignments }
