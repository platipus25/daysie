import Link from 'next/link'
import Image from "next/image";

interface PageCardProps {
    page: { 
        id: string, 
        title: string, 
        count: number, 
        lastEditedBy?: { name: string, image: string }, 
    }
}

export default function PageCard(props: PageCardProps) {

    return (
        <Link href={`/p/${props.page.id}`}>
            <div className="flex flex-row p-2 text-white rounded bg-indigo-500 active:bg-indigo-400 align-baseline group w-full">
                <span className="m-2 shrink text-2xl self-center h-fit">{props.page.count}</span>
                <div className="flex flex-col mx-2 justify-center content-center">
                    <p className="group-hover:underline self-start">{props.page.title}</p>
                    { props.page.lastEditedBy && 
                    <p className="text-xs text-gray-100 font-light">edited by 
                        <Image 
                        className="rounded-full w-min h-6 w-6 inline-block mx-1"
                        src={props.page.lastEditedBy.image}
                        alt="Profile Picture"
                        width={48}
                        height={48}
                        />
                    </p>
                    }
                </div>
            </div>
        </Link>
    )
}