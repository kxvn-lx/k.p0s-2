// ----- Keranjang actions hook -----
import * as Haptics from 'expo-haptics'
import useKeranjangStore, { type BasketItem } from '@/features/keranjang/store/keranjang-store'
import type { StockRow } from '@/features/stok/api/stock.service'

export function useKeranjangActions() {
  const items = useKeranjangStore((s) => s.items) as Record<string, BasketItem>
  const addItem = useKeranjangStore((s) => s.addItem)
  const increment = useKeranjangStore((s) => s.increment)
  const removeItem = useKeranjangStore((s) => s.remove)
  const setQty = useKeranjangStore((s) => s.setQty)

  function remainingFor(stock: StockRow) {
    return (stock.jumlah_stok ?? 0) - (items[stock.id]?.qty ?? 0)
  }

  async function addToBasket(stock: StockRow, qtyToAdd = 1, variasiId?: string | null, hargaUnit?: number) {
    const avail = remainingFor(stock)
    if (avail < qtyToAdd) return { ok: false, reason: 'STOK_TIDAK_CUKUP' }

    await Haptics.selectionAsync()
    addItem(stock, qtyToAdd, variasiId ?? undefined, hargaUnit)
    return { ok: true }
  }

  async function selectVariation(stock: StockRow, v?: { id: string; min_qty: number; harga_jual: number } | null) {
    if (!v) return addToBasket(stock, 1, null, stock.harga_jual)

    const existing = items[stock.id]

    if (existing && existing.variasiId === v.id) {
      if (remainingFor(stock) < v.min_qty) return { ok: false, reason: 'STOK_TIDAK_CUKUP' }
      await Haptics.selectionAsync()
      increment(stock.id, v.min_qty)
      return { ok: true }
    }

    if (remainingFor(stock) < v.min_qty) return { ok: false, reason: 'STOK_TIDAK_CUKUP' }

    await Haptics.selectionAsync()
    addItem(stock, v.min_qty, v.id, v.harga_jual)
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
