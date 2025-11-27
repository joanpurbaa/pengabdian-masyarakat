import { Heart, UserIcon } from 'lucide-react'
import type { ReactNode } from 'react'

function MainLayout(props: { children: ReactNode }) {
    const { children } = props

    return (
        <section className='h-screen flex flex-col overflow-hidden'>
            <header className="z-20 fixed w-full bg-gray-100 text-white flex justify-between items-center p-[20px] shadow-xs">
                <section>
                    <a className="flex items-center space-x-4 cursor-pointer" href="/">
                        <Heart className="fill-[#70B748] text-[#70B748] w-10 h-10" />
                        <div className="text-[#70B748] text-base lg:text-[24px] font-bold">
                            Title
                        </div>
                    </a>
                </section>
                <section className="flex justify-end items-center gap-[15px] md:gap-[30px]">
                    <div className="flex items-center gap-3">
                        <h3 className="text-zinc-800 text-base lg:text-xl font-medium">
                            Name
                        </h3>
                        <UserIcon className="w-7 h-7 text-zinc-800" />
                    </div>
                </section>
            </header>
            <section className='h-full flex'>
                {children}
            </section>
        </section>
    )
}

export default MainLayout