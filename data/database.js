// data/Database.js
import * as  SQLite  from 'expo-sqlite';

const db = SQLite.openDatabase('carddb');

export const fetchCardDataFromDatabase = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM cards',
      [],
      (_, { rows }) => {
        const data = rows._array; // Convert SQLite result to array
        callback(data);
      },
      (_, error) => {
        console.error('Error fetching card data from database:', error);
      }
    );
  });
};
