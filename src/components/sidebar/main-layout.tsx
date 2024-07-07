'use client'

import { Sidebar } from '@/components/sidebar/sidebar'
import { cn } from '@/lib/utils'
import { Navbar } from './navbar'
import { useStore } from '@/core/hooks/use-store'
import { useSidebarToggle } from '@/core/hooks/use-sidebar-toggle'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const sidebar = useStore(useSidebarToggle, (state) => state);
  if (!sidebar) return null

  return (
    <>
      <Sidebar />
      <main
        className={cn(
          ' bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300',
          sidebar?.isOpen === false ? 'lg:ml-[60px]' : 'lg:ml-56'
        )}
      >
        <div>
          <Navbar />
          <div className='pb-8 sm:px-8 min-h-[calc(100vh_-_56px)]'>{children}</div>
        </div>
      </main>
    </>
  )
}
