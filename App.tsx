// App.js
import React ,{useEffect} from 'react';
import {initFileSystem, initCardDatabase, initBankDatabase, closeDB} from './database/database';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppState, BackHandler } from 'react-native';
import Home from './screens/home';
import SearchScreen from './screens/search-screen';
const Stack = createStackNavigator();

const App = () => {
  useEffect(()=>{
    useEffect(() => {
      initFileSystem();
      initCardDatabase();
      initBankDatabase();
  
      // 监听应用状态变化
      const appStateChanger = AppState.addEventListener('change', handleAppStateChange);
  
      // 监听硬件返回按钮
      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);
  
      // 移除监听器
      return () => {
        appStateChanger.remove();
        backHandler.remove();
      };
    }, []);
  })
  const navigation = useNavigation();
  const handleAppStateChange = async (nextAppState: string) => {
    if (nextAppState === 'inactive' || nextAppState === 'background') {
      // 应用进入后台或失去焦点时，关闭数据库连接
      closeDB();
    }
    if(nextAppState === 'active'){
      initCardDatabase();
      initBankDatabase();
    }
  };
  
  const handleBackButtonPress = () => {
    // 在 Home 页面时，处理返回按钮事件
    if (AppState.currentState === 'active' && !navigation.canGoBack()) {
      // 关闭数据库连接
      closeDB();
      // 退出应用
      BackHandler.exitApp();
      return true;
    }
  
    return false;
  };
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Search" component={SearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
