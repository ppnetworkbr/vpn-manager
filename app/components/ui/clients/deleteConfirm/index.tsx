import { Delete } from '@mui/icons-material'
import { useServerAction } from 'zsa-react'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  Box,
} from '@mui/material'
import { useState } from 'react'

import { ToastAlert, ToastAlertProps } from '../../shared/alert/toastAlert'
import { deleteClientAction } from '@/app/actions/clients/deleteClient'

interface DeleteConfirmProps {
  open: boolean
  onClose: () => void
  id: string
  title: string
  message: string
  redirectOnClose?: string
}

export function DeleteConfirmDialog({
  onClose,
  id,
  message,
  open,

  title,
}: DeleteConfirmProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [toastAlert, setToastAlert] = useState<ToastAlertProps>({
    variant: 'success',
    message: '',
    open: false,
  })
  const { execute } = useServerAction(deleteClientAction, {})
  function handleDelete() {
    setIsLoading(true)
    execute({ id }).then(([, error]) => {
      setIsLoading(false)
      if (error) {
        setToastAlert({
          open: true,
          message: error.message,
          variant: 'error',
        })
      } else {
        setToastAlert({
          open: true,
          message: 'Core deletado com sucesso',
          variant: 'success',
        })
        onClose()
      }
    })
  }

  return (
    <>
      <Box>
        <Dialog open={open} onClose={onClose}>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <Box>
              <Typography>{message}</Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Box>
              <Button onClick={onClose} disabled={!!isLoading}>
                Cancelar
              </Button>
              <LoadingButton
                color="error"
                onClick={() => {
                  handleDelete()
                }}
                loading={!!isLoading}
                loadingPosition="start"
                startIcon={<Delete />}
                variant="text"
              >
                <span>Deletar</span>
              </LoadingButton>
            </Box>
          </DialogActions>
        </Dialog>
        <ToastAlert
          open={toastAlert?.open}
          message={toastAlert?.message}
          variant={toastAlert?.variant}
          claimantIsModal
          onClose={() => setToastAlert({ ...toastAlert, open: false })}
        />
      </Box>
    </>
  )
}
