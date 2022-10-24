import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const pageData: Prisma.PageCreateInput[] = [
  {
    title: 'Days Without Fire Alarm',
    incidents: {
      create: [
        {
          date: new Date(2022, 7, 30)
        },
        {
          date: new Date(2022, 8, 15)
        }
      ],
    },
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const p of pageData) {
    const page = await prisma.page.create({
      data: p,
    })
    console.log(`Created page with id: ${page.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })