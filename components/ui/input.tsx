import { cn } from "@/lib/utils"
import { BottomSheetTextInput } from "@gorhom/bottom-sheet"
import { forwardRef } from "react"
import { Platform, TextInput, type TextInputProps } from "react-native"

// ----- SHARED STYLES -----
const getInputClassNames = (editable: boolean | undefined, className?: string) => {
  return cn(
    "font-mono dark:bg-input/30 border-input bg-input/30 text-foreground h-auto flex w-full min-w-0 flex-row items-center rounded-[--radius] border p-1 shadow-sm shadow-black/5 sm:h-9 text-base leading-none",
    editable === false &&
    cn(
      "opacity-50",
      Platform.select({
        web: "disabled:pointer-events-none disabled:cursor-not-allowed",
      })
    ),
    Platform.select({
      web: cn(
        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground outline-none transition-[color,box-shadow] md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
      ),
      native: "placeholder:text-muted-foreground/50",
    }),
    className
  )
}

// ----- COMPONENTS -----
const Input = forwardRef<TextInput, TextInputProps>(
  ({ className, placeholderClassName, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={getInputClassNames(props.editable, className)}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

const BottomSheetInput = forwardRef<
  React.ElementRef<typeof BottomSheetTextInput>,
  React.ComponentPropsWithoutRef<typeof BottomSheetTextInput>
>(({ className, placeholderClassName, ...props }, ref) => {
  return (
    <BottomSheetTextInput
      ref={ref}
      className={getInputClassNames(props.editable, className)}
      {...props}
    />
  )
})
BottomSheetInput.displayName = "BottomSheetInput"

export { Input, BottomSheetInput }
