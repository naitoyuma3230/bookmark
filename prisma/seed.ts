import { PrismaClient } from '@prisma/client'
import { articles } from '../data/articles'
import { users } from '../data/users'

const prisma = new PrismaClient()

async function main() {
  await prisma.bookmarkOnUsers.deleteMany()
  await prisma.article.deleteMany()
  await prisma.user.deleteMany()
  await prisma.user.createMany({
    data: users,
  })
  await prisma.article.createMany({
    data: articles,
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
