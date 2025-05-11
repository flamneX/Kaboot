import { useState, useCallback } from "react";
import { Text, View, FlatList, TouchableNativeFeedback } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { FloatingAction } from "react-native-floating-action";
import { AppButton, Loading, Timeout, listStyles } from "../UI";
let host = require('../Config').settings.serverPath;

const ChapterList = ({ route, navigation } : any) => {
  // Fetching States
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  // Route Params
  const [accountRole] = useState(route.params.accountRole);
  const [courseID] = useState(route.params.courseID);
  // Used Variables
  const [chapterList, setChapterList] = useState<any[]>([]);
  
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

    // Fetch list of chapters from course
    setError('');
    setLoading(true);
    let url = host + '/' + courseID + '/chapter';
    try {
      const response = await fetch(url);
      const result = await response.json();
      setChapterList(result);
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

  // Actions when user clicks on list
  const HandleClick = ( item:any ) => {
    if (accountRole == "ADMIN") {
      navigation.navigate('QuestionTab', {
        courseID: item.courseID,
        chapterID: item.chapterID,
      })
    }
    else {
      navigation.navigate('Note', {
        courseID: item.courseID,
        chapterID: item.chapterID,
        editable: false,
      })
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
      onPress = {() => fetchData()}
    />
  }

  // Main Screen
  return(
    <View style={{ flex:1 }}>
      <FlatList 
        data = {chapterList}
        renderItem = {({item} : any) => (
          <TouchableNativeFeedback
            onPress = {() => HandleClick(item)}>
            <View style={listStyles.container}>
              <View style={{ flex:9 }}>
                <Text style={listStyles.header} numberOfLines={1}>{item.chapterNo}. {item.chapterName}</Text>
              </View>
              {accountRole == "ADMIN" ? (
                <AppButton
                  style = {{ flex:1 }}
                  theme = 'info'
                  icon = {require("../Images/edit.jpg")}
                  onPress = {() => navigation.navigate('ChapterInfo', {
                    chapterID: item.chapterID,
                    courseID: item.courseID,
                  })}/>
              ) : (
                <View/>
              )}
            </View>
          </TouchableNativeFeedback>
        )}
      />
      {accountRole == "ADMIN" ? (
        <FloatingAction
          actions = {[
            {
              text: 'Add Chapter',
              icon: require("../Images/add.jpg"),
              name: 'add'
            }
          ]}
          onPressItem={() => navigation.navigate('ChapterAdd', {
            courseID: courseID,
          })}/>
      ) : (
        <View/>
      )}
    </View>
  )
}

export default ChapterList;