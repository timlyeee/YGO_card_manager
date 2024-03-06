import { Asset, useAssets } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

import CardList from '../cards/card-list';
import { CardPair } from '../database/define';
import { database } from '../database/database';
import SearchBar from '../components/search-bar';

import { useFocusEffect } from '@react-navigation/native';

const SearchScreen = ({ navigation }) => {
  const [keyword, setKeyWord] = useState<string>('');
  const [cards, setCards] = useState<CardPair[]>([]);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [isSearchBarFocused, setIsSearchBarFocused] = useState<boolean>(false);
  useEffect(() => {
    if(database.isOpened){
      console.log("database is opened");
      database.searchCardData(keyword).then((cards) => {
        setCards(cards);
        setIsDirty(true);
      });
    }
    console.log("use effect when isDirty or keyword changed")
  }, [keyword, isDirty]);  // 注意：空的依赖数组确保 useEffect 只在组件加载时执行一次

  const goBack = () => {
    navigation.goBack();
  }
  const handleSearchFocus = () => {
    setIsSearchBarFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchBarFocused(false);
  };
  function handleSearchCard(keyword) {
    setKeyWord(keyword);
    

  }
  return (

    <View style={{
      padding: 16, paddingTop: 44
    }}>

      <SearchBar
        onBack={goBack}
        onFocus={handleSearchFocus}
        onBlur={handleSearchBlur}
        onSearch={handleSearchCard} />
      {cards && (
        <CardList cards={cards} />
      )}
    </View>
  );
};

export default SearchScreen;
