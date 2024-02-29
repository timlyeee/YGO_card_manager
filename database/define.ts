

export const N = 0;
export const R = 1;
export const SR = 2;
export const UR = 3;
export const CR = 4;
export const HR = 5;
export const SER = 20;
export const UTR = 30;
export const QCSER = 40;

export class Card {
    public id: number;
    public rarity: number;
    public pack: string;
    constructor(id, rarity, pack) {
        this.id = id;
        this.rarity = rarity;
        this.pack = pack;
    }
}
export class CardData {

    // constructor
}