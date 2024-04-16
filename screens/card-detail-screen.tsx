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
    database.getCardInfoById(userCenter.currentCard.cardData.id).then((cardInfos) => {
      userCenter.currentCard = {
        cardData: userCenter.currentCard.cardData,
        cards: cardInfos
      }

    });
  };
  const getPackList = async () => {
    const cardID = userCenter.currentCard.cardData.cid;
    console.log(`cardID ${cardID}`);
    if (cardID != undefined) {
      const url1 = `https://yxwdbapi.windoent.com/konami/card/detail?titleId=1&cardId=${cardID}&lang=cn`;
      const url2 = `https://yxwdbapi.windoent.com/konami/card/detail?titleId=1&cardId=${cardID}&lang=ja`;
      const fetchURL1 = httpRequest(url1);
      const fetchURL2 = httpRequest(url2);
      console.log(`fetch url ${fetchURL1} and ${fetchURL2}`);
      Promise.allSettled([fetchURL1, fetchURL2])
        .then((results) => {

          // 合并 packLists，处理结果
          var combinedPackList = [];
          for(const result of results){
            if(result.status == 'fulfilled'){
              console.log(`fulfilled result ${result.value?.response??'a'}`);
              combinedPackList = combinedPackList.concat(result.value?.response?.packList??[]);
              console.log(combinedPackList.toString());
            } else {
              console.log(`rejects result ${result.reason}`);
              
            }
          }

          const mpacks: CardInfo[] = combinedPackList.map((pack: any) => {
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
          console.log('fetch urls and set packs');
        })
        .catch((error) => {
          console.error('Error fetching URLs:', error);
          // 处理错误
        });


      
      
    }

  }
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


    <View style={{ marginVertical: 43, marginBottom: 300 }}>
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
