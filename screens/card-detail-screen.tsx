import React, { useEffect, useState } from 'react';
import { View, Text, Image, Modal, TouchableOpacity, FlatList, TextInput, Button } from 'react-native';
import { CardData, CardInfo, CardPair } from '../define/card';
import httpRequest from '../service/http-request';
import { userCenter } from '../service/user-center';
import { database } from '../service/database';
import TitleBar from '../components/title-bar';
import { AntDesign } from '@expo/vector-icons';
const CardDetailScreen = ({ route, navigation }) => {
  const [trigger, setTrigger] = useState<boolean>(false);
  const [packs, setPacks] = useState<CardInfo[]>([]);
  const [cardData, setCardData] = useState<CardData>();
  const [totalQuantity, setTotalQuantity] = useState<number>();
  const handleIncrease = (cardInfo: CardInfo, added: number) => {
    userCenter.increaseCardQuantity(userCenter.currentCard, cardInfo, added);
    setTrigger(!trigger);
  }

  const handleDecrease = (cardInfo: CardInfo, minus: number) => {
    userCenter.decreaseCardQuantity(userCenter.currentCard, cardInfo, 1);
    setTrigger(!trigger);
  };

  useEffect(() => {
    setPacks(Array.from(userCenter.getCardPair(userCenter.currentCard).cards.values()));
    setCardData(userCenter.getCardPair(userCenter.currentCard).cardData);
    setTotalQuantity(packs.reduce((acc, card) => acc + card.quantity, 0));
    console.log("card details rendered");
  }, [trigger, userCenter.currentCard]);

  

  const renderItem = ({ item }: { item: CardInfo }) => {

    return (
      <View style={{
        marginBottom: 1,
        backgroundColor: 'white',
        padding: 16,
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between'

        }}>
          <Text>{item.packName}</Text>
          <Text>{item.rarity}</Text>
        </View>
        <View style={{
          justifyContent: 'flex-end',
          alignItems: 'flex-end'
        }}>
          <View
            style={{
              borderColor: 'gray',
              borderWidth: 1,
              borderRadius: 6,
              marginTop: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: 100
            }}
          >
            <TouchableOpacity
              style={{
                height: 24,
                width: 24,
                borderColor: 'gray',
                borderRightWidth: 1,
                borderTopLeftRadius: 6,
                borderBottomLeftRadius: 6,
                backgroundColor: 'white',
                alignSelf: 'flex-start',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onPress={() => {
                handleIncrease(item, 1);
              }}>
              <AntDesign name="plus" size={16} color="black" />
            </TouchableOpacity>
            <Text
              style={{
                height: 24,
                flex: 1,
                backgroundColor: 'white',
                textAlign: 'center',
                textAlignVertical: 'center',
                alignSelf: 'center'
              }}
            >{item.quantity}</Text>
            <TouchableOpacity
              style={{
                height: 24,
                width: 24,
                borderColor: 'gray',
                borderLeftWidth: 1,
                // borderWidth: 1,
                borderTopRightRadius: 6,
                borderBottomRightRadius: 6,
                backgroundColor: 'white',
                alignSelf: 'flex-end',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onPress={() => {
                handleDecrease(item, 1)
              }}>
              <AntDesign name="minus" size={16} color="black" />

            </TouchableOpacity>
          </View>

        </View>


      </View>
    );
  }
  return (


    <View style={{ marginVertical: 43, marginBottom: 300 }}>
      {/* Return bar */}
      <TitleBar title={cardData.name} onBack={() => { userCenter.goBack(navigation, route) }} />
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
          src={cardData.imageUrl}
          style={{
            padding: 8,
            width: 120,
            height: 174,
            resizeMode: 'contain',
            backgroundColor: 'gray',
          }}

        />
        <View style={{
          flex: 1,
          padding: 12
        }}>
          <Text
            style={{
              fontSize: 18,
              padding: 4
            }}
          >{cardData.name}</Text>
          <Text style={{
            fontSize: 14,
            fontWeight: '300',
            padding: 4
          }}>{cardData.id}</Text>
          <Text style={{
            fontSize: 12,
            padding: 4
          }}>总持有：{totalQuantity}</Text>
        </View>


      </View>

      {/* 显示每一条 CardInfo 数据 */}
      <FlatList
        data={packs}
        renderItem={renderItem}
        keyExtractor={(item: CardInfo) => `${item.id}-${item.rarity}-${item.packId}`}
      />
    </View>

  );
}

export default CardDetailScreen;
