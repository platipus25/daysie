import { useState, Fragment } from 'react'
import { Dialog, Transition, Popover } from '@headlessui/react'

interface CopyLinkProps {
    href: string,
}

export default function CopyLink(props: CopyLinkProps) {
    const [ isBannerShown, showBanner ] = useState(false);

    const copyLink = () => {
        const origin = location.origin
        const link = new URL(props.href, origin)

        navigator.clipboard.writeText(link.href)

        showBanner(true);
      }

    return (
        <Popover className="relative">
        {({ close }) => (
            <>
                <Popover.Button 
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                    onClick={() => {
                        copyLink()
                        console.log("hi")
                        //close()
                    }}>
                    Copy Link
                </Popover.Button>

                <Popover.Panel className="absolute rounded z-10 bg-gray-600 py-1 px-2 mt-2">
                    <h3 className="text-sm font-medium leading-6 whitespace-nowrap text-white dark:text-gray-200">Link Copied!</h3>
                </Popover.Panel>
            </>
        )}
        </Popover>
    )
}
