import useKeranjangStore from "@/features/keranjang/store/keranjang-store"
import type {
  StockRow,
  VariasiHargaRow,
} from "@/features/keranjang/types/keranjang.types"

export function useKeranjangActions() {
  const items = useKeranjangStore((s) => s.items)
  const addItem = useKeranjangStore((s) => s.addItem)
  const increment = useKeranjangStore((s) => s.increment)
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
    if (!variation) {
      return addToBasket(stock, 1, null, stock.harga_jual)
    }

    const minQty = variation.min_qty ?? 1
    if (minQty <= 0) {
      return { ok: false, reason: "INVALID_MIN_QTY" }
    }

    const existing = items[stock.id]

    if (existing && existing.variasiId === variation.id) {
      if (remainingFor(stock) < minQty) {
        return { ok: false, reason: "STOK_TIDAK_CUKUP" }
      }
      increment(stock.id, minQty)
      return { ok: true }
    }

    if (remainingFor(stock) < minQty) {
      return { ok: false, reason: "STOK_TIDAK_CUKUP" }
    }

    addItem(stock, minQty, variation.id, variation.harga_jual)
    return { ok: true }
  }

  return {
    items,
    addToBasket,
    selectVariation,
    remainingFor,
    increment,
    setQty,
    removeItem,
  }
}

export default useKeranjangActions
