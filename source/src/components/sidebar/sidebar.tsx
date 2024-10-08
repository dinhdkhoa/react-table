import Link from 'next/link'

import { Menu } from '@/components/sidebar/menu'
import { SidebarToggle } from '@/components/sidebar/sidebar-toggle'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useStore } from '@/core/hooks/use-store'
import { useSidebarToggle } from '@/core/hooks/use-sidebar-toggle'

export function Sidebar() {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300',
        sidebar?.isOpen === false ? 'w-[60px]' : 'w-56'
      )}
    >
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
      <div className='relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800'>
        <Button
          className={cn(
            'transition-transform ease-in-out duration-300 mb-1',
            sidebar?.isOpen === false ? 'translate-x-1' : 'translate-x-0'
          )}
          variant='link'
          asChild
        >
          <Link href='/dashboard' className='flex items-center gap-2'>
            <Image src='/logo.png' className={`overflow-hidden transition-all`} alt='Logtechub Logo' width={277} height={57} />
            {/* <h1
              className={cn(
                'font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300 overflow-hidden',
                sidebar?.isOpen === false ? '-translate-x-96 opacity-0 hidden' : 'translate-x-0 opacity-100'
              )}
            >
              Enode
            </h1> */}
          </Link>
        </Button>
        <Menu isOpen={sidebar?.isOpen} />
      </div>
    </aside>
  )
}
