import { Asset, useAssets } from 'expo-asset';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { CardInfo, CardData, CardPair } from '../define/card';
import { listFilesRecursively } from '../utils/file-utils';
const LOCAL_DB_DIR = `${FileSystem.documentDirectory}SQLite`;

const CARDS_DB = 'mycard.cdb';
const CARDS_DB_LOCATION = `${LOCAL_DB_DIR}/${CARDS_DB}`; // copy to

const BANK_DB = 'mybank.db';
const BANK_DB_LOCATION = `${LOCAL_DB_DIR}/${BANK_DB}`;

const INVENTORY_TABLE = 'inventory'; // inventory table name in mybank.db
const DATA_TABLE = 'datas'; // datas table name in mycard.cdb
const TEXT_TABLE = 'texts';
class Database {
// fields
  private static instance: Database | null = null;
  private carddb: SQLite.SQLiteDatabase;
  private bankdb: SQLite.SQLiteDatabase;

  /**
   * Card database and bank/${INVENTORY_TABLE} database
   */
  private constructor() {
    console.log('LOCAL_DB_DIR:', LOCAL_DB_DIR);
    console.log('CARDS_DB_LOCATION:', CARDS_DB_LOCATION);
    console.log('BANK_DB_LOCATION:', BANK_DB_LOCATION);
    // 私有构造函数，防止直接实例化
    this.initFileSystem();
    this.initCardDatabase().then(() => {
      this.isCardDBOpened = true;
    });
    this.initBankDatabase().then(() => {
      this.isBankDBOpened = true;
    });
    listFilesRecursively(LOCAL_DB_DIR);

  }
  private isCardDBOpened: boolean = false;
  private isBankDBOpened: boolean = false;
  public get isOpened(): boolean {
    return this.isCardDBOpened && this.isBankDBOpened;
  }
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async initFileSystem() {
    console.log("Init file system");
    // check local card db
    // await FileSystem.deleteArsync(CARDS_DB_LOCATION);
    if (!(await FileSystem.getInfoAsync(LOCAL_DB_DIR)).exists) {
      await FileSystem.makeDirectoryAsync(LOCAL_DB_DIR);
      console.log("Init app sandbox, make database directory success");
    }

  }
  public async initCardDatabase() {
    // download cards database to sandbox
    if (!(await FileSystem.getInfoAsync(CARDS_DB_LOCATION)).exists) {
      await FileSystem.downloadAsync(
        Asset.fromModule(require(`../assets/${CARDS_DB}`)).uri,
        CARDS_DB_LOCATION
      ).then(() => {
        console.log(`Download success, ${CARDS_DB_LOCATION}`);
      }
      ).catch((error) => {
        console.error(`Download database failed: ${error}`);
      });
    }

    if (this.carddb != null) {
      return;
    }
    console.log(`Try open database ${CARDS_DB}, while localdir ${FileSystem.documentDirectory}`)
    this.carddb = SQLite.openDatabase(CARDS_DB);

  }
  // local functions
  public async initBankDatabase() {

    if (this.bankdb != null) {
      // already inited
      return;
    }

    this.bankdb = SQLite.openDatabase(BANK_DB);
    // this.bankdb.transaction(
    //   (tx) => {
    //     tx.executeSql(
    //       'DROP TABLE IF EXISTS inventory',
    //       [],
    //       (_, result) => {
    //         console.log('Table dropped successfully');
    //       },
    //       (_, error) => {
    //         console.error('Error dropping table:', error);
    //         return false;
    //       }
    //     );
    //   },
    //   (error) => {
    //     console.error('Transaction error:', error);
    //   }
    // );
    this.bankdb.transaction(
      (tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS ${INVENTORY_TABLE} (
            id INTEGER,  
            rarity INTEGER,
            pack TEXT, 
            quantity INTEGER,
            PRIMARY KEY (id, rarity, pack)
            )`,
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
  public async closeDB() {
    if (this.carddb) {
      this.carddb.closeAsync();
      this.carddb = null;
    }

    if (this.bankdb) {
      this.bankdb.closeAsync();
      this.bankdb = null;
    }
  }
  // utils
  public async listAllTable(db: SQLite.SQLiteDatabase) {
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
  public async insertBankCard(card: CardInfo) {
    this.bankdb.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO ${INVENTORY_TABLE} (id, rarity,pack, quantity) 
        VALUES (?, ?, ?, ?) 
        ON CONFLICT (id, rarity, pack)
        DO NOTHING`,
        [card.id, card.rarity, card.pack, card.quantity],
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
  public async increaseCardQuantity(card: CardInfo, num: number) {
    this.bankdb.transaction(
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

  public async decreaseCardQuantity(card: CardInfo, num: number) {
    this.bankdb.transaction(
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
  public async searchCardData(keyword: string): Promise<CardPair[]> {
    return new Promise<CardPair[]>((resolve, reject) => {
      console.log(`Try transact from carddb ${this.carddb}`);
      this.carddb.transaction(
        (tx) => {
          tx.executeSql(
            `SELECT * FROM ${TEXT_TABLE} WHERE name LIKE ?`,
            [`%${keyword}%`],
            (_, result) => {
              const cardData: CardData[] = result.rows._array.map((item: any) => ({
                id: item.id,
                name: item.name,
                effect: item.desc,
                cid: item.cid
              }));
              const promises: Promise<CardPair>[] = cardData.map((cardDataItem) => {
                return new Promise<CardPair>((resolveCard, rejectCard) => {
                  this.bankdb.transaction(
                    (txBank) => {
                      txBank.executeSql(
                        `SELECT * FROM ${INVENTORY_TABLE} WHERE id = ?`,
                        [cardDataItem.id],
                        (_, resultBank) => {
                          const cards: CardInfo[] = resultBank.rows._array || [];
                          resolveCard({ cardData: cardDataItem, cards: cards });
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
                .then((searchResults: CardPair[]) => {
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
  public async fetchMyBankData(): Promise<CardPair[]> {
    return new Promise<CardPair[]>((resolve, reject) => {
      console.log(`fetch my bank data`);
      this.bankdb.transaction(
        (tx) => {
          tx.executeSql(
            `SELECT * FROM ${INVENTORY_TABLE} WHERE quantity > 0`,
            [],
            async (_, result) => {
              const cardsMap = new Map<number, CardPair>(); // id to card pair
              const cardDataPromises: Promise<CardData>[] = [];

              for (let i = 0; i < result.rows.length; i++) {
                const item = result.rows.item(i);
                const cardInfo = new CardInfo(item.id, item.rarity, item.pack, item.quantity);

                // Collect promises for fetching CardData
                cardDataPromises.push(this.getCardDataByID(item.id));

                if (cardsMap.has(item.id)) {
                  // If the id already exists in the map, update the existing entry
                  const existingEntry = cardsMap.get(item.id);
                  existingEntry.cards.push(cardInfo);
                } else {
                  // If the id is not present, create a new entry
                  const newEntry: CardPair = { cardData: null, cards: [cardInfo] };
                  cardsMap.set(item.id, newEntry);
                }
              }

              try {
                // Wait for all CardData promises to resolve
                const cardDataList = await Promise.all(cardDataPromises);

                // Update CardData in the cardsMap
                cardDataList.forEach((cardData, index) => {
                  const itemId = result.rows.item(index).id;
                  const entry = cardsMap.get(itemId);
                  if (entry) {
                    entry.cardData = cardData;
                  }
                });

                // Filter out entries with total quantity <= 0
                const filteredData = Array.from(cardsMap.values()).filter(
                  (entry) => entry.cards.reduce((total, card) => total + card.quantity, 0) > 0
                );

                resolve(filteredData);
              } catch (error) {
                console.error('Error fetching CardData', error);
                reject(error);
              }
            },
            (_, error) => {
              console.error('Error fetching my bank data', error);
              reject(error);
              return false;
            }
          );
        },
        (error) => {
          console.error('Transaction error', error);
        }
      );
    });
  }

  public getCardDataByID(id: number): Promise<CardData> {
    return new Promise((resolve, reject) => {
      let cardData: CardData = { id: -1, name: 'Unknown', effect: 'Unknown', cid: 0 }; // 默认值
      this.carddb.transaction(
        (tx) => {
          tx.executeSql(
            `SELECT * FROM texts WHERE id = ?`,
            [id],
            (_, result) => {
              console.log(`result ${result}`);
              if (result.rows.length > 0) {
                var item = result.rows.item(0)
                cardData.id = item.id;
                cardData.name = item.name;
                cardData.effect = item.effect;
                cardData.cid = item.cid;
                console.log(`search id ${id}, get card id ${cardData.id} with name ${cardData.name}`);
                resolve(cardData);
              } else {
                console.log(`No card found for ID: ${id}`);
                resolve(cardData); // 返回默认值
              }
            },
            (_, error) => {
              console.error('Error executing SQL query', error);
              reject(error);
              return false;
            }
          );
        },
        (error) => {
          console.error('Error opening texts database transaction', error);
          reject(error);
        }
      );
    });
  }


}

export const database = Database.getInstance();
