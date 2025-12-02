import { BluetoothDevice } from "@/lib/printer/types/bluetooth.types"


// ----- Device Utilities -----


/**
 * Filter devices by printer-related keywords
 */
export const filterPrinters = (devices: BluetoothDevice[]): BluetoothDevice[] => {
    const printerKeywords = ["printer", "rpp", "thermal", "pos", "58mm", "80mm", "escpos"]
    return devices.filter((device) => {
        const nameLower = device.name.toLowerCase()
        return printerKeywords.some((keyword) => nameLower.includes(keyword))
    })
}

/**
 * Deduplicate devices by address
 */
export const deduplicateDevices = (devices: BluetoothDevice[]): BluetoothDevice[] => {
    return devices.filter(
        (device, index, self) => self.findIndex((d) => d.address === device.address) === index
    )
}