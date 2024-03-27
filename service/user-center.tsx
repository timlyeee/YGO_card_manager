import { CardPair } from "../define/card";

class UserCenter {
    private static instance: UserCenter;
    
    private currentCard_;
    public get currentCard() : CardPair {
        return this.currentCard_;
    }
    
    public set currentCard(v : CardPair) {
        this.currentCard_ = v;

    }
    
    
    


    private constructor() {

    }

    public static getInstance(): UserCenter {
        if (!UserCenter.instance) {
            UserCenter.instance = new UserCenter();
        }
        return UserCenter.instance;
    }
}

export const userCenter = UserCenter.getInstance();