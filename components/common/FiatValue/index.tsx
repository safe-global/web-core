import { ReactElement, useMemo } from 'react'
import { useAppSelector } from '@/store'
import { selectCurrency } from '@/store/sessionSlice'
import { formatCurrency } from '@/utils/formatters'

const FiatValue = ({ value }: { value: string | number }): ReactElement => {
  const currency = useAppSelector(selectCurrency)

  const fiat = useMemo(() => {
    return formatCurrency(value, currency)
  }, [currency])

  return <span suppressHydrationWarning>{fiat}</span>
}

export default FiatValue
