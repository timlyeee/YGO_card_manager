import React, { useEffect, useState } from 'react';
import { View, Text, FlatList,StyleSheet, TouchableOpacity, StyleProp, ViewStyle, Modal } from 'react-native';
import '../database/define'
import { CardInfo, CardData, CardPair } from '../database/define';
import { database } from '../database/database';
import CardDetails from './card-detail';
const CardList = ({ cards, listStyle }: {
  cards: CardPair[];
  listStyle?: StyleProp<ViewStyle>; // 添加 style prop
  // onPress: (card: CardPair) => void;
  // onIncrement: (id: number) => void;
  // onDecrement: (id: number) => void;
}) => {

  const [selectedCard, setSelectedCard] = useState<CardPair | null>(null);
  const renderCard = ({ item }: { item: CardPair }) => {
    const totalQuantity = item.cards.reduce((acc, card) => acc + card.quantity, 0);
    const handleCardPress = () => {
      setSelectedCard(item);
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
  const handleCloseModal = () => {
    setSelectedCard(null);
  };
  const handleIncrease = (card: CardInfo) => {
    if (selectedCard) {
      console.log(`cardinfo added ${card}`);
      database.insertBankCard(card);
      database.increaseCardQuantity(card, 1);
    }
  };

  const handleDecrease = (card: CardInfo) => {
    if (selectedCard) {
      database.decreaseCardQuantity(card, 1);
    }
  };
  return (
    <>
      <FlatList
        style={listStyle}
        data={cards}
        renderItem={renderCard}
        keyExtractor={(card: CardPair) => card.cardData.id.toString()}
      />
      {/* Modal for displaying card details */}
      <Modal animationType="slide" transparent={true} visible={selectedCard !== null}>
        <View style={styles.modalContainer}>
          <CardDetails cardPair={selectedCard || { cardData: { id: 0, name: '', effect: '' }, cards: [] }} onClose={handleCloseModal} onIncrease={handleIncrease} onDecrease={handleDecrease} />
        </View>
      </Modal>
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
