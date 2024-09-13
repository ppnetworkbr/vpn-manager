'use client'

import { useState } from 'react'

import { Box } from '@mui/material'
import { ToastAlert, ToastAlertProps } from '../../shared/alert/toastAlert'
import Modal from '../../shared/modal/modal'
import CoreVpnAddForm from './form'
import ButtonWithIcon from '../../shared/buttom/buttom'
import { CloudSync, Add } from '@mui/icons-material'
import { useServerAction } from 'zsa-react'
import { checkAllConfigs } from '@/app/actions/core-vpn/checkAllConfigs'
export default function AddCoreVpn() {
  const [open, setOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState<ToastAlertProps>({
    open: false,
    variant: 'info',
    message: 'Core criado com sucesso',
  })

  const { execute, isPending } = useServerAction(checkAllConfigs)
  function handleClickOpen() {
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
  }

  function setToast(toastData: ToastAlertProps) {
    setModalOpen(toastData)
  }
  async function handleClickSyncCofig() {
    const [data, error] = await execute()
    console.log(data, error, 'data')
    if (error) {
      setModalOpen({
        open: true,
        message: 'Erro ao sincronizar configurações',
        variant: 'error',
      })
    } else {
      setModalOpen({
        open: true,
        message: 'Configurações sincronizadas com sucesso',
        variant: 'success',
      })
    }
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <h1>Cores VPN</h1>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '20px',
          }}
        >
          <ButtonWithIcon
            title={isPending ? 'Sync...' : 'Sync Config'}
            disabled={isPending}
            icon={<CloudSync />}
            handleClickOpen={handleClickSyncCofig}
          />
          <ButtonWithIcon
            icon={<Add />}
            handleClickOpen={handleClickOpen}
            title="Adicionar Core VPN"
          />
        </Box>
      </Box>
      <Modal handleClose={handleClose} open={open} title="Adicionar Core VPN">
        <CoreVpnAddForm onClose={handleClose} setToast={setToast} />
      </Modal>
      <ToastAlert
        open={modalOpen.open}
        message={modalOpen.message}
        variant={modalOpen.variant}
        onClose={() => setModalOpen({ ...modalOpen, open: false })}
      />
    </>
  )
}
