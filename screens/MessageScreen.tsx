import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { StatusBar, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Appbar } from 'react-native-paper'
import { AuthContext } from '../components/context'
import { useNavigation } from '@react-navigation/native'

const MessageScreen = () => {
    const { theme, isDarkTheme, authInfo } = React.useContext<any>(AuthContext);
    const navigation = useNavigation();

    var ws = new WebSocket('ws://192.168.1.105:18084/wss/89CC42FEE09306971A4AE36868581BDD');

    useEffect(() => {
        ws.onopen = () => {
            // connection opened
            ws.send('连接');  // send a message
        };
        ws.onmessage = (e) => {
            // a message was received
            console.log(e.data);
        };
        ws.onerror =(err)=> {
            console.log(err)
        }
    }, [])
    return (
        <SafeAreaView>
            <StatusBar
                backgroundColor={theme.colors.background}
                barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
            />
            <Appbar.Header>
                <Appbar.BackAction onPress={() => { navigation.goBack() }} />
                <Appbar.Content title="消息" />
            </Appbar.Header>

        </SafeAreaView >
    )
}

MessageScreen.propTypes = {}

export default MessageScreen
