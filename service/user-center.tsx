
import { CardData, CardInfo, CardPair } from "../define/card";
import { database } from "./database";
import httpRequest from "./http-request";

/// Always follow the rule: update database first, if success, update cache
class UserCenter {


    private static instance: UserCenter;
    public caches: Map<number, CardPair>;
    // public valids: Map<number, boolean>;
    public currentCard: number;

    /// Navigation
    private navigationStack: string[];
    public navigate(navigation: any, route: any, screen: string, params?: any) {
        var currentScreen = route.name;
        this.navigationStack.push(currentScreen);
        navigation.navigate(screen, params);
    }
    public goBack(navigation: any, route: any) {
        console.log(`navigation stack ${this.navigationStack}`);

        var lastScreen = this.navigationStack.pop();
        if (lastScreen != undefined && lastScreen != null) {
            navigation.navigate(lastScreen);
        } else {
            navigation.goBack();
        }
    }
    /// Card management

    public getMyBankCard() {
        var this_ = this;
        database.fetchMyBankData().then((cardInfos) => {
            cardInfos.forEach(cardInfo => {
                if (!this_.caches.has(cardInfo.id)) {
                    var cardPair = {
                        cardData: undefined,
                        cards: new Map<string, CardInfo>()
                    };
                    this_.caches[cardInfo.id] = cardPair;
                }
                // if fetch was triggered, always override cache datas.
                if (this_.caches[cardInfo.id])
                    this_.caches[cardInfo.id][cardInfo.pidv] = cardInfo;
            });
            this_.caches.forEach((cardPair, id) => {
                if (!cardPair.cardData) {
                    database.getCardDataByID(id).then((cardData) => {
                        // override
                        cardPair.cardData = cardData;
                    }).catch((reason) => {
                        console.error(`[UserCenter][GetMyBankData] Error getting card data with card id ${id}`, reason);
                    })
                }
            })
        }).catch((reason) => {
            console.error('[UserCenter][GetMyBankData] Error getting my bank data', reason);
        });

    }
    /// Get card detail, if cache exist and no need to refresh, return cache
    public getCardPair(id: number): CardPair {
        if (this.caches[id] != null) {
            return this.caches[id];
        }
        var cardDataPromise = database.getCardDataByID(id);
        var cardInfoPromise = database.getCardInfoByID(id);
        var this_ = this;
        Promise.allSettled([cardDataPromise, cardInfoPromise]).then((results) => {
            var cardPair = {
                cardData: undefined,
                cards: new Map<string, CardInfo>()
            };
            if (results[0].status == "rejected") {
                // card data isn't valid, return directly
                return null;
            }
            // card data exist, cache data
            cardPair.cardData = results[0].value;
            // card info exist, cache card infos
            if (results[1].status == "fulfilled") {
                results[1].value.forEach((cardInfo: CardInfo) => {
                    cardPair.cards[cardInfo.pidv] = cardInfo;
                });
            }
            this_.caches[id] = cardPair;

            return this_.caches[id];
        }).catch((reason) => {
            console.log(`[UserCenter] [GetCardDetail] Error occurs: ${reason}`);
            return null;
        })

    }
    public fetchCardDataOnServer(id: number) {
        var cardPairCache: CardPair = this.caches[id];
        if (!cardPairCache) {
            cardPairCache = this.getCardPair(id); // set card pair data in cache
        }

        if (id) {
            const url1 = `https://yxwdbapi.windoent.com/konami/card/detail?titleId=1&cardId=${id}&lang=cn`;
            const url2 = `https://yxwdbapi.windoent.com/konami/card/detail?titleId=1&cardId=${id}&lang=ja`;
            const fetchURL1 = httpRequest(url1);
            const fetchURL2 = httpRequest(url2);
            console.log(`fetch url ${fetchURL1} and ${fetchURL2}`);
            var this_ = this;
            Promise.allSettled([fetchURL1, fetchURL2])
                .then((results) => {

                    // combine packLists
                    var combinedPackList = [];
                    for (const result of results) {
                        if (result.status == 'fulfilled') {
                            console.log(`fulfilled result ${result.value?.response ?? 'a'}`);
                            combinedPackList = combinedPackList.concat(result.value?.response?.packList ?? []);
                            console.log(combinedPackList.toString());
                        } else {
                            console.log(`rejects result ${result.reason}`);

                        }
                    }
                    // if card is not found, insert cardinfo to dictionary
                    combinedPackList.forEach((pack) => {
                        // right now, it's only consist of three params
                        var pidv = UserCenter.getpidv(pack.cardNo, pack.rarityKey, pack.packId);
                        if (!cardPairCache.cards.has(pidv)) {
                            const cardInfo = new CardInfo(
                                pidv,
                                pack.cardNo,
                                id,
                                pack.rarityKey,
                                pack.packId,
                                pack.packName,
                                0 // by default
                            )
                            cardPairCache.cards[pidv] = cardInfo;
                            // update card info to database
                            this.updateCardInfo(id, cardInfo);
                        }
                    })
                })
                .catch((error) => {
                    console.error('Error fetching URLs:', error);
                    // 处理错误
                });




        }

    }
    /// Update card detail strictly equals to the card detail
    public updateCardData(id: number, cardData: CardData) {
        var this_ = this;
        database.updateCardData(cardData).then(() => {
            if (this_.caches[id] != null) {
                this_.caches[id].cardData = cardData;
            }
        }).catch((reason) => {
            console.log(`[UserCenter] [updateCardData] Error occurs: ${reason}`);
            return null;
        })

    }
    public updateCardInfo(id: number, cardInfo: CardInfo) {
        var this_ = this;
        database.updateCardInfo(cardInfo).then(() => {
            this_.caches[id][cardInfo.pidv] = cardInfo;
        }).catch((reason) => {
            console.log(`[UserCenter] [updateCardInfo] Error occurs: ${reason}`);
            return null;
        });
    }
    public increaseCardQuantity(id: number, cardInfo: CardInfo, added: number) {
        var this_ = this;
        database.increaseCardQuantity(cardInfo, added).then(() => {
            // if it exist, update cache data
            const cacheInfo = this_.caches[id].has(cardInfo.pidv)
            if (cacheInfo) {
                cacheInfo.quantity += added;
            }
        }).catch((reason) => {
            console.log(`[UserCenter] [IncreaseCardQuantity] Error occurs: ${reason}`);
            return null;
        });
    }
    public decreaseCardQuantity(id: number, cardInfo: CardInfo, minus: number) {
        var this_ = this;
        database.decreaseCardQuantity(cardInfo, minus).then(() => {
            // if it exist, update cache data
            const cacheInfo = this_.caches[id].has(cardInfo.pidv)
            if (cacheInfo) {
                cacheInfo.quantity -= Math.min(cacheInfo.quantity, minus);
            }
        }).catch((reason) => {
            console.log(`[UserCenter] [DecreaseCardQuantity] Error occurs: ${reason}`);
            return null;
        });
    }
    private constructor() {
        this.currentCard = -1;
        this.caches = new Map<number, CardPair>();
        this.navigationStack = new Array<string>;
    }

    public static getInstance(): UserCenter {
        if (!UserCenter.instance) {
            UserCenter.instance = new UserCenter();
        }
        return UserCenter.instance;
    }
    public static getpidv(cardNo: string, rarityKey: string, packID: number): string{
        return cardNo + '-' + rarityKey + '-' + packID;
    }
}

export const userCenter = UserCenter.getInstance();