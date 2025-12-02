// Bluetooth device and connection types
export type BluetoothDevice = {
    name: string
    address: string
}

// Connection state
export type ConnectionState =
    | "disconnected"
    | "connecting"
    | "connected"
    | "reconnecting"

// Bluetooth-specific error codes
export type BluetoothError =
    | "BLUETOOTH_DISABLED"
    | "PERMISSION_DENIED"
    | "DEVICE_NOT_FOUND"
    | "CONNECTION_FAILED"
    | "CONNECTION_LOST"
    | "SCAN_FAILED"
    | "UNPAIR_FAILED"
    | "UNKNOWN"

export type BluetoothErrorInfo = {
    code: BluetoothError
    message: string
    originalError?: unknown
}