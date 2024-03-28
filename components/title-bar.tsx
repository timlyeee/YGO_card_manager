import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const TitleBar = ({ title, onBack }) => {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 16,
    }}>
      <TouchableOpacity style={[
        {
          marginRight: 8,
          justifyContent: 'center',
          alignItems:'center',
          left: 0,
          width: 40, 
          height: 40,
          alignContent: 'center',
          position: 'absolute',// 浮在元素上
          zIndex: 1, // 控制层叠顺序，值越大越在上面
        }
      ]} onPress={() => { onBack(); }}>
        <Ionicons name="arrow-back" size={32} color="black" />
      </TouchableOpacity>
      <Text
        style={[{
          fontSize: 20,
          textAlign: 'center',
          verticalAlign:'middle',
          height: 40,
          flex: 1,
        }]}
      >
        {title}
      </Text>
    </View>
  );
};

export default TitleBar;
