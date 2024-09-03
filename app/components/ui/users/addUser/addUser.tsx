'use client'

import { useState } from 'react'
import ButtonAddUser from './buttonAddUser'
import { Box } from '@mui/material'
import { ToastAlert, ToastAlertProps } from '../../shared/alert/toastAlert'
import Modal from '../../shared/modal/modal'
import UserAddForm from './form'
export default function AddUser() {
  const [open, setOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState<ToastAlertProps>({
    open: false,
    variant: 'info',
    message: 'Usuário criado com sucesso',
  })
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  const setToast = (toastData: ToastAlertProps) => {
    setModalOpen(toastData)
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
        <h1>Usuários</h1>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '20px',
          }}
        >
          <ButtonAddUser handleClickOpen={handleClickOpen} />
        </Box>
      </Box>
      <Modal handleClose={handleClose} open={open} title="Adicionar Usuário">
        <UserAddForm onClose={handleClose} setToast={setToast} />
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
