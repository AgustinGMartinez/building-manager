import React from 'react'
import { Assignment } from 'components/Assignment'
import { useContext } from 'react'
import { UserContext } from 'contexts'
import { useFetch } from 'hooks/useFetch'

const Separator = () => (
  <div style={{ margin: '3rem 0', borderBottom: '1px solid #666', width: '100%' }} />
)

const MyAssignments = () => {
  const { user } = useContext(UserContext)
  const [assignments, isLoading] = useFetch({ url: `/assignments?user_id=${user.id}` })

  return assignments.length ? (
    assignments.map((assignment, i) => (
      <React.Fragment key={assignment.id}>
        <Assignment assignment={assignment} />
        {i + 1 !== assignments.length && <Separator />}
      </React.Fragment>
    ))
  ) : isLoading ? (
    'Cargando...'
  ) : (
    <h4>No tenés asignaciones todavía</h4>
  )
}

export { MyAssignments }
