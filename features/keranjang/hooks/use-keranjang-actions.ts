import useKeranjangStore from "@/features/keranjang/store/keranjang-store"
import type {
  StockRow,
  VariasiHargaRow,
} from "@/features/keranjang/types/keranjang.types"

export function useKeranjangActions() {
  const items = useKeranjangStore((s) => s.items)
  const addItem = useKeranjangStore((s) => s.addItem)
  const removeItem = useKeranjangStore((s) => s.remove)
  const setQty = useKeranjangStore((s) => s.setQty)

  function remainingFor(stock: StockRow): number {
    const currentInBasket = items[stock.id]?.qty ?? 0
    const available = stock.jumlah_stok ?? 0
    return Math.max(0, available - currentInBasket)
  }

  async function addToBasket(
    stock: StockRow,
    qtyToAdd = 1,
    variasiId: string | null = null,
    hargaUnit?: number
  ): Promise<{ ok: boolean; reason?: string }> {
    if (qtyToAdd <= 0) {
      return { ok: false, reason: "INVALID_QTY" }
    }

    const avail = remainingFor(stock)
    if (avail < qtyToAdd) {
      return { ok: false, reason: "STOK_TIDAK_CUKUP" }
    }

    addItem(stock, qtyToAdd, variasiId, hargaUnit)
    return { ok: true }
  }

  async function selectVariation(
    stock: StockRow,
    variation: VariasiHargaRow | null
  ): Promise<{ ok: boolean; reason?: string }> {
    const existing = items[stock.id]
    const totalStock = stock.jumlah_stok ?? 0

    // Selecting Base (Original)
    if (!variation) {
      if (existing) {
        // Already on Base: add 1 more
        if (!existing.variasi_harga_id) {
          if (remainingFor(stock) < 1)
            return { ok: false, reason: "STOK_TIDAK_CUKUP" }
          addItem(stock, 1, null, stock.harga_jual)
          return { ok: true }
        }
        // Switching from Variation to Base: reset to 1
        if (totalStock < 1) return { ok: false, reason: "STOK_TIDAK_CUKUP" }
        setQty(stock.id, 1, stock.harga_jual, null)
        return { ok: true }
      }
      // New item (Base)
      return addToBasket(stock, 1, null, stock.harga_jual)
    }

    // Selecting a Variation
    const minQty = variation.min_qty > 0 ? variation.min_qty : 1
    if (minQty <= 0) return { ok: false, reason: "INVALID_MIN_QTY" }

    if (existing) {
      // Already on same variation: add minQty more
      if (existing.variasi_harga_id === variation.id) {
        if (remainingFor(stock) < minQty)
          return { ok: false, reason: "STOK_TIDAK_CUKUP" }
        addItem(stock, minQty, variation.id, variation.harga_jual)
        return { ok: true }
      }

      // Switching to different variation: reset to minQty
      if (totalStock < minQty) return { ok: false, reason: "STOK_TIDAK_CUKUP" }
      setQty(stock.id, minQty, variation.harga_jual, variation.id)
      return { ok: true }
    }

    // New item (Variation)
    if (remainingFor(stock) < minQty)
      return { ok: false, reason: "STOK_TIDAK_CUKUP" }
    addItem(stock, minQty, variation.id, variation.harga_jual)
    return { ok: true }
  }

  function adjustQty(stockId: string, delta: number) {
    const item = items[stockId]
    if (!item) return
    addItem(item.stock, delta, item.variasi_harga_id, item.harga_jual)
  }

  return {
    items,
    addToBasket,
    selectVariation,
    adjustQty,
    removeItem,
    setQty,
    remainingFor,
  }
}

export default useKeranjangActions
