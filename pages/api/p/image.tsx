import { ImageResponse } from '@vercel/og';
import { countDays, hashids } from '../../../lib/lib'
import { prisma } from '../../../lib/db'
import { GetServerSideProps } from 'next'
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // ?title=<title>
    const hasTitle = searchParams.has('title');
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : 'My default title';

    const hasCount = searchParams.has('count');
    const count = hasCount
      ? searchParams.get('count')?.slice(0, 100)
      : '';

    /*const page = await prisma.page.findUnique({
      where: { id: 0 },
      include: { incidents: true, },
    })*/

    return new ImageResponse(
      (
        <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
        }}
      >
        <h1 tw="text-9xl m-8 mb-4 p-3 rounded-2xl">
                {count}
              </h1>
              <h3 tw="text-xl mb-8 content-center">
                {title}
              </h3>
        </div>
      ),
      {
        width: 400,
        height: 400,
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}