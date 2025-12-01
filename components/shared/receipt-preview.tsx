import { View } from "react-native"
import { Text } from "@/components/ui/text"
import type { PrintCommand, TextSize } from "@/lib/printer/printer.types"
import { LINE_WIDTH } from "@/lib/printer/services/printer.service"

// ----- Props -----
type ReceiptPreviewProps = {
    commands: PrintCommand[]
}


// ----- Main Component -----
export function ReceiptPreview({ commands }: ReceiptPreviewProps) {
    return (
        <View className="bg-white p-2">
            {commands.map((cmd, index) => (
                <CommandRenderer key={index} command={cmd} />
            ))}
        </View>
    )
}

// ----- Command Renderer -----
function CommandRenderer({ command }: { command: PrintCommand }) {
    switch (command.type) {
        case "text":
            return <TextCommand {...command} />

        case "line":
            return <LineCommand char={command.char} />

        case "row":
            return <RowCommand left={command.left} right={command.right} />

        case "blank":
            return <View style={{ height: 16 }} />

        case "feed":
            return <View style={{ height: 16 * command.lines }} />

        default:
            return null
    }
}

// ----- Text Command -----
function TextCommand({
    content,
    align,
    bold,
    size,
}: {
    content: string
    align: "left" | "center" | "right"
    bold: boolean
    size: TextSize
}) {
    const SIZE_SCALE: Record<TextSize, number> = {
        normal: 1,
        wide: 1.5,
        tall: 1.5,
        large: 2,
        xlarge: 2.5,
    }

    const scale = SIZE_SCALE[size]

    return (
        <Text
            className={`font-mono text-black ${bold ? "font-bold" : ""}`}
            style={{
                fontSize: 12 * scale,
                lineHeight: 16 * scale,
                textAlign: align,
                paddingHorizontal: 8,
            }}
        >
            {content}
        </Text>
    )
}

// ----- Line Command (separator) -----
function LineCommand({ char }: { char: string }) {
    const line = char.repeat(LINE_WIDTH)

    return (
        <Text
            className="font-mono text-black text-center"
            style={{
                fontSize: 12,
                lineHeight: 16,
                paddingHorizontal: 8,
            }}
        >
            {line}
        </Text>
    )
}

// ----- Row Command (left + right aligned) -----
function RowCommand({ left, right }: { left: string; right: string }) {
    const rightLen = Math.min(right.length, LINE_WIDTH - 2)
    const leftLen = LINE_WIDTH - rightLen

    const leftPadded = left.length >= leftLen
        ? left.substring(0, leftLen)
        : left + " ".repeat(leftLen - left.length)

    const rightPadded = right.length >= rightLen
        ? right.substring(0, rightLen)
        : " ".repeat(rightLen - right.length) + right

    const formattedLine = leftPadded + rightPadded

    return (
        <Text
            className="font-mono text-black"
            style={{
                fontSize: 12,
                lineHeight: 16,
                paddingHorizontal: 8,
            }}
        >
            {formattedLine}
        </Text>
    )
}

export default ReceiptPreview