import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, TextInput, Button } from 'react-native';
import { CardInfo, CardPair } from '../define/card';
import httpRequest from '../service/http-request';

const CardDetails = ({ cardPair, onClose, onIncrease, onDecrease }: {
  cardPair: CardPair; 
  onClose:()=>void;
  onIncrease: (card: CardInfo) => void;
  onDecrease: (card: CardInfo)=>void;
}) => {
  const getPackList = async()=>{
    try{
      const cardID =  cardPair.cardData.cid;
      if (cardPair.cardData.cid !=0 ) {
        const url = `https://yxwdbapi.windoent.com/konami/card/detail?titleId=1&cardId=${cardId}&lang=cn`;
        const cardData = await httpRequest(url); // 使用提取的 HTTP 请求工具类发起请求
        if (cardData && cardData.response && cardData.response.packList) {
            const packs = cardData.response.packList.map((pack: any) => pack.packName);
            console.log('Pack List:', packs);
            // setPackList(packs);
        } else {
            console.log('No pack list found in card data.');
        }
    }
  }catch(error) {
    console.error('Error get card pack list data');
  }
  };
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
