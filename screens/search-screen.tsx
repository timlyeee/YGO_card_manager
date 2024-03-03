import { Asset, useAssets } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import AddCardButton from '../cards/add-card-button';
import AddCardModal from '../cards/add-card-modal';
import CardDetails from '../cards/card-detail';
import CardList from '../cards/card-list';
import AnimatedSearchBar from '../components/search-bar';
import { CardPair } from '../database/define';
import { database } from '../database/database';
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../components/search-bar';


const SearchScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [myCardsOnly, setMyCardsOnly] = useState(false);
  const [cards, setCards] = useState<CardPair[]>([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isAddCardModalVisible, setAddCardModalVisible] = useState(false);
  const [isSearchBarFocused, setIsSearchBarFocused] = useState(false);

  useEffect(() => {
  }, []);  // 注意：空的依赖数组确保 useEffect 只在组件加载时执行一次


  const goBack=()=>{
    navigation.goBack();
  }
  const handleSearchFocus = () => {
    setIsSearchBarFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchBarFocused(false);
  };
  function handleSearchCard(keyword) {
    database.searchCardData(keyword).then((cards) => {
      setCards(cards);
    });

  }
  return (

    <View style={{
      padding: 16, paddingTop: 44
    }}>

      <SearchBar 
        onBack={goBack} 
        onFocus={handleSearchFocus}
        onBlur={handleSearchBlur}
        onSearch={handleSearchCard}/>
      {cards && (
        <CardList cards={cards}/>
      )}
    </View>
  );
};

export default SearchScreen;
