import { useState } from "react";
import { Dimensions, View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { tabBarStyle } from "../UI";
import QuestionList from "./QuestionList";
import Note from "./Note";

const Tab = createMaterialTopTabNavigator();

const QuestionTab = ({ route } : any) => {
  // Route Params
  const [courseID] = useState(route.params.courseID);
  const [chapterID] = useState(route.params.chapterID);

  return(
    <View style={{ 
      flexDirection: 'row',
      height: Dimensions.get('window').height
    }}>
      <Tab.Navigator
      initialRouteName="Question"
      screenOptions={{
        lazy: true,
        tabBarStyle: tabBarStyle.topBar,
        tabBarLabelStyle: tabBarStyle.topBarLabel,
      }}>
        <Tab.Screen
          name="Question" 
          component={QuestionList} 
          initialParams={{
            courseID: courseID,
            chapterID: chapterID,
          }}/>
        <Tab.Screen 
          name="Note" 
          component={Note}
          initialParams={{
            courseID: courseID,
            chapterID: chapterID,
            editable: true,
          }}/>
      </Tab.Navigator>
    </View>
  )
}

export default QuestionTab;