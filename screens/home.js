import React, { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { View, Text, TextInput, FlatList, TouchableOpacity, Switch } from 'react-native';
import CardList from '../cards/card-list';
import CardDetails from '../cards/card-detail';
import AddCardButton from '../cards/add-card-button';
import AddCardModal from '../cards/add-card-modal';

const DB_FILE_NAME = 'carddb.db'; // 数据库文件名
const DB_DIR = FileSystem.documentDirectory; // 数据库文件所在目录

const Home = () => {
  const [searchText, setSearchText] = useState('');
  const [myCardsOnly, setMyCardsOnly] = useState(false);
  const [cardData, setCardData] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isAddCardModalVisible, setAddCardModalVisible] = useState(false);


  useEffect(() => {
    initDatabase();
    fetchCardData();
  }, []); // 注意：空的依赖数组确保 useEffect 只在组件加载时执行一次


  const filteredCards = cardData.filter((card) => {
    const matchesSearch = (
      card.name.toLowerCase().includes(searchText.toLowerCase()) ||
      card.code.includes(searchText)
    );
    const matchesMyCardsOnly = !myCardsOnly || card.quantity > 0;
    console.log('searchText', searchText, 'card', card.name, 'is matched', matchesSearch && matchesMyCardsOnly);
    return matchesSearch && matchesMyCardsOnly;
  });

  const initDatabase = async () => {
    try {
      // 检查数据库文件是否存在
      const dbFileExists = await FileSystem.getInfoAsync(`${DB_DIR}${DB_FILE_NAME}`);
      
      // 如果不存在，则创建数据库文件并初始化表格
      if (!dbFileExists.exists) {
        await createDatabase();
        console.log('Database initialized successfully');
      } else {
        console.log('Database already exists');
      }
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  };
  const createDatabase = async () => {
    try {
      // 创建数据库文件
      await FileSystem.writeAsStringAsync(`${DB_DIR}${DB_FILE_NAME}`, '');

      // 打开数据库连接
      const db = SQLite.openDatabase(DB_FILE_NAME);

      // 创建表格
      db.transaction(
        (tx) => {
          tx.executeSql(
            'CREATE TABLE IF NOT EXISTS cards (id INTEGER PRIMARY KEY, name TEXT, code TEXT, quantity INTEGER)',
            [],
            (_, result) => {
              console.log('Table created successfully');
            },
            (_, error) => {
              console.error('Error creating table:', error);
            }
          );
        },
        (error) => {
          console.error('Transaction error:', error);
        },
        () => {
          console.log('Transaction completed successfully');
        }
      );
    } catch (error) {
      console.error('Error creating database:', error);
    }
  };
  const fetchCardData = async () => {
    try {
      // 打开数据库连接
      const db = SQLite.openDatabase(DB_FILE_NAME);

      // 查询所有卡片数据
      db.transaction(
        (tx) => {
          tx.executeSql(
            'SELECT * FROM cards',
            [],
            (_, result) => {
              const data = result.rows._array;
              setCardData(data);
            },
            (_, error) => {
              console.error('Error fetching card data:', error);
            }
          );
        },
        (error) => {
          console.error('Transaction error:', error);
        },
        () => {
          console.log('Transaction completed successfully');
        }
      );
    } catch (error) {
      console.error('Error fetching card data:', error);
    }
  };
  const handleCardPress = (card) => {
    // 显示卡片详细信息组件
    setSelectedCard(card);
  };

  const handleCloseCardDetails = () => {
    // 关闭卡片详细信息组件
    setSelectedCard(null);
  };
  const handleAddCardPress = () => {
    setAddCardModalVisible(true);
  };
  // ... 其他代码 ...

  const handleAddCard = async (name, code) => {
    try {
      // 打开数据库连接
      const db = SQLite.openDatabase(DB_FILE_NAME);

      // 插入新卡片到表格
      db.transaction(
        (tx) => {
          tx.executeSql(
            'INSERT INTO cards (name, code, quantity) VALUES (?, ?, ?)',
            [name, code, 0], // 默认数量为 0
            (_, result) => {
              console.log('Card added successfully');
            },
            (_, error) => {
              console.error('Error adding card:', error);
            }
          );
        },
        (error) => {
          console.error('Transaction error:', error);
        },
        () => {
          console.log('Transaction completed successfully');
        }
      );

      // 更新内存中的卡片数据
      const newCard = {
        id: cardData.length + 1,
        name: name,
        code: code,
        quantity: 0,
      };
      setCardData([...cardData, newCard]);
    } catch (error) {
      console.error('Error adding card:', error);
    }
  };

  const handleIncrement = async (card) => {
    try {
      // 打开数据库连接
      const db = SQLite.openDatabase(DB_FILE_NAME);

      // 增加卡片数量
      db.transaction(
        (tx) => {
          tx.executeSql(
            'UPDATE cards SET quantity = quantity + 1 WHERE id = ?',
            [card.id],
            (_, result) => {
              console.log('Card quantity incremented successfully');
            },
            (_, error) => {
              console.error('Error incrementing card quantity:', error);
            }
          );
        },
        (error) => {
          console.error('Transaction error:', error);
        },
        () => {
          console.log('Transaction completed successfully');
        }
      );

      // 更新内存中的卡片数据
      fetchCardData(); // 重新获取卡片数据
    } catch (error) {
      console.error('Error incrementing card quantity:', error);
    }
  };

  const handleDecrement = async (card) => {
    try {
      // 打开数据库连接
      const db = SQLite.openDatabase(DB_FILE_NAME);

      // 减少卡片数量
      db.transaction(
        (tx) => {
          tx.executeSql(
            'UPDATE cards SET quantity = CASE WHEN quantity > 0 THEN quantity - 1 ELSE 0 END WHERE id = ?',
            [card.id],
            (_, result) => {
              console.log('Card quantity decremented successfully');
            },
            (_, error) => {
              console.error('Error decrementing card quantity:', error);
            }
          );
        },
        (error) => {
          console.error('Transaction error:', error);
        },
        () => {
          console.log('Transaction completed successfully');
        }
      );

      // 更新内存中的卡片数据
      fetchCardData(); // 重新获取卡片数据
    } catch (error) {
      console.error('Error decrementing card quantity:', error);
    }
  };
  return (
    <View style={{ padding: 16 }}>
      {/* 自定义的 Card Search Bar */}
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 10,
          paddingLeft: 10,
        }}
        placeholder="Search by name or code"
        onChangeText={(text) => setSearchText(text)}
        value={searchText}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Text>Show only my cards</Text>
        {/* <Switch value={myCardsOnly} onValueChange={() => setMyCardsOnly(!myCardsOnly)} /> */}
      </View>
      {/* 添加卡片按钮 */}
      <AddCardButton onPress={handleAddCardPress} />
      <CardList data={filteredCards}
        onPress={handleCardPress}
        onIncrement={handleIncrement} // 传递新增卡片数量的处理函数
        onDecrement={handleDecrement} // 传递减少卡片数量的处理函数
      />
      {/* 显示卡片详细信息组件 */}
      {selectedCard && (
        <CardDetails card={selectedCard} onClose={handleCloseCardDetails} />
      )}
      {/* 自定义卡片信息的弹出框 */}
      <AddCardModal
        visible={isAddCardModalVisible}
        onClose={() => setAddCardModalVisible(false)}
        onAddCard={handleAddCard}
      />
    </View>
  );
};

export default Home;
