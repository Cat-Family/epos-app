import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  TextInput,
  TouchableOpacity,
} from 'react-native';

export default function HomeScreen() {
  const [gamesTab, setGamesTab] = useState(1);

  const onSelectSwitch = (value: React.SetStateAction<number>) => {
    setGamesTab(value);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View
        style={{
          flexDirection: 'row',
          borderColor: '#C6C6C6',
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 10,
          paddingVertical: 8,
        }}>
        <TextInput placeholder="Search" />
      </View>
    </SafeAreaView>
  );
}
