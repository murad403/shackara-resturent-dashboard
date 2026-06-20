import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, endIcon, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {startIcon && (
          <div className="absolute left-3.5 text-gray-400 pointer-events-none flex items-center justify-center">
            {startIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-lg border border-transparent bg-[#F3F4F6] text-sm text-title transition-all placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-button-color focus-visible:border-button-color focus-visible:bg-white disabled:cursor-not-allowed disabled:opacity-50",
            startIcon ? "pl-11" : "pl-4",
            endIcon ? "pr-11" : "pr-4",
            className
          )}
          ref={ref}
          {...props}
        />
        {endIcon && (
          <div className="absolute right-3.5 flex items-center justify-center">
            {endIcon}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
