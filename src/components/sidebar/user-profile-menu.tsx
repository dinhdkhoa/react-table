"use client"

import Link from "next/link"
import {
  Ellipsis,
  EllipsisVertical,
  LayoutGrid,
  LogOut,
  User
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import ModeToggle  from "../mode-toggle"
import SidebarAvatarBtn from "./sidebar-avatar-btn"
import UserInfoLabel from "./user-info-label"

export function UserProfileMenu({ isOpen }: { isOpen?: boolean }) {
  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              {isOpen === false ? (
                <SidebarAvatarBtn />
              ) : (
                <EllipsisVertical className=" h-5 w-5 hover:cursor-pointer" />
              )}
            </DropdownMenuTrigger>
          </TooltipTrigger>
          {isOpen == false && (
            <TooltipContent side="right" hidden={isOpen}>
              Profile
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      <UserProfileMenuContents />
    </DropdownMenu>
  )
}

const UserProfileMenuContents = () => {
  return (
    <DropdownMenuContent className="w-56" align="start" forceMount>
      <DropdownMenuLabel>
        <UserInfoLabel />
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem className="hover:cursor-pointer" asChild>
          <Link href="/dashboard" className="flex items-center">
            <LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:cursor-pointer" asChild>
          <ModeToggle />
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:cursor-pointer" asChild>
          <Link href="/account" className="flex items-center">
            <User className="w-4 h-4 mr-3 text-muted-foreground" />
            Account
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="hover:cursor-pointer" onClick={() => {}}>
        <LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
        Sign out
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}
