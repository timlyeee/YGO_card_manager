import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, StyleProp, ViewStyle, Modal } from 'react-native';
import '../define/card'
import { CardInfo, CardData, CardPair } from '../define/card';
import { database } from '../service/database';
import { userCenter } from '../service/user-center';
const CardList = ({ onCardPress, onTrigger, cards, listStyle }: {
  onCardPress: () => void;
  onTrigger: () => void;
  cards: CardPair[];
  listStyle?: StyleProp<ViewStyle>; // 添加 style prop
}) => {

  const renderCard = ({ item }: { item: CardPair }) => {
    const totalQuantity = item.cards.reduce((acc, card) => acc + card.quantity, 0);
    const handleCardPress = () => {

      userCenter.currentCard = item;
      console.log(`current item : ${item.cardData} + ${item.cards.toString()}`)
      console.log(`userCenter.currentCard is ${userCenter.currentCard.cardData.name}`);
      // open card detail page
      userCenter.trigger = !userCenter.trigger;

      // onTrigger();
      onCardPress();

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
