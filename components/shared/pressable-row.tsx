// ----- PressableRow -----
import { Pressable, type PressableProps } from 'react-native'
import React from 'react'
import { cn } from '@/lib/utils'

type Props = PressableProps & {
    className?: string
    children?: React.ReactNode
}

export default function PressableRow({ className, children, ...rest }: Props) {
    return (
        <Pressable {...rest} className={cn("row-pressable", className)}>
            {children}
        </Pressable>
    )
}
