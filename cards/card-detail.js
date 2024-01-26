// components/CardDetailsComponent.js
import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';

const CardDetails = ({ card, onClose }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={true}>
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ backgroundColor: '#fff', padding: 16 }}>
          <Text>Name: {card.name}</Text>
          <Text>Code: {card.code}</Text>
          <Text>Quantity: {card.quantity}</Text>
          {/* 添加其他卡片详细信息的显示内容 */}
          <TouchableOpacity onPress={onClose}>
            <Text style={{ color: 'blue', marginTop: 16 }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CardDetails;
