import { hashids } from '../../lib/lib'
import { prisma } from '../../lib/db'

export default async function handler(req, res) {
    // Get data submitted in request's body.
    const body = req.body
  
    // Optional logging to see the responses
    // in the command line where next.js app is running.
    console.log('body: ', body)
  
    // Guard clause checks for first and last name,
    // and returns early if they are not found
    if (!body.pageId || !hashids.isValidId(body.pageId)) {
      // Sends a HTTP bad request error code
      return res.status(400).json({ data: 'Id not found' })
    }

    const dbId = Number(hashids.decode(body.pageId)[0])

    let page = await prisma.page.findUnique({ where: { id: dbId }})
    
    if (page === null) {
      return res.status(400).json({ data: `id \`${dbId}\` is not a valid page` })
    }

    const result = await prisma.incident.create({
      data: {
        date: new Date(),
        page: { connect: { id: page.id } },
      },
    })

    console.log(result)

    page = await prisma.page.findUnique({
      include: { incidents: true },
      where: { id: dbId },
    })
  
    // Found the name.
    // Sends a HTTP success code
    res.status(200).json({ data: JSON.parse(JSON.stringify(page)) })
  }