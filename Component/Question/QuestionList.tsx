import { useState, useCallback } from "react";
import { Text, View, FlatList, TouchableNativeFeedback, Dimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { FloatingAction } from "react-native-floating-action";
import { Loading, Timeout, listStyles } from "../UI";
let host = require('../Config').settings.serverPath;

const QuestionList = ({ route, navigation } : any) => {
  // Fetching State
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  // Route Params
  const [courseID] = useState(route.params.courseID);
  const [chapterID] = useState(route.params.chapterID);
  // Used Variables
  const [windowHeight] = useState(Dimensions.get('window').height);
  const [questionList, setQuestionList] = useState<any[]>([]);
  
  // Run when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  )

  // Fetch Data from server
  const fetchData = async () => {
    // 5s Timeout
    const timeoutID = setTimeout(() => {
      setError('Request timed out');
      setLoading(false);
    }, 5000);

    // Fetch list of questions from chapter
    setError('');
    setLoading(true);
    let url = host + '/' + courseID + "/" + chapterID + "/question";
    try {
      const response = await fetch(url);
      const result = await response.json();
      setQuestionList(result);
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
      onPress = {() => fetchData()}
    />
  }

  // Main Screen
  return(
    <View style={{ flex:1 }}>
      <FlatList 
        data = {questionList}
        renderItem = { ({item} : any) => (
          <TouchableNativeFeedback
            onPress = {() => navigation.navigate('QuestionInfo', {
              courseID: courseID,
              chapterID: chapterID,
              questionID: item.questionID,
            })}>
            <View style={listStyles.container}>
              <Text style={listStyles.description} numberOfLines={2}>{item.questionAsk}</Text>
            </View>
          </TouchableNativeFeedback>
        )}/>
      <FloatingAction
        distanceToEdge = {{ vertical : windowHeight*0.1, horizontal : 30}}
        actions = {[
          {
            text: 'Add Question',
            icon: require("../Images/add.jpg"),
            name: 'add'
          }
        ]}
        onPressItem={() => navigation.navigate('QuestionAdd', {
          courseID: courseID,
          chapterID: chapterID,
        })}/>
    </View>
  )
}

export default QuestionList;