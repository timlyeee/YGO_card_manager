import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';

// 打开或创建数据库
const db = openDatabase({ name: 'mydatabase.db', location: 'default' });

// 执行 SQL 查询等操作
db.transaction(tx => {
  tx.executeSql('SELECT * FROM mytable;', [], (_, { rows }) => {
    console.log(rows.raw());
  });
});

// 关闭数据库
db.close();


export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
