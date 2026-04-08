import { Outlet } from "react-router"
import { cn } from "@/lib/utils.ts"
import Icon from "@/assets/icon.svg"
import type { ComponentProps } from "react"

const AuthLayout = ({ className, ...props }: ComponentProps<"div">) => (
  <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="flex items-center gap-2 self-center font-medium">
        <img
          alt="DMARC Analyser Icon"
          src={Icon}
          className="flex size-6 rounded-sm"
        />
        DMARC Analyser
      </div>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Outlet />
      </div>
    </div>
  </div>
)

export default AuthLayout
