
import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CardList from '../cards/card-list';
import { CardPair } from '../define/card';
import { database } from '../service/database';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { userCenter } from '../service/user-center';
const MyBank = ({route, navigation}) => {


  const [cards, setCards] = useState<CardPair[]>([]);
  const [trigger, setTrigger] = useState<boolean>(false);


  const [filterFlag, setFilterFlag] = useState<number>(0);
  const [filterBtnColor, setFilterBtnColor] = useState<string>("blue");
  
  const [showCards, setShowCards] = useState<CardPair[]>([]);

  function triggy(){
    setTrigger(!trigger);

  }
  const isFocused = useIsFocused();
  useEffect(() => {
    console.log("use mybank effect");
      database.fetchMyBankData().then((results)=>{
      setCards(results);
    });
    if(isFocused){
      console.log("is focus, update");
      database.fetchMyBankData().then((results)=>{
      
        setCards(results);
      });
    }
    RefreshShowCards(filterFlag);

  }, [trigger, isFocused]);


  const onFilterBtnClick = ()=>
  {
     if(filterFlag == 0)
     {
      setFilterFlag(1);
      RefreshShowCards(1);
     }
     else if(filterFlag == 1)
     {

       setFilterFlag(0);
       RefreshShowCards(0);
     }
  };

  function RefreshShowCards(filterFlag)
  {
    if(filterFlag == 0)
    {
      setShowCards(cards);
      setFilterBtnColor("blue");

    }
    else if(filterFlag == 1)
    {
        const filtedCards =cards.filter(item =>
        {
          const totalQuantity = item.cards.reduce((acc, card) => acc + card.quantity, 0);
          return totalQuantity > 3;
        });
        setShowCards(filtedCards);
        setFilterBtnColor("red");
    }
  }
  

  
  return (
    <View style={{
      margin: 16,
      // padding: 16, 
      paddingTop: 120
    }}>
    

    {/*  筛选按钮 */}
     <TouchableOpacity 
       style={{
        height: 30,
        width: 150,
        borderColor: filterBtnColor,
        borderLeftWidth: 5,
        borderRightWidth: 5,
        backgroundColor: 'white',
        alignSelf: 'flex-start',
        alignItems: 'center',
        justifyContent: 'center'
      }}
     onPress={onFilterBtnClick}>

     <Text style={{ color: 'black' }}>筛选大于三张卡牌</Text>
     </TouchableOpacity>
   

    <CardList cards={showCards} onTrigger={()=>{}} onCardPress={()=>userCenter.navigate(navigation, route, 'CardDetail', {card: userCenter.currentCard})}/>

    </View>
  );
};

export default MyBank;
