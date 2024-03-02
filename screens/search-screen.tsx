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


const SearchScreen = () => {
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
  function handleSearchCard(keyword: string) {
    database.searchCardData(keyword).then((cards)=>{
      setCardData(cards);
    });

  }
  return (

    <View style={{
      padding: 16, paddingTop: isSearchBarFocused ? 2 : 120
    }}>

      {/* 自定义的 Card Search Bar */}

      {/* <Button title='search'> </Button> */}
      <AnimatedSearchBar
        viewStyle=
        {
          { marginTop: 100 }
        } onFocus={handleSearchFocus} onBlur=
        {handleSearchBlur} onSearch={(text) => setSearchText(text)} >
      </AnimatedSearchBar>

      <AddCardButton onPress={handleAddCardPress} />{
        (<CardList data={cards} onPress=
          {handleCardPress} onIncrement={handleIncrement}
          // 传递新增卡片数量的处理函数
          onDecrement=
          {
            handleDecrement
          }  // 传递减少卡片数量的处理函数
        />
        )}

      {selectedCard && (
        <CardDetails card={selectedCard} onClose={handleCloseCardDetails} />)}
      < AddCardModal
        visible={isAddCardModalVisible}
        onClose={() => setAddCardModalVisible(false)}
        onAddCard={handleAddCard}
      />
    </View>
  );
};

export default SearchScreen;
