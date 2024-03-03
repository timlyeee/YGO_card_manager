
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/home';
import MyBank from '../screens/my-bank';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import SearchScreen from '../screens/search-screen';
const Tab = createBottomTabNavigator();

export const BottomNavigationBar = () => {
    return (
        <Tab.Navigator initialRouteName="Home">
            <Tab.Screen
                name="Home"
                component={Home}
                options={{ 
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                      ),
                    headerShown: false }}
            />
            <Tab.Screen
                name="MyBank"
                component={MyBank}
                options={{ 
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="user" size={size} color={color} />),
                    headerShown: false }}
            />
            <Tab.Screen
                name="Search"
                component={SearchScreen}
                
                options={{ 
                    tabBarStyle:{
                        height: 0,
                    },
                    tabBarShowLabel:false,
                    tabBarButton:()=>null,
                    headerShown: false }} />
        </Tab.Navigator>

    )
}