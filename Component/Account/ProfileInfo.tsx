import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView, Dimensions } from "react-native";
import { InputWithLabel, Loading, Timeout } from "../UI";
import { FloatingAction } from "react-native-floating-action";
import AsyncStorage from "@react-native-async-storage/async-storage";
let host = require('../Config').settings.serverPath;

// Actions for Floating Action
const actions = [
  {
    text: 'Edit Account',
    icon: require("../Images/edit.jpg"),
    name: 'edit'
  },
  {
    text: 'Log Out',
    icon: require("../Images/logout.jpg"),
    name: 'logout'
  }
]

const ProfileInfo = ({ route, navigation } : any) => {
  // Fetching States
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  // Route Params
  const [accountID] = useState(route.params.accountID);
  // Used Variables
  const [account, setAccount] = useState<any>();

  //Run when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  // Fetch data from server
  const fetchData = async () => {
    // 5s Timeout
    const timeoutID = setTimeout(() => {
      setError('Request timed out');
      setLoading(false);
    }, 5000);

    //Fetch info of user
    setError('');
    setLoading(true);
    let url = host + '/account/' + accountID;
    try {
      const response = await fetch(url);
      const result = await response.json();
      setAccount(result);
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
      <FloatingAction
        distanceToEdge = {{ vertical : Dimensions.get('window').height*0.1, horizontal : 20}}
        floatingIcon={require("../Images/options.jpg")}
        actions = {actions}
        onPressItem={name => {
          switch(name) {
            case 'edit':
              navigation.navigate('AccountEdit', {
                account: account,
                profileEdit: true,
              });
              break;
            case 'logout':
              AsyncStorage.removeItem('username');
              AsyncStorage.removeItem('password');
              navigation.navigate("Login");
              break;
          }
        }}/>
    </ScrollView>
  );
}

export default ProfileInfo;