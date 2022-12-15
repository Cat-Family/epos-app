import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Appbar, Button, TouchableRipple} from 'react-native-paper';
import {AuthContext} from '../components/context';
import {useNavigation, useScrollToTop} from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import CryptoJS from 'crypto-js';
import useFetch from '../hooks/useFetch';
import useMessage from '../hooks/actions/useMessage';

const {width, height} = Dimensions.get('screen');

const MessageScreen = () => {
  const {theme, isDarkTheme, authInfo} = React.useContext<any>(AuthContext);
  const navigation = useNavigation();
  const [ellips, setEllips] = useState(true);
  const [ellipsId, setEllipsId] = useState(undefined);
  const [refreshing, setRefreshing] = useState(false);
  let scrollRef = useRef<any>();

  const {
    topMessages,
    messages,
    error,
    isLoading,
    getMessagesHandler,
    readMessageHandler,
    topMessageHandler,
    unTopMessageHandler,
    deleteMessageHandler,
  } = useMessage();

  const onRefresh = async () => {
    setEllips(true);
    setEllipsId(undefined);
    getMessagesHandler(true);
  };

  useEffect(() => {
    setEllips(true);
    setEllipsId(undefined);
    getMessagesHandler(true);
  }, []);

  return (
    <SafeAreaView
      style={[
        {...styles.container},
        {
          backgroundColor: theme.colors.mainbackground,
        },
      ]}>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
      />
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
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
          justifyContent: 'center',
          // marginTop: 5,
        }}>
        {topMessages.map((item: any, index: number) => (
          <TouchableRipple
            key={item.id}
            style={[
              {...styles.messageCard},
              item.isTop && {backgroundColor: 'rgba(196, 198, 207, 0.3)'},
            ]}
            onPress={() => {
              if (item.isRead === 0) {
                readMessageHandler(item.id, item.isTop);
              }
              // unSelect message (ellipsId: undefined)
              if (Boolean(ellipsId)) {
                // switch message card (ellipsId equals item id)
                if (ellipsId === item.id) {
                  // toggle ellips
                  setEllips(!ellips);
                } else {
                  // switch message
                  setEllipsId(item.id);
                  setEllips(false);
                }
              } else {
                // un select message
                setEllips(false);
                setEllipsId(item.id);
              }
            }}>
            <Animatable.View
            // animation={"zoomIn"}
            // easing="ease-in-out"
            >
              <Text style={styles.subject}>{`${item?.subject}`}</Text>
              {item?.isRead === 0 && <Text style={styles.statusIcon}></Text>}
              <Text>{`${item?.creatTime}`}</Text>
              <Text
                numberOfLines={ellipsId === item.id && !ellips ? undefined : 1}
                ellipsizeMode="tail"
                style={styles.content}>
                {`${item?.content}`}
              </Text>
              {ellipsId === item.id && !ellips && (
                <View style={styles.action}>
                  <Button
                    style={[
                      {
                        borderRadius: 6,
                        height: 38,
                        marginLeft: 10,
                        fontWeight: '600',
                      },
                    ]}
                    onPress={() => {
                      unTopMessageHandler(item.id);
                    }}>
                    取消置顶
                  </Button>
                  <Button
                    labelStyle={{color: theme.colors.error}}
                    style={[{borderRadius: 6, height: 38, fontWeight: '600'}]}
                    onPress={() => deleteMessageHandler(item.id)}>
                    删除
                  </Button>
                </View>
              )}
            </Animatable.View>
          </TouchableRipple>
        ))}
        {messages.map((item: any, index: number) => (
          <TouchableRipple
            key={item.id}
            style={[
              {...styles.messageCard},
              item.isTop && {backgroundColor: 'rgba(196, 198, 207, 0.3)'},
            ]}
            onPress={() => {
              if (item.isRead === 0) {
                readMessageHandler(item.id, item.isTop);
              }
              // unSelect message (ellipsId: undefined)
              if (Boolean(ellipsId)) {
                // switch message card (ellipsId equals item id)
                if (ellipsId === item.id) {
                  // toggle ellips
                  setEllips(!ellips);
                } else {
                  // switch message
                  setEllipsId(item.id);
                  setEllips(false);
                }
              } else {
                // un select message
                setEllips(false);
                setEllipsId(item.id);
              }
            }}>
            <Animatable.View
            // animation={"zoomIn"}
            // easing="ease-in-out"
            >
              <Text style={styles.subject}>{`${item?.subject}`}</Text>
              {item?.isRead === 0 && <Text style={styles.statusIcon}></Text>}
              <Text>{`${item?.creatTime}`}</Text>
              <Text
                numberOfLines={ellipsId === item.id && !ellips ? undefined : 1}
                ellipsizeMode="tail"
                style={styles.content}>
                {`${item?.content}`}
              </Text>
              {ellipsId === item.id && !ellips && (
                <View style={styles.action}>
                  <Button
                    style={[
                      {
                        borderRadius: 6,
                        height: 38,
                        marginLeft: 10,
                        fontWeight: '600',
                      },
                    ]}
                    onPress={() => {
                      topMessageHandler(item.id);
                    }}>
                    置顶
                  </Button>

                  <Button
                    labelStyle={{color: theme.colors.error}}
                    style={[{borderRadius: 6, height: 38, fontWeight: '600'}]}
                    onPress={() => deleteMessageHandler(item.id)}>
                    删除
                  </Button>
                </View>
              )}
            </Animatable.View>
          </TouchableRipple>
        ))}
        <View style={{height: 92}}></View>
      </ScrollView>
    </SafeAreaView>
  );
};

MessageScreen.propTypes = {};

export default MessageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  TouchableOpacity: {
    backgroundColor: '#0077FF',
    fontSize: 32,
  },
  header: {
    fontSize: 32,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
  },
  messageCard: {
    marginHorizontal: 10,
    marginVertical: 6,
    padding: 10,
    width: width * 0.95,
    backgroundColor: '#fff',
    fontSize: 32,
    borderRadius: 10,
  },
  subject: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
  },
  statusIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    backgroundColor: 'red',
    borderRadius: 100,
  },
  content: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '300',
  },
  action: {
    marginTop: 2,
    flexDirection: 'row-reverse',
  },
});
