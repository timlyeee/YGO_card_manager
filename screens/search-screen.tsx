
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import CardList from '../cards/card-list';
import { CardPair } from '../define/card';
import { database } from '../service/database';
import SearchBar from '../components/search-bar';
import { userCenter } from '../service/user-center';

const SearchScreen = ({ route, navigation }) => {
  const [keyword, setKeyWord] = useState<string>('');
  const [cards, setCards] = useState<CardPair[]>([]);
  const [trigger, setTrigger] = useState<boolean>(false);
  const [isSearchBarFocused, setIsSearchBarFocused] = useState<boolean>(false);
  useEffect(() => {
    //监听trigger和keyword，保证searchlist和当前card的数量显示是一致的。
    if (database.isOpened) {
      console.log("database is opened");
      if (keyword != '') {
        database.searchCardData(keyword).then((cards) => {
          setCards(cards);
        });
      }

    }
    console.log("use effect when isDirty or keyword changed")
  }, [keyword, userCenter.currentCard, trigger]);


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
  function triggy() {
    setTrigger(!trigger);
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
        <CardList onTrigger={()=>setTrigger(!trigger)} 
        onCardPress={() => userCenter.navigate(navigation, route, 'CardDetail', {card: userCenter.currentCard})} 
        cards={cards} />
      )}
    </View>
  );
};

export default SearchScreen;
