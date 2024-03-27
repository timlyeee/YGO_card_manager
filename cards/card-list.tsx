import React, { useEffect, useState } from 'react';
import { View, Text, FlatList,StyleSheet, TouchableOpacity, StyleProp, ViewStyle, Modal } from 'react-native';
import '../define/card'
import { CardInfo, CardData, CardPair } from '../define/card';
import { database } from '../service/database';
import CardDetails from './card-detail';
import { userCenter } from '../service/user-center';
const CardList = ({ onCardPress, cards, listStyle }: {
  onCardPress: ()=>void;
  cards: CardPair[];
  listStyle?: StyleProp<ViewStyle>; // 添加 style prop
  // onPress: (card: CardPair) => void;
  // onIncrement: (id: number) => void;
  // onDecrement: (id: number) => void;
}) => {
  useEffect(()=>{
    console.log("render card list");
    if(selectedCard){
      var card = cards.find((card: CardPair)=>{
        return card.cardData.id == selectedCard.cardData.id;
      });
      if(card!=null){
        console.log("set selectd card");
        setSelectedCard(card);
      }
    }
    
  },[cards])
  const [selectedCard, setSelectedCard] = useState<CardPair | null>(null);
  const renderCard = ({ item }: { item: CardPair }) => {
    const totalQuantity = item.cards.reduce((acc, card) => acc + card.quantity, 0);
    const handleCardPress = () => {

      userCenter.currentCard = item;
      console.log(`userCenter.currentCard is ${userCenter.currentCard}`);
      // open card detail page
      onCardPress();
      // setSelectedCard(item);
    };
    return (
      <TouchableOpacity onPress={handleCardPress}>
        <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
          <Text>{item.cardData.name}</Text>
          <Text>{item.cardData.id}</Text>
          <Text>卡片总库存{totalQuantity}</Text>
        </View>
      </TouchableOpacity>
    );
  }


  return (
    <>
      <FlatList
        style={listStyle}
        data={cards}
        renderItem={renderCard}
        keyExtractor={(card: CardPair) => card.cardData.id.toString()}
      />
      {/* Modal for displaying card details */}
      {/* <Modal animationType="slide" transparent={true} visible={selectedCard !== null}>
        <View style={styles.modalContainer}>
          <CardDetails cardPair={selectedCard || { cardData: { id: 0, name: '', effect: '', cid: 0 }, cards: [] }} 
              onClose={handleCloseModal} 
              onIncrease={handleIncrease} 
              onDecrease={handleDecrease} />
        </View>
      </Modal> */}

    </>


  );
};
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
export default CardList;
