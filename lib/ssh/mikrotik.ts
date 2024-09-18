import { Client } from 'ssh2'
import { getL2tpUser } from './mikrotik.types'

export class MikrotikManager {
  private ssh: Client
  private host: string
  private username: string
  private password: string
  private port: number

  constructor(host: string, username: string, password: string, port: number) {
    this.ssh = new Client()
    this.host = host
    this.username = username
    this.password = password
    this.port = port
  }

  async connect() {
    return new Promise<void>((resolve, reject) => {
      this.ssh
        .on('ready', () => resolve())
        .on('error', (err) => {
          reject(err)
        })
        .connect({
          host: this.host,
          port: this.port, // Porta SSH padrão
          username: this.username,
          password: this.password,
          timeout: 5000,
        })
    })
  }

  async disconnect() {
    this.ssh.end()
  }

  async executeCommand(command: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.ssh.exec(command, {}, (err, stream) => {
        if (err) {
          reject(new Error(`Erro ao executar o comando: ${err.message}`))
          return
        }

        if (!stream) {
          reject(
            new Error('Erro ao executar o comando: stream nulo/indefinido'),
          )
          return
        }

        let output = ''
        stream
          .on('close', () => {
            if (output.trim() === '') {
              resolve([])
              return
            }
            const lines = output.trim().split('\n')
            resolve(lines)
          })
          .on('data', (data: { toString: () => string }) => {
            output += data.toString()
          })
          .stderr.on('data', (data) => {
            reject(new Error(data.toString()))
          })
      })
    })
  }

  async createL2TPUser({
    password,
    username,
  }: {
    username: string
    password: string
  }) {
    const command = `ppp secret add name=${username} password=${password} profile=VPN-MANAGER comment=VPN-MANAGER-${username} service=l2tp`
    const result = await this.executeCommand(command)
    // reuslto [ 'input does not match any value of profile' ]

    if (result[0] === 'input does not match any value of profile') {
      throw new Error('Profile não encontrado no mikrotik')
    }
  }

  async getL2TPUsers(): Promise<getL2tpUser[] | []> {
    const command = 'ppp secret print where comment ~"VPN-MANAGER"'
    let lines: string[]
    try {
      lines = await this.executeCommand(command)
      // remover linhas com comentario

      lines = lines.filter((line) => !line.includes(';;; VPN-MANAGER-'))
      const headerIndex = lines.findIndex(
        (line) => line.includes('NAME') && line.includes('SERVICE'),
      )

      if (headerIndex === -1) {
        throw new Error('Formato da tabela de usuários inválido')
      }

      const columnNames = lines[headerIndex].trim().split(/\s+/)

      columnNames.splice(columnNames.indexOf('CALLER-ID'), 1)
      columnNames.splice(columnNames.indexOf('REMOTE-ADDRESS'), 1)
      const userLines = lines
        .slice(headerIndex + 1)
        .filter((line) => line.trim() !== '')
      const users = userLines.map((line) => {
        const values = line.trim().split(/\s+/)

        // Garantir que haja valores suficientes para todas as colunas,
        // mesmo se houver espaços em branco no final da linha
        while (values.length < columnNames.length) {
          values.push('')
        }

        // Remover espaços em branco extras do final do último valor (PROFILE)
        if (values.length > 0) {
          values[values.length - 1] = values[values.length - 1].trim()
        }

        const userData: getL2tpUser = {
          name: values[0],
          service: values[1],
          password: values[2],
          profile: values[3],
        }

        return userData
      })

      return users
    } catch (error) {
      throw new Error(`Erro ao obter usuários L2TP: ${error}`)
    }
    // Encontrar o índice da linha que contém os cabeçalhos da tabela
  }

  async deleteL2TPUser(username: string) {
    const command = `ppp secret remove ${username}`
    await this.executeCommand(command)
  }

  async createIpAddressList(network: string, client: string) {
    const command = `ip firewall address-list add address=${network} list=VPN-MANAGER-${client} comment=VPN-MANAGER-${client}`
    const result = await this.executeCommand(command)
    if (result[0] === 'input does not match any value of list') {
      throw new Error('Lista não encontrada no mikrotik')
    }
  }

  async removeIpAddressList(number: number) {
    const command = `ip firewall address-list remove ${number}`
    await this.executeCommand(command)
  }

  async getIpAddressList() {
    const command =
      'ip firewall address-list print where comment ~"VPN-MANAGER"'
    let lines: string[]
    lines = await this.executeCommand(command)
    lines = lines.filter((line) => !line.includes(';;; VPN-MANAGER-'))
    const headerIndex = lines.findIndex(
      (line) => line.includes('ADDRESS') && line.includes('LIST'),
    )

    if (headerIndex === -1) {
      throw new Error('Formato da tabela de endereços inválido')
    }

    const columnNames = lines[headerIndex].trim().split(/\s+/)

    columnNames.splice(columnNames.indexOf('COMMENT'), 1)
    const ipListLines = lines
      .slice(headerIndex + 1)
      .filter((line) => line.trim() !== '')
    const ipList = ipListLines.map((line) => {
      const values = line.trim().split(/\s+/)

      // Garantir que haja valores suficientes para todas as colunas,
      // mesmo se houver espaços em branco no final da linha
      while (values.length < columnNames.length) {
        values.push('')
      }

      // Remover espaços em branco extras do final do último valor (PROFILE)
      if (values.length > 0) {
        values[values.length - 1] = values[values.length - 1].trim()
      }

      const ipData = {
        list: values[0],
        network: values[1],
      }

      return ipData
    })

    return ipList
  }

  async createVpnClient({
    ip,
    username,
    preSharedKey,
    password,
    ipSrcAddress,
    name,
  }: {
    ip: string
    ipSrcAddress: string
    username: string
    preSharedKey: string
    password: string
    name: string
  }) {
    const command = `interface l2tp-client add connect-to=${ip} user=${username} password=${password} comment=VPN-MANAGER name=VPN-MANAGER-${name} ipsec-secret=${preSharedKey} use-ipsec=yes disabled=no src-address=${ipSrcAddress} dial-on-demand=yes`
    await this.executeCommand(command)
  }

  async removeVpnClient(name: string) {
    const command = `interface l2tp-client remove ${name}`
    await this.executeCommand(command)
  }

  async createIpRoute({ name }: { name: string }) {
    const command = `ip route add gateway=VPN-MANAGER-${name} dst-address=0.0.0.0/0 routing-mark=VPN-MANAGER-${name} comment=VPN-MANAGER`
    await this.executeCommand(command)
  }

  async removeIpRoute(number: number) {
    const command = `ip route remove ${number}`
    await this.executeCommand(command)
  }

  async getIpRoute() {
    const command = 'ip route print where comment ~"VPN-MANAGER"'
    let lines: string[]
    lines = await this.executeCommand(command)
    lines = lines.filter((line) => !line.includes(';;; VPN-MANAGER'))
    const headerIndex = lines.findIndex(
      (line) => line.includes('GATEWAY') && line.includes('DST-ADDRESS'),
    )

    if (headerIndex === -1) {
      throw new Error('Formato da tabela de rotas inválido')
    }

    const columnNames = lines[headerIndex].trim().split(/\s+/)

    columnNames.splice(columnNames.indexOf('COMMENT'), 1)
    const ipRouteLines = lines
      .slice(headerIndex + 1)
      .filter((line) => line.trim() !== '')
    const ipRoute = ipRouteLines.map((line) => {
      const values = line.trim().split(/\s+/)

      // Garantir que haja valores suficientes para todas as colunas,
      // mesmo se houver espaços em branco no final da linha
      while (values.length < columnNames.length) {
        values.push('')
      }

      // Remover espaços em branco extras do final do último valor (PROFILE)
      if (values.length > 0) {
        values[values.length - 1] = values[values.length - 1].trim()
      }

      const ipData = {
        gateway: values[1],
        dstAddress: values[0],
      }
      return ipData
    })
    return ipRoute
  }

  async createIpNat({ name }: { name: string }) {
    const command = `ip firewall nat add chain=srcnat action=masquerade out-interface=VPN-MANAGER-${name} comment=VPN-MANAGER`
    await this.executeCommand(command)
  }

  async removeIpNat(number: number) {
    const command = `ip firewall nat remove ${number}`
    await this.executeCommand(command)
  }
  async moveToUpNat() {
    const command = 'ip firewall nat export'
    let lines: string[]
    lines = await this.executeCommand(command)
    lines = lines.filter((line) => !line.includes('#'))
    lines = lines.filter((line) => !line.includes('/ip firewall nat'))
    lines = lines.filter((line) => line.includes('chain'))
    // pegar index das linhas que possui VPN-MANAGER
    const indexs = lines.map((line, index) => {
      if (line.includes('VPN-MANAGER')) {
        return index
      }
    })

    await this.executeCommand('ip firewall nat print')
    for (const index of indexs) {
      if (index !== undefined) {
        const command = `ip firewall nat move ${index} 0`
        await this.executeCommand(command)
      }
    }
  }
  async getIpNatLines() {
    const command = 'ip firewall nat print where comment ~"VPN-MANAGER"'
    let lines: string[]
    lines = await this.executeCommand(command)
    lines = lines.filter((line) => !line.includes(';;;'))
    lines = lines.filter((line) => !line.includes('Flags: X - disabled'))
    lines = lines.filter((line) => line !== '\r')
    return lines.length
  }

  async createOrChangeIpMangle({
    userName,
    clientName,
  }: {
    userName: string
    clientName: string
  }) {
    const command = `ip firewall mangle add in-interface=<l2tp-${userName}>  comment="VPN-MANAGER-${userName}" dst-address-list=VPN-MANAGER-${clientName} action=mark-routing new-routing-mark=VPN-MANAGER-${clientName} chain=prerouting`
    const result = await this.executeCommand(command)
    if (result[0] === 'input does not match any value of interface') {
      throw new Error('Interface não encontrada no mikrotik')
    }
  }

  async userL2tpIsOnline(userName: string) {
    const command = `ppp active print where name=${userName}`
    let lines = await this.executeCommand(command)
    lines = lines.filter((line) => !line.includes(';;;'))
    lines = lines.filter((line) => !line.includes('Flags'))
    lines = lines.filter((line) => !line.includes('NAME'))
    return lines.length > 0
  }

  async getIpMangleCount(userName: string): Promise<number> {
    const command = `ip firewall mangle print where comment ~"VPN-MANAGER-${userName}"`
    let lines = await this.executeCommand(command)
    lines = lines.filter((line) => !line.includes(';;;'))
    lines = lines.filter((line) => !line.includes('Flags'))
    lines = lines.filter((line) => line.includes(userName))
    return lines.length
  }

  async removeIpMangle(number: number) {
    const command = `ip firewall mangle remove ${number}`
    await this.executeCommand(command)
  }
}
