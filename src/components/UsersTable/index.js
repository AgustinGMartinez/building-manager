import React, { useState } from "react"
import { Modal } from "../modal"
import { NewUserForm } from "./components/NewUserForm"
import { DefaultTable } from "../DefaultTable"

const UsersTable = ({ isAdmin, data, loading, onCreateUser }) => {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const closeCreateModal = () => setCreateModalOpen(false)
  const onCreatedUser = () => {
    closeCreateModal()
    onCreateUser()
  }
  return (
    <>
      <DefaultTable
        isLoading={loading}
        columns={[
          {
            title: "Nombre y apellido",
            field: "fullname"
          },
          { title: "Usuario", field: "username" }
        ]}
        data={data}
        title={isAdmin ? "Administradores" : "Usuarios"}
        actions={[
          {
            icon: "add",
            tooltip: "Crear usuario",
            isFreeAction: true,
            onClick: () => setCreateModalOpen(true)
          }
        ]}
      />
      <Modal open={createModalOpen} close={closeCreateModal}>
        <NewUserForm
          isAdmin={isAdmin}
          onClose={closeCreateModal}
          onDone={onCreatedUser}
        />
      </Modal>
    </>
  )
}

export { UsersTable }
