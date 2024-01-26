// screens/CardDetailScreen.js
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

const CardDetailScreen = ({ route }) => {
  const { card } = route.params;
  const [quantity, setQuantity] = useState(card.quantity);

  const handleIncrement = () => setQuantity(quantity + 1);
  const handleDecrement = () => setQuantity(quantity > 0 ? quantity - 1 : 0);

  return (
    <View style={{ padding: 16 }}>
      <Text>{card.name}</Text>
      <Text>{card.code}</Text>
      <Text>Quantity: {quantity}</Text>
      <Button title="Increment" onPress={handleIncrement} />
      <Button title="Decrement" onPress={handleDecrement} />
    </View>
  );
};

export default CardDetailScreen;
