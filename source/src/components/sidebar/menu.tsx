'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { CollapseMenuButton } from '@/components/sidebar/collapse-menu-button'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { getMenuList } from '@/lib/menu-list'
import { cn } from '@/lib/utils'
import SidebarAvatarBtn from './sidebar-avatar-btn'
import UserInfoLabel from './user-info-label'
import { UserProfileMenu } from './user-profile-menu'

interface MenuProps {
  isOpen: boolean | undefined
}

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname()
  const menuList = getMenuList(pathname)

  return (
    <ScrollArea className='[&>div>div[style]]:!block'>
      <nav className='mt-8 h-full w-full'>
        <ul className='flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start '>
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className='w-full' key={index}>
              {menus.map(({ href, label, icon: Icon, active, submenus }, index) =>
                submenus.length === 0 ? (
                  <div className='w-full' key={index}>
                    <TooltipProvider disableHoverableContent>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Button
                            variant={active ? 'secondary' : 'ghost'}
                            className={cn('w-full h-10 mb-1', isOpen === false ? '' : 'justify-start')}
                            asChild
                          >
                            <Link href={href}>
                              <span className={cn(isOpen === false ? '' : 'mr-4')}>
                                <Icon size={18} />
                              </span>
                              <p
                                className={cn(
                                  'max-w-[200px] truncate',
                                  isOpen === false ? '-translate-x-96 opacity-0' : 'translate-x-0 opacity-100'
                                )}
                              >
                                {label}
                              </p>
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        {isOpen === false && <TooltipContent side='right'>{label}</TooltipContent>}
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ) : (
                  <div className='w-full' key={index}>
                    <CollapseMenuButton icon={Icon} label={label} active={active} submenus={submenus} isOpen={isOpen} />
                  </div>
                )
              )}
            </li>
          ))}
          <li className='w-full grow flex items-end '>
            <UserInfo isOpen={isOpen} />
          </li>
        </ul>
      </nav>
    </ScrollArea>
  )
}

const UserInfo = ({ isOpen }: { isOpen?: boolean }) => {
  return (
    <div className='w-full items-center flex justify-between lg:hidden'>
      {isOpen !== false && (
        <>
          <SidebarAvatarBtn disabled={true} />
          <div className='flex items-start'>
            <UserInfoLabel />
          </div>
        </>
      )}

      <UserProfileMenu isOpen={isOpen} />
    </div>
  )
}
