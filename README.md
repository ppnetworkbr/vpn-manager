
![Logo](https://dev.ppnetwork.app/images/login.png?07-17-38)

----
# VPN Manager

Este projeto surgiu da nossa necessidade de gerenciar diversas conexões VPN em nosso sistema de consultoria. Com ele, você pode:

- [x]  Gerenciar, coordenar e aplicar políticas em todas as VPNs dos seus clientes.
- [x]  Controlar o acesso dos usuários a cada VPN através de uma interface web intuitiva.
- [x]  Orquestrar a seleção de clientes para cada usuário, permitindo que eles alternem entre VPNs facilmente.
- [x]  Gerenciar redes, incluindo a criação, modificação e exclusão de regras de membros e firewalls.
- [x]  Marcar rotas para direcionar o tráfego da rede de cada cliente para o usuário desejado.
- [ ]  Marcar rotas especificas para determinados clientes.


## Roadmap

- Adicionar gerenciamento de rotas mais especificas

- Adicionar suporte ao wireguard


## Váriaveis de Ambiente

To run this project, you will need to add the following environment variables to your .env file

`AUTH_SECRET=` token utilizando para criptografia do JWT

`L2TP-PRESHARED-KEY=` chave pré-compartilhada configurada no mikrotik

`DATABASE_URL=` url de conexão do postgres exemplo: `postgresql://username:password@localhost:5432/database?schema=public`


## Rodando Local

Clone o repositorio 

```bash
  git clone https://github.com/ppnetworkbr/vpn-manager
```

Acesse a pasta do projeto

```bash
  cd vpn-manager
```

Instala-le as dependecias 

```bash
  npm install --force
```

Rode as migrações de banco de dados

```bash
  npx prisma migrate deploy
```
Inicie o serviço

```bash
  npm run start
```


## Tecnologia utilizadas

**Client:** React, NextJS, MUI, AuthJS

**Server:** Node, NEXTJS, Prisma, AuthJS, ssh2

**DataBase:** Postgres


## Autores

- [@caikpigosso](https://www.github.com/caikpigosso)
- [@ppnetwork](https://www.instagram.com/ppnetwork.consultoria/)


## Obs

Documentação em processo de escrita

