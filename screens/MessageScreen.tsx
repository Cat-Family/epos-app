import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { ScrollView, SectionList, StatusBar, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Appbar } from 'react-native-paper'
import { AuthContext } from '../components/context'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import LinearGradient from 'react-native-linear-gradient'



const MessageScreen = () => {
    const { theme, isDarkTheme, authInfo } = React.useContext<any>(AuthContext);
    const navigation = useNavigation();
    const [message, setMessage] = useState<any>([]);
    var msg = [{"signName":"cat"}]

    var ws = new WebSocket('ws://192.168.1.105:18084/wss/89CC42FEE09306971A4AE36868581BDD');

    useEffect(() => {
        setMessage([])
        ws.onopen = () => {
            // connection opened
        };
        ws.onmessage = (e) => {
            // a message was received
            if (typeof JSON.parse(e.data) == "object") {
                if (JSON.parse(e.data)?.code === 10000) {
                    setMessage(msg => [...msg, JSON.parse(e.data)?.data?.wsLoginInfo])
                }
            }
        };
        ws.onerror = (err) => {
            console.log(err)
        }
    }, [])
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                backgroundColor={theme.colors.background}
                barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
            />
            <Appbar.Header>
                <Appbar.BackAction onPress={() => { navigation.goBack() }} />
                <Appbar.Content title="通知消息" />
            </Appbar.Header>
            <ScrollView
                style={{
                    flex: 1,
                    width: '100%',
                    paddingTop: 10,
                    backgroundColor: theme.colors.mainbackground,
                }}
                // refreshControl={
                //     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                // }
                contentContainerStyle={{
                    width: '100%',
                }}>
                {
                    msg.map((item: any, index: number) => (
                        <TouchableOpacity key={index} onPress={() => console.log("test") }>
                            <Text >{`${item.signName} ${item.subject} ${item.loginTime}`}</Text>
                        </TouchableOpacity>
                    ))
                }
                {console.log(message)}
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
    TouchableOpacity :{
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
    }
});