import { hashids } from '../../lib/lib'
import { prisma } from '../../lib/db'
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from './auth/[...nextauth]'
import { Awaitable, NextAuthOptions } from 'next-auth'

export default async function handler(req, res) {
    const options: NextAuthOptions = {
      ...authOptions,
      callbacks: {
        ...authOptions.callbacks,
        async session({ session, token, user }) {
          //console.log(session, token, user)

          // send the user id through to the handler
          const s = {
            ...session,
            user: {
              ...session.user,
              id: user.id
            }
          }
          
          return s
        }
      }
    }

    const session = await unstable_getServerSession(req, res, options)

    if (!session) {
      res.status(401).json({ message: "You must be logged in." });
      return;
    }

    const userId = (session.user as unknown as { id: string }).id

    const user = await prisma.user.findUnique({ 
      where: { 
        id: userId,
      }
    })
    console.log(user)

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
        user: { connect: { id: userId }},
        page: { connect: { id: page.id }},
      },
    })

    console.log(result)

    page = await prisma.page.findUnique({
      include: { incidents: true },
      where: { id: dbId },
    })

    console.log(page)
  
    // Found the name.
    // Sends a HTTP success code 
    res.status(200).json({ data: JSON.parse(JSON.stringify(page)) })
  }