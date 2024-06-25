"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table"
import {
  ArrowUpDown,
  ChevronDown,
  CirclePlus,
  Download,
  Filter,
  MoreHorizontal
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import GridHeader from "./_components/grid-header"
import GridPagination from "./_components/grid-pagination"
import { toast } from "sonner"
import { GridDeleteButton } from "./_components/modal"

const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@yahoo.com",
    date: "2024-05-01",
    currency: "USD",
    transactionType: "purchase",
    country: "USA"
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@gmail.com",
    date: "2024-04-20",
    currency: "EUR",
    transactionType: "refund",
    country: "Germany"
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@gmail.com",
    date: "2024-05-15",
    currency: "GBP",
    transactionType: "purchase",
    country: "UK"
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@gmail.com",
    date: "2024-03-30",
    currency: "USD",
    transactionType: "purchase",
    country: "USA"
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@hotmail.com",
    date: "2024-04-10",
    currency: "CAD",
    transactionType: "purchase",
    country: "Canada"
  },
  {
    id: "x9djw8l2",
    amount: 450,
    status: "success",
    email: "johndoe@gmail.com",
    date: "2024-05-05",
    currency: "USD",
    transactionType: "withdrawal",
    country: "USA"
  },
  {
    id: "plq5k8z7",
    amount: 125,
    status: "failed",
    email: "janedoe@gmail.com",
    date: "2024-02-25",
    currency: "AUD",
    transactionType: "purchase",
    country: "Australia"
  },
  {
    id: "g7klm9pq",
    amount: 540,
    status: "processing",
    email: "emily88@gmail.com",
    date: "2024-03-18",
    currency: "USD",
    transactionType: "purchase",
    country: "USA"
  },
  {
    id: "h6w9y8xu",
    amount: 380,
    status: "success",
    email: "michael23@yahoo.com",
    date: "2024-04-12",
    currency: "JPY",
    transactionType: "purchase",
    country: "Japan"
  },
  {
    id: "s7tj4nm5",
    amount: 995,
    status: "success",
    email: "alice.smith@gmail.com",
    date: "2024-01-08",
    currency: "USD",
    transactionType: "refund",
    country: "USA"
  },
  {
    id: "u8vkp0rw",
    amount: 689,
    status: "failed",
    email: "robert56@yahoo.com",
    date: "2024-05-20",
    currency: "INR",
    transactionType: "purchase",
    country: "India"
  },
  {
    id: "t3hr8mv9",
    amount: 410,
    status: "processing",
    email: "linda44@hotmail.com",
    date: "2024-03-05",
    currency: "USD",
    transactionType: "purchase",
    country: "USA"
  },
  {
    id: "q4pz7kl0",
    amount: 765,
    status: "success",
    email: "david.jones@gmail.com",
    date: "2024-02-15",
    currency: "GBP",
    transactionType: "withdrawal",
    country: "UK"
  },
  {
    id: "n1tx6zu3",
    amount: 820,
    status: "success",
    email: "susan.miller@yahoo.com",
    date: "2024-04-22",
    currency: "USD",
    transactionType: "purchase",
    country: "USA"
  },
  {
    id: "z5kmp8lo",
    amount: 360,
    status: "failed",
    email: "kevin.brown@gmail.com",
    date: "2024-01-18",
    currency: "EUR",
    transactionType: "purchase",
    country: "France"
  },
  {
    id: "r9mj3bvx",
    amount: 575,
    status: "success",
    email: "nancy.wilson@gmail.com",
    date: "2024-05-28",
    currency: "USD",
    transactionType: "refund",
    country: "USA"
  },
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@yahoo.com",
    date: "2024-05-01",
    currency: "USD",
    transactionType: "purchase",
    country: "USA"
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@gmail.com",
    date: "2024-04-20",
    currency: "EUR",
    transactionType: "refund",
    country: "Germany"
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@gmail.com",
    date: "2024-05-15",
    currency: "GBP",
    transactionType: "purchase",
    country: "UK"
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@gmail.com",
    date: "2024-03-30",
    currency: "USD",
    transactionType: "purchase",
    country: "USA"
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@hotmail.com",
    date: "2024-04-10",
    currency: "CAD",
    transactionType: "purchase",
    country: "Canada"
  },
  {
    id: "x9djw8l2",
    amount: 450,
    status: "success",
    email: "johndoe@gmail.com",
    date: "2024-05-05",
    currency: "USD",
    transactionType: "withdrawal",
    country: "USA"
  },
  {
    id: "plq5k8z7",
    amount: 125,
    status: "failed",
    email: "janedoe@gmail.com",
    date: "2024-02-25",
    currency: "AUD",
    transactionType: "purchase",
    country: "Australia"
  },
  {
    id: "g7klm9pq",
    amount: 540,
    status: "processing",
    email: "emily88@gmail.com",
    date: "2024-03-18",
    currency: "USD",
    transactionType: "purchase",
    country: "USA"
  },
  {
    id: "h6w9y8xu",
    amount: 380,
    status: "success",
    email: "michael23@yahoo.com",
    date: "2024-04-12",
    currency: "JPY",
    transactionType: "purchase",
    country: "Japan"
  },
  {
    id: "s7tj4nm5",
    amount: 995,
    status: "success",
    email: "alice.smith@gmail.com",
    date: "2024-01-08",
    currency: "USD",
    transactionType: "refund",
    country: "USA"
  },
  {
    id: "u8vkp0rw",
    amount: 689,
    status: "failed",
    email: "robert56@yahoo.com",
    date: "2024-05-20",
    currency: "INR",
    transactionType: "purchase",
    country: "India"
  },
  {
    id: "t3hr8mv9",
    amount: 410,
    status: "processing",
    email: "linda44@hotmail.com",
    date: "2024-03-05",
    currency: "USD",
    transactionType: "purchase",
    country: "USA"
  },
  {
    id: "q4pz7kl0",
    amount: 765,
    status: "success",
    email: "david.jones@gmail.com",
    date: "2024-02-15",
    currency: "GBP",
    transactionType: "withdrawal",
    country: "UK"
  },
  {
    id: "n1tx6zu3",
    amount: 820,
    status: "success",
    email: "susan.miller@yahoo.com",
    date: "2024-04-22",
    currency: "USD",
    transactionType: "purchase",
    country: "USA"
  },
  {
    id: "z5kmp8lo",
    amount: 360,
    status: "failed",
    email: "kevin.brown@gmail.com",
    date: "2024-01-18",
    currency: "EUR",
    transactionType: "purchase",
    country: "France"
  },
  {
    id: "r9mj3bvx",
    amount: 575,
    status: "success",
    email: "nancy.wilson@gmail.com",
    date: "2024-05-28",
    currency: "USD",
    transactionType: "refund",
    country: "USA"
  }
]


