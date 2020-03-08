import React, { useState } from 'react'
import { Modal } from '../modal'
import { NewUserForm, DeleteUserModal } from './components'
import { DefaultTable } from '../DefaultTable'

const UsersTable = ({ isAdmin, data, loading, onCreateUser, onDeleteUser }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  const closeCreateModal = () => setIsCreateModalOpen(false)

  const onCreatedUser = () => {
    closeCreateModal()
    onCreateUser()
  }

  const handleOpenDeleteModal = user => {
    setIsDeleteModalOpen(true)
    setUserToDelete(user)
  }

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false)
    setUserToDelete(null)
  }

  const onDeleteUserDone = () => {
    handleDeleteModalClose()
    onDeleteUser()
  }

  return (
    <>
      <DefaultTable
        isLoading={loading}
        columns={[
          {
            title: 'Nombre y apellido',
            field: 'fullname',
          },
          { title: 'Usuario', field: 'username' },
          isAdmin
            ? { title: 'Es superadmin', render: admin => (admin.is_superadmin ? 'Sí' : 'No') }
            : {},
        ]}
        data={data}
        title={isAdmin ? 'Administradores' : 'Usuarios'}
        actions={[
          {
            icon: 'add',
            tooltip: `Crear ${isAdmin ? 'administrador' : 'usuario'}`,
            isFreeAction: true,
            onClick: () => setIsCreateModalOpen(true),
          },
          {
            icon: 'delete',
            tooltip: `Borrar ${isAdmin ? 'administrador' : 'usuario'}`,
            onClick: (e, user) => handleOpenDeleteModal(user),
          },
        ]}
      />
      {isCreateModalOpen && (
        <Modal open close={closeCreateModal}>
          <NewUserForm isAdmin={isAdmin} onClose={closeCreateModal} onDone={onCreatedUser} />
        </Modal>
      )}
      {isDeleteModalOpen && userToDelete && (
        <DeleteUserModal
          isAdmin={isAdmin}
          user={userToDelete}
          onClose={handleDeleteModalClose}
          onDone={onDeleteUserDone}
        />
      )}
    </>
  )
}

export { UsersTable }
