import React, { useCallback, useMemo, useRef } from 'react'
import { GetThemeValueForKey, H5, ScrollView, Text, View } from 'tamagui'
import { SafeFontIcon } from '@/src/components/SafeFontIcon/SafeFontIcon'
import { BottomSheetFooterProps, BottomSheetModal, BottomSheetModalProps, BottomSheetView } from '@gorhom/bottom-sheet'
import { StyleSheet } from 'react-native'
import { BackdropComponent, BackgroundComponent } from './sheetComponents'

import DraggableFlatList, { DragEndParams, RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist'

interface DropdownProps<T> {
  label: string
  leftNode?: React.ReactNode
  children?: React.ReactNode
  dropdownTitle?: string
  sortable?: boolean
  onDragEnd?: (params: DragEndParams<T>) => void
  items?: T[]
  snapPoints?: BottomSheetModalProps['snapPoints']
  labelProps?: {
    fontSize?: '$4' | '$5' | GetThemeValueForKey<'fontSize'>
    fontWeight: 400 | 500 | 600
  }
  actions?: React.ReactNode
  footerComponent?: React.FC<BottomSheetFooterProps>
  renderItem?: React.FC<{ item: T; isDragging?: boolean; drag?: () => void; onClose: () => void }>
  keyExtractor?: ({ item, index }: { item: T; index: number }) => string
}

const defaultLabelProps = {
  fontSize: '$4',
  fontWeight: 400,
} as const

export function Dropdown<T>({
  label,
  leftNode,
  children,
  dropdownTitle,
  sortable,
  items,
  snapPoints = [600, '90%'],
  keyExtractor,
  actions,
  renderItem: Render,
  labelProps = defaultLabelProps,
  footerComponent,
  onDragEnd,
}: DropdownProps<T>) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  const handleModalClose = useCallback(() => {
    bottomSheetModalRef.current?.dismiss()
  }, [])

  const hasCustomItems = items && Render
  const isSortable = items && sortable

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<T>) => {
      return (
        <ScaleDecorator activeScale={1.05}>
          {Render && <Render drag={drag} isDragging={isActive} item={item} onClose={handleModalClose} />}
        </ScaleDecorator>
      )
    },
    [handleModalClose, Render],
  )

  const renderDropdownHeader = useMemo(
    () => (
      <View justifyContent="center" marginTop="$3" marginBottom="$4" alignItems="center">
        <H5 fontWeight={600}>{dropdownTitle}</H5>

        {actions && (
          <View position="absolute" right={'$4'} top={'$1'}>
            {actions}
          </View>
        )}
      </View>
    ),
    [dropdownTitle, actions],
  )

  return (
    <>
      <View
        alignItems="center"
        testID="dropdown-label-view"
        onPress={handlePresentModalPress}
        flexDirection="row"
        marginBottom="$3"
        columnGap="$2"
      >
        {leftNode}

        <Text fontSize={labelProps.fontSize} fontWeight={labelProps.fontWeight}>
          {label}
        </Text>

        <SafeFontIcon testID="dropdown-arrow" name="arrow-down" />
      </View>

      <BottomSheetModal
        enableOverDrag={false}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        ref={bottomSheetModalRef}
        enablePanDownToClose
        overDragResistanceFactor={10}
        backgroundComponent={BackgroundComponent}
        backdropComponent={BackdropComponent}
        footerComponent={footerComponent}
      >
        {!isSortable && dropdownTitle && renderDropdownHeader}

        <BottomSheetView
          style={[styles.contentContainer, !isSortable ? { flex: 1, paddingHorizontal: 20 } : undefined]}
        >
          {isSortable ? (
            <DraggableFlatList<T>
              data={items}
              containerStyle={{ height: '100%' }}
              ListHeaderComponent={dropdownTitle ? renderDropdownHeader : undefined}
              onDragEnd={onDragEnd}
              keyExtractor={(item, index) => (keyExtractor ? keyExtractor({ item, index }) : index.toString())}
              renderItem={renderItem}
            />
          ) : (
            <ScrollView>
              <View minHeight={200} alignItems="center" paddingVertical="$3">
                <View alignItems="flex-start" paddingBottom="$4" width="100%">
                  {hasCustomItems
                    ? items.map((item, index) => (
                        <Render
                          key={keyExtractor ? keyExtractor({ item, index }) : index}
                          item={item}
                          onClose={handleModalClose}
                        />
                      ))
                    : children}
                </View>
              </View>
            </ScrollView>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    </>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: 'space-around',
  },
})
