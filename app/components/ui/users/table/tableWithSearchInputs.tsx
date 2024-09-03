'use client'

import {
  Box,
  TableRow,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TablePagination,
  IconButton,
  Tooltip,
  Paper,
} from '@mui/material'
import { Search, Delete, Edit } from '@mui/icons-material'
import { alpha } from '@mui/material/styles'

import React, { useState, ChangeEvent } from 'react'
import StyledNoRows from './styledNoRows'
import { DataProps } from './@types/table'
import { grey } from '@mui/material/colors'
import { DeleteConfirmDialog } from '../deleteConfirm'
import UserEditModal from '../editUser/editUser'
import { Roles, User } from '@prisma/client'

interface EditModalProps {
  open: boolean
  user: User
}
interface ColumnProps {
  id: 'name' | 'email' | 'role' | 'action'
  label: string
  minWidth?: number
  align?: 'right' | 'left' | 'center'
  format?: (value: number) => string
}

// name of the columns
interface TableWithSearchBoxProps {
  users: DataProps[]
}
export default function TableWithSearchBox({ users }: TableWithSearchBoxProps) {
  const columns: readonly ColumnProps[] = [
    {
      id: 'name',
      label: 'Nome',
    },
    {
      id: 'email',
      label: 'Email',
    },
    {
      id: 'role',
      label: 'Nível de Acesso',
    },

    {
      id: 'action',
      align: 'center',
      label: 'Ação',
    },
  ]
  const [page, setPage] = useState(0)

  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    message: '',
    id: '',
    title: '',
  })
  const [editModal, setEditModal] = useState<EditModalProps>(
    {} as EditModalProps,
  )

  const handleCloseEditModal = () => {
    setEditModal({ open: false, user: {} as User })
  }
  const filteredData = users.filter((user) => {
    return (
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.role.includes(search)
    )
  })
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  function handleDelete(id: string, name: string) {
    setDeleteDialog({
      open: true,
      message: `Deseja realmente deletar o ${name}?`,
      id: `${id}`,
      title: `Deletar usuário ${name}?`,
    })
  }
  function handleSearch(value: string) {
    setSearch(value)
  }

  function handleEditClick(data: DataProps) {
    setEditModal({
      open: true,
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        password: '',
        role: data.role === 'admin' ? Roles.admin : Roles.technical,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        deletedAt: data.deletedAt,
        emailVerified: data.emailVerified,
      },
    })
  }

  return (
    <Paper
      sx={{
        mt: '1rem',
      }}
    >
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            flexDirection: 'row',
            py: '0.5rem',
            pr: '0.5rem',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <TextField
              id="input-with-sx"
              label={'Pesquisar'}
              variant="standard"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Search sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
          </Box>
        </Box>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table
            aria-label="sticky table"
            stickyHeader
            sx={{
              opacity: filteredData.length === 0 ? 0.5 : 1,
              // colocar fundo mais escuro no hea do table  sx={{

              '& th': {
                backgroundColor: alpha(grey[100], 0.9),
              },
            }}
          >
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    sx={{
                      mr: column.id === 'action' ? '2rem' : '0',
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {filteredData.length === 0 ? (
              <TableBody>
                <TableRow>
                  <TableCell
                    sx={{
                      textAlign: 'center',
                    }}
                    colSpan={6}
                  >
                    <StyledNoRows />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        const value = row[column.id]
                        switch (column.id) {
                          case 'role':
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {value === 'admin'
                                  ? 'Administrador'
                                  : 'Técnico'}
                              </TableCell>
                            )
                          case 'email':
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {value}
                              </TableCell>
                            )
                          case 'name':
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {value}
                              </TableCell>
                            )

                          default:
                            return (
                              <TableCell key={column.id} align={column.align}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Tooltip
                                    title={'deletar'}
                                    onClick={() => {
                                      handleDelete(row.id, row.name)
                                    }}
                                  >
                                    <IconButton>
                                      <Delete
                                        sx={{
                                          color: 'error.light',
                                        }}
                                      />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip
                                    title={'editar'}
                                    onClick={() => {
                                      handleEditClick(row)
                                    }}
                                  >
                                    <IconButton>
                                      <Edit
                                        sx={{
                                          color: 'primary.main',
                                        }}
                                      />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            )
                        }
                      })}
                    </TableRow>
                  ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        <TablePagination
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            width: '100%',
          }}
          labelRowsPerPage={'Itens por página'}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count}`
          }
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          getItemAriaLabel={(type) =>
            `Ir para ${type === 'next' ? 'Próxima página' : 'Página anterior'}`
          }
        />
        <DeleteConfirmDialog
          open={deleteDialog.open}
          title={deleteDialog.title}
          id={deleteDialog.id}
          onClose={() => setDeleteDialog({ ...deleteDialog, open: false })}
          message={deleteDialog.message}
        />
        <UserEditModal
          isOpenModal={editModal.open}
          user={editModal.user}
          closeModal={handleCloseEditModal}
        />
      </Box>
    </Paper>
  )
}
