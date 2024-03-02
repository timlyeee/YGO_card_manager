import { Asset, useAssets } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as database from '../database/database';
import AddCardButton from '../cards/add-card-button';
import AddCardModal from '../cards/add-card-modal';
import CardDetails from '../cards/card-detail';
import CardList from '../cards/card-list';
import AnimatedSearchBar from '../components/animated-search-bar';
import '../database/define';


const Home = () => {
  const [searchText, setSearchText] = useState('');
  const [myCardsOnly, setMyCardsOnly] = useState(false);
  const [cardData, setCardData] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isAddCardModalVisible, setAddCardModalVisible] = useState(false);
  const [isSearchBarFocused, setIsSearchBarFocused] = useState(false);


  useEffect(() => {
  }, []);  // 注意：空的依赖数组确保 useEffect 只在组件加载时执行一次



  const handleSearchFocus = () => {
    setIsSearchBarFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchBarFocused(false);
  };

  return (

    <View style={{
      padding: 16, paddingTop: isSearchBarFocused ? 2 : 120
    }}>
      {!isSearchBarFocused && (
        <>
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
        </>
      )}


      
    </View>
  );
};

export default Home;
