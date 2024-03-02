import { Asset, useAssets } from 'expo-asset';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Card, CardData } from './define';
const LOCAL_DB_DIR = `${FileSystem.documentDirectory}SQLite`;

const CARDS_DB = 'mycard.cdb';
const CARDS_DB_LOCATION = `${LOCAL_DB_DIR}/${CARDS_DB}`; // copy to

const BANK_DB = 'mybank.db';
const BANK_DB_LOCATION = `${LOCAL_DB_DIR}/${BANK_DB}`;

const INVENTORY_TABLE = 'inventory'; // inventory table name in mybank.db
const DATA_TABLE = 'datas'; // datas table name in mycard.cdb
/**
 * Card database and bank/${INVENTORY_TABLE} database
 */
let carddb: SQLite.SQLiteDatabase, bankdb: SQLite.SQLiteDatabase;

async function initFileSystem() {
  // check local card db
  if (!(await FileSystem.getInfoAsync(LOCAL_DB_DIR)).exists) {
    await FileSystem.makeDirectoryAsync(LOCAL_DB_DIR);
    console.log("Init app sandbox, make database directory success");
  }

}
async function initCardDatabase() {
  // download cards database to sandbox
  if (!(await FileSystem.getInfoAsync(CARDS_DB_LOCATION)).exists) {
    await FileSystem.downloadAsync(
      Asset.fromModule(require(`../assets/${CARDS_DB}`)).uri,
      CARDS_DB_LOCATION
    ).then(() => {


    }
    ).catch((error) => {
      console.error(`Download database failed: ${error}`);
    });
  }
  if (carddb != null) {
    return;
  }
  carddb = SQLite.openDatabase(CARDS_DB_LOCATION);
}
// local functions
async function initBankDatabase() {

  if (bankdb != null) {
    // already inited
    return;
  }
  bankdb = SQLite.openDatabase(BANK_DB_LOCATION);
  bankdb.transaction(
    (tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS ${INVENTORY_TABLE} (id INTEGER, pack TEXT, rarity INTEGER, quantity INTEGER)`,
        [],
        (_, result) => {
          console.log('Table created successfully');
        },
        (_, error) => {
          console.error('Error creating table:', error);
          return false;
        });

    })
}
async function closeDB(){
  if (carddb) {
    carddb.closeAsync();
    carddb = null;
  }

  if (bankdb) {
    bankdb.closeAsync();
    bankdb = null;
  }
}
// utils
async function listAllTable(db: SQLite.SQLiteDatabase) {
  db.transaction(
    (tx) => {
      tx.executeSql(
        `SELECT name FROM sqlite_master WHERE type="table" AND name NOT LIKE "android%";`,
        [],
        (_, result) => {
          const tableNames = result.rows._array.map((row) => row.name);
          console.log('Table names x:', tableNames);
        },
        (_, error) => {
          console.error('Error fetching table names:', error);
          return false;
        });
    },
    (error) => {
      console.error('Transaction error:', error);
    });
}
/**
 * Insert card with card_id, pack_number, rarity
 *  */
async function insertBankCard(card: Card) {
  bankdb.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO ${INVENTORY_TABLE} (id, pack, rarity, quantity) VALUES (?, ?, ?, ?)`,
      [card.id, card.pack, card.rarity, 0],
      (_, result) => {
        console.log('Card added successfully');
      },
      (_, error) => {
        console.error('Error adding card:', error);
        return false;
      });
  },
    (error) => {
      console.error('Transaction error:', error);
    },
    () => {
      console.log('Transaction completed successfully');
    })

}
async function increaseCardQuantity(card: Card, num: number) {
  bankdb.transaction(
    (tx) => {
      tx.executeSql(
        `UPDATE ${INVENTORY_TABLE} SET quantity = quantity + ? WHERE id = ? AND rarity = ? AND pack = ?`,
        [num, card.id, card.rarity, card.pack],

        (_, result) => {
          console.log('Card quantity incremented successfully');
        },
        (_, error) => {
          console.error('Error incrementing card quantity:', error);
          return false;
        });
    },
    (error) => {
      console.error('Transaction error:', error);
    },
    () => {
      console.log('Transaction completed successfully');
    });

}

async function decreaseCardQuantity(card: Card, num: number){
  bankdb.transaction(
    (tx) => {
      tx.executeSql(
        `UPDATE ${INVENTORY_TABLE} SET quantity = CASE WHEN quantity >= ${num} THEN quantity - ${num} ELSE 0 END WHERE id = ${card.id} AND pack = ${card.pack} AND rarity = ${card.rarity}`,
        [],
        (_, result) => {
          console.log('Card quantity incremented successfully');
        },
        (_, error) => {
          console.error('Error incrementing card quantity:', error);
          return false;
        });
    },
    (error) => {
      console.error('Transaction error:', error);
    },
    () => {
      console.log('Transaction completed successfully');
    });

}
async function searchCardData(keyword: string): Promise<{cardData: CardData,card: Card}[]> {
  return new Promise((resolve, reject) => {
    carddb.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT * FROM ${DATA_TABLE} WHERE name LIKE ?`,
          [`%${keyword}%`],
          (_, result) => {
            const cardData = result.rows._array as CardData[];
            const promises = cardData.map((cardDataItem) => {
              return new Promise((resolveCard, rejectCard) => {
                bankdb.transaction(
                  (txBank) => {
                    txBank.executeSql(
                      `SELECT * FROM ${INVENTORY_TABLE} WHERE id = ?`,
                      [cardDataItem.id],
                      (_, resultBank) => {
                        const card = resultBank.rows.length > 0 ? resultBank.rows.item(0) : null;
                        resolveCard({ cardData: cardDataItem, card });
                      },
                      (_, errorBank) => {
                        rejectCard(errorBank);
                        return false;
                      }
                    );
                  },
                  (errorBank) => {
                    rejectCard(errorBank);
                  }
                );
              });
            });
            // for all promises, set card data one by one
            Promise.all(promises)
              .then((searchResults: {cardData: CardData,card: Card}[]) => {
                resolve(searchResults);
              })
              .catch((error) => {
                reject(error);
              });
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      },
      (error) => {
        reject(error);
      },
      () => {
        console.log('Search transaction completed successfully');
      }
    );
  });
}
export { 
  initFileSystem, initBankDatabase, initCardDatabase, closeDB,
  insertBankCard, increaseCardQuantity, decreaseCardQuantity, 
  searchCardData };
