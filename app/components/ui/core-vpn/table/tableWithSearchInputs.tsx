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
import {
  Search,
  Delete,
  Edit,
  SyncProblem,
  CloudDone,
} from '@mui/icons-material'
import { alpha } from '@mui/material/styles'

import React, { useState, ChangeEvent, useEffect } from 'react'
import StyledNoRows from './styledNoRows'
import { DataProps } from './@types/table'
import { grey } from '@mui/material/colors'
import { DeleteConfirmDialog } from '@/app/components/ui/core-vpn/deleteConfirm'
import CoreEditModal from '@/app/components/ui/core-vpn/editCore/editCore'
import { CoreVpn } from '@prisma/client'
import { checkConnectionCoreVpn } from '@/app/actions/core-vpn/checkConnectionCoreVpn'
import { useServerAction } from 'zsa-react'
import { LoadingButton } from '@mui/lab'

interface EditModalProps {
  open: boolean
  coreVpn: CoreVpn
}
interface ColumnProps {
  id: 'name' | 'ip' | 'port' | 'username' | 'password' | 'action'
  label: string
  minWidth?: number
  align?: 'right' | 'left' | 'center'
  format?: (value: number) => string
}
interface ConnectionStatus {
  [key: string]: {
    isPending: boolean
    error: string | null
    success: boolean | null
  }
}
// name of the columns
interface TableWithSearchBoxProps {
  coreVpns: DataProps[]
}
export default function TableWithSearchBox({
  coreVpns,
}: TableWithSearchBoxProps) {
  const columns: readonly ColumnProps[] = [
    {
      id: 'name',
      label: 'Nome',
    },
    {
      id: 'ip',
      label: 'IP',
    },
    {
      id: 'username',
      label: 'Usuário',
    },
    {
      id: 'port',
      label: 'Porta',
    },
    {
      id: 'password',
      label: 'Senha',
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

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({})
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    message: '',
    id: '',
    title: '',
  })
  const [editModal, setEditModal] = useState<EditModalProps>(
    {} as EditModalProps,
  )

  const { execute } = useServerAction(checkConnectionCoreVpn)
  const handleCloseEditModal = () => {
    setEditModal({ open: false, coreVpn: {} as CoreVpn })
  }
  const filteredData =
    coreVpns && coreVpns.length > 0 && coreVpns[0].id
      ? coreVpns.filter((coreVpn) => {
          return (
            coreVpn.ip.toLowerCase().includes(search.toLowerCase()) ||
            coreVpn.name.toLowerCase().includes(search.toLowerCase()) ||
            coreVpn.username.toLowerCase().includes(search.toLowerCase())
          )
        })
      : []
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
      title: `Deletar core ${name}?`,
    })
  }
  function handleSearch(value: string) {
    setSearch(value)
  }

  function handleEditClick(data: DataProps) {
    setEditModal({
      open: true,
      coreVpn: {
        id: data.id,
        name: data.name,
        ip: data.ip,
        port: data.port,
        username: data.username,
        password: data.password,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        deletedAt: data.deletedAt,
      },
    })
  }
  async function handleCheckConnectionClick(data: DataProps) {
    setConnectionStatus((prev) => ({
      ...prev,
      [data.id]: { isPending: true, error: null, success: null },
    }))

    const [, err] = await execute({
      id: data.id,
      ip: data.ip,
      username: data.username,
      password: data.password,
      port: data.port,
    })
    if (err) {
      setConnectionStatus((prev) => ({
        ...prev,
        [data.id]: { isPending: false, error: err.data, success: null },
      }))
    } else {
      setConnectionStatus((prev) => ({
        ...prev,
        [data.id]: { isPending: false, error: null, success: true },
      }))
    }
  }
  useEffect(() => {
    coreVpns.forEach((row) => {
      handleCheckConnectionClick(row)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coreVpns])
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
                          case 'ip':
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {value}
                              </TableCell>
                            )
                          case 'username':
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
                          case 'port':
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {value}
                              </TableCell>
                            )

                          case 'password':
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
                                  <Tooltip
                                    title={
                                      connectionStatus[row.id]?.error
                                        ? connectionStatus[row.id]?.error
                                        : connectionStatus[row.id]?.success
                                          ? 'Conectado'
                                          : 'Testar conexão'
                                    }
                                    onClick={() => {
                                      handleCheckConnectionClick(row)
                                    }}
                                  >
                                    <LoadingButton
                                      sx={{
                                        // deixar o botão redondo
                                        borderRadius: '50%',
                                        width: '40px',
                                        height: '40px',
                                        padding: 0,
                                        minWidth: 0,
                                      }}
                                      loading={
                                        connectionStatus[row.id]?.isPending
                                      }
                                    >
                                      {!connectionStatus[row.id]?.isPending &&
                                        (connectionStatus[row.id]?.error ? (
                                          <SyncProblem
                                            sx={{
                                              color: 'error.light',
                                            }}
                                          />
                                        ) : (
                                          connectionStatus[row.id]?.success && (
                                            <CloudDone
                                              sx={{
                                                color: 'success.main',
                                              }}
                                            />
                                          )
                                        ))}
                                    </LoadingButton>
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
        <CoreEditModal
          isOpenModal={editModal.open}
          coreVpn={editModal.coreVpn}
          closeModal={handleCloseEditModal}
        />
      </Box>
    </Paper>
  )
}
