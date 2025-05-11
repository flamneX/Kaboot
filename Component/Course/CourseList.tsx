import { useState, useCallback } from "react";
import { Text, View, FlatList, TouchableNativeFeedback } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { FloatingAction } from "react-native-floating-action";
import { AppButton, Loading, Timeout, listStyles } from "../UI";
let host = require('../Config').settings.serverPath;

const CourseList = ({ route, navigation } : any) => {
  // Fetching States
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  // Route Params
  const [accountID] = useState(route.params.accountID);
  const [accountRole] = useState(route.params.accountRole);
  const [selectMode] = useState(route.params.selectMode);
  // Used Variables
  const [courseList, setCourseList] = useState<any[]>([]);
  
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

    // Fetch list of courses
    setError('');
    setLoading(true);
    let url = host + '/course';
    try {
      const response = await fetch(url);
      const result = await response.json();
      setCourseList(result);
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
  const HandleClick = (item: any) => {
    if (selectMode == 'Quiz') {
      navigation.navigate('QuizChapter', {
        accountID: accountID,
        courseID: item.courseID,
      });
    }
    else if (selectMode == 'History') {
      navigation.navigate('HistoryDate', {
        accountID: accountID,
        accountRole: accountRole,
        courseID: item.courseID,
      });
    }
    else {
      navigation.navigate('ChapterList', {
        accountRole: accountRole,
        courseID: item.courseID,
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
        data = {courseList}
        renderItem = { ({item} : any) => (
          <TouchableNativeFeedback 
            onPress = {() => HandleClick(item)}>
            <View style={listStyles.container}>
              <View style = {{ flex:9 }}>
                <Text style={listStyles.header} numberOfLines={1}>{item.courseCode}</Text>
                <Text style={listStyles.description} numberOfLines = {1}>{'> ' + item.courseName}</Text>
              </View>
              {accountRole == "ADMIN" && selectMode != 'History' ? (
                <AppButton
                  style = {{ flex:1 }}
                  theme = 'info'
                  icon = {require("../Images/edit.jpg")}
                  onPress = {() => navigation.navigate('CourseInfo', {
                    courseID: item.courseID,
                  })}/>
              ) : (
                <View/>
              )}
            </View>
          </TouchableNativeFeedback>
        )}/>
      {accountRole == "ADMIN" && selectMode != 'History' ? (
        <FloatingAction
          actions = {[
            {
              text: 'Add Course',
              icon: require("../Images/add.jpg"),
              name: 'add'
            }
          ]}
          onPressItem={() => navigation.navigate('CourseAdd')}/>
      ) : (
        <View/>
      )}
    </View>
  )
}

export default CourseList;