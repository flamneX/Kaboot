import { useFocusEffect } from "@react-navigation/native";
import { useState, useCallback } from "react";
import { Dimensions, Text, View, FlatList, TouchableNativeFeedback } from "react-native";
import { FloatingAction } from "react-native-floating-action";
import { Loading, Timeout, listStyles } from "../UI";
let host = require('../Config').settings.serverPath;

const AccountList = ({ route, navigation } : any) => {
  // Fetching States
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  // Route Params
  const [accountRole] = useState(route.params.accountRole);
  // Used Variables
  const [windowHeight] = useState(Dimensions.get('window').height);
  const [accountList, setAccountList] = useState<any[]>([]);
  
  // Run when screen is focused
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

    // Fetch list of accounts
    setError('');
    setLoading(true);
    let url = host + '/account/' + accountRole;
    try {
      const response = await fetch(url);
      const result = await response.json();
      if (accountRole == 'ADMIN') {
        setAccountList(result.filter((account: any) => account.accountID != route.params.accountID));
      }
      else {
        setAccountList(result);
      }
    }
    catch (err) {
      console.log(err);
    }
    finally {
      setLoading(false);
      clearTimeout(timeoutID);
    }

    return () => clearTimeout(timeoutID);
  }
  
  // Loading Screen
  if (loading) {
    return <Loading/>
  }

  // Error Screen
  if (error) {
    return <Timeout
      error = {error}
      onPress = {() => fetchData()}
    />
  }
  
  // Main Screen
  return(
    <View style={{ flex:1, paddingBottom: windowHeight*0.1 }}>
      <FlatList 
        data = {accountList}
        renderItem = { ({item} : any) => (
          <TouchableNativeFeedback
            onPress = {() => navigation.navigate('AccountInfo', {
              accountID: item.accountID,
            })}>
            <View style={listStyles.container}>
              <Text style={listStyles.header}>{item.accountName}</Text>
            </View>
          </TouchableNativeFeedback>
        )}/>
      <FloatingAction
        distanceToEdge = {{ vertical : windowHeight*0.1, horizontal : 30 }}
        actions = {[
          {
            text: 'Add Account',
            icon: require("../Images/add.jpg"),
            name: 'add'
          }
        ]}
        onPressItem={() => navigation.navigate('AccountAdd', {
          accountRole: accountRole,
        })}
      />
    </View>
  )
}

export default AccountList;