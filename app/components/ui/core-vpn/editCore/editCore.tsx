import { useState } from 'react'
import Modal from '../../shared/modal/modal'
import UserEditForm from './form'
import { CoreVpn } from '@prisma/client'
import { ToastAlert, ToastAlertProps } from '../../shared/alert/toastAlert'
interface UserEditModalProps {
  coreVpn: CoreVpn
  isOpenModal: boolean
  closeModal: () => void
}

export default function UserEditModal({
  coreVpn,
  closeModal,
  isOpenModal = false,
}: UserEditModalProps) {
  const [toast, setToast] = useState<ToastAlertProps>({} as ToastAlertProps)

  const handleSetToast = (toastData: ToastAlertProps) => {
    setToast(toastData)
  }

  return (
    <Modal
      open={isOpenModal}
      handleClose={closeModal}
      title={`Editar Core Vpn ${coreVpn?.name ? coreVpn.name : ''}`}
    >
      <UserEditForm
        onClose={closeModal}
        coreVpn={coreVpn}
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
