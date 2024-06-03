'use client'

import { TableCell, TableRow } from "@/components/ui/table";
import { CirclePlus, Download, Filter, AlignJustify } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useState } from "react";
export default function TableHeaderActions({ colspan, table }: { colspan: number, table: any }) {
  const [dropDownOpen, setDropDownOpen] = useState(false)
  return (
    <TableRow className="bg-transparent h-10 hover:bg-transparent">
      <TableCell colSpan={colspan}>
        <div className="flex justify-between">
          <h4 className="font-bold">Ngx Table V3</h4>
          <div className="flex justify-end gap-2 ">
            <DropdownMenu open={dropDownOpen}>
              <DropdownMenuTrigger onMouseEnter={() => setDropDownOpen(true)} className="mt-1" asChild>
                <AlignJustify className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onPointerDownOutside={() => setDropDownOpen(false)}>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="mt-1" asChild>
                  {/* <Button variant="outline">Hover</Button> */}
                  <Filter
                    className="h-4 w-4"
                    onClick={() => {
                      toast.success("test")
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filter</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="mt-1" asChild>
                  {/* <Button variant="outline">Hover</Button> */}
                  <Download
                    className="h-4 w-4"
                    onClick={() => {
                      toast.success("test")
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    onClick={() => {
                      toast.success("test")
                    }}
                  >
                    Add <CirclePlus className=" ml-1 h-4 w-4" />
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </TableCell>
    </TableRow>
  )
}