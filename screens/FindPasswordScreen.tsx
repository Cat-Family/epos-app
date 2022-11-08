import React from 'react';
import {Text, View} from 'react-native';
import {AuthNavigationProp} from '../navigation/AuthStack';

export type Props = {
  navigation: AuthNavigationProp;
};

const FindPasswordScreen: React.FC<Props> = ({navigation}) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>FindPasswordScreen</Text>
    </View>
  );
};

export default FindPasswordScreen;
