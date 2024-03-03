import { Asset, useAssets } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CardList from '../cards/card-list';
import { CardPair } from '../database/define';
import { database } from '../database/database';
const MyBank = ({navigation}) => {


  const [cards, setCards] = useState<CardPair[]>([]);
  useEffect(() => {
    database.fetchMyBankData().then((results)=>{
      
      setCards(results);
    });
  }, []);

  return (

    <View style={{
      margin: 16,
      // padding: 16, 
      paddingTop: 120
    }}>


    <CardList cards={cards}/>

    </View>
  );
};

export default MyBank;
