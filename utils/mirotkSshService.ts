import { NodeSSH } from 'node-ssh'

const ssh = new NodeSSH()

export async function criarVpnCliente(chr: any, cliente: any) {
  try {
    await ssh.connect({
      host: chr.ip,
      username: chr.usuario,
      password: chr.senha,
      port: chr.portaSsh,
    })

    const commands = [
      `/interface l2tp-server add name=${cliente.nomeFantasia} user=${cliente.usuarioVpn} password=${cliente.senhaVpn} remote-address=${cliente.ipVpn}`,
      `/ip firewall address-list add list=${cliente.nomeFantasia} address=${cliente.ipVpn}`,
    ]

    for (const cmd of commands) {
      await ssh.execCommand(cmd)
    }

    return true
  } catch (error) {
    console.error('Erro ao criar VPN no Mikrotik:', error)
    return false
  } finally {
    ssh.dispose()
  }
}
