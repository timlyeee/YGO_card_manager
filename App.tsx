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

  // const handleAppStateChange = async (nextAppState: string) => {
  //   if (nextAppState === 'inactive' || nextAppState === 'background') {
  //     // 应用进入后台或失去焦点时，关闭数据库连接
  //     closeDB();
  //   }
  //   if(nextAppState === 'active'){
  //     initCardDatabase();
  //     initBankDatabase();
  //   }
  // };
  
  // const handleBackButtonPress = () => {
  //   const navigation = useNavigation();
  //   // 在 Home 页面时，处理返回按钮事件
  //   if (AppState.currentState === 'active' && !navigation.canGoBack()) {
  //     // 关闭数据库连接
  //     closeDB();
  //     // 退出应用
  //     BackHandler.exitApp();
  //     return true;
  //   }
  
  //   return false;
  // };
  return (
    <NavigationContainer>
      {/* <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={Home}
          options={{headerShown: false}}
          />
        <Stack.Screen 
          name="Search" 
          component={SearchScreen}
          options={{headerShown: false}} />
      </Stack.Navigator> */}
      <BottomNavigationBar/>
    </NavigationContainer>
  );
};

export default App;