export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
  date: string
  currency: string
  transactionType: string
  country: string
}

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    )
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>
  },
  {
    accessorKey: "amount",
    header: () => <div className="">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(amount)

      return <div className=" font-medium">{formatted}</div>
    }
  },
  {
    accessorKey: "transactionType",
    header: "Transaction Type",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("transactionType")}</div>
    )
  },

  {
    accessorKey: "country",
    header: "Country",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("country")}</div>
    )
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <div className="capitalize">{row.getValue("date")}</div>
  },
  {
    id: "actions",
    enableHiding: false,
    maxSize: 50,
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => 
                toast(JSON.stringify(payment))
                // navigator.clipboard.writeText(payment.id)
              }
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={e => e.preventDefault()}>
              <GridDeleteButton row={payment}/>
            </DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

export default function TableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  })

  return (
    <div className=" mx-auto">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border mb-4">
        <Table className="">
          <TableHeader>
            <GridHeader colspan={columns.length} table={table} />
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="border-r last:border-r-0"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="border-r-0">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={
                    row.getIsSelected() && "selected"
                    // || (row.getValue("status") == "success" && "success") ||
                    // (row.getValue("status") == "failed" && "error")
                  }
                  data-selected={row.getIsSelected()}
                  data-success={row.getValue("status") == "success"}
                  data-error={row.getValue("status") == "failed"}
                >
                  {row.getVisibleCells().map((cell) => (
                    // cell nhỏ thêm px-2 py-0
                    <TableCell
                      key={cell.id}
                      className="border-r  last:border-r-0 px-2 py-0"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2} className="h-12 text-center ">
                Total
              </TableCell>
              <TableCell></TableCell>
              <TableCell className=" border-r border-l">Sum</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      <GridPagination table={table} />
    </div>
  )
}
