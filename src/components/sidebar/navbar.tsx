import { SheetMenu } from "@/components/sidebar/sheet-menu";
import PageTitle from "./page-title";

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <PageTitle />
        </div>
        {/* <div className="flex flex-1 items-center space-x-2 justify-end"> 
          //right side of header
        </div> */}
      </div>
    </header>
  )
}
