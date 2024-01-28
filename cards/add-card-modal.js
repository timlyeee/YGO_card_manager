// components/AddCardModal.js
import React, { useState } from 'react';
import { Modal, View, TextInput, TouchableOpacity, Text } from 'react-native';

const AddCardModal = ({ visible, onClose, onAddCard }) => {
  const [newCardName, setNewCardName] = useState('');
  const [newCardCode, setNewCardCode] = useState('');

  const handleAddCard = () => {
    onAddCard(newCardName, newCardCode);
    setNewCardName('');
    setNewCardCode('');
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: '#fff', padding: 16, width: '80%', borderRadius: 8 }}>
          <TextInput
            placeholder="Card Name"
            value={newCardName}
            onChangeText={(text) => setNewCardName(text)}
            style={{ marginBottom: 16, borderColor: 'gray', borderWidth: 1, padding: 8 }}
          />
          <TextInput
            placeholder="Card Code"
            value={newCardCode}
            onChangeText={(text) => setNewCardCode(text)}
            style={{ marginBottom: 16, borderColor: 'gray', borderWidth: 1, padding: 8 }}
          />
          <TouchableOpacity onPress={handleAddCard} style={{ backgroundColor: 'blue', padding: 8, borderRadius: 4 }}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>Add Card</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={{ marginTop: 16 }}>
            <Text style={{ color: 'red', textAlign: 'center' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AddCardModal;
