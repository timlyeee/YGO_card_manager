
import { CardPair } from "../define/card";

class UserCenter {


    private static instance: UserCenter;

    public currentCard: CardPair

    /// Navigation
    private navigationStack: string[] = new Array<string>;
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


    private constructor() {

    }
    public trigger: boolean = false;
    public shoot(){
        this.trigger = !this.trigger;
        console.log("shoot!");
    }
    public static getInstance(): UserCenter {
        if (!UserCenter.instance) {
            UserCenter.instance = new UserCenter();
        }
        return UserCenter.instance;
    }
}

export const userCenter = UserCenter.getInstance();