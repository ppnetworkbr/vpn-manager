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
      this.ssh.exec(command, (err, stream) => {
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
              reject(new Error('Comando não retornou saída'))
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

  async createL2TPUser(username: string, password: string) {
    const command = `/ppp/secret/add name=${username} password=${password} service=l2tp profile=default`
    await this.executeCommand(command)
  }

  async getL2TPUsers(): Promise<getL2tpUser[] | []> {
    const command = 'ppp secret print'
    let lines: string[]
    try {
      lines = await this.executeCommand(command)

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
        // igorar o primeiro valor, que é o número da linha

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
          idMikrotik: values[0],
          name: values[1],
          service: values[2],
          password: values[3],
          profile: values[4],
        }

        return userData
      })
      return users
    } catch (error) {
      throw new Error(`Erro ao obter usuários L2TP: ${error}`)
    }
    // Encontrar o índice da linha que contém os cabeçalhos da tabela
  }
  // ... adapte os demais métodos para utilizar executeCommand
}
