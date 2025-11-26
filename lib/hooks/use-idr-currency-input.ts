import { useCallback, useState } from 'react'

// ----- TYPES -----
type UseCurrencyInputResult = {
  displayValue: string
  rawValue: number
  handleChange: (text: string) => void
  setRawValue: (value: number) => void
}

// ----- FORMATTER -----
const formatDisplayValue = (value: number): string => {
  if (value === 0 || isNaN(value)) return ''
  return new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const extractNumericValue = (text: string): number => {
  if (!text) return 0
  const cleaned = text.replace(/\D/g, '')
  return cleaned ? parseInt(cleaned, 10) : 0
}

// ----- HOOK -----
export const useIdrCurrencyInput = (initialValue: number = 0): UseCurrencyInputResult => {
  const [rawValue, setRawValue] = useState<number>(initialValue)
  const [displayValue, setDisplayValue] = useState<string>(
    initialValue > 0 ? formatDisplayValue(initialValue) : ''
  )

  const handleChange = useCallback((text: string) => {
    const numeric = extractNumericValue(text)
    setRawValue(numeric)
    setDisplayValue(numeric > 0 ? formatDisplayValue(numeric) : '')
  }, [])

  const updateRawValue = useCallback((value: number) => {
    setRawValue(value)
    setDisplayValue(value > 0 ? formatDisplayValue(value) : '')
  }, [])

  return {
    displayValue,
    rawValue,
    handleChange,
    setRawValue: updateRawValue,
  }
}
