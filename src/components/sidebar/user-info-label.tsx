import React from "react"

export default function UserInfoLabel() {
  return (
    <div className="font-normal">
      <div className="flex flex-col space-y-1">
        <p className="text-sm font-medium leading-none">John Doe</p>
        <p className="text-xs leading-none text-muted-foreground">
          johndoe@example.com
        </p>
      </div>
    </div>
  )
}
