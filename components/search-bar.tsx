import React, { useState, useRef } from 'react';
import { View,StyleSheet, Text,TextInput, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const SearchBar = ({onBack, onSearch, onBlur, onFocus}) => {
  const [searchText, setSearchText] = useState('');

  const handleFocus = () => {
    onFocus && onFocus();
  };

  const handleBlur = () => {
    onBlur && onBlur();
  };


  const handleSearch = () => {
    onSearch && onSearch(searchText);
  };
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 }}>
        <TouchableOpacity style={[
          {
            marginRight: 8,
            height:32,
            // backgroundColor:'gray',
            width:32,
          },
          style.iconContainer]} onPress={() => { onBack(); }}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TextInput
          style={[{
            flex: 1,
            paddingLeft: 10,
          }, style.bar]}
          placeholder="输入搜索关键词"
          onChangeText={(text) => setSearchText(text)}
          value={searchText}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <TouchableOpacity onPress={handleSearch}
          style={[{
            width: 32,
            // backgroundColor: 'gray',
            marginLeft: 8,
          }, style.bar, style.iconContainer]}>
          <Ionicons name="search-sharp" size={24} color="black" />
          {/* <Text>search</Text> */}
        </TouchableOpacity>


      </View>
  );
};
const style = StyleSheet.create(
  {
    bar: {
      height: 32,
      borderColor: 'gray',
      borderRadius: 6,
      borderWidth: 1,
    },
    iconContainer:{
      alignItems: 'center',
      justifyContent: 'center'
    }
  }
)
export default SearchBar;
