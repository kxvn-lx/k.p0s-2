// ----- Badge stepper popover -----
import { View } from 'react-native'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import type { ReactNode } from 'react'

type Props = {
    qty: number
    satuan?: string | null
    onDecrement: () => void
    onIncrement: () => void
    onRemove: () => void
    children?: ReactNode
}

export default function BadgeStepper({ qty, satuan, onDecrement, onIncrement, onRemove }: Props) {
    return (
        <View className="p-2 w-40">
            <View className="flex-row items-center justify-between mb-2">
                <Button size="icon" variant="outline" title="-" onPress={onDecrement} />
                <Text className="font-medium">{qty} {satuan ?? ''}</Text>
                <Button size="icon" variant="outline" title="+" onPress={onIncrement} />
            </View>

            <View className="flex-row justify-between">
                <Button variant="outline" size="sm" title="Hapus" onPress={onRemove} />
                <Button size="sm" title="Tutup" onPress={() => { /* handled by Popover */ }} />
            </View>
        </View>
    )
}
