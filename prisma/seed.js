/* eslint-disable @typescript-eslint/no-var-requires */
const { hashSync } = require('bcrypt')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const user = {
    email: 'admins@localhost.com',
    password: hashSync('admin', 10),
    name: 'admin',
    role: 'admin',
  }

  const existingUser = await prisma.user.findFirst({
    where: { email: 'admins@localhost.com' },
  })

  if (existingUser) {
    await prisma.user.update({
      where: { id: existingUser.id },
      data: user,
    })
  } else {
    await prisma.user.create({ data: user })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
