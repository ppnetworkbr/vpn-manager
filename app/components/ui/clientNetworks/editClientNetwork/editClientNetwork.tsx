import { useState } from 'react'
import Modal from '../../shared/modal/modal'
import ClientNetworkEditForm from './form'
import { clientNetworks } from '@prisma/client'
import { ToastAlert, ToastAlertProps } from '../../shared/alert/toastAlert'
interface ClientNetworkEditModalProps {
  clientNetwork: clientNetworks
  isOpenModal: boolean
  closeModal: () => void
}

export default function ClientNetworkEditModal({
  clientNetwork,
  closeModal,
  isOpenModal = false,
}: ClientNetworkEditModalProps) {
  const [toast, setToast] = useState<ToastAlertProps>({} as ToastAlertProps)

  const handleSetToast = (toastData: ToastAlertProps) => {
    setToast(toastData)
  }

  return (
    <Modal
      open={isOpenModal}
      handleClose={closeModal}
      title={`Editar Core Vpn ${clientNetwork?.name ? clientNetwork.name : ''}`}
    >
      <ClientNetworkEditForm
        onClose={closeModal}
        clientNetwork={clientNetwork}
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
