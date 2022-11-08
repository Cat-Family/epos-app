import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import AuthStack from './navigation/AuthStack';
import AppStack from './navigation/AppStack';

const App = () => {
  return (
    <NavigationContainer>
      <AuthStack />
      {/* <AppStack /> */}
    </NavigationContainer>
  );
};

export default App;
