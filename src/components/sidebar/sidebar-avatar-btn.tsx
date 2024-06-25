import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, ButtonProps } from "../ui/button"
import { cn } from "@/lib/utils"

interface Props extends ButtonProps {
}

const SidebarAvatarBtn = React.forwardRef<HTMLButtonElement, Props>(
  ({ disabled, ...props }, ref) => (
    <Button
      variant="outline"
      ref={ref}
      className={cn(
        "relative h-8 w-8 rounded-full focus-visible:ring-0 ",
        disabled ? "hover:bg-background hover:cursor-default" : ""
      )}
      {...props}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src="#" alt="Avatar" />
        <AvatarFallback className="bg-transparent">JD</AvatarFallback>
      </Avatar>
    </Button>
  )
)


export default SidebarAvatarBtn
