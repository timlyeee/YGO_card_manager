// App.js
import React from 'react';
import { View } from 'react-native';
import Home from './screens/home';
import {initFileSystem, initCardDatabase, initBankDatabase} from './database/database';
const App = () => {
  initFileSystem();
  initCardDatabase();
  initBankDatabase();
  return (
    <View style={{ flex: 1 }}>
      <Home />
    </View>
  );
};

export default App;
