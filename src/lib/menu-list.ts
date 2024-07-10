import { Tag, Users, Settings, Bookmark, SquarePen, LayoutGrid, LogIn, Table } from 'lucide-react'

type Submenu = {
  href: string
  label: string
  active: boolean
}

type Menu = {
  href: string
  label: string
  active: boolean
  icon: any
  submenus: Submenu[]
}

type Group = {
  groupLabel: string
  menus: Menu[]
}

export function getActiveMenuItem(pathname: string): Menu | Submenu | null {
  const groups = getMenuList(pathname)

  for (const group of groups) {
    for (const menu of group.menus) {
      if (menu.active) {
        return menu
      }

      for (const submenu of menu.submenus) {
        if (submenu.active) {
          return submenu
        }
      }
    }
  }

  return null
}

export const getActiveMenuTitle = (pathname: string): string => {
  const activeItem = getActiveMenuItem(pathname)
  if (!activeItem) {
    return 'Page'
    throw new Error('Route is not yet declared in getMenuList')
  }
  return activeItem.label
}

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: '',
      menus: [
        {
          href: '/dashboard',
          label: 'Dashboard',
          active: pathname.includes('/dashboard'),
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: 'Contents',
      menus: [
        {
          href: '',
          label: 'Posts',
          active: pathname.includes('/posts'),
          icon: SquarePen,
          submenus: [
            {
              href: '/posts',
              label: 'All Posts',
              active: pathname === '/posts'
            },
            {
              href: '/posts/new',
              label: 'New Post',
              active: pathname === '/posts/new'
            }
          ]
        },
        {
          href: '/table',
          label: 'Table',
          active: pathname.includes('/table'),
          icon: Table,
          submenus: []
        },
        {
          href: '/login',
          label: 'Login',
          active: pathname.includes('/login'),
          icon: LogIn,
          submenus: []
        }
      ]
    },
    {
      groupLabel: 'Settings',
      menus: [
        {
          href: '/enode-log',
          label: 'Enode Log',
          active: pathname.includes('/enode-log'),
          icon: Users,
          submenus: []
        },
        {
          href: '/account',
          label: 'Account',
          active: pathname.includes('/account'),
          icon: Settings,
          submenus: []
        }
      ]
    }
  ]
}
