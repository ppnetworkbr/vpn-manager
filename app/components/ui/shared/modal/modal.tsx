'use client'

import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { ToastAlertProps } from '../../shared/alert/toastAlert'

export default function Modal({
  open,
  handleClose,
  title,
  children,
}: {
  open: boolean
  title: string
  children: React.ReactNode
  handleClose: () => void
  setToast?: (toastData: ToastAlertProps) => void
}) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  )
}
