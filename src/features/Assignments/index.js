import React from 'react'
import { useFetch } from '../../hooks/useFetch'
import { DefaultTable } from 'components/DefaultTable'
import moment from 'moment'
import { StringUtils } from 'utils'

const columns = [
  {
    title: 'Publicador',
    render: row => `${row.user_name} ${row.user_lastname}`,
  },
  { title: 'Finalizado', render: row => (row.completed ? 'Sí' : 'No') },
  {
    title: 'Finalizado el',
    render: row =>
      row.completed_at ? moment(row.completed_at).format(StringUtils.DATE_FORMAT) : '',
  },
  { title: 'Creado', render: row => moment(row.created_at).format(StringUtils.DATE_FORMAT) },
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
  const [assingments, isLoading] = useFetch({ url: '/assignments' })

  return (
    <DefaultTable title="Asignaciones" columns={columns} data={assingments} isLoading={isLoading} />
  )
}

export { Assignments }
