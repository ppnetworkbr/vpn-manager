import { useState } from 'react'
import Modal from '../../shared/modal/modal'
import ClientEditForm from './form'
import { Client } from '@prisma/client'
import { ToastAlert, ToastAlertProps } from '../../shared/alert/toastAlert'
interface ClientEditModalProps {
  client: Client
  isOpenModal: boolean
  closeModal: () => void
}

export default function ClientEditModal({
  client,
  closeModal,
  isOpenModal = false,
}: ClientEditModalProps) {
  const [toast, setToast] = useState<ToastAlertProps>({} as ToastAlertProps)

  const handleSetToast = (toastData: ToastAlertProps) => {
    setToast(toastData)
  }

  return (
    <>
      <Modal
        open={isOpenModal}
        handleClose={closeModal}
        title={`Editar Core Vpn ${client?.name ? client.name : ''}`}
      >
        <ClientEditForm
          onClose={closeModal}
          client={client}
          setToast={handleSetToast}
        />
      </Modal>
      <ToastAlert
        open={toast.open}
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </>
  )
}
