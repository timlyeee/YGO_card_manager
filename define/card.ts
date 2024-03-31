import { Image, ImageSourcePropType } from "react-native";


export class CardInfo {
    public id: number;
    public rarity: string;
    public pack: string;
    public quantity: number;
    constructor(id, rarity, pack, quantity) {
        this.id = id;
        this.rarity = rarity;
        this.pack = pack;
        this.quantity = quantity;
    }
}
export class CardData {
    public id: number;
    public name: string;
    public effect: string;
    public cid: number;
    public imageUrl : string ;
    constructor(id: number, name: string, effect: string, cid: number, imageUrl:string ){
        this.id = id;
        this.name = name;
        this.effect = effect;
        this.cid = cid;
        this.imageUrl = imageUrl;
    }
}

export type CardPair = {
    cardData: CardData,
    cards: CardInfo[]
};