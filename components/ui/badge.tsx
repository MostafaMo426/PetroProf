import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-navy-900 text-white shadow hover:bg-navy-800",
        secondary:
          "border-transparent bg-navy-100 text-navy-900 hover:bg-navy-200",
        destructive:
          "border-transparent bg-red-600 text-white shadow hover:bg-red-700",
        outline: "text-navy-900 border-navy-200",
        warning:
          "border-transparent bg-yellow-400 text-navy-950 font-bold",
        orange:
          "border-transparent bg-orange-500 text-white font-semibold",
        success:
          "border-transparent bg-emerald-600 text-white font-semibold",
        irata1:
          "border-emerald-300 bg-emerald-50 text-emerald-800 font-bold",
        irata2:
          "border-blue-300 bg-blue-50 text-blue-800 font-bold",
        irata3:
          "border-purple-300 bg-purple-50 text-purple-800 font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
