
![Logo](https://dev.ppnetwork.app/images/login.png?07-17-38)

----
# VPN Manager

Este projeto surgiu da nossa necessidade de gerenciar diversas conexões VPN em nosso sistema de consultoria. Com ele, você pode:

- [x] Gerenciar, coordenar e aplicar políticas em todas as VPNs dos seus clientes.
- [x] Controlar o acesso dos usuários a cada VPN através de uma interface web intuitiva.
- [x] Orquestrar a seleção de clientes para cada usuário, permitindo que eles alternem entre VPNs facilmente.
- [x] Gerenciar redes, incluindo a criação, modificação e exclusão de regras de membros e firewalls.
- [x] Marcar rotas para direcionar o tráfego da rede de cada cliente para o usuário desejado.
- [ ] Marcar rotas específicas para determinados clientes.

## Roadmap

- Adicionar gerenciamento de rotas mais específicas.
- Adicionar suporte ao WireGuard.



## Váriaveis de Ambiente

Para executar este projeto, você precisará adicionar as seguintes variáveis de ambiente ao seu arquivo .env:   


`AUTH_SECRET=`token utilizado para criptografia do JWT

`L2TP-PRESHARED-KEY=` chave pré-compartilhada configurada no MikroTik

`DATABASE_URL=` URL de conexão do Postgres. Exemplo: `postgresql://username:password@localhost:5432/database?schema=public`


## Executando Localmente

Clone o repositório:

```bash
git clone https://github.com/ppnetworkbr/vpn-manager
```

Acesse a pasta do projeto:

```bash
  cd vpn-manager
```

Instale as dependências:

```bash
  npm install --force
```

Execute as migrações de banco de dados:

```bash
  npx prisma migrate deploy
```
Inicie o serviço

```bash
  npm run start
```


## Tecnologia utilizadas

**Cliente**: React, Next.js, MUI, Auth.js.
**Servidor**: Node, Next.js, Prisma, Auth.js, ssh2.
**Banco de Dados**: Postgres.

## Autores

- [@caikpigosso](https://www.github.com/caikpigosso)
- [@ppnetwork](https://www.instagram.com/ppnetwork.consultoria/)


## Observações
Documentação em processo de escrita.



