import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import React from 'react'
import { useState } from 'react'
import { GetServerSideProps } from 'next'
import Error from 'next/error'
import { countDays, hashids } from '../../lib/lib'
import { prisma } from '../../lib/db'
import ResetDialog from '../../components/ResetDialog'
import { sendRenderResult } from 'next/dist/server/send-payload'
import CopyLink from '../../components/CopyLink'
import { useSession, signIn, signOut } from "next-auth/react"

// Fetch all posts (in /pages/index.tsx)
export const getServerSideProps: GetServerSideProps = async (context) => {
    const id = Array.isArray(context.params.id) ? context.params.id[0] : context.params.id

    const dbId = Number(hashids.decode(id)[0]);

    console.log(`id: ${id} db_id: ${dbId}`)

    if (Number.isNaN(dbId)) {
      return { props: { errorCode: 400, page: {} } }
    }

    const page = await prisma.page.findUnique({
      where: { id: dbId },
      include: { incidents: true, },
    })

    if (page === null) {
      // uh oh
      console.error("Couldn't find page")
      return { props: { errorCode: 404, page: {} } }
    }

    //console.log(page)
    const count = countDays(page.incidents)

    const uiPage = {
      title: page.title,
      count,
      id,
    }

    return { props: { errorCode: null, page: uiPage } }
}

interface PageProps {
  errorCode: number | null,
  page: { title: string, id: string, count: number },
}

const Page: React.FC<PageProps> = props => {
  const [ count, setCount ] = useState(props.page.count);
  const { data: session } = useSession()

  console.log(session)

  if (props.errorCode) {
    return <Error statusCode={props.errorCode} />
  }

  const sendReset = async () => {
    const body = {
      pageId: props.page.id,
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }

    const response = await fetch('/api/reset', options)

    if (response.ok) {
      const json = await response.json()
      const page = json.data
      
      console.log(page)
      const days = countDays(page.incidents)

      setCount(days)
    } else {
      console.error(response, await response.json())
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{`Daysie | ${props.page.title}`}</title>
        <meta name="description" content="Generated by create next app" />
        <meta property="og:image" content="https://og-examples.vercel.sh/api/static" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="grid justify-items-center content-start pb-3 min-h-screen">
        <h1 className="text-9xl m-8 mb-4 p-3 rounded-2xl">{count}</h1>
        <h3 className="text-xl mb-8">
            { props.page.title }
        </h3>
        <div className="flex flex-row gap-3 justify-evenly">
          <ResetDialog resetAction={sendReset}/>
          <CopyLink href={`/p/${props.page.id}`}></CopyLink>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
  
export default Page;