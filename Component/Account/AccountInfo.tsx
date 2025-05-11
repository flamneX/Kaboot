import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView, Alert } from "react-native";
import { InputWithLabel, Loading, PickerWithLabel, Timeout } from "../UI";
import { FloatingAction } from "react-native-floating-action";
let host = require('../Config').settings.serverPath;

// Actions for Floating Action
const actions = [
  {
    text: 'Edit Account',
    icon: require("../Images/edit.jpg"),
    name: 'edit'
  },
  {
    text: 'Delete Account',
    icon: require("../Images/delete.jpg"),
    name: 'delete'
  }
]

const AccountInfo = ({ route, navigation } : any) => {
  // Fetching States
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  // Route Params
  const [accountID] = useState<String>(route.params.accountID);
  // Used Variables
  const [account, setAccount] = useState<any>();
  let url = host + '/account/' + accountID;

  //Run when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  )

  // Fetch data from server
  const fetchData = async () => {
    // 5s Timeout
    const timeoutID = setTimeout(() => {
      setError('Request timed out');
      setLoading(false);
    }, 5000);

    //Fetch info of specific account
    setError('');
    setLoading(true);
    try {
      const response = await fetch(url);
      const result = await response.json();
      setAccount(result);
      navigation.setOptions({headerTitle: result.accountName});
    } 
    catch (err) {
      console.log(err);
    } 
    finally {
      setLoading(false);
      clearTimeout(timeoutID);
    }

    return () => clearTimeout(timeoutID);
  };

  // Delete Account
  const deleteAccount = async () => {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({accountID: accountID}),
      });
      const result = await response.json();
      if (result.affected > 0) {
        Alert.alert("Success", "Account deleted successfully.");
        navigation.goBack();
      }
    }
    catch (err) {
      Alert.alert("Error","Failed to delete Account");       
    }
  }

  // Loading Screen
  if (loading) {
      return <Loading/>
  }

  // Error Screen
  if (error) {
    return <Timeout
      error = {error}
      onPress = {() => fetchData()}/>
  }

  // Main Screen
  return(
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <InputWithLabel 
        label = "Username:"
        value = {account.accountName}
        editable = {false}>
      </InputWithLabel>
      <InputWithLabel 
        label = "Password:"
        value = {account.accountPass}
        editable = {false}/>
      <InputWithLabel 
        label = "Email:"
        value = {account.accountEmail}
        editable = {false}/>
      <PickerWithLabel
        label = "Role:"
        items = {[{
          key: 'ADMIN',
          value: 'ADMIN',
        }, {
          key: 'STUDENT',
          value: 'STUDENT',
        }]}
        selectedValue = {account.accountRole}
        enabled = {false}/>
      <FloatingAction 
        actions={actions}
        floatingIcon={require("../Images/options.jpg")}
        onPressItem={name=>{
          switch(name) {
            case 'edit':
              navigation.navigate('AccountEdit', {
                account: account,
              });
              break;
            case 'delete':
              Alert.alert("Confirm Deletion of:", account.accountName + "?", [
                {
                  text: 'No',
                  onPress: () => {},
                },
                {
                  text: 'Yes',
                  onPress: () => {deleteAccount()}
                }])
              break;
          }
        }}
      />
    </ScrollView>
  );
}

export default AccountInfo;