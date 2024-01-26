import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

const CardList = ({ data, onPress }) => {
  const renderCardItem = ({ item }) => (
    <TouchableOpacity onPress={() => onPress(item)}>
      <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
        <Text>{item.name}</Text>
        <Text>{item.code}</Text>
        <Text>Quantity: {item.quantity}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderCardItem}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

export default CardList;
