import { useState } from "react";
import { ScrollView, View, Alert } from "react-native";
import { InputWithLabel, AppButton, PickerWithLabel } from "../UI";
import AsyncStorage from "@react-native-async-storage/async-storage";
let host = require('../Config').settings.serverPath;

// Roles of Account
let roles = [
  {
    key: 'ADMIN',
    value: 'ADMIN',
  },
  {
    key: 'STUDENT',
    value: 'STUDENT',
  },
];

const AccountEdit = ({route, navigation} : any) => {
  // Route Params
  const [account] = useState(route.params.account);
  const [profileEdit] = useState(route.params.profileEdit);
  // Used Variables
  const [accName, setAccName] = useState(account.accountName);
  const [accPass, setAccPass] = useState(account.accountPass);
  const [accEmail, setAccEmail] = useState(account.accountEmail);
  const [accRole, setAccRole] = useState(account.accountRole);

  // Save edits made on Account
  const editAccount = async() => {
    if (!accName || !accPass || !accEmail || !accEmail) {
      Alert.alert("Error", "All fields must be filled in.");
    }
    else {
      let url = host + '/account/' + account.accountID;
      try {
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accountName: accName,
            accountPass: accPass,
            accountEmail: accEmail,
            accountRole: accRole,
          }),
        });
        const result = await response.json();
        if (result.affected > 0) {
          Alert.alert("Success", "Account edited successfully.");
          if (profileEdit) {
            AsyncStorage.setItem('username', accName);
            AsyncStorage.setItem('password', accPass);
          }
          navigation.goBack();
        }
      }
      catch (err) {
        Alert.alert("Error", "Account ID already exists");
      }
    }
  }

  // Main Screen
  return(
    <ScrollView contentContainerStyle={{ flexGrow:1 }}>
      <InputWithLabel 
        label = "Username:"
        value = {accName}
        placeholder = "Enter Username"
        onChangeText = {(text:any) => setAccName(text)}/>
      <InputWithLabel 
        label = "Password:"
        value = {accPass}
        placeholder = "Enter Password"
        onChangeText = {(text:any) => {setAccPass(text)}}/>
      <InputWithLabel 
        label = "Email:"
        value = {accEmail}
        placeholder = "Enter Email"
        onChangeText = {(text:any) => {setAccEmail(text)}}/>
      {!profileEdit ? (
        <PickerWithLabel
        label = "Role:"
        prompt = "Select Role of Account:"
        items = {roles}
        selectedValue={accRole}
        onValueChange={(itemValue:any) =>setAccRole(itemValue)}/>
      ) : (
        <View/>
      )}
      <View style={{ height:10 }}/>
      <AppButton
        title = 'Save Changes'
        onPress={() => editAccount()}/>
    </ScrollView>
  )
}

export default AccountEdit;