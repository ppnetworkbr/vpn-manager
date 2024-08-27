import { Dispatch, SetStateAction } from 'react'

export type IsetToastAlert = Dispatch<
  SetStateAction<{
    variant: 'error' | 'warning' | 'info' | 'success'
    message: string
    open: boolean
  }>
>
