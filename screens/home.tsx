import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import '../define/card';

import SearchNavigate from '../components/search-navigate';
import { userCenter } from '../service/user-center';
const Home = ({ route, navigation }) => {


  useEffect(() => {
  }, []);  // 注意：空的依赖数组确保 useEffect 只在组件加载时执行一次

  return (
    <View>
      <View style={{
        margin: 16,
        // padding: 16, 
        paddingTop: 120
      }}>

        <Text
          style={{
            fontSize: 36, alignContent: 'flex-start', borderRadius: 4,
          }}
        >游戏王卡片存折</Text>
        <Text style={{
          paddingTop: 20,
          paddingLeft: 0,
          fontSize: 20,
          alignContent: 'flex-start'
        }}>附带游戏王卡组整合器
        </Text>

        <SearchNavigate onPress={() => { userCenter.navigate(navigation, route, 'Search') }}></SearchNavigate>




      </View>

    </View>

  );
};

export default Home;
