import { CardPair } from "../define/card";

class UserCenter {


    private static instance: UserCenter;

    private currentCard_;
    public get currentCard(): CardPair {
        return this.currentCard_;
    }

    public set currentCard(v: CardPair) {
        this.currentCard_ = v;

    }

    /// Navigation
    private navigationStack: string[] = new Array<string>;
    public navigate(navigation: any, screen: string, params?: any) {
        this.navigationStack.push(screen);
        navigation.navigate(screen, params);
    }
    public goBack(navigation: any) {
        console.log(`navigation stack ${this.navigationStack}`);

        this.navigationStack.pop();
        if (this.navigationStack.length > 0) {
            navigation.navigate(this.navigationStack[this.navigationStack.length - 1]);
        } else {
            navigation.goBack();
        }
    }


    private constructor() {

    }
    public trigger: boolean;
    public static getInstance(): UserCenter {
        if (!UserCenter.instance) {
            UserCenter.instance = new UserCenter();
        }
        return UserCenter.instance;
    }
}

export const userCenter = UserCenter.getInstance();