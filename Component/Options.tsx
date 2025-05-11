import { useState } from "react";
import { View, ScrollView } from "react-native";
import { AppButton } from "./UI";

const Options = ({ route, navigation } : any) => {
  // Route Params
  const [account] = useState(route.params.account);

  return(
    <ScrollView style={{flex:1}}>
      <AppButton
        title = {account.accountRole == "ADMIN" ? "Course Select" : "Check Notes"}
        onPress = {() => navigation.navigate('CourseList', {
          accountRole: account.accountRole,
        })}/>
      {account.accountRole == "ADMIN" ? (
        <AppButton
          title = "Edit Accounts"
          onPress = {() => navigation.navigate('AccountTab', {
            accountID: account.accountID,
          })}/>
      ) : (
        <View/>
      )}
      <AppButton
        title = {account.accountRole == "ADMIN" ? "Quiz History" : "Check History"}
        onPress = {() => navigation.navigate('CourseList', {
          accountID: account.accountID,
          accountRole: account.accountRole,
          selectMode: 'History',
        })}/>
    </ScrollView>
  )
}

export default Options;