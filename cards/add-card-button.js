import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const AddCardButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ marginTop: 16 }}>
      <Text style={{ color: 'blue' }}>Add Card</Text>
    </TouchableOpacity>
  );
};

export default AddCardButton;
