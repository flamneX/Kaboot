import { useState, useCallback } from "react";
import { Text, View, FlatList, TouchableNativeFeedback, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { AppButton, listStyles, Loading, Timeout } from "../UI";
import CheckBox from "@react-native-community/checkbox";
let host = require('../Config').settings.serverPath;

const QuizChapter = ({route, navigation} : any) => {
  // Fetching States
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  // Route Params
  const [accountID] = useState(route.params.accountID);
  const [courseID] = useState(route.params.courseID);
  // Used Variables
  const [chapterList, setChapterList] = useState<any[]>([]);
  const [checkBoxValue, setCheckBoxValue] = useState<boolean[]>([]);
  const [selectedChapter ,setSelectedChapter] = useState<any>([]);
  
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
    }, 5000)
    
    // Fetch list of chapters of course
    setError('');
    setLoading(true);
    setCheckBoxValue([]);
    setSelectedChapter([])
    let url = host + '/' + courseID + '/chapter';
    try {
      const response = await fetch(url);
      const result = await response.json();
      setChapterList(result);
      for (let i = 0; i < result.length; i++) {
        setCheckBoxValue(prevItem => [...prevItem, false]);
      }
    }
    catch (err) {
      setError("Failed to fetch Data");
    }
    finally {
      setLoading(false);
      clearTimeout(timeoutID);
    }

    return () => clearTimeout(timeoutID);
  }

  // Change Checkbox value and update selected list
  const HandleChange = (item : any, index : any) => {
    if (checkBoxValue[index]) {
      const newValue = [...checkBoxValue];
      newValue[index] = false;
      setCheckBoxValue(newValue);
      setSelectedChapter(selectedChapter.filter((element: any) => element !== item.chapterID));
    }
    else {
      const newValue = [...checkBoxValue];
      newValue[index] = true;
      setCheckBoxValue(newValue);
      setSelectedChapter((prevChapter : any) => [...prevChapter, item.chapterID])
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
      onPress = {() => {
        fetchData();
      }}/>
  }

  // Main Screen
  return(
    <View style={{ flex:1 }}>
      <FlatList
        data = {chapterList}
        renderItem = {({ item, index } : any) => (
          <TouchableNativeFeedback
            onPress = {() => HandleChange(item, index)}>
            <View style={listStyles.container}>
              <CheckBox 
                value = {checkBoxValue[index]}
                onValueChange={() => HandleChange(item, index)}/>
              <Text style={listStyles.header} numberOfLines={1}> {item.chapterNo}. {item.chapterName}</Text>  
            </View>
          </TouchableNativeFeedback>
        )}/>
      <AppButton
        title = "Continue"
        onPress = {() => (selectedChapter.length > 0 ? 
          navigation.navigate('QuizQuestion', {
            accountID: accountID,
            courseID: courseID,
            selectedChapter: selectedChapter,
          }) : 
          Alert.alert("Error", "Select at least one chapter.")
        )}/>
    </View>
  )
}

export default QuizChapter;