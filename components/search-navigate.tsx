import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const SearchNavigate = ({ onPress }) => {

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'center',
      marginTop: 102
    }}>

      <TouchableOpacity
        style={[{
          // backgroundColor: 'white',
          flex: 1,
          paddingLeft: 10,
        }, style.bar]}
        onPress={onPress}>
        <Text style={{
          textAlign: 'left',
          textAlignVertical: 'center',
          // backgroundColor: 'yellow',
          flex: 1,
          color: 'gray',
        }}>输入搜索关键词</Text>

      </TouchableOpacity>



    </View>
  );
};
const style = StyleSheet.create(
  {
    bar: {
      height: 40,
      borderColor: 'gray',
      borderRadius: 6,
      borderWidth: 1,
    },
    iconContainer: {
      alignItems: 'center',
      justifyContent: 'center'
    }
  }
)
export default SearchNavigate;
