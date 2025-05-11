import { useEffect, useState } from "react";
import { ScrollView, View, Alert } from "react-native";
import { InputWithLabel, AppButton, PickerWithLabel } from "../UI";
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

const AccountAdd = ({ route, navigation } : any) => {
  // Route Params
  const [header] = useState(route.params.header);
  // Used Variables
  const [accName, setAccName] = useState('');
  const [accPass, setAccPass] = useState('');
  const [accEmail, setAccEmail] = useState('');
  const [accRole, setAccRole] = useState(route.params.accountRole);

  // Set the header of the Screen
  useEffect(() => {
    if (header != null) {
      navigation.setOptions({headerTitle: header});
    }
  }, []);

  // Add Account to database
  const addAccount = async () => {
    if (!accName || !accPass || !accEmail || !accEmail) {
      Alert.alert("Error", "All fields must be filled in.");
    }
    else {
      let url = host + '/account';
      try {
        const response = await fetch(url, {
          method: 'POST',
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
        })
        const result = await response.json();
        if (result.affected > 0) {
          Alert.alert("Success", "Account created successfully.");
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
      {header == null ? (
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
        title = 'Create Account'
        onPress={() => addAccount()}/>
    </ScrollView>
  )
}

export default AccountAdd;