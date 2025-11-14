import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border border-gray-300 placeholder:text-gray-500 focus-visible:border-emerald-400 focus-visible:ring-emerald-400/30 field-sizing-content min-h-24 w-full rounded-lg bg-white px-3.5 py-2.5 text-base text-gray-900 shadow-xs transition-[color,box-shadow,border] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
