import Head from 'next/head'
import Image from 'next/image'
import { GetServerSideProps } from 'next'
import { countDays, latestIncident, hashids } from '../lib/lib'
import { prisma } from '../lib/db'
import styles from '../styles/Home.module.css'
import PageCard from '../components/PageCard'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { PlusIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

export const getServerSideProps: GetServerSideProps = async (context) => {


  const pages = await prisma.page.findMany({
    include: { 
      incidents: true,
    },
  })

  //console.log(pages)
  const uiPages = await Promise.all(
    pages.map(async page => {
    const latest = latestIncident(page.incidents)
    let lastEditedBy = null
    if (latest !== null && latest.userId !== null) {
      const user = await prisma.user.findUnique({
        where: {
          id: latest.userId
        }
      })
      
      lastEditedBy = {
        name: user.name,
        image: user.image,
      }
    }

    return {
      count: countDays(page.incidents),
      id: hashids.encode(page.id),
      title: page.title,
      lastEditedBy: lastEditedBy,
    }
  }))

  return { props: { pages: uiPages } }
}

interface HomeProps {
  pages: { 
    count: number, 
    id: string, 
    title: string, 
    lastEditedBy?: { name: string, image: string },
  }[],
}

export default function Home(props: HomeProps) {

  const pages = props.pages.map(page => (
    <PageCard key={page.id} page={page}></PageCard>
  ))

  return (
    <div>
      <Head>
        <title>Daysie</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="min-h-screen content-center flex flex-col items-center px-4">
        {/*<div className='self-center w-2/4'>
          <Link href="/create">
          <button className='p-2 rounded-full bg-blue-500 active:bg-blue-600'>
            <PlusIcon className="w-6 h-6" />
          </button>
          </Link>
        </div>*/}
        <div className="flex flex-col gap-3 h-fit w-fit">
          {pages}
        </div>
      </main>

      <Footer />
    </div>
  )
}
