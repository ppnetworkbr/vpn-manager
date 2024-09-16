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
        console.debug(command)

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
              console.debug(`Comando '${command}' não retornou saída`)
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
    console.log(result, 'result do criar usuario ')
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
        console.log(values, 'values')
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
      console.log(users, 'users')
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
  // ... adapte os demais métodos para utilizar executeCommand
}
