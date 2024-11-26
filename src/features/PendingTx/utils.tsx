import { TransactionQueuedItem } from '@/src/store/gateway/AUTO_GENERATED/transactions'
import {
  getBulkGroupTxHash,
  getTxHash,
  isConflictHeaderListItem,
  isLabelListItem,
  isTransactionListItem,
} from '@/src/utils/transaction-guards'
import { groupBulkTxs } from '@/src/utils/transactions'
import { GroupedPendingTxsWithTitle } from '@/src/features/PendingTx/PendingTxList'
import { type PendingTransactionItems, TransactionListItemType } from '@/src/store/gateway/types'
import { View } from 'tamagui'
import TxGroupedCard from '@/src/components/transactions-list/Card/TxGroupedCard'
import TxConflictingCard from '@/src/components/transactions-list/Card/TxConflictingCard'
import SafeListItem from '@/src/components/SafeListItem'
import TxInfo from '@/src/components/TxInfo'
import React from 'react'

type GroupedTxs = (PendingTransactionItems | TransactionQueuedItem[])[]

export const groupTxs = (list: PendingTransactionItems[]) => {
  const groupedByConflicts = groupConflictingTxs(list)
  return groupBulkTxs(groupedByConflicts)
}

export const groupPendingTxs = (list: PendingTransactionItems[]) => {
  const transactions = groupTxs(list)
  const sections = ['Next', 'Queued']

  const txSections: {
    pointer: number
    amount: number
    sections: GroupedPendingTxsWithTitle[]
  } = {
    pointer: -1,
    amount: 0,
    sections: [
      { title: 'Ready to execute', data: [] },
      { title: 'Confirmation needed', data: [] },
    ],
  }

  return transactions.reduce((acc, item) => {
    if ('type' in item && isLabelListItem(item)) {
      acc.pointer = sections.indexOf(item.label)
    } else if (
      acc.sections[acc.pointer] &&
      (Array.isArray(item) || item.type === TransactionListItemType.TRANSACTION)
    ) {
      acc.amount += Array.isArray(item) ? item.length : 1

      acc.sections[acc.pointer].data.push(item as TransactionQueuedItem)
    }

    return acc
  }, txSections)
}

export const groupConflictingTxs = (list: PendingTransactionItems[]): GroupedTxs =>
  list
    .reduce<GroupedTxs>((resultItems, item) => {
      if (isConflictHeaderListItem(item)) {
        return [...resultItems, []]
      }

      const prevItem = resultItems[resultItems.length - 1]
      if (Array.isArray(prevItem) && isTransactionListItem(item) && item.conflictType !== 'None') {
        const updatedPrevItem = [...prevItem, item]
        return [...resultItems.slice(0, -1), updatedPrevItem]
      }

      return [...resultItems, item]
    }, [])
    .map((item) => {
      return Array.isArray(item)
        ? item.sort((a, b) => {
            return b.transaction.timestamp - a.transaction.timestamp
          })
        : item
    })

export const renderItem = ({
  item,
  index,
}: {
  item: PendingTransactionItems | TransactionQueuedItem[]
  index: number
}) => {
  if (Array.isArray(item)) {
    // Handle bulk transactions
    return (
      <View marginTop={index && '$4'} paddingHorizontal="$3">
        {getBulkGroupTxHash(item) ? (
          <TxGroupedCard transactions={item} inQueue />
        ) : (
          <TxConflictingCard inQueue transactions={item} />
        )}
      </View>
    )
  }

  if (isLabelListItem(item)) {
    return (
      <View marginTop={index && '$4'} paddingHorizontal="$3">
        <SafeListItem.Header title={item.label} />
      </View>
    )
  }

  if (isTransactionListItem(item)) {
    return (
      <View marginTop={index && '$4'} paddingHorizontal="$3">
        <TxInfo inQueue tx={item.transaction} />
      </View>
    )
  }

  return null
}

export const keyExtractor = (item: PendingTransactionItems | TransactionQueuedItem[], index: number) => {
  if (Array.isArray(item)) {
    const txGroupHash = getBulkGroupTxHash(item)
    if (txGroupHash) {
      return txGroupHash + index
    }

    if (isTransactionListItem(item[0])) {
      return getTxHash(item[0]) + index
    }
    return String(index)
  }
  return String(index)
}