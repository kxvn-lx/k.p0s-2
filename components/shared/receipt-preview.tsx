import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { LINE_WIDTH, formatRow } from "@/lib/printer/receipt-builder"
import type { PrintCommand, TextSize } from "@/lib/printer/printer.types"

// ----- Constants -----
const CHAR_WIDTH = 7.5
const PREVIEW_WIDTH = LINE_WIDTH * CHAR_WIDTH
const TOOTH_SIZE = 8
const TOOTH_COUNT = Math.floor(PREVIEW_WIDTH / TOOTH_SIZE)

// ----- Size Multipliers -----
const SIZE_SCALE: Record<TextSize, number> = {
    normal: 1,
    wide: 1.5,
    tall: 1.5,
    large: 2,
}

// ----- Props -----
type ReceiptPreviewProps = {
    commands: PrintCommand[]
}

// ----- Sawblade Edge -----
function SawbladeEdge({ position }: { position: "top" | "bottom" }) {
    const isTop = position === "top"
    return (
        <View className="flex-row" style={{ width: PREVIEW_WIDTH }}>
            {Array.from({ length: TOOTH_COUNT }).map((_, i) => (
                <View
                    key={i}
                    style={{
                        width: 0,
                        height: 0,
                        borderLeftWidth: TOOTH_SIZE / 2,
                        borderRightWidth: TOOTH_SIZE / 2,
                        borderLeftColor: "transparent",
                        borderRightColor: "transparent",
                        ...(isTop
                            ? { borderBottomWidth: TOOTH_SIZE, borderBottomColor: "white" }
                            : { borderTopWidth: TOOTH_SIZE, borderTopColor: "white" }),
                    }}
                />
            ))}
        </View>
    )
}

// ----- Component -----
export function ReceiptPreview({ commands }: ReceiptPreviewProps) {
    return (
        <View className="items-center">
            <SawbladeEdge position="top" />
            <View className="bg-white px-2 py-4" style={{ width: PREVIEW_WIDTH }}>
                {commands.map((cmd, index) => (
                    <PreviewLine key={index} command={cmd} />
                ))}
            </View>
            <SawbladeEdge position="bottom" />
        </View>
    )
}

// ----- Preview Line -----
function PreviewLine({ command }: { command: PrintCommand }) {
    switch (command.type) {
        case "text":
            return <TextLine {...command} />

        case "line":
            return (
                <Text className="font-mono text-black text-center" style={{ fontSize: 12, lineHeight: 16 }}>
                    {command.char.repeat(LINE_WIDTH)}
                </Text>
            )

        case "row":
            return (
                <Text className="font-mono text-black" style={{ fontSize: 12, lineHeight: 16 }}>
                    {formatRow(command.left, command.right)}
                </Text>
            )

        case "blank":
            return <View style={{ height: 16 }} />

        case "feed":
            return <View style={{ height: 16 * command.lines }} />

        default:
            return null
    }
}

// ----- Text Line -----
function TextLine({ content, align, bold, size }: { content: string; align: "left" | "center" | "right"; bold: boolean; size: TextSize }) {
    const scale = SIZE_SCALE[size]

    return (
        <Text
            className={`font-mono text-black ${bold ? "font-bold" : ""}`}
            style={{
                fontSize: 12 * scale,
                lineHeight: 16 * scale,
                textAlign: align,
            }}
        >
            {content}
        </Text>
    )
}

export default ReceiptPreview