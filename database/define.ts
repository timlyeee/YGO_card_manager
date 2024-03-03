

export const N = 0;
export const R = 1;
export const SR = 2;
export const UR = 3;
export const CR = 4;
export const HR = 5;
export const SER = 20;
export const UTR = 30;
export const QCSER = 40;

export class CardInfo {
    public id: number;
    public rarity: number;
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
    
    constructor(id: number, name: string, effect: string){
        this.id = id;
        this.name = name;
        this.effect = effect;
    }
}

export type CardPair = {
    cardData: CardData,
    cards: CardInfo[]
};