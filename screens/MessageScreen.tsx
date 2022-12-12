import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Dimensions, RefreshControl, ScrollView, SectionList, StatusBar, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Appbar, Button, TouchableRipple } from 'react-native-paper'
import { AuthContext } from '../components/context'
import { useNavigation } from '@react-navigation/native'
import * as Animatable from 'react-native-animatable';
import CryptoJS from 'crypto-js';

const { width, height } = Dimensions.get('screen');

const MessageScreen = () => {
    const { theme, isDarkTheme, authInfo } = React.useContext<any>(AuthContext);
    const navigation = useNavigation();
    const [message, setMessage] = useState<any>([]);
    const [ellips, setEllips] = useState(true)
    const [loading, setLoading] = useState(false)
    const [ellipsId, setEllipsId] = useState(undefined)
    const [refreshing, setRefreshing] = useState(false)
    let scrollRef = useRef<any>()

    async function postData(url = '', data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            // redirect: 'follow', // manual, *follow, error
            // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }

    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await postData("https://qianyushop.shop/api/appClient/msg/QueryMessageList/magicApiJSON.do", {
                authInfo: {
                    ...authInfo,
                    reqTime: new Date().getTime(),
                    reqUid: CryptoJS.MD5(new Date().getTime().toString()).toString(),
                },
            })

            setMessage(res.data.info)
        } catch (error: any) {
            console.error(error.message)
        }
        setLoading(false)
    }

    const onRefresh = async () => {
        setRefreshing(true)
        try {
            const res = await postData("https://qianyushop.shop/api/appClient/msg/QueryMessageList/magicApiJSON.do", {
                authInfo: {
                    ...authInfo,
                    reqTime: new Date().getTime(),
                    reqUid: CryptoJS.MD5(new Date().getTime().toString()).toString(),
                },
            })
            setEllips(true)
            setEllipsId(undefined)
            setMessage(res.data.info)
        } catch (error: any) {
            setEllips(true)
            setEllipsId(undefined)
            console.error(error.message)
        }

        setRefreshing(false)
    }

    useEffect(() => {
        setEllips(true)
        setEllipsId(undefined)
        setMessage([])
        fetchData()
    }, [])

    return (
        <SafeAreaView style={[{ ...styles.container }, {
            backgroundColor: theme.colors.mainbackground,

        }]}>
            <StatusBar
                backgroundColor={theme.colors.background}
                barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
            />
            <Appbar.Header>
                <Appbar.BackAction onPress={() => { navigation.goBack() }} />
                <Appbar.Content title="通知消息" />
            </Appbar.Header>
            <ScrollView
                ref={scrollRef}
                style={{
                    // paddingBottom: 100,
                }}
                refreshControl={
                    loading ? <RefreshControl refreshing={loading} /> :
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                contentContainerStyle={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    // marginTop: 5,
                }}>
                {
                    message.map((item: any, index: number) => (

                        <TouchableRipple
                            key={item.id}
                            style={styles.messageCard}
                            onPress={() => {
                                setMessage(message.map(msg =>
                                    msg.id === item.id ?
                                        { ...msg, isRead: 1 }
                                        : msg
                                ))
                                // unSelect message (ellipsId: undefined)
                                if (Boolean(ellipsId)) {
                                    // switch message card (ellipsId equals item id)
                                    if (ellipsId === item.id) {
                                        // toggle ellips
                                        setEllips(!ellips)
                                    } else {
                                        // switch message
                                        setEllipsId(item.id)
                                        setEllips(false)
                                    }
                                } else {
                                    // un select message
                                    setEllips(false)
                                    setEllipsId(item.id)
                                }
                            }}>
                            <Animatable.View
                            // animation={"zoomIn"}
                            // easing="ease-in-out"
                            >
                                <Text style={styles.subject}>{`${item?.subject}`}</Text>
                                {item?.isRead === 0 &&
                                    <Text style={styles.statusIcon}></Text>
                                }
                                <Text >{`${item?.creatTime}`}</Text>
                                {/* <WebView
                                   originWhitelist={['*']} 
                                   source={{ html: '<h1>Hello world</h1>' }}
  	                            /> */}
                                <Text
                                    numberOfLines={o
                                        (ellipsId === item.id && !ellips) ?
                                            undefined : 1
                                    }
                                    ellipsizeMode="tail"
                                    style={styles.content}>
                                    {`${item?.content}`}
                                </Text>
                                {ellipsId === item.id && !ellips
                                    && <View style={styles.action}>
                                        <Button
                                            style={[{ borderRadius: 6, height: 38, marginLeft: 10, fontWeight: '600' },]}
                                            onPress={() => console.log("test")}>置顶</Button>
                                        <Button
                                            labelStyle={{ color: theme.colors.error }}
                                            style={[{ borderRadius: 6, height: 38, fontWeight: '600' }]}
                                            onPress={() => console.log("test")}>删除</Button>
                                    </View>}

                            </Animatable.View>
                        </TouchableRipple>
                    ))
                }
                <View style={{ height: 92 }}></View>
            </ScrollView>
        </SafeAreaView >
    )
}

MessageScreen.propTypes = {}

export default MessageScreen


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    TouchableOpacity: {
        backgroundColor: "#0077FF",
        fontSize: 32,
    }
    ,
    header: {
        fontSize: 32,
        backgroundColor: "#fff"
    },
    title: {
        fontSize: 24
    },
    messageCard: {
        marginHorizontal: 10,
        marginVertical: 6,
        padding: 10,
        width: width * 0.95,
        backgroundColor: "#fff",
        fontSize: 32,
        borderRadius: 10,
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
        borderRadius: 100,
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
});