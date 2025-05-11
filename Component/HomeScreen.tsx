import { useState } from "react";
import { Image, ScrollView, Dimensions, View } from "react-native";
import { AppButton } from "./UI";

const HomeScreen = ({route, navigation} : any) => {
  // Used Variables
  const [windowHeight] = useState(Dimensions.get('window').height);
  const [account] = useState(route.params.account);

  return(
    <ScrollView contentContainerStyle={{ flexGrow:1, paddingBottom: windowHeight*0.08 }}>
      <View style={{ flexDirection:'column', alignItems: 'center'}}>
        <Image 
          source={require('./Images/quiz.jpg')}
          style={{ height: windowHeight*0.3, width: windowHeight*0.3 }}/>
      </View>
      <View style={{ height:20 }}/>
      <AppButton
        title = "Start Quiz"
        onPress = {() => navigation.navigate('CourseList', {
          accountID: account.accountID,
          selectMode: 'Quiz',
        })}
      />
    </ScrollView>
  )
}

export default HomeScreen;