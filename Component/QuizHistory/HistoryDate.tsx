import { useState, useCallback } from "react";
import { Text, View, FlatList, TouchableNativeFeedback } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Loading, Timeout, listStyles } from "../UI";
let host = require('../Config').settings.historyPath;

const HistoryDate = ({ route, navigation } : any) => {
  // Fetching States
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  // Route Params
  const [accountID] = useState(route.params.accountID);
  const [accountRole] = useState(route.params.accountRole);
  const [courseID] = useState(route.params.courseID);
  // Used Variables
  const [historyDates, setHistoryDates] = useState<any[]>([]);
  
  // Run when screen is focused
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

    // Fetch Data
    setError('');
    setLoading(true);
    let url = host + '/' + courseID + '/history';
    if (accountRole == 'STUDENT') {
      url += '/' + accountID;
    }
    try {
      const response = await fetch(url);
      const result = await response.json();
      setHistoryDates(result);
    } 
    catch (err) {
      setError("Failed to fetch data");
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
      onPress = {() => fetchData()}/>
  }

  // Main Screen
  return(
    <View style={{ flex:1 }}>
      <FlatList 
        data = {historyDates}
        renderItem = {({item} : any) => (
          <TouchableNativeFeedback
            onPress = {() => navigation.navigate("HistoryList", {
              accountID: accountID,
              accountRole: accountRole,
              courseID: courseID,
              quizDate: item,
            })}>
            <View style={listStyles.container}>
              <Text style={listStyles.header} numberOfLines={1}>{"> " + item}</Text>
            </View>
          </TouchableNativeFeedback>
        )}
      />
    </View>
  )
}

export default HistoryDate;