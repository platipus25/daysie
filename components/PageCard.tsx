import Link from 'next/link'

interface PageCardProps {
    page: { id: string, title: string, count: number, }
}

export default function PageCard(props: PageCardProps) {

    return (
        <Link href={`/p/${props.page.id}`}>
            <div className="flex flex-row p-2 text-white rounded bg-indigo-500 active:bg-indigo-400 align-baseline group w-full">
                <span className="m-2 shrink text-2xl self-center h-fit">{props.page.count}</span>
                <div className="flex flex-col mx-2 justify-center content-center">
                    <p className="group-hover:underline self-start">{props.page.title}</p>
                    {/*<p>edited by wheherhajelrhj</p>*/}
                </div>
            </div>
        </Link>
    )
}