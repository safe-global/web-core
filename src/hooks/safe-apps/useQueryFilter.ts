import { type Dispatch, type SetStateAction, useEffect } from 'react'
import { useRouter } from 'next/router'
import { getCategoryOptions } from '@/components/safe-apps/SafeAppsFilters'
import type { SafeAppData } from '@safe-global/safe-gateway-typescript-sdk'

// TODO: Add search and batch filter as well
const useQueryFilter = ({
  safeAppsList,
  selectedCategories,
  setSelectedCategories,
}: {
  safeAppsList: SafeAppData[]
  selectedCategories: string[]
  setSelectedCategories: Dispatch<SetStateAction<string[]>>
}) => {
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) return

    const categoryOptions = getCategoryOptions(safeAppsList).map((category) => category.value)
    const categoryQuery = Array.isArray(router.query.categories) ? router.query.categories[0] : router.query.categories

    if (categoryQuery && selectedCategories.length === 0) {
      const categoryQueryOptions = categoryQuery.split(',')
      const isCategoryOption = categoryQueryOptions.every((category) => categoryOptions.includes(category))

      if (!isCategoryOption) return

      setSelectedCategories(categoryQueryOptions)
    }
  }, [router.isReady, router.query.categories, safeAppsList, selectedCategories.length, setSelectedCategories])

  const onSelectCategories = (selectedCategories: string[]) => {
    setSelectedCategories(selectedCategories)

    const { categories, ...otherParams } = router.query

    router.push(
      {
        pathname: router.pathname,
        query:
          selectedCategories.length === 0 ? otherParams : { ...router.query, categories: selectedCategories.join(',') },
      },
      undefined,
      {
        shallow: true,
      },
    )
  }

  return { onSelectCategories }
}

export default useQueryFilter
