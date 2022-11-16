import { useSession, signIn, signOut } from "next-auth/react"
import Image from "next/image";
import Link from "next/link";


const Header = () => {
    const { data: session } = useSession()

    return (
        <header className="flex flex-nowrap w-full p-3 justify-end">
            <div className="flex text-gray-600 dark:text-gray-100 h-12">
            { session ?
            <>
            <button 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent active:shadow-lg px-4 py-2 font-medium"
            onClick={async () => await signOut()}
            >
                Sign out
            </button>
                <Image 
                    className="rounded-full w-min h-12 w-12"
                    src={session.user.image}
                    alt="Profile Picture"
                    width={48}
                    height={48}
                />

            </>:
            <button 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent active:shadow-lg px-4 py-2 font-medium"
            onClick={async () => await signIn()}
            >
                Sign in
            </button>
            }
            </div>
        </header>
    )
}

export default Header;