import { Snackbar, Alert } from '@mui/material'

export interface ToastAlertProps {
  variant: 'error' | 'warning' | 'info' | 'success'
  message: string
  open: boolean
  claimantIsModal?: boolean
  onClose?: () => void
}

export function ToastAlert({
  message,
  variant,
  onClose,
  claimantIsModal = false,
  open,
}: ToastAlertProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={variant}
        variant={claimantIsModal ? 'filled' : 'standard'}
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}
