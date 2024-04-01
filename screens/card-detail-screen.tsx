import React, { useEffect, useState } from 'react';
import { View, Text, Image, Modal, TouchableOpacity, FlatList, TextInput, Button } from 'react-native';
import { CardInfo, CardPair } from '../define/card';
import httpRequest from '../service/http-request';
import { userCenter } from '../service/user-center';
import { database } from '../service/database';
import TitleBar from '../components/title-bar';
import { useFocusEffect } from '@react-navigation/native';

const CardDetailScreen = ({ route, navigation }) => {
  const { card } = route.params;
  const handleIncrease = (card: CardInfo) => {

    database.insertBankCard(card);

    database.increaseCardQuantity(card, 1);

  }
  const [packs, setPacks] = useState<CardInfo[]>([]);

  const handleDecrease = (card: CardInfo) => {
    database.decreaseCardQuantity(card, 1);
  };
  const getPackList = async () => {
    try {
      const cardID = card.cardData.cid;
      console.log(`cardID ${cardID}`);
      if (cardID != undefined) {
        const url = `https://yxwdbapi.windoent.com/konami/card/detail?titleId=1&cardId=${cardID}&lang=cn`;
        httpRequest(url).then((data) => {
          console.log(`cardID ${cardID}, data.response packList ${data.response.packList}`);
          const mpacks: CardInfo[] = data.response.packList.map((pack: any) => {
            const newCard: CardInfo = {
              id: card.cardData.id,
              rarity: pack.rarityKey,
              pack: pack.packName,
              quantity: 0,
            };
            return newCard;
          });
          setPacks(mpacks);

          console.log('Pack List:', packs);
          // setPackList(packs);

        }); // 使用提取的 HTTP 请求工具类发起请求

      }
    } catch (error) {
      console.error('Error get card pack list data');
    }
  };
  useEffect(() => {
    console.log("card details rendered");
    getPackList().then(() => {

    });
  }, [card, userCenter.trigger, navigation]);
  // 使用 useFocusEffect 在页面获得焦点时触发

  const totalQuantity = card.cards.reduce((acc, card) => acc + card.quantity, 0);

  const renderItem = ({ item }: { item: CardInfo }) => (
    <View>
      <View style={{ flexDirection: 'row' }}>
        <Text>{item.pack}</Text>
        <Text>{item.rarity}</Text>
      </View>

      <Button
        title="Add"
        onPress={() => {

          handleIncrease(item);
        }}
      />
      <Text>{item.quantity}</Text>
      <Button
        title="Decrease"
        onPress={() => {
          handleDecrease(item)
        }} />

    </View>
  );

  return (


    <View style={{ marginTop: 43 }}>
      {/* Return bar */}
      <TitleBar title={card.cardData.name} onBack={() => { navigation.goBack() }} />
      <View
        style={{
          borderColor: 'white',
          borderRadius: 6,
          borderWidth: 1,
          margin: 8,
          backgroundColor: "white",
          height: 194,
          flexDirection: 'row'
        }}
      >
        <Image
          src={card.cardData.imageUrl}
          style={{
            width: 120,
            height: 174,
            resizeMode: 'contain',
            backgroundColor: 'gray',
          }}

        />
        <View style={{
          flex: 1
        }}>
          <Text>Name: {card.cardData.name}</Text>
          <Text>ID: {card.cardData.id}</Text>
          <Text>卡片总库存{totalQuantity}</Text>
        </View>


      </View>

      {/* 显示每一条 CardInfo 数据 */}
      <FlatList
        data={packs}
        renderItem={renderItem}
        keyExtractor={(item: CardInfo) => `${item.id}-${item.rarity}-${item.pack}`}
      />
    </View>

  );
}

export default CardDetailScreen;
