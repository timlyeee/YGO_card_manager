import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, TextInput, Button } from 'react-native';
import { CardInfo, CardPair } from '../database/define';

const CardDetails = ({ cardPair, onClose, onIncrease, onDecrease }: {
  cardPair: CardPair; 
  onClose:()=>void;
  onIncrease: (card: CardInfo) => void;
  onDecrease: (card: CardInfo)=>void;
}) => {
  useEffect(()=>{
    console.log("card details rendered");
  },[cardPair])
  const [newCardId, setNewCardId] = useState('');
  const [newCardRarity, setNewCardRarity] = useState('');
  const [newCardPack, setNewCardPack] = useState('');
  const [newCardQuantity, setNewCardQuantity] = useState('');

  const totalQuantity = cardPair.cards.reduce((acc, card) => acc + card.quantity, 0);

  const renderItem = ({ item }: { item: CardInfo }) => (
    <View>
      <Text>{`ID: ${item.id}, Rarity: ${item.rarity}, Pack: ${item.pack}, Quantity: ${item.quantity}`}</Text>
    </View>
  );

  return (
    
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ backgroundColor: '#fff', padding: 16 }}>
          <Text>Name: {cardPair.cardData.name}</Text>
          <Text>ID: {cardPair.cardData.id}</Text>
          <Text>卡片总库存{totalQuantity}</Text>

          {/* 显示每一条 CardInfo 数据 */}
          <FlatList
            data={cardPair.cards}
            renderItem={renderItem}
            keyExtractor={(item: CardInfo) => `${item.id}-${item.rarity}-${item.pack}`}
          />


          

          <Button
            title="Add"
            onPress={() => {
              const newCard: CardInfo = {
                id: cardPair.cardData.id,
                rarity: 0,
                pack: "0",
                quantity: 1,
              };
              onIncrease(newCard);
            }}
          />
          <Button 
            title="Decrease"
            onPress={()=>{
              const newCard: CardInfo = {
                id: cardPair.cardData.id,
                rarity: 0,
                pack: "0",
                quantity: 1,
              };
              onDecrease(newCard)
            }}/>


          <TouchableOpacity onPress={onClose}>
            <Text style={{ color: 'blue', marginTop: 16 }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>

  );
};

export default CardDetails;
