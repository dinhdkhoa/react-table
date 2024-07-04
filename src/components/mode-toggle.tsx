'use client'

import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { useTheme } from 'next-themes'
import { forwardRef } from 'react'

const ModeToggle = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const { setTheme, theme } = useTheme()
  return (
    <div
      className='flex items-center focus:bg-accent hover:cursor-pointer text-sm px-2 py-1.5 hover:bg-accent'
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <MoonIcon className='w-4 h-4  mr-3 rotate-90 scale-0 text-muted-foreground transition-transform ease-in-out duration-500 dark:rotate-0 dark:scale-100' />
      <SunIcon className='absolute w-4 h-4 mr-3  rotate-0 text-muted-foreground scale-1000 transition-transform ease-in-out duration-500 dark:-rotate-90 dark:scale-0' />
      Switch Theme
    </div>
  )
})

ModeToggle.displayName = 'ModeToggle'

export default ModeToggle
