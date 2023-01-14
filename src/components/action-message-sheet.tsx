import React, {
  Dispatch,
  SetStateAction,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import RNButtomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import BottomSheet from '@/atoms/bottom-sheet'
import { Box, Text } from '@/atoms'
import AppContext from '@/app/context/AppContext'
import { Message } from '@/app/models/Message'
const { useObject } = AppContext
interface Props {
  onClose?: () => void
}

interface ActionMessageSheetHandle {
  show: () => void
  setMessageId: Dispatch<SetStateAction<string>>
}

const ActionMessageSheet = forwardRef<ActionMessageSheetHandle, Props>(
  ({ onClose }, ref) => {
    const refButtomSheet = useRef<RNButtomSheet>(null)
    const snapPoints = useMemo(() => ['60%', '90%'], [])
    const [messageId, setMessageId] = useState<string>('')
    const message = useObject<Message & Realm.Object>(
      'Message',
      Number(messageId)
    )

    useImperativeHandle(ref, () => ({
      setMessageId,
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
          <Text variant="messageTitle">{message?.subject}</Text>
          <Text>{message?.content}</Text>
          <Text>{message?.isTop}</Text>
          <Text>{message?.createdAt.toDateString()}</Text>
        </Box>
      </BottomSheet>
    )
  }
)

type ActionMessageSheet = ActionMessageSheetHandle
export default ActionMessageSheet
