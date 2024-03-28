import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, TextInput, Button } from 'react-native';
import { CardInfo, CardPair } from '../define/card';
import httpRequest from '../service/http-request';
import { userCenter } from '../service/user-center';
import { database } from '../service/database';
import TitleBar from '../components/title-bar';

const CardDetailScreen = ({ navigation }) => {

  const handleIncrease = (card: CardInfo) => {

    database.insertBankCard(card);

    database.increaseCardQuantity(card, 1);

  }


  const handleDecrease = (card: CardInfo) => {
    database.decreaseCardQuantity(card, 1);
  };
  const getPackList = async () => {
    try {
      const cardID = userCenter.currentCard.cardData.cid;
      if (cardID != 0) {
        const url = `https://yxwdbapi.windoent.com/konami/card/detail?titleId=1&cardId=${cardID}&lang=cn`;
        const cardData = await httpRequest(url); // 使用提取的 HTTP 请求工具类发起请求
        if (cardData && cardData.response && cardData.response.packList) {
          const packs = cardData.response.packList.map((pack: any) => pack.packName);
          console.log('Pack List:', packs);
          // setPackList(packs);
        } else {
          console.log('No pack list found in card data.');
        }
      }
    } catch (error) {
      console.error('Error get card pack list data');
    }
  };
  useEffect(() => {
    console.log("card details rendered");

  }, [userCenter.currentCard])

  const totalQuantity = userCenter.currentCard.cards.reduce((acc, card) => acc + card.quantity, 0);

  const renderItem = ({ item }: { item: CardInfo }) => (
    <View>
      <Text>{`ID: ${item.id}, Rarity: ${item.rarity}, Pack: ${item.pack}, Quantity: ${item.quantity}`}</Text>
    </View>
  );

  return (


    <View style={{ marginTop: 43 }}>
      {/* Return bar */}
      <TitleBar title={userCenter.currentCard.cardData.name} onBack={() => { navigation.goBack() }} />
      <View
        style={{
          borderColor: 'white',
          borderRadius: 6,
          borderWidth: 1,
          margin: 8,
          backgroundColor: "white",
          height: 194
        }}
      >
        <Text>Name: {userCenter.currentCard.cardData.name}</Text>
        <Text>ID: {userCenter.currentCard.cardData.id}</Text>
        <Text>卡片总库存{totalQuantity}</Text>

      </View>

      {/* 显示每一条 CardInfo 数据 */}
      <FlatList
        data={userCenter.currentCard.cards}
        renderItem={renderItem}
        keyExtractor={(item: CardInfo) => `${item.id}-${item.rarity}-${item.pack}`}
      />

      <Button
        title="Add"
        onPress={() => {
          const newCard: CardInfo = {
            id: userCenter.currentCard.cardData.id,
            rarity: 0,
            pack: "0",
            quantity: 1,
          };
          handleIncrease(newCard);
        }}
      />
      <Button
        title="Decrease"
        onPress={() => {
          const newCard: CardInfo = {
            id: userCenter.currentCard.cardData.id,
            rarity: 0,
            pack: "0",
            quantity: 1,
          };
          handleDecrease(newCard)
        }} />



    </View>

  );
}

export default CardDetailScreen;
