import { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, TouchableNativeFeedback } from "react-native";
import { tabBarStyle, headerStyles } from "./UI";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ProfileInfo from "./Account/ProfileInfo";
import HomeScreen from "./HomeScreen";
import Options from "./Options";

const bottomTab = createBottomTabNavigator();

// Custom Button For middle Button
const CustomButton = ({children, onPress}: any) => {
  return(
    <TouchableNativeFeedback onPress={onPress}>
      <View
        style={{
          width: 100,
          backgroundColor: '#609146'
        }}>
        {children}
      </View>
    </TouchableNativeFeedback>
  )
}

const HomeTab = ({ route } : any) => {
  const [account] = useState(route.params.account);

  return(
    <bottomTab.Navigator
      initialRouteName = 'Home'
      screenOptions={{
        lazy: true,
        tabBarShowLabel: false,
        tabBarStyle: tabBarStyle.bottomBar,
        headerTitleStyle: headerStyles.text,
        headerTitleAlign: 'center',
      }}>
      <bottomTab.Screen 
        name = 'Options'
        component = {Options}
        options = {{
          headerTitle: 'Options',
          tabBarIcon: ({focused}) => (
            <MaterialCommunityIcons name='view-list-outline' size={50} color={focused ? '#303030': 'white'}/>
          )
        }}
        initialParams={{account: account}}/>
      <bottomTab.Screen 
        name = 'Home'
        component = {HomeScreen}
        options = {{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <MaterialCommunityIcons name='home' size={50} color={focused ? '#303030': 'white'}/>
          ),
          tabBarButton: (props:any) => (
            <CustomButton {...props} />
          )
        }}
        initialParams={{account: account}}/>
      <bottomTab.Screen 
        name = 'Profile'
        component = {ProfileInfo}
        options = {{
          headerTitle: 'Profile',
          tabBarIcon: ({focused}) => (
            <MaterialCommunityIcons name='account-circle' size={50} color={focused ? '#303030': 'white'}/>
          )
        }}
        initialParams={{accountID: account.accountID}}/>
    </bottomTab.Navigator>
  )
}

export default HomeTab;