import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet"
import { AccountType } from "@/schemaValidations/account.schema"
import {
  Menu,
  Package2,
  Search,
  Shell
} from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "./mode-toggle"
import Image from "next/image"


export default async function Header({ user }: { user: AccountType | null }) {
  // thay vì truyền props user có thể dùng cookies()
  // if (!user) {
  //   return null
  // }
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 mb-4 z-10">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Image src="/logo.png" width={75} height={75} alt="ITL Logo" />
        </Link>
        <Link
          href="/table"
          className="text-foreground transition-colors hover:text-foreground"
        >
          Table
        </Link>
        <Link
          href="/login"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Login
        </Link>
      </nav>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial">
          <ModeToggle />
        </div>
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
    </header>
  )
}
