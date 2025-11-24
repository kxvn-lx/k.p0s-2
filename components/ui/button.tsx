import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { Pressable, type PressableProps, Text, View } from "react-native"
import type { ReactNode } from "react"

const buttonVariants = cva(
  "flex items-center justify-center rounded-[--radius] transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary active:opacity-90",
        secondary: "bg-secondary active:opacity-90",
        destructive: "bg-destructive active:opacity-90",
        outline: "border border-input bg-background active:bg-accent",
        ghost: "active:bg-accent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 p-2"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const buttonTextVariants = cva("font-medium text-center", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      destructive: "text-destructive-foreground",
      outline: "text-foreground",
      ghost: "text-foreground",
    },
    size: {
      default: "text-base",
      sm: "text-sm",
      lg: "text-lg",
      icon: "text-sm",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

type ButtonProps = PressableProps &
  VariantProps<typeof buttonVariants> & {
    title?: string
    children?: ReactNode
    textClassName?: string
  }

function Button({
  className,
  textClassName,
  variant,
  size,
  title,
  children,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children ? (
        <View className="flex-row items-center justify-center gap-2">
          {children}
          {title ? (
            <Text
              className={cn(buttonTextVariants({ variant, size }), textClassName)}
            >
              {title}
            </Text>
          ) : null}
        </View>
      ) : (
        <Text
          className={cn(buttonTextVariants({ variant, size }), textClassName)}
        >
          {title}
        </Text>
      )}
    </Pressable>
  )
}

export { Button, buttonTextVariants, buttonVariants }
