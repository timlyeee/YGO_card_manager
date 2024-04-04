
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
  }, [trigger, isFocused]);

  return (

    <View style={{
      margin: 16,
      // padding: 16, 
      paddingTop: 120
    }}>


    <CardList cards={cards} onTrigger={()=>{}} onCardPress={()=>userCenter.navigate(navigation, route, 'CardDetail', {card: userCenter.currentCard})}/>

    </View>
  );
};

export default MyBank;
