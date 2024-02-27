import React, { useState, useRef } from 'react';
import { View,Text,TextInput, TouchableOpacity, Animated } from 'react-native';

import { FontAwesome } from '@expo/vector-icons';
const AnimatedSearchBar = ({onSearch, onBlur, onFocus, viewStyle}) => {
  const [searchText, setSearchText] = useState('');
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    onFocus && onFocus();
    animateSearchBar(true);
  };

  const handleBlur = () => {
    onBlur && onBlur();
    animateSearchBar(false);
  };

  const animateSearchBar = (shouldShow) => {
    Animated.timing(slideAnim, {
      toValue: shouldShow ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleSearch = () => {
    onSearch && onSearch(searchText);
  };
  return (
    <View style={{...viewStyle}}>
      <Animated.View
        style={{
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -60],
              }),
            },
          ],
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 }}>
          <TextInput
            style={{
              flex: 1,
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              paddingLeft: 10,
            }}
            placeholder="输入搜索关键词"
            onChangeText={(text) => setSearchText(text)}
            value={searchText}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <TouchableOpacity onPress={handleSearch} style={{ marginLeft: 10 }}>
          <FontAwesome name="search" size={24} color="black" />
            {/* <Text>search</Text> */}
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default AnimatedSearchBar;
