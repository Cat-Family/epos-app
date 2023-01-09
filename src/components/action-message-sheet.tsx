import React, { forwardRef, useImperativeHandle, useMemo, useRef } from 'react'
import RNButtomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import BottomSheet from '@/atoms/bottom-sheet'
import { Box, Text } from '@/atoms'

interface Props {
  onClose?: () => void
}

interface ActionMessageSheetHandle {
  show: () => void
}

const ActionMessageSheet = forwardRef<ActionMessageSheetHandle, Props>(
  ({ onClose }, ref) => {
    const refButtomSheet = useRef<RNButtomSheet>(null)
    const snapPoints = useMemo(() => ['60%', '90%'], [])

    useImperativeHandle(ref, () => ({
      show: () => {
        const { current: bottomSheet } = refButtomSheet
        if (bottomSheet) {
          bottomSheet.snapToIndex(0)
        }
      }
    }))

    return (
      <BottomSheet
        ref={refButtomSheet}
        index={-1}
        snapPoints={snapPoints}
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
          />
        )}
        detached={true}
        bottomInset={46}
        enablePanDownToClose={true}
        style={{ marginHorizontal: 12 }}
        onClose={onClose}
      >
        <Box alignItems="center">
          <Text>test</Text>
        </Box>
      </BottomSheet>
    )
  }
)

type ActionMessageSheet = ActionMessageSheetHandle
export default ActionMessageSheet
