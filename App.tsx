// App.js
import React ,{useEffect} from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppState, BackHandler } from 'react-native';
import Home from './screens/home';
import SearchScreen from './screens/search-screen';
import { BottomNavigationBar } from './components/bottom-navigation-bar';
// const Stack = createStackNavigator();

const App = () => {

  return (
    <NavigationContainer>
      
      <BottomNavigationBar/>
    </NavigationContainer>
  );
};

export default App;
