import React, { useEffect, useState } from 'react';
import { View, Text, Image, Modal, TouchableOpacity, FlatList, TextInput, Button } from 'react-native';
import { CardInfo, CardPair } from '../define/card';
import httpRequest from '../service/http-request';
import { userCenter } from '../service/user-center';
import { database } from '../service/database';
import TitleBar from '../components/title-bar';
import { AntDesign } from '@expo/vector-icons';
const CardDetailScreen = ({ route, navigation }) => {
  const [trigger, setTrigger] = useState<boolean>(false);
  const handleIncrease = (card: CardInfo) => {

    database.insertBankCard(card);

    database.increaseCardQuantity(card, 1);
    setTrigger(!trigger);
    database.getCardInfoById(userCenter.currentCard.cardData.id).then((cardInfos) => {
      userCenter.currentCard = {
        cardData: userCenter.currentCard.cardData,
        cards: cardInfos
      }

    });

  }
  const [packs, setPacks] = useState<CardInfo[]>([]);

  const handleDecrease = (card: CardInfo) => {
    database.decreaseCardQuantity(card, 1);
    setTrigger(!trigger);
  };
  const getPackList = async () => {
    try {
      const cardID = userCenter.currentCard.cardData.cid;
      console.log(`cardID ${cardID}`);
      if (cardID != undefined) {
        const url = `https://yxwdbapi.windoent.com/konami/card/detail?titleId=1&cardId=${cardID}&lang=cn`;
        httpRequest(url).then((data) => {
          console.log(`cardID ${cardID}, data.response packList ${data.response.packList}`);
          const mpacks: CardInfo[] = data.response.packList.map((pack: any) => {
            var existQuantity = 0;
            for (const cardInfo of userCenter.currentCard.cards) {
              if (cardInfo.pack == pack.packName && cardInfo.rarity == pack.rarityKey && cardInfo.id == userCenter.currentCard.cardData.id) {
                existQuantity = cardInfo.quantity;
                console.log(`exist quantity ${existQuantity}`);
              }
            }
            const newCard: CardInfo = {
              id: userCenter.currentCard.cardData.id,
              rarity: pack.rarityKey,
              pack: pack.packName,
              quantity: existQuantity,
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
    getPackList();
    console.log("card details rendered");
  }, [trigger, userCenter.currentCard]);
  // 使用 useFocusEffect 在页面获得焦点时触发

  const totalQuantity = userCenter.currentCard.cards.reduce((acc, card) => acc + card.quantity, 0);

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
          <Text>{item.pack}</Text>
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
                handleIncrease(item);
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
                handleDecrease(item)
              }}>
              <AntDesign name="minus" size={16} color="black" />

            </TouchableOpacity>
          </View>

        </View>


      </View>
    );
  }
  return (


    <View style={{ marginTop: 43 }}>
      {/* Return bar */}
      <TitleBar title={userCenter.currentCard.cardData.name} onBack={() => { userCenter.goBack(navigation, route) }} />
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
          src={userCenter.currentCard.cardData.imageUrl}
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
          >{userCenter.currentCard.cardData.name}</Text>
          <Text style={{
            fontSize: 14,
            fontWeight: '300',
            padding: 4
          }}>{userCenter.currentCard.cardData.id}</Text>
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
        keyExtractor={(item: CardInfo) => `${item.id}-${item.rarity}-${item.pack}`}
      />
    </View>

  );
}

export default CardDetailScreen;
