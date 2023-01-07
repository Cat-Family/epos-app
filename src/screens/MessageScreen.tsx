import React, { useRef, useState } from 'react'
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Appbar, Button, Snackbar, TouchableRipple } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import * as Animatable from 'react-native-animatable'
import useMessage from '../hooks/actions/useMessage'
import useTheme from '../hooks/utils/useTheme'
import AppContext from '../app/context/AppContext'
import { Message } from '../app/models/Message'
const { useQuery } = AppContext

const { width, height } = Dimensions.get('screen')

const MessageScreen = () => {
  const { theme, userColorScheme } = useTheme()

  const navigation = useNavigation()
  const [ellips, setEllips] = useState(true)
  const [ellipsId, setEllipsId] = useState<number | undefined>(undefined)
  let scrollRef = useRef<any>()
  const msgs = useQuery(Message).sorted('_id')

  const {
    error,
    isLoading,
    dispatch,
    getMessagesHandler,
    readMessageHandler,
    topMessageHandler,
    unTopMessageHandler,
    deleteMessageHandler
  } = useMessage()

  const onRefresh = async () => {
    setEllips(true)
    setEllipsId(undefined)
    getMessagesHandler(true, true)
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack()
          }}
        />
        <Appbar.Content title="通知消息" />
      </Appbar.Header>
      <ScrollView
        ref={scrollRef}
        style={
          {
            // paddingBottom: 100,
          }
        }
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center'
          // marginTop: 5,
        }}
      >
        {msgs
          .filter(item => item.isTop)
          .sort((a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf())
          .map((item: Message, index: number) => (
            <TouchableRipple
              key={item._id}
              style={[
                { ...styles.messageCard },
                item.isTop && { backgroundColor: 'rgba(196, 198, 207, 0.3)' }
              ]}
              onPress={() => {
                if (!item.isRead) {
                  readMessageHandler(item._id)
                }
                // unSelect message (ellipsId: undefined)
                if (Boolean(ellipsId)) {
                  // switch message card (ellipsId equals item id)
                  if (ellipsId === item._id) {
                    // toggle ellips
                    setEllips(!ellips)
                  } else {
                    // switch message
                    setEllipsId(item._id)
                    setEllips(false)
                  }
                } else {
                  // un select message
                  setEllips(false)
                  setEllipsId(item._id)
                }
              }}
            >
              <Animatable.View
              // animation={"zoomIn"}
              // easing="ease-in-out"
              >
                <Text style={styles.subject}>{`${item?.subject}`}</Text>
                {!item.isRead && <Text style={styles.statusIcon}></Text>}
                <Text>{`${item?.createdAt}`}</Text>
                <Text
                  numberOfLines={
                    ellipsId === item._id && !ellips ? undefined : 1
                  }
                  ellipsizeMode="tail"
                  style={styles.content}
                >
                  {`${item?.content}`}
                </Text>
                {ellipsId === item._id && !ellips && (
                  <View style={styles.action}>
                    <Button
                      style={[
                        {
                          borderRadius: 6,
                          height: 38,
                          marginLeft: 10
                        }
                      ]}
                      onPress={() => {
                        unTopMessageHandler(item._id)
                      }}
                    >
                      取消置顶
                    </Button>
                    <Button
                      labelStyle={{ color: theme.colors.error }}
                      style={[{ borderRadius: 6, height: 38 }]}
                      onPress={() => deleteMessageHandler(item._id)}
                    >
                      删除
                    </Button>
                  </View>
                )}
              </Animatable.View>
            </TouchableRipple>
          ))}
        {msgs
          .filter(item => !item.isTop)
          .sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf())
          .map((item: Message & Realm.Object, index: number) => (
            <TouchableRipple
              key={item._id}
              style={[
                { ...styles.messageCard },
                item.isTop && { backgroundColor: 'rgba(196, 198, 207, 0.3)' }
              ]}
              onPress={() => {
                if (!item.isRead) {
                  readMessageHandler(item._id)
                }
                // unSelect message (ellipsId: undefined)
                if (Boolean(ellipsId)) {
                  // switch message card (ellipsId equals item id)
                  if (ellipsId === item._id) {
                    // toggle ellips
                    setEllips(!ellips)
                  } else {
                    // switch message
                    setEllipsId(item._id)
                    setEllips(false)
                  }
                } else {
                  // un select message
                  setEllips(false)
                  setEllipsId(item._id)
                }
              }}
            >
              <Animatable.View
              // animation={"zoomIn"}
              // easing="ease-in-out"
              >
                <Text style={styles.subject}>{`${item?.subject}`}</Text>
                {!item?.isRead && <Text style={styles.statusIcon}></Text>}
                <Text style={{ color: 'grey' }}>{`${item?.createdAt}`}</Text>
                <Text
                  numberOfLines={
                    ellipsId === item._id && !ellips ? undefined : 1
                  }
                  ellipsizeMode="tail"
                  style={styles.content}
                >
                  {`${item?.content}`}
                </Text>
                {ellipsId === item._id && !ellips && (
                  <View style={styles.action}>
                    <Button
                      style={[
                        {
                          borderRadius: 6,
                          height: 38,
                          marginLeft: 10
                        }
                      ]}
                      onPress={() => {
                        topMessageHandler(item._id)
                      }}
                    >
                      置顶
                    </Button>

                    <Button
                      labelStyle={{ color: theme.colors.error }}
                      style={[{ borderRadius: 6, height: 38 }]}
                      onPress={() => deleteMessageHandler(item._id)}
                    >
                      删除
                    </Button>
                  </View>
                )}
              </Animatable.View>
            </TouchableRipple>
          ))}
        <View style={{ height: 92 }}></View>
      </ScrollView>
      <Snackbar
        visible={Boolean(error)}
        onDismiss={() => dispatch({ type: 'RESTORE' })}
        action={{
          label: '关闭'
        }}
      >
        {error}
      </Snackbar>
    </>
  )
}

MessageScreen.propTypes = {}

export default MessageScreen

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  TouchableOpacity: {
    backgroundColor: '#0077FF',
    fontSize: 32
  },
  header: {
    fontSize: 32,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24
  },
  messageCard: {
    marginHorizontal: 10,
    marginVertical: 6,
    padding: 10,
    width: width * 0.95,
    backgroundColor: '#fff',
    fontSize: 32,
    borderRadius: 10
  },
  subject: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600'
  },
  statusIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    backgroundColor: 'red',
    borderRadius: 100
  },
  content: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '300'
  },
  action: {
    marginTop: 2,
    flexDirection: 'row-reverse'
  }
})
