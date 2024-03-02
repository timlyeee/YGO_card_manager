import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

const CardList = ({ cards, onPress,onIncrement, onDecrement  }) => {
  const renderCardItem = ({ item }) => (
    <TouchableOpacity onPress={() => onPress(item)}>
      <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
        <Text>{item.name}</Text>
        <Text>{item.code}</Text>
        <Text>Quantity: {item.quantity}</Text>
        {/* 减少卡片数量的按钮 Decrement card quantity */}
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <TouchableOpacity onPress={() => onDecrement(item)} style={{ marginRight: 8 }}>
            <Text style={{ color: 'red' }}>Decrement</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onIncrement(item)} style={{ marginRight: 8 }}>
            <Text style={{ color: 'green' }}>Increment</Text>
          </TouchableOpacity>
        </View>
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
