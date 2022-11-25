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
  StatusBar,
  SectionList,
  StyleSheet,
} from 'react-native';
import {Button} from 'react-native-paper';
import {AuthContext} from '../components/context';

const DATA = [
  {
    title: 'Main dishes',
    data: ['Pizza', 'Burger', 'Risotto'],
  },
  {
    title: 'Sides',
    data: ['French Fries', 'Onion Rings', 'Fried Shrimps'],
  },
  {
    title: 'Drinks',
    data: ['Water', 'Coke', 'Beer'],
  },
  {
    title: 'Desserts',
    data: ['Cheese Cake', 'Ice Cream'],
  },
];
export default function OrderScreen() {
  const {theme} = React.useContext<any>(AuthContext);
  const [cateIndex, setCateIndex] = useState(0);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        display: 'flex',
        flexDirection: 'row',
      }}>
      <StatusBar backgroundColor={theme.colors.background}></StatusBar>
      <ScrollView
        contentContainerStyle={{
          backgroundColor: theme.colors.surface,
          height: '100%',
          borderRightWidth: 1,
          borderColor: theme.colors.outlineVariant,
        }}>
        {DATA.map((item, index) => (
          <Button
            key={index}
            textColor={
              index === cateIndex
                ? theme.colors.primary
                : theme.colors.secondary
            }
            onPress={() => setCateIndex(index)}>
            {item.title}
          </Button>
        ))}
      </ScrollView>
      <ScrollView
        style={{
          backgroundColor: theme.colors.background,
        }}
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
        <Text>test</Text>
        <Text>test</Text>
        <Text>test</Text>
        <Text>test</Text>
        <Text>test</Text>
        <Text>test</Text>
        <Text>test</Text>
        <Text>test</Text>
        <Text>test</Text>
        <Text>test</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 16,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
  },
  header: {
    fontSize: 32,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
  },
});
