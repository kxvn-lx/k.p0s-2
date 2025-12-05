// ----- PressableRow -----
import { Pressable, type PressableProps } from 'react-native'
import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type PressableRef = React.ElementRef<typeof Pressable>

type Props = PressableProps & {
  className?: string
  children?: React.ReactNode
}

const PressableRow = forwardRef<PressableRef, Props>(function PressableRow(
  { className, children, ...rest },
  ref,
) {
  return (
    <Pressable
      ref={ref}
      {...rest}
      className={cn("active:opacity-80 active:bg-primary/5", className)}
    >
      {children}
    </Pressable>
  )
})

PressableRow.displayName = "PressableRow"

export default PressableRow
