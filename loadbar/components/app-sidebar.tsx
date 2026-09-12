'use client'

import type { ComponentProps } from 'react'
import Link from 'next/link'
import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import Logo from '@/components/shadcn-studio/logo'
import { placeholderUser } from '@/lib/placeholder-data'
import {
  BriefcaseIcon,
  FolderKanbanIcon,
  LayoutDashboardIcon,
  Settings2Icon,
  UserRoundIcon
} from 'lucide-react'

const navMain = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: <LayoutDashboardIcon />
  },
  {
    title: 'Profile',
    url: '/profile',
    icon: <UserRoundIcon />
  },
  {
    title: 'Portfolio',
    url: '/portfolio',
    icon: <FolderKanbanIcon />
  },
  {
    title: 'Jobs',
    url: '/jobs',
    icon: <BriefcaseIcon />
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: <Settings2Icon />
  }
]

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className='data-[slot=sidebar-menu-button]:p-1.5!'
              render={<Link href='/dashboard' />}
            >
              <Logo className='gap-2' />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: placeholderUser.name,
            email: placeholderUser.email
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
