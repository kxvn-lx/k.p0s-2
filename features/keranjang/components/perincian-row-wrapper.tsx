import { useRef } from "react"
import PerincianRow, { PerincianRowRef } from "./perincian-row"
import type { BasketItem } from "@/features/keranjang/types/keranjang.types"

// ----- TYPES -----
type PerincianRowWrapperProps = {
  item: BasketItem
  onDelete: () => void
  onEdit: () => void
  onSwipeOpen: (ref: PerincianRowRef | null) => void
}

// ----- COMPONENT -----
export default function PerincianRowWrapper({
  item,
  onDelete,
  onEdit,
  onSwipeOpen,
}: PerincianRowWrapperProps) {
  const rowRef = useRef<PerincianRowRef>(null)

  return (
    <PerincianRow
      ref={rowRef}
      item={item}
      onDelete={onDelete}
      onEdit={onEdit}
      onSwipeOpen={() => onSwipeOpen(rowRef.current)}
    />
  )
}
