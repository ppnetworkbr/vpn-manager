import { Button } from '@mui/material'
import React from 'react'

interface ButtonWithIconProps {
  title: string
  icon?: React.ReactNode
}

export default function ButtonWithIcon({ title, icon }: ButtonWithIconProps) {
  function handleClickOpen() {}

  return (
    <Button
      onClick={handleClickOpen}
      startIcon={icon}
      variant="contained"
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
