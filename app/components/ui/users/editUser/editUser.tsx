import { useState } from 'react'
import Modal from '../../shared/modal/modal'
import UserEditForm from './form'
import { User } from '@prisma/client'
import { ToastAlert, ToastAlertProps } from '../../shared/alert/toastAlert'
interface UserEditModalProps {
  user: User
  isOpenModal: boolean
  closeModal: () => void
}

export default function UserEditModal({
  user,
  closeModal,
  isOpenModal = false,
}: UserEditModalProps) {
  const [toast, setToast] = useState<ToastAlertProps>({} as ToastAlertProps)

  const handleSetToast = (toastData: ToastAlertProps) => {
    setToast(toastData)
  }

  return (
    <Modal open={isOpenModal} handleClose={closeModal} title={`Editar Usuário`}>
      <UserEditForm
        onClose={closeModal}
        user={user}
        setToast={handleSetToast}
      />
      <ToastAlert
        message={toast.message}
        open={toast.open}
        variant={toast.variant}
      />
    </Modal>
  )
}
