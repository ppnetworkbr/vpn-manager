import { Button } from '@mui/material'
import React from 'react'

interface ButtonWithIconProps {
  title: string
  icon?: React.ReactNode
  disabled?: boolean
  handleClickOpen: () => void
}

export default function ButtonWithIcon({
  title,
  icon,
  disabled = false,
  handleClickOpen,
}: ButtonWithIconProps) {
  return (
    <Button
      onClick={handleClickOpen}
      startIcon={icon}
      disabled={disabled}
      variant="outlined"
      sx={{
        fontSize: {
          xs: '0.8rem',
          sm: '0.8rem',
          md: '0.8rem',
          lg: '1rem',
        },
      }}
    >
      {title}
    </Button>
  )
}
