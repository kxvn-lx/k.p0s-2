// ----- IMPORTS -----
import useKeranjangStore from "@/features/keranjang/store/keranjang-store"
import type {
  StockRow,
  VariasiHargaRow,
} from "@/features/keranjang/types/keranjang.types"
import type { ActionResult } from "@/lib/types/action.types"

// ----- HOOK -----
export function useKeranjangActions() {
  // ----- STORE SELECTORS -----
  const items = useKeranjangStore((s) => s.items)
  const addItem = useKeranjangStore((s) => s.addItem)
  const setQty = useKeranjangStore((s) => s.setQty)
  const removeItem = useKeranjangStore((s) => s.remove)
  const remainingFor = useKeranjangStore((s) => s.remainingFor)

  // ----- ACTIONS -----
  function addToBasket(
    stock: StockRow,
    qtyToAdd = 1,
    variasiId: string | null = null,
    hargaUnit?: number,
    minQty = 0
  ): ActionResult {
    if (qtyToAdd <= 0) {
      return { ok: false, message: "QTY ND VALID (QTY <= 0)" }
    }

    const availableStock = remainingFor(stock)
    if (availableStock < qtyToAdd) {
      return { ok: false, message: "STOK ND CUKUP" }
    }

    addItem(stock, qtyToAdd, variasiId, hargaUnit, minQty)
    return { ok: true }
  }

  function selectVariation(
    stock: StockRow,
    variation: VariasiHargaRow | null
  ): ActionResult {
    const currentCartItem = items[stock.id]
    const availableStock = stock.jumlah_stok ?? 0

    if (!variation) {
      if (currentCartItem) {
        if (!currentCartItem.variasi_harga_id) {
          if (remainingFor(stock) < 1)
            return { ok: false, message: "STOK NND CUKUP" }
          addItem(stock, 1, null, stock.harga_jual, 0)
          return { ok: true }
        }
        if (availableStock < 1) return { ok: false, message: "STOK NND CUKUP" }
        setQty(stock.id, 1, stock.harga_jual, null, 0)
        return { ok: true }
      }
      return addToBasket(stock, 1, null, stock.harga_jual, 0)
    }

    const minimumQuantity = variation.min_qty > 0 ? variation.min_qty : 1
    if (minimumQuantity <= 0) return { ok: false, message: "JUMLAH MINIMUM ND VALID" }

    if (currentCartItem) {
      if (currentCartItem.variasi_harga_id === variation.id) {
        if (remainingFor(stock) < minimumQuantity)
          return { ok: false, message: "STOK ND CUKUP" }
        addItem(stock, minimumQuantity, variation.id, variation.harga_jual, minimumQuantity)
        return { ok: true }
      }

      if (availableStock < minimumQuantity) return { ok: false, message: "STOK ND CUKUP" }
      setQty(stock.id, minimumQuantity, variation.harga_jual, variation.id, minimumQuantity)
      return { ok: true }
    }

    if (remainingFor(stock) < minimumQuantity)
      return { ok: false, message: "STOK ND CUKUP" }
    addItem(stock, minimumQuantity, variation.id, variation.harga_jual, minimumQuantity)
    return { ok: true }
  }

  function adjustQty(
    stockId: string,
    delta: number
  ): ActionResult {
    const cartItem = items[stockId]
    if (!cartItem) return { ok: false, message: "STOK ND ADA DI KERANJANG" }

    const currentQuantity = cartItem.qty
    const newQuantity = currentQuantity + delta
    const minimumQuantity = cartItem.variasi_harga_id
      ? cartItem.min_qty
      : 0

    if (delta < 0 && newQuantity < minimumQuantity) {
      return { ok: false, message: `JUMLAH MINIMUM FOR INI VARIASI HARGA: ${minimumQuantity} ${cartItem.stock.satuan_utama ?? ''}` }
    }

    if (delta > 0) {
      const remaining = remainingFor(cartItem.stock)
      if (remaining < delta) {
        return { ok: false, message: "STOK ND CUKUP" }
      }
    }

    addItem(cartItem.stock, delta, cartItem.variasi_harga_id, cartItem.harga_satuan, minimumQuantity)
    return { ok: true }
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
