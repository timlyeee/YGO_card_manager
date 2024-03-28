

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
    constructor(id: number, name: string, effect: string, cid: number){
        this.id = id;
        this.name = name;
        this.effect = effect;
        this.cid = cid;
    }
}

export type CardPair = {
    cardData: CardData,
    cards: CardInfo[]
};