import { View, ScrollView } from "react-native"
import { Text } from "@/components/ui/text"
import { LINE_WIDTH, formatRow } from "@/lib/printer/receipt-builder"
import type { PrintCommand, TextSize } from "@/lib/printer/printer.types"

// ----- Constants -----
// Monospace font sizing to match 58mm thermal paper
const CHAR_WIDTH = 7.5 // Approximate width per character in pixels
const PREVIEW_WIDTH = LINE_WIDTH * CHAR_WIDTH // ~240px for 32 chars

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
    className?: string
}

// ----- Component -----
export function ReceiptPreview({ commands, className }: ReceiptPreviewProps) {
    return (
        <View
            className="bg-white p-2"
            style={{ width: PREVIEW_WIDTH }}
        >
            {commands.map((cmd, index) => (
                <PreviewLine key={index} command={cmd} />
            ))}
        </View>
    )
}

// ----- Preview Line -----
type PreviewLineProps = {
    command: PrintCommand
}

function PreviewLine({ command }: PreviewLineProps) {
    switch (command.type) {
        case "text":
            return <TextLine {...command} />

        case "line":
            return (
                <Text
                    className="font-mono text-black text-center"
                    style={{ fontSize: 12, lineHeight: 16 }}
                >
                    {command.char.repeat(LINE_WIDTH)}
                </Text>
            )

        case "row":
            return (
                <Text
                    className="font-mono text-black"
                    style={{ fontSize: 12, lineHeight: 16 }}
                >
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
type TextLineProps = {
    content: string
    align: "left" | "center" | "right"
    bold: boolean
    size: TextSize
}

function TextLine({ content, align, bold, size }: TextLineProps) {
    const scale = SIZE_SCALE[size]
    const fontSize = 12 * scale
    const lineHeight = 16 * scale

    const textAlign = align === "center" ? "center" : align === "right" ? "right" : "left"

    return (
        <Text
            className={`font-mono text-black ${bold ? "font-mono-bold" : ""}`}
            style={{
                fontSize,
                lineHeight,
                textAlign,
            }}
        >
            {content}
        </Text>
    )
}

export default ReceiptPreview