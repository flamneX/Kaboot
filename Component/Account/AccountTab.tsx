import { useState } from "react";
import { Dimensions, View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import studentList from "./AccountList";
import adminList from "./AccountList";
import { tabBarStyle } from "../UI";

const Tab = createMaterialTopTabNavigator();

const AccountTab = ({ route } : any) => {
  // Route Params
  const [accountID] = useState(route.params.accountID);

  return(
    <View
    style={{
      flexDirection: 'row',
      height: Dimensions.get('window').height
    }}>
      <Tab.Navigator 
      initialRouteName="STUDENT"
      screenOptions={{
        lazy: true,
        tabBarStyle: tabBarStyle.topBar,
        tabBarLabelStyle: tabBarStyle.topBarLabel,
      }}>
        <Tab.Screen 
          name="STUDENT" 
          component={studentList}
          initialParams={{
            accountRole: 'STUDENT'
          }}/>
        <Tab.Screen
          name="ADMIN" 
          component={adminList}
          initialParams={{
            accountRole: 'ADMIN',
            accountID: accountID,
          }}/>
      </Tab.Navigator>
    </View>
  )
}

export default AccountTab;