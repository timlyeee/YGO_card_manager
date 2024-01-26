import React, { useState, useEffect } from 'react';
import { View, Text,TextInput, FlatList, TouchableOpacity, Switch } from 'react-native';
import CardList from '../cards/card-list';
import CardDetails from '../cards/card-detail';
// import { SearchBar } from 'react-native-search-bar';
// import { fetchCardDataFromDatabase } from './data/database';
// 示例卡片数据
const exampleCardData = [
  { id: 1, name: 'Card 1', code: '123456', quantity: 3 },
  { id: 2, name: 'Card 2', code: '789012', quantity: 1 },
  // 添加更多示例卡片数据
];
const Home = () => {
  const [searchText, setSearchText] = useState('');
  const [myCardsOnly, setMyCardsOnly] = useState(false);
  const [cardData, setCardData] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);


  useEffect(() => {
    // 使用硬编码的示例卡片数据
    setCardData(exampleCardData);
  }, []); // 注意：空的依赖数组确保 useEffect 只在组件加载时执行一次


  const filteredCards = cardData.filter((card) => {
      const matchesSearch = (
        card.name.toLowerCase().includes(searchText.toLowerCase()) ||
        card.code.includes(searchText)
      );
      const matchesMyCardsOnly = !myCardsOnly || card.quantity > 0;
      console.log('searchText', searchText,'card', card.name, 'is matched', matchesSearch && matchesMyCardsOnly);
      return matchesSearch && matchesMyCardsOnly;
    });
  
  const renderCardItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleCardPress(item)}>
      <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
        <Text>{item.name}</Text>
        <Text>{item.code}</Text>
        <Text>Quantity: {item.quantity}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleCardPress = (card) => {
    // 显示卡片详细信息组件
    setSelectedCard(card);
  };

  const handleCloseCardDetails = () => {
    // 关闭卡片详细信息组件
    setSelectedCard(null);
  };

  return (
    <View style={{ padding: 16 }}>
      {/* 自定义的 Card Search Bar */}
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 10,
          paddingLeft: 10,
        }}
        placeholder="Search by name or code"
        onChangeText={(text) => setSearchText(text)}
        value={searchText}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Text>Show only my cards</Text>
        {/* <Switch value={myCardsOnly} onValueChange={() => setMyCardsOnly(!myCardsOnly)} /> */}
      </View>
      <CardList data={filteredCards} onPress={handleCardPress} />
      {/* 显示卡片详细信息组件 */}
      {selectedCard && (
        <CardDetails card={selectedCard} onClose={handleCloseCardDetails} />
      )}
    </View>
  );
};

export default Home;
