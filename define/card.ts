import { Image, ImageSourcePropType } from "react-native";

// card total quantity list to quick extract datas
export class CardTotalQuantity {
    public id: number;
    public quantity: number;
}
// card occupation
export class CardOccupation {
    public pid: string;
    public deck: number;
    public count: number;// how many card in this deck.
}
// card info
export class CardInfo {
    constructor(
        public pidv: string,
        public cardNo: string,
        public id: number,
        public rarity: string,
        public packId: number,
        public packName: string,
        public quantity: number) { }
}
// card data
export class CardData {

    constructor(
        public id: number,
        public name: string,
        public effect: string,
        public cid: number,
        public imageUrl: string) { }
}

export type CardPair = {
    cardData: CardData,
    cards: Map<string, CardInfo>,
};