'use client'

import React, { useState } from 'react'

import { Box } from '@mui/material'
import { ToastAlert, ToastAlertProps } from '../../shared/alert/toastAlert'
import Modal from '../../shared/modal/modal'
import ClientAddForm from './form'
import ButtonWithIcon from '../../shared/buttom/buttom'
import { Add } from '@mui/icons-material'

export default function AddClientNetwork() {
  const [open, setOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState<ToastAlertProps>({
    open: false,
    variant: 'info',
    message: 'Rede criada com sucesso',
  })

  function handleClickOpen() {
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
  }

  function setToast(toastData: ToastAlertProps) {
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
        <h1>Redes</h1>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '20px',
          }}
        >
          <ButtonWithIcon
            icon={<Add />}
            handleClickOpen={handleClickOpen}
            title="Adicionar Rede"
          />
        </Box>
      </Box>
      <Modal handleClose={handleClose} open={open} title="Adicionar Rede">
        <ClientAddForm onClose={handleClose} setToast={setToast} />
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
